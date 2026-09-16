import {
  COACHMARK_TITLE_BODY_GAP,
  TOOLTIP_POINTER_DEPTH,
  TOOLTIP_POINTER_INSET,
  TOOLTIP_POINTER_LENGTH,
  coachmarkTokens,
} from '@dsm/shared';
import type { TTipPointerDirection } from '@dsm/shared';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type { FloatingContext } from '@floating-ui/react';
import { useId, useRef } from 'react';
import type { CSSProperties, MutableRefObject } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ICoachmarkProps } from './Coachmark.types';

/** The side a resolved placement lands on. */
type TSide = 'top' | 'bottom' | 'left' | 'right';

/** What {@link useCoachmark} hands the component. */
export interface IUseCoachmarkResult {
  open: boolean;
  setReference: (node: HTMLElement | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  pointerRef: MutableRefObject<HTMLDivElement | null>;
  getFloatingProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  floatingStyles: CSSProperties;
  floatingContext: FloatingContext;
  shellStyle: CSSProperties;
  cardStyle: CSSProperties;
  mediaWrapStyle: CSSProperties;
  mediaDismissStyle: CSSProperties;
  contentStyle: CSSProperties;
  textBlockStyle: CSSProperties;
  headStyle: CSSProperties;
  titleStyle: CSSProperties;
  bodyStyle: CSSProperties;
  footerStyle: CSSProperties;
  stepStyle: CSSProperties;
  actionsStyle: CSSProperties;
  pointerStyle: CSSProperties | undefined;
  pointerDirection: TTipPointerDirection | undefined;
  pointerFill: string;
  pointerStroke: string;
  pointerStrokeWidth: number;
  titleId: string;
  bodyId: string;
  stepAnnouncement: string | undefined;
  renderTitle: boolean;
  renderBack: boolean;
  renderFooter: boolean;
  renderStep: boolean;
  dismissAppearance: 'veil' | 'on-media';
  dismissOnMedia: boolean;
  showDismiss: boolean;
}

/** Panel side → tip points toward the opposite side (the anchor). */
const tipDirectionForSide = (side: TSide): TTipPointerDirection => {
  switch (side) {
    case 'top':
      return 'down';
    case 'bottom':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    default: {
      const _exhaustive: never = side;
      return _exhaustive;
    }
  }
};

/**
 * Positions `.TipPointer` on the floating shell. Layout box is 16×10 (mitre
 * stubs overflow). Protrudes `depth - inset` (8) with the 2 px faldón over the
 * card border.
 */
const pointerPositionStyle = (
  side: TSide,
  pointerX: number | undefined,
  pointerY: number | undefined,
): CSSProperties => {
  const out = -(TOOLTIP_POINTER_DEPTH - TOOLTIP_POINTER_INSET);
  const vertical = side === 'top' || side === 'bottom';
  const base: CSSProperties = {
    position: 'absolute',
    width: vertical ? TOOLTIP_POINTER_LENGTH : TOOLTIP_POINTER_DEPTH,
    height: vertical ? TOOLTIP_POINTER_DEPTH : TOOLTIP_POINTER_LENGTH,
    zIndex: 1,
    pointerEvents: 'none',
    lineHeight: 0,
    overflow: 'visible',
  };

  if (side === 'top') {
    return { ...base, left: pointerX, bottom: out };
  }
  if (side === 'bottom') {
    return { ...base, left: pointerX, top: out };
  }
  if (side === 'left') {
    return { ...base, top: pointerY, right: out };
  }
  return { ...base, top: pointerY, left: out };
};

/**
 * Wires Floating UI and resolves every style the Coachmark needs.
 *
 * Controlled open: the host sets `isOpen`. Esc always dismisses. Outside press
 * dismisses only on `sequence="single"`. Role is non-modal `dialog` with focus
 * moved into the panel on open and returned to the anchor on close.
 */
export const useCoachmark = ({
  media = 'none',
  sequence = 'single',
  placement = 'top-start',
  isOpen = false,
  showTitle = true,
  stepIndex = '2 de 4',
  showAction = true,
  showBack = true,
  showDismiss = true,
  onOpenChange,
}: ICoachmarkProps): IUseCoachmarkResult => {
  const mode = useThemeMode();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { colors, dimension, title: titleType, body: bodyType, step: stepType } =
    coachmarkTokens[mode];
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const bodyId = useId();
  const titleFontFamily = useFontFamily(titleType.fontWeight);
  const bodyFontFamily = useFontFamily(bodyType.fontWeight);
  const stepFontFamily = useFontFamily(stepType.fontWeight);

  const hasPointer = placement !== 'none';
  const preferred = placement !== 'none' ? placement : undefined;
  const isMulti = sequence === 'multi';

  const { refs, floatingStyles, context, middlewareData, placement: resolved } = useFloating({
    open: isOpen,
    onOpenChange: (next) => {
      onOpenChange?.(next);
    },
    placement: preferred,
    middleware: [
      offset(dimension.tipReserve),
      preferred ? flip() : autoPlacement(),
      shift({ padding: dimension.tipReserve }),
      ...(hasPointer ? [arrow({ element: pointerRef, padding: dimension.pointerEdgeInset })] : []),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePress: !isMulti,
  });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const side = resolved.split('-')[0] as TSide;
  const { x: pointerX, y: pointerY } = middlewareData.arrow ?? {};

  const renderTitle = media === 'none' ? true : showTitle;
  const renderBack = isMulti && showBack;
  const renderStep = isMulti;
  const renderFooter = renderStep || renderBack || showAction;
  const dismissOnMedia = media === 'image' && showDismiss;

  const announcedStep =
    renderStep && stepIndex
      ? /^paso\s+/i.test(stepIndex)
        ? stepIndex
        : `Paso ${stepIndex}`
      : undefined;

  return {
    open: isOpen,
    setReference: refs.setReference,
    setFloating: refs.setFloating,
    pointerRef,
    getFloatingProps,
    floatingStyles: {
      ...floatingStyles,
      zIndex: dimension.zIndex,
    },
    floatingContext: context,
    // Do **not** set `position` here — `floatingStyles` owns absolute/fixed
    // placement. Spreading `position: 'relative'` after it was pinning the
    // portal panel to the document origin instead of the anchor.
    shellStyle: {
      boxSizing: 'border-box',
      width: dimension.width,
      ...(prefersReducedMotion
        ? {}
        : { transition: `opacity ${dimension.enterDurationMs}ms ease-out` }),
    },
    cardStyle: {
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden',
      borderRadius: dimension.borderRadius,
      borderWidth: dimension.borderWidth,
      borderStyle: 'solid',
      borderColor: colors.border,
      backgroundColor: colors.surface,
      boxShadow: [
        `0 ${dimension.overlayShadowFarY}px ${dimension.overlayShadowFarBlur}px ${colors.overlayShadowFar}`,
        `0 ${dimension.overlayShadowNearY}px ${dimension.overlayShadowNearBlur}px ${colors.overlayShadowNear}`,
      ].join(', '),
    },
    mediaWrapStyle: {
      position: 'relative',
      width: '100%',
      backgroundColor: colors.media,
    },
    mediaDismissStyle: {
      position: 'absolute',
      top: dimension.mediaDismissInset,
      right: dimension.mediaDismissInset,
      zIndex: 1,
    },
    contentStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: dimension.blockGap,
      padding: dimension.padding,
      boxSizing: 'border-box',
    },
    textBlockStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: COACHMARK_TITLE_BODY_GAP,
      flex: 1,
      minWidth: 0,
    },
    headStyle: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: dimension.inlineGap,
      width: '100%',
    },
    titleStyle: {
      margin: 0,
      flex: 1,
      minWidth: 0,
      fontFamily: titleFontFamily,
      fontWeight: titleType.fontWeight,
      fontSize: titleType.fontSize,
      lineHeight: `${titleType.lineHeight}px`,
      color: colors.title,
    },
    bodyStyle: {
      margin: 0,
      fontFamily: bodyFontFamily,
      fontWeight: bodyType.fontWeight,
      fontSize: bodyType.fontSize,
      lineHeight: `${bodyType.lineHeight}px`,
      color: colors.body,
    },
    // Single: actions sit start (Figma left). Multi: step start + actions end.
    footerStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: renderStep ? 'space-between' : 'flex-start',
      gap: dimension.inlineGap,
      width: '100%',
    },
    stepStyle: {
      margin: 0,
      fontFamily: stepFontFamily,
      fontWeight: stepType.fontWeight,
      fontSize: stepType.fontSize,
      lineHeight: `${stepType.lineHeight}px`,
      color: colors.step,
    },
    actionsStyle: {
      display: 'flex',
      alignItems: 'center',
      gap: dimension.inlineGap,
      ...(renderStep ? { marginLeft: 'auto' } : {}),
    },
    pointerStyle: hasPointer
      ? pointerPositionStyle(side, pointerX, pointerY)
      : undefined,
    pointerDirection: hasPointer ? tipDirectionForSide(side) : undefined,
    pointerFill: colors.pointer,
    pointerStroke: colors.pointerBorder,
    pointerStrokeWidth: dimension.borderWidth,
    titleId,
    bodyId,
    stepAnnouncement: announcedStep,
    renderTitle,
    renderBack,
    renderFooter,
    renderStep,
    dismissAppearance: media === 'image' ? 'on-media' : 'veil',
    dismissOnMedia,
    showDismiss,
  };
};
