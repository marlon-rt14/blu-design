import {
  TOOLTIP_POINTER_DEPTH,
  TOOLTIP_POINTER_INSET,
  TOOLTIP_POINTER_LENGTH,
  TOOLTIP_TITLE_BODY_GAP,
  tooltipTokens,
} from '@dsm/shared';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useRef, useState } from 'react';
import type { CSSProperties, MutableRefObject } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ITooltipProps } from './Tooltip.types';

/** The side a resolved placement lands on. */
type TSide = 'top' | 'bottom' | 'left' | 'right';

/** What {@link useTooltip} hands the component. */
interface IUseTooltipResult {
  /** `true` while the panel is mounted. */
  open: boolean;
  /** Ref for the element the tooltip is anchored to. */
  setReference: (node: HTMLElement | null) => void;
  /** Ref for the panel. */
  setFloating: (node: HTMLElement | null) => void;
  /** Ref for the pointer, so the engine can position it along the panel's edge. */
  pointerRef: MutableRefObject<HTMLDivElement | null>;
  getReferenceProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  /** Position of the panel, from the engine. Merge with {@link panelStyle}. */
  floatingStyles: CSSProperties;
  panelStyle: CSSProperties;
  contentStyle: CSSProperties;
  titleStyle: CSSProperties;
  bodyStyle: CSSProperties;
  linkSlotStyle: CSSProperties;
  /** The pointer, already rotated and offset for the side the engine chose. */
  pointerStyle: CSSProperties | undefined;
  /** Whether the dismiss renders: only with `type="info"` and a handler. */
  showDismiss: boolean;
  /** Whether the title renders: only with `type="info"` and a string. */
  showTitle: boolean;
}

/**
 * Turns a resolved placement into the pointer's own geometry.
 *
 * The pointer is a CSS triangle: 16 along the panel's edge and 10 deep, which
 * is `.TipPointer`'s size. It is mounted {@link TOOLTIP_POINTER_INSET} inside
 * the panel, so it protrudes 8 — the reason a tooltip with a pointer measures
 * exactly 8 more than the same one at `placement="none"`.
 */
const pointerGeometry = (side: TSide, colour: string): CSSProperties => {
  const half = TOOLTIP_POINTER_LENGTH / 2;
  const transparent = `${half}px solid transparent`;
  const solid = `${TOOLTIP_POINTER_DEPTH}px solid ${colour}`;
  const out = -(TOOLTIP_POINTER_DEPTH - TOOLTIP_POINTER_INSET);

  // The triangle points *away* from the panel, so it is drawn on the side
  // facing the trigger: a panel above the trigger gets a downward pointer.
  if (side === 'top') {
    return { borderLeft: transparent, borderRight: transparent, borderTop: solid, bottom: out };
  }
  if (side === 'bottom') {
    return { borderLeft: transparent, borderRight: transparent, borderBottom: solid, top: out };
  }
  if (side === 'left') {
    return { borderTop: transparent, borderBottom: transparent, borderLeft: solid, right: out };
  }
  return { borderTop: transparent, borderBottom: transparent, borderRight: solid, left: out };
};

/**
 * Wires the positioning engine and resolves every style the Tooltip needs.
 *
 * The engine is Floating UI, which is also the vocabulary bDS speaks: the
 * thirteen placements are side plus alignment, and they are **the result** of
 * measuring the space rather than an instruction. With no `placement` the
 * engine picks freely (`autoPlacement`); with one it treats it as a preference
 * and still flips away from a side with no room (`flip`).
 *
 * @param params - The Tooltip props.
 * @returns The floating machinery, the resolved styles, and what to render.
 */
