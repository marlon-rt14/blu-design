import { badgeTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IBadgeProps } from './Badge.types';

interface IUseBadgeResult {
  rootStyle: CSSProperties;
  textStyle: CSSProperties;
}

/**
 * Resolves every style the Badge needs.
 *
 * No interaction state to track — Badge has none — so this is a pure
 * function of `status` and `type`. `dot` is a fixed circle at
 * `dimension.dotSize`; `count` floors at `dimension.countSize` (circular for
 * one digit) and grows only horizontally once the text is wider than it is
 * tall.
 */
export const useBadge = ({ type = 'count', status = 'neutral' }: IBadgeProps): IUseBadgeResult => {
  const mode = useThemeMode();
  const { colors, dimension, text } = badgeTokens[mode];
  const statusColors = colors.statuses[status];
  const fontFamily = useFontFamily(text.fontWeight);

  const isDot = type === 'dot';

  return {
    rootStyle: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      minWidth: isDot ? dimension.dotSize : dimension.countSize,
      height: isDot ? dimension.dotSize : dimension.countSize,
      paddingInline: isDot ? 0 : dimension.paddingHorizontal,
      borderRadius: dimension.borderRadius,
      backgroundColor: statusColors.bg,
    },
    textStyle: {
      fontFamily,
      fontWeight: text.fontWeight,
      fontSize: text.fontSize,
      lineHeight: `${text.lineHeight}px`,
      color: statusColors.text,
      whiteSpace: 'nowrap',
    },
  };
};
