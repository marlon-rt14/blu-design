import {
  COACHMARK_TITLE_BODY_GAP,
  TOOLTIP_POINTER_DEPTH,
  TOOLTIP_POINTER_INSET,
  TOOLTIP_POINTER_LENGTH,
  coachmarkTokens,
} from '@dsm/shared';
import type { TTipPointerDirection } from '@dsm/shared';
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/react-native';
import { useEffect, useRef } from 'react';
import type { ComponentRef, MutableRefObject, Ref } from 'react';
import type { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ICoachmarkProps } from './Coachmark.types';

/** What a ref to a `View` actually points at on React Native 0.87. */
type TViewElement = ComponentRef<typeof View>;

/** The side a resolved placement lands on. */
type TSide = 'top' | 'bottom' | 'left' | 'right';

/** What {@link useCoachmark} hands the component. */
export interface IUseCoachmarkResult {
  open: boolean;
  setReference: Ref<TViewElement>;
  setFloating: Ref<TViewElement>;
  pointerRef: MutableRefObject<TViewElement | null>;
  /** Re-measure after overlay layout / orientation changes. */
  update: () => void;
  floatingStyles: StyleProp<ViewStyle>;
  shellStyle: StyleProp<ViewStyle>;
  cardStyle: StyleProp<ViewStyle>;
  mediaWrapStyle: StyleProp<ViewStyle>;
  mediaDismissStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  textBlockStyle: StyleProp<ViewStyle>;
  headStyle: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  bodyStyle: StyleProp<TextStyle>;
  footerStyle: StyleProp<ViewStyle>;
  stepStyle: StyleProp<TextStyle>;
  actionsStyle: StyleProp<ViewStyle>;
  pointerStyle: StyleProp<ViewStyle> | undefined;
  pointerDirection: TTipPointerDirection | undefined;
  pointerFill: string;
  pointerStroke: string;
  pointerStrokeWidth: number;
  stepAnnouncement: string | undefined;
  renderTitle: boolean;
  renderBack: boolean;
  renderFooter: boolean;
  renderStep: boolean;
  dismissAppearance: 'veil' | 'on-media';
  dismissOnMedia: boolean;
  showDismiss: boolean;
  closeOnBackdrop: boolean;
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
): ViewStyle => {
  const out = -(TOOLTIP_POINTER_DEPTH - TOOLTIP_POINTER_INSET);
  const vertical = side === 'top' || side === 'bottom';
  const base: ViewStyle = {
    position: 'absolute',
    width: vertical ? TOOLTIP_POINTER_LENGTH : TOOLTIP_POINTER_DEPTH,
    height: vertical ? TOOLTIP_POINTER_DEPTH : TOOLTIP_POINTER_LENGTH,
    zIndex: 1,
    overflow: 'visible',
  };

  if (side === 'top') {
    return { ...base, ...(pointerX === undefined ? {} : { left: pointerX }), bottom: out };
  }
  if (side === 'bottom') {
    return { ...base, ...(pointerX === undefined ? {} : { left: pointerX }), top: out };
  }
  if (side === 'left') {
    return { ...base, ...(pointerY === undefined ? {} : { top: pointerY }), right: out };
  }
  return { ...base, ...(pointerY === undefined ? {} : { top: pointerY }), left: out };
};

/**
 * Resolves styles and Floating UI refs for the native Coachmark.
 *
 * React Native has no `autoPlacement` — an omitted placement prefers `top` and
 * `flip` does the rest (Dev frame: *"Los 13 placement son el resultado, no la
 * entrada"*). Panel is portaled (`Modal` / fixed overlay) while the anchor is
 * not → `sameScrollView: false` (`measureInWindow`). Do **not** set
 * `offsetParent`: its `.measure()` is parent-relative and corrupts window
 * coords (panel below the anchor with the tip still on the bottom edge).
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
}: ICoachmarkProps): IUseCoachmarkResult => {
  const mode = useThemeMode();
  const { colors, dimension, title: titleType, body: bodyType, step: stepType } =
    coachmarkTokens[mode];
  const pointerRef = useRef<TViewElement | null>(null);

  const hasPointer = placement !== 'none';
  const preferred = placement !== 'none' ? placement : 'top';
  const isMulti = sequence === 'multi';

  const { refs, floatingStyles, placement: resolved, middlewareData, update } = useFloating({
    placement: preferred,
    middleware: [
      offset(dimension.tipReserve),
      // Preference only — Dev: placement is the engine's result. Flip when the
      // preferred side has no room; the prop value in controls does not change.
      flip(),
      shift({ padding: dimension.tipReserve }),
      ...(hasPointer
        ? [arrow({ element: pointerRef as never, padding: dimension.pointerEdgeInset })]
        : []),
    ],
    sameScrollView: false,
  });

  // Portaled panel + `measureInWindow`: position is only current at measure
  // time. Figma: *"Al hacer scroll sigue al ancla"*. Web has `autoUpdate`;
  // here we remeasure every frame while open so the card tracks the anchor
  // (and the tip side stays in sync after flip).
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    let frame = 0;
    let alive = true;
    const tick = (): void => {
      if (!alive) {
        return;
      }
      update();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, [isOpen, placement, update]);

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
    setReference: refs.setReference as Ref<TViewElement>,
    setFloating: refs.setFloating as Ref<TViewElement>,
    pointerRef,
    update,
    floatingStyles: [{ zIndex: dimension.zIndex }, floatingStyles],
    // No `position` on the shell — `floatingStyles` owns absolute placement.
    shellStyle: {
      width: dimension.width,
    },
    cardStyle: {
      position: 'relative',
      flexDirection: 'column',
      width: '100%',
      overflow: 'hidden',
      borderRadius: dimension.borderRadius,
      borderWidth: dimension.borderWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      // Same overlay ramp string syntax as Tooltip / Snackbar.
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
      flexDirection: 'column',
      gap: dimension.blockGap,
      padding: dimension.padding,
    },
    textBlockStyle: {
      flexDirection: 'column',
      gap: COACHMARK_TITLE_BODY_GAP,
      flexShrink: 1,
      minWidth: 0,
    },
    headStyle: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: dimension.inlineGap,
      width: '100%',
    },
    titleStyle: {
      flex: 1,
      minWidth: 0,
      fontFamily: resolveMulishFontFamily(titleType.fontWeight),
      fontSize: titleType.fontSize,
      lineHeight: titleType.lineHeight,
      color: colors.title,
    },
    bodyStyle: {
      fontFamily: resolveMulishFontFamily(bodyType.fontWeight),
      fontSize: bodyType.fontSize,
      lineHeight: bodyType.lineHeight,
      color: colors.body,
    },
    // Single: actions sit start (Figma left). Multi: step start + actions end.
    footerStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: renderStep ? 'space-between' : 'flex-start',
      gap: dimension.inlineGap,
      width: '100%',
    },
    stepStyle: {
      fontFamily: resolveMulishFontFamily(stepType.fontWeight),
      fontSize: stepType.fontSize,
      lineHeight: stepType.lineHeight,
      color: colors.step,
    },
    actionsStyle: {
      flexDirection: 'row',
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
    stepAnnouncement: announcedStep,
    renderTitle,
    renderBack,
    renderFooter,
    renderStep,
    dismissAppearance: media === 'image' ? 'on-media' : 'veil',
    dismissOnMedia,
    showDismiss,
    closeOnBackdrop: !isMulti,
  };
};
