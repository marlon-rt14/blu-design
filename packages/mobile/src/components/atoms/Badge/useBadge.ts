import { badgeTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveFontWeight, useThemeMode } from '../../../theme';
import type { IBadgeProps } from './Badge.types';

interface IUseBadgeResult {
  rootStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
}

/**
 * Resolves every style the Badge needs. Same shape as web's `useBadge`: a
 * pure function of `status` and `type` — Badge has no interaction state.
 */
export const useBadge = ({ type = 'count', status = 'neutral' }: IBadgeProps): IUseBadgeResult => {
  const mode = useThemeMode();
  const { colors, dimension, text } = badgeTokens[mode];
  const statusColors = colors.statuses[status];
  const fontWeight = resolveFontWeight(text.fontWeight);

  const isDot = type === 'dot';

  return {
    rootStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      minWidth: isDot ? dimension.dotSize : dimension.countSize,
      height: isDot ? dimension.dotSize : dimension.countSize,
      paddingHorizontal: isDot ? 0 : dimension.paddingHorizontal,
      borderRadius: dimension.borderRadius,
      backgroundColor: statusColors.bg,
    },
    textStyle: {
      fontWeight,
      fontSize: text.fontSize,
      lineHeight: text.lineHeight,
      color: statusColors.text,
    },
  };
};
