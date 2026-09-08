import { snackbarTokens } from '@dsm/shared';
import type { TSnackbarTone } from '@dsm/shared';
import type { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ISnackbarProps } from './Snackbar.types';

interface IUseSnackbarParams extends ISnackbarProps {
  isClosePressed: boolean;
  isCloseFocused: boolean;
}

interface IUseSnackbarResult {
  rootStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  iconBoxStyle: StyleProp<ViewStyle>;
  messageStyle: StyleProp<TextStyle>;
  actionsStyle: StyleProp<ViewStyle>;
  closeHitStyle: StyleProp<ViewStyle>;
  closeVisualStyle: StyleProp<ViewStyle>;
  closeHitSlop: Insets;
  liveRegion: 'assertive' | 'polite';
  swipeThreshold: number;
  swipeCapture: number;
}

const overlayShadow = (tokens: (typeof snackbarTokens)['light']): string => {
  const { dimension, colors } = tokens;
  return [
    `0 ${dimension.overlayShadowFarY}px ${dimension.overlayShadowFarBlur}px ${colors.overlayShadowFar}`,
    `0 ${dimension.overlayShadowNearY}px ${dimension.overlayShadowNearBlur}px ${colors.overlayShadowNear}`,
  ].join(', ');
};

const liveRegionOf = (tone: TSnackbarTone): 'assertive' | 'polite' => {
  switch (tone) {
    case 'danger':
      return 'assertive';
    case 'info':
    case 'success':
    case 'warning':
      return 'polite';
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
};

export const useSnackbar = ({
  tone = 'info',
  isClosePressed,
  isCloseFocused,
}: IUseSnackbarParams): IUseSnackbarResult => {
  const mode = useThemeMode();
  const tokens = snackbarTokens[mode];
  const { dimension, colors, message } = tokens;
  const hitOutset = (dimension.targetMin - dimension.closeSize) / 2;

  const closeBackground = isClosePressed ? colors.close.backgroundPressed : 'transparent';

  const rootStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimension.actionsGap,
    width: '100%',
    maxWidth: dimension.maxWidth,
    alignSelf: 'center',
    padding: dimension.padding,
    borderWidth: dimension.borderWidth,
    borderColor: colors.border,
    borderRadius: dimension.borderRadius,
    backgroundColor: colors.surface,
    boxShadow: overlayShadow(tokens),
    zIndex: dimension.zIndex,
  };

  const contentStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimension.contentGap,
    flex: 1,
    minWidth: 0,
    minHeight: dimension.contentMinHeight,
  };

  const iconBoxStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.iconSize,
    height: dimension.iconSize,
    flexShrink: 0,
  };

  const messageStyle: StyleProp<TextStyle> = {
    flex: 1,
    minWidth: 0,
    fontFamily: resolveMulishFontFamily(message.fontWeight),
    fontSize: message.fontSize,
    lineHeight: message.lineHeight,
    color: colors.text,
  };

  const actionsStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimension.actionsInlineGap,
    flexShrink: 0,
  };

  const closeHitStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.closeSize,
    height: dimension.closeSize,
    flexShrink: 0,
  };

  const closeVisualStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.closeSize,
    height: dimension.closeSize,
    borderRadius: dimension.pillRadius,
    backgroundColor: closeBackground,
    ...(isCloseFocused
      ? {
          outlineWidth: dimension.focusRingSpread,
          outlineOffset: dimension.focusRingOffset,
          outlineColor: colors.close.borderFocus,
          outlineStyle: 'solid' as const,
        }
      : {}),
  };

  const closeHitSlop: Insets = {
    top: hitOutset,
    right: hitOutset,
    bottom: hitOutset,
    left: hitOutset,
  };

  return {
    rootStyle,
    contentStyle,
    iconBoxStyle,
    messageStyle,
    actionsStyle,
    closeHitStyle,
    closeVisualStyle,
    closeHitSlop,
    liveRegion: liveRegionOf(tone),
    swipeThreshold: dimension.targetMin,
    swipeCapture: dimension.swipeCapture,
  };
};
