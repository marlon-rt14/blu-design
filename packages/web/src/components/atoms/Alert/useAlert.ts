import { alertTokens } from '@dsm/shared';
import type { TAlertPlacement } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IAlertProps } from './Alert.types';

interface IUseAlertParams extends IAlertProps {
  isDismissHovered: boolean;
  isDismissPressed: boolean;
  isDismissFocusVisible: boolean;
}

interface IUseAlertResult {
  rootStyle: CSSProperties;
  iconBoxStyle: CSSProperties;
  chipStyle: CSSProperties;
  contentStyle: CSSProperties;
  titleStyle: CSSProperties;
  bodyStyle: CSSProperties;
  actionsStyle: CSSProperties;
  dismissHitStyle: CSSProperties;
  dismissVisualStyle: CSSProperties;
  liveRole: 'alert' | 'status' | undefined;
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

/**
 * Chip sits in `iconBox` whose height is the body line-box so it lines up
 * with the first text line, not the padding edge. Do not drop that frame.
 */
export const useAlert = ({
  tone = 'danger',
  placement = 'page',
  announce = true,
  isDismissHovered,
  isDismissPressed,
  isDismissFocusVisible,
}: IUseAlertParams): IUseAlertResult => {
  const mode = useThemeMode();
  const tokens = alertTokens[mode];
  const sizeTokens = placementTokens(placement, tokens);
  const { chipSize, dismissSize, targetMin, pillRadius, focusRingOffset, focusRingSpread, actionPaddingTop } =
    tokens.dimension;
  const titleFontFamily = useFontFamily(sizeTokens.title.fontWeight);
  const bodyFontFamily = useFontFamily(sizeTokens.body.fontWeight);
  const toneColors = tokens.colors.tones[tone];

  const dismissBackground = isDismissPressed
    ? tokens.colors.dismiss.backgroundPressed
    : isDismissHovered
      ? tokens.colors.dismiss.backgroundHover
      : tokens.colors.dismiss.background;

  const showFocusRing = isDismissFocusVisible;
  const boxShadow = showFocusRing
    ? `0 0 0 ${focusRingSpread - focusRingOffset}px ${tokens.colors.borderFocus}`
    : undefined;

  const hitOutset = (targetMin - dismissSize) / 2;

  const liveRole: 'alert' | 'status' | undefined = announce
    ? tone === 'danger' || tone === 'warning'
      ? 'alert'
      : 'status'
    : undefined;

  const rootStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: sizeTokens.gap,
    width: '100%',
    padding: sizeTokens.padding,
    borderRadius: sizeTokens.borderRadius,
    backgroundColor: toneColors.surface,
  };

  const iconBoxStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: chipSize,
    height: sizeTokens.body.lineHeight,
  };

  const chipStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: chipSize,
    height: chipSize,
    borderRadius: pillRadius,
    backgroundColor: toneColors.chip,
  };

  const contentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontFamily: titleFontFamily,
    fontWeight: sizeTokens.title.fontWeight,
    fontSize: sizeTokens.title.fontSize,
    lineHeight: `${sizeTokens.title.lineHeight}px`,
    color: tokens.colors.text,
  };

  const bodyStyle: CSSProperties = {
    margin: 0,
    fontFamily: bodyFontFamily,
    fontWeight: sizeTokens.body.fontWeight,
    fontSize: sizeTokens.body.fontSize,
    lineHeight: `${sizeTokens.body.lineHeight}px`,
    color: tokens.colors.text,
  };

  const actionsStyle: CSSProperties = {
    paddingTop: actionPaddingTop,
  };

  const dismissHitStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: targetMin,
    height: targetMin,
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
    width: dismissSize,
    height: dismissSize,
    borderRadius: pillRadius,
    backgroundColor: dismissBackground,
    boxShadow,
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
    liveRole,
  };
};
