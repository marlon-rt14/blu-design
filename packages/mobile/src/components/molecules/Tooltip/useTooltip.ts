import {
  TOOLTIP_POINTER_DEPTH,
  TOOLTIP_POINTER_INSET,
  TOOLTIP_POINTER_LENGTH,
  tooltipTokens,
} from '@dsm/shared';
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/react-native';
import { useRef, useState } from 'react';
import type { ComponentRef, MutableRefObject, Ref } from 'react';
import type { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ITooltipProps } from './Tooltip.types';

/** What a ref to a `View` actually points at on React Native 0.87. */
type TViewElement = ComponentRef<typeof View>;

/** The side a resolved placement lands on. */
type TSide = 'top' | 'bottom' | 'left' | 'right';

/** What {@link useTooltip} hands the component. */
interface IUseTooltipResult {
  open: boolean;
  /** Opens the panel. Wired to a long press, never to a plain one. */
  show: () => void;
  /** Closes it. Wired to the backdrop and to the dismiss. */
  hide: () => void;
  /**
   * Refs for the trigger, the panel and the pointer, which the engine measures.
   *
   * Typed against React Native's own element type rather than the engine's.
   * `@floating-ui/react-native` still declares them as the `View` *class*,
   * which is what a ref pointed at before 0.87 replaced it with
   * `ReactNativeElement`. The cast happens once, where the two meet.
   */
  setReference: Ref<TViewElement>;
  setFloating: Ref<TViewElement>;
  pointerRef: MutableRefObject<TViewElement | null>;
  /** Absolute position of the panel, from the engine. */
  floatingStyles: StyleProp<ViewStyle>;
  panelStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  bodyStyle: StyleProp<TextStyle>;
  linkSlotStyle: StyleProp<ViewStyle>;
  pointerStyle: StyleProp<ViewStyle> | undefined;
  showDismiss: boolean;
  showTitle: boolean;
}

/**
 * Turns a resolved placement into the pointer's own geometry.
 *
 * The same CSS-triangle trick as web — React Native supports the border
 * technique too. 16 along the panel's edge by 10 deep, mounted
 * {@link TOOLTIP_POINTER_INSET} inside so it protrudes 8.
 */
const pointerGeometry = (side: TSide, colour: string): ViewStyle => {
  const half = TOOLTIP_POINTER_LENGTH / 2;
  const out = -(TOOLTIP_POINTER_DEPTH - TOOLTIP_POINTER_INSET);
  const across = {
    borderLeftWidth: half,
    borderRightWidth: half,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  };
  const along = {
    borderTopWidth: half,
    borderBottomWidth: half,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  };
  if (side === 'top') {
    return { ...across, borderTopWidth: TOOLTIP_POINTER_DEPTH, borderTopColor: colour, bottom: out };
  }
  if (side === 'bottom') {
    return {
      ...across,
      borderBottomWidth: TOOLTIP_POINTER_DEPTH,
      borderBottomColor: colour,
      top: out,
    };
  }
  if (side === 'left') {
    return { ...along, borderLeftWidth: TOOLTIP_POINTER_DEPTH, borderLeftColor: colour, right: out };
  }
  return { ...along, borderRightWidth: TOOLTIP_POINTER_DEPTH, borderRightColor: colour, left: out };
};

/**
 * Wires the positioning engine and resolves every style the native Tooltip
 * needs.
 *
 * Same engine and same vocabulary as web — the thirteen placements are the
 * *result* of measuring the space. What differs is everything about opening
 * and closing it: there is no pointer on a touch screen, so a long press opens
 * it and a tap outside closes it, and none of WCAG 1.4.13's hover rules apply.
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
  const pointerRef = useRef<TViewElement | null>(null);

  const isInfo = type === 'info';
  const hasPointer = placement !== 'none';
  const preferred = placement && placement !== 'none' ? placement : 'top';

  const { refs, floatingStyles, placement: resolved, middlewareData, update } = useFloating({
    // React Native's engine has no `autoPlacement`, so with nothing stated the
    // preference is `top` and `flip` does the rest. The caller still never pins
    // a side: flip overrules it whenever there is no room.
    placement: preferred,
    middleware: [
      offset(dimension.offset),
      flip(),
      shift({ padding: dimension.offset }),
      // The engine's `arrow` wants its own ref shape; see the note on the refs.
      ...(hasPointer ? [arrow({ element: pointerRef as never })] : []),
    ],
    sameScrollView: false,
  });

  const side = resolved.split('-')[0] as TSide;
  const { x: pointerX, y: pointerY } = middlewareData.arrow ?? {};

  return {
    open,
    // Measure *then* show. Unlike web, where `autoUpdate` watches the pair
    // continuously, this engine positions on demand — and the trigger may have
    // moved since the last pass, most obviously inside a ScrollView.
    show: () => {
      update();
      setOpen(true);
    },
    hide: () => setOpen(false),
    setReference: refs.setReference as Ref<TViewElement>,
    setFloating: refs.setFloating as Ref<TViewElement>,
    pointerRef,
    floatingStyles,
    panelStyle: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: dimension.dismissGap,
      maxWidth: 280,
      paddingVertical: dimension.paddingVertical[type],
      paddingHorizontal: dimension.paddingHorizontal,
      borderRadius: dimension.borderRadius[type],
      backgroundColor: colors.surface,
      // Far first, near second: the first layer paints on top. Same string
      // syntax and same `overlay` ramp the Snackbar uses.
      boxShadow: [
        `0 ${dimension.shadowFarY}px ${dimension.shadowFarBlur}px ${colors.shadowFar}`,
        `0 ${dimension.shadowNearY}px ${dimension.shadowNearBlur}px ${colors.shadowNear}`,
      ].join(', '),
    },
    // No gap between the title and the body: the air is already inside the line
    // box. See TOOLTIP_TITLE_BODY_GAP.
    contentStyle: { flex: 1, minWidth: 0 },
    titleStyle: {
      // `fontFamily` carries the weight on this platform; never both.
      fontFamily: resolveMulishFontFamily(typography.title.fontWeight),
      fontSize: typography.title.fontSize,
      lineHeight: typography.title.fontSize * typography.title.lineHeightRatio,
      color: colors.title,
    },
    bodyStyle: {
      fontFamily: resolveMulishFontFamily(typography.body.fontWeight),
      fontSize: typography.body.fontSize,
      lineHeight: typography.body.fontSize * typography.body.lineHeightRatio,
      color: colors.body,
    },
    linkSlotStyle: { flexDirection: 'row', paddingTop: dimension.linkGap },
    pointerStyle: hasPointer
      ? {
          position: 'absolute',
          width: 0,
          height: 0,
          borderStyle: 'solid',
          ...(pointerX === undefined ? null : { left: pointerX }),
          ...(pointerY === undefined ? null : { top: pointerY }),
          ...pointerGeometry(side, colors.pointer),
        }
      : undefined,
    showDismiss: isInfo && onDismiss !== undefined,
    showTitle: isInfo && title !== undefined,
  };
};
