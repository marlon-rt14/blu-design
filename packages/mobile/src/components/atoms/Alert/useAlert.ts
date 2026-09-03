import { alertTokens } from '@dsm/shared';
import type { TAlertPlacement, TAlertTone } from '@dsm/shared';
import type { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IAlertProps } from './Alert.types';

interface IUseAlertParams extends IAlertProps {
  isDismissPressed: boolean;
}

interface IUseAlertResult {
  rootStyle: StyleProp<ViewStyle>;
  iconBoxStyle: StyleProp<ViewStyle>;
  chipStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  bodyStyle: StyleProp<TextStyle>;
  actionsStyle: StyleProp<ViewStyle>;
  dismissHitStyle: StyleProp<ViewStyle>;
  dismissVisualStyle: StyleProp<ViewStyle>;
  dismissHitSlop: Insets;
  liveRole: 'alert' | 'none';
  liveRegion: 'assertive' | 'polite';
}

const placementTokens = (
  placement: TAlertPlacement,
  tokens: (typeof alertTokens)['light'],
): (typeof tokens.placements)[TAlertPlacement] => {
  switch (placement) {
    case 'page':
      return tokens.placements.page;
    case 'section':
      return tokens.placements.section;
    case 'inline':
      return tokens.placements.inline;
    default: {
      const _exhaustive: never = placement;
      return _exhaustive;
    }
  }
};

const liveRoleOf = (tone: TAlertTone): 'alert' | 'none' => {
  switch (tone) {
    case 'danger':
    case 'warning':
      return 'alert';
    case 'success':
    case 'info':
    case 'neutral':
      return 'none';
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
};

const liveRegionOf = (tone: TAlertTone): 'assertive' | 'polite' => {
  switch (tone) {
    case 'danger':
    case 'warning':
      return 'assertive';
    case 'success':
    case 'info':
    case 'neutral':
      return 'polite';
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
};

export const useAlert = ({
  tone = 'danger',
  placement = 'page',
  isDismissPressed,
}: IUseAlertParams): IUseAlertResult => {
  const mode = useThemeMode();
  const tokens = alertTokens[mode];
  const sizeTokens = placementTokens(placement, tokens);
  const { chipSize, dismissSize, targetMin, pillRadius, actionPaddingTop } = tokens.dimension;
  const toneColors = tokens.colors.tones[tone];
  const hitOutset = (targetMin - dismissSize) / 2;

  const dismissBackground = isDismissPressed
    ? tokens.colors.dismiss.backgroundPressed
    : tokens.colors.dismiss.background;

  const liveRole = liveRoleOf(tone);
  const liveRegion = liveRegionOf(tone);

  const rootStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: sizeTokens.gap,
    width: '100%',
    padding: sizeTokens.padding,
    borderRadius: sizeTokens.borderRadius,
    backgroundColor: toneColors.surface,
  };

  const iconBoxStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: chipSize,
    height: sizeTokens.body.lineHeight,
    flexShrink: 0,
  };

  const chipStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: chipSize,
    height: chipSize,
    borderRadius: pillRadius,
    backgroundColor: toneColors.chip,
  };

  const contentStyle: StyleProp<ViewStyle> = {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(sizeTokens.title.fontWeight),
    fontSize: sizeTokens.title.fontSize,
    lineHeight: sizeTokens.title.lineHeight,
    color: tokens.colors.text,
  };

  const bodyStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(sizeTokens.body.fontWeight),
    fontSize: sizeTokens.body.fontSize,
    lineHeight: sizeTokens.body.lineHeight,
    color: tokens.colors.text,
  };

  const actionsStyle: StyleProp<ViewStyle> = {
    paddingTop: actionPaddingTop,
  };

  const dismissHitStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dismissSize,
    height: dismissSize,
    flexShrink: 0,
  };

  const dismissVisualStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    width: dismissSize,
    height: dismissSize,
    borderRadius: pillRadius,
    backgroundColor: dismissBackground,
  };

  const dismissHitSlop: Insets = {
    top: hitOutset,
    right: hitOutset,
    bottom: hitOutset,
    left: hitOutset,
  };

  return {
    rootStyle,
    iconBoxStyle,
    chipStyle,
    contentStyle,
    titleStyle,
    bodyStyle,
    actionsStyle,
    dismissHitStyle,
    dismissVisualStyle,
    dismissHitSlop,
    liveRole,
    liveRegion,
  };
};
