import { snackbarTokens } from '@dsm/shared';
import type { TSnackbarStatus, TTokensOf } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ISnackbarProps } from './Snackbar.types';

interface IUseSnackbarParams extends ISnackbarProps {
  isDismissHovered: boolean;
  isDismissPressed: boolean;
  isDismissFocusVisible: boolean;
}

interface IUseSnackbarResult {
  rootStyle: CSSProperties;
  contentStyle: CSSProperties;
  iconBoxStyle: CSSProperties;
  messageStyle: CSSProperties;
  actionsStyle: CSSProperties;
  dismissHitStyle: CSSProperties;
  dismissVisualStyle: CSSProperties;
  live: 'assertive' | 'polite';
  swipeThreshold: number;
}

const overlayShadow = (tokens: TTokensOf<typeof snackbarTokens>): string => {
  const { dimension, colors } = tokens;
  return [
    `0 ${dimension.overlayShadowFarY}px ${dimension.overlayShadowFarBlur}px ${colors.overlayShadowFar}`,
    `0 ${dimension.overlayShadowNearY}px ${dimension.overlayShadowNearBlur}px ${colors.overlayShadowNear}`,
  ].join(', ');
};

const liveOf = (status: TSnackbarStatus): 'assertive' | 'polite' => {
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
  isDismissHovered,
  isDismissPressed,
  isDismissFocusVisible,
}: IUseSnackbarParams): IUseSnackbarResult => {
  const mode = useThemeMode();
  const tokens = snackbarTokens[mode];
  const { dimension, colors, message } = tokens;
  const fontFamily = useFontFamily(message.fontWeight);
  const hitOutset = (dimension.targetMin - dimension.dismissSize) / 2;

  const dismissBackground = isDismissPressed
    ? colors.dismiss.backgroundPressed
    : isDismissHovered
      ? colors.dismiss.backgroundHover
      : 'transparent';

  const rootStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimension.actionsGap,
    width: '100%',
    maxWidth: dimension.maxWidth,
    alignSelf: 'center',
    padding: dimension.padding,
    borderStyle: 'solid',
    borderWidth: dimension.borderWidth,
    borderColor: colors.border,
    borderRadius: dimension.borderRadius,
    backgroundColor: colors.surface,
    boxShadow: overlayShadow(tokens),
    zIndex: dimension.zIndex,
  };

  const contentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimension.contentGap,
    flex: 1,
    minWidth: 0,
    minHeight: dimension.contentMinHeight,
  };

  const iconBoxStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: dimension.iconSize,
    height: dimension.iconSize,
  };

  const messageStyle: CSSProperties = {
    margin: 0,
    flex: 1,
    minWidth: 0,
    fontFamily,
    fontWeight: message.fontWeight,
    fontSize: message.fontSize,
    lineHeight: `${message.lineHeight}px`,
    color: colors.text,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflowWrap: 'break-word',
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimension.actionsInlineGap,
    flexShrink: 0,
  };

  const dismissHitStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: dimension.targetMin,
    height: dimension.targetMin,
    margin: -hitOutset,
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  };

  const dismissVisualStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dimension.dismissSize,
    height: dimension.dismissSize,
    borderRadius: dimension.pillRadius,
    backgroundColor: dismissBackground,
    outline: isDismissFocusVisible
      ? `${dimension.focusRingSpread}px solid ${colors.dismiss.borderFocus}`
      : 'none',
    outlineOffset: dimension.focusRingOffset,
  };

  return {
    rootStyle,
    contentStyle,
    iconBoxStyle,
    messageStyle,
    actionsStyle,
    dismissHitStyle,
    dismissVisualStyle,
    live: liveOf(status),
    swipeThreshold: dimension.targetMin,
  };
};
