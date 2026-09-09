import { avatarTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IAvatarGroupProps } from './AvatarGroup.types';

interface IUseAvatarGroupResult {
  rowStyle: CSSProperties;
  /** First item sits at rest; every later one (including the overflow tile) overlaps the previous. */
  itemStyle: (index: number) => CSSProperties;
  overflowStyle: CSSProperties;
  overflowTextStyle: CSSProperties;
}

export const useAvatarGroup = ({ size = 'md' }: IAvatarGroupProps): IUseAvatarGroupResult => {
  const mode = useThemeMode();
  const tokens = avatarTokens[mode];
  const sizeTokens = tokens.dimension.sizes[size];
  const fontFamily = useFontFamily(tokens.dimension.initialsFontWeight);

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  const itemStyle = (index: number): CSSProperties => ({
    marginLeft: index === 0 ? 0 : sizeTokens.overlap,
  });

  const overflowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeTokens.diameter,
    height: sizeTokens.diameter,
    boxSizing: 'border-box',
    borderRadius: '50%',
    backgroundColor: tokens.colors.overflowBackground,
    boxShadow: `inset 0 0 0 ${tokens.dimension.ringWidth}px ${tokens.colors.overflowBorder}`,
  };

  const overflowTextStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.dimension.initialsFontWeight,
    fontSize: tokens.dimension.initialsFontSize[size],
    color: tokens.colors.overflowText,
    userSelect: 'none',
  };

  return { rowStyle, itemStyle, overflowStyle, overflowTextStyle };
};
