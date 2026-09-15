import { snackbarTokens } from '@dsm/shared';
import type { TSnackbarStatus, TTokensOf } from '@dsm/shared';
import type { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ISnackbarProps } from './Snackbar.types';

interface IUseSnackbarParams extends ISnackbarProps {
  isDismissPressed: boolean;
  isDismissFocused: boolean;
}

interface IUseSnackbarResult {
  rootStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  iconBoxStyle: StyleProp<ViewStyle>;
  messageStyle: StyleProp<TextStyle>;
  actionsStyle: StyleProp<ViewStyle>;
  dismissHitStyle: StyleProp<ViewStyle>;
  dismissVisualStyle: StyleProp<ViewStyle>;
  dismissHitSlop: Insets;
  liveRegion: 'assertive' | 'polite';
  swipeThreshold: number;
  swipeCapture: number;
}

const overlayShadow = (tokens: TTokensOf<typeof snackbarTokens>): string => {
  const { dimension, colors } = tokens;
  return [
    `0 ${dimension.overlayShadowFarY}px ${dimension.overlayShadowFarBlur}px ${colors.overlayShadowFar}`,
    `0 ${dimension.overlayShadowNearY}px ${dimension.overlayShadowNearBlur}px ${colors.overlayShadowNear}`,
  ].join(', ');
};

const liveRegionOf = (status: TSnackbarStatus): 'assertive' | 'polite' => {
  switch (status) {
    case 'danger':
      return 'assertive';
    case 'info':
    case 'success':
    case 'warning':
      return 'polite';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
};

export const useSnackbar = ({
  status = 'info',
  isDismissPressed,
  isDismissFocused,
}: IUseSnackbarParams): IUseSnackbarResult => {
  const mode = useThemeMode();
  const tokens = snackbarTokens[mode];
  const { dimension, colors, message } = tokens;
  const hitOutset = (dimension.targetMin - dimension.dismissSize) / 2;

  const dismissBackground = isDismissPressed ? colors.dismiss.backgroundPressed : 'transparent';

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

  const dismissHitStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.dismissSize,
    height: dimension.dismissSize,
    flexShrink: 0,
  };

  const dismissVisualStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.dismissSize,
    height: dimension.dismissSize,
    borderRadius: dimension.pillRadius,
    backgroundColor: dismissBackground,
    ...(isDismissFocused
      ? {
          outlineWidth: dimension.focusRingSpread,
          outlineOffset: dimension.focusRingOffset,
          outlineColor: colors.dismiss.borderFocus,
          outlineStyle: 'solid' as const,
        }
      : {}),
  };

  const dismissHitSlop: Insets = {
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
    dismissHitStyle,
    dismissVisualStyle,
    dismissHitSlop,
    liveRegion: liveRegionOf(status),
    swipeThreshold: dimension.targetMin,
    swipeCapture: dimension.swipeCapture,
  };
};