export const useTooltip = ({
  type = 'descriptive',
  title,
  placement,
  onDismiss,
}: ITooltipProps): IUseTooltipResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = tooltipTokens[mode];
  const [open, setOpen] = useState(false);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  // Set explicitly rather than inherited, because the panel is portalled to
  // `document.body` and so sits outside the provider's subtree — without this
  // it falls back to the UA serif. The only component here that has to say it.
  const titleFontFamily = useFontFamily(typography.title.fontWeight);
  const bodyFontFamily = useFontFamily(typography.body.fontWeight);

  const isInfo = type === 'info';
  const hasPointer = placement !== 'none';
  const preferred = placement && placement !== 'none' ? placement : undefined;

  const { refs, floatingStyles, context, middlewareData, placement: resolved } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: preferred,
    middleware: [
      offset(dimension.offset),
      // A stated placement is a preference the engine may overrule; with none,
      // it chooses outright. Either way the caller never pins a side — *"un
      // tooltip que insiste en ir arriba cuando no hay lugar arriba es un
      // tooltip cortado"*.
      preferred ? flip() : autoPlacement(),
      shift({ padding: dimension.offset }),
      ...(hasPointer ? [arrow({ element: pointerRef })] : []),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    // WCAG 1.4.13, *persistent*: an `info` tooltip waits for the person. Once
    // it is open, hover stops driving it, so leaving with the pointer does not
    // take it away — only Esc, an outside press or the dismiss will.
    enabled: !isInfo || !open,
    // WCAG 1.4.13, *hoverable*: the pointer has to be able to travel into the
    // panel without it vanishing, which is the only way a link inside is
    // reachable. `safePolygon` keeps it open across the gap.
    handleClose: safePolygon(),
    move: false,
  });
  const focus = useFocus(context);
  // WCAG 1.4.13, *dismissible*: Esc closes without moving the pointer.
  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: isInfo });
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const side = resolved.split('-')[0] as TSide;
  const { x: pointerX, y: pointerY } = middlewareData.arrow ?? {};

  return {
    open,
    setReference: refs.setReference,
    setFloating: refs.setFloating,
    pointerRef,
    getReferenceProps,
    getFloatingProps,
    floatingStyles,
    panelStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'flex-start',
      gap: dimension.dismissGap,
      maxWidth: 280,
      paddingBlock: dimension.paddingVertical[type],
      paddingInline: dimension.paddingHorizontal,
      borderRadius: dimension.borderRadius[type],
      backgroundColor: colors.surface,
      // Far first, near second: CSS paints the first on top, and this is the
      // `overlay` ramp the Snackbar uses too.
      boxShadow: [
        `0 ${dimension.shadowFarY}px ${dimension.shadowFarBlur}px ${colors.shadowFar}`,
        `0 ${dimension.shadowNearY}px ${dimension.shadowNearBlur}px ${colors.shadowNear}`,
      ].join(', '),
    },
    contentStyle: {
      display: 'flex',
      flexDirection: 'column',
      // Zero between the title and the body: the air is already inside the line
      // box. See TOOLTIP_TITLE_BODY_GAP.
      gap: TOOLTIP_TITLE_BODY_GAP,
      flex: 1,
      minWidth: 0,
    },
    titleStyle: {
      margin: 0,
      fontFamily: titleFontFamily,
      fontWeight: typography.title.fontWeight,
      fontSize: typography.title.fontSize,
      lineHeight: typography.title.lineHeightRatio,
      color: colors.title,
    },
    bodyStyle: {
      margin: 0,
      fontFamily: bodyFontFamily,
      fontWeight: typography.body.fontWeight,
      fontSize: typography.body.fontSize,
      lineHeight: typography.body.lineHeightRatio,
      color: colors.body,
    },
    linkSlotStyle: { display: 'flex', paddingTop: dimension.linkGap },
    pointerStyle: hasPointer
      ? {
          position: 'absolute',
          width: 0,
          height: 0,
          left: pointerX === undefined ? undefined : pointerX,
          top: pointerY === undefined ? undefined : pointerY,
          ...pointerGeometry(side, colors.pointer),
        }
      : undefined,
    showDismiss: isInfo && onDismiss !== undefined,
    showTitle: isInfo && title !== undefined,
  };
};
