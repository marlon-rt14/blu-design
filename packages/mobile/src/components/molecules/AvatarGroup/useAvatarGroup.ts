import { avatarTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IAvatarGroupProps } from './AvatarGroup.types';

interface IUseAvatarGroupResult {
  rowStyle: StyleProp<ViewStyle>;
  /** First item sits at rest; every later one (including the overflow tile) overlaps the previous. */
  itemStyle: (index: number) => StyleProp<ViewStyle>;
  overflowStyle: StyleProp<ViewStyle>;
  overflowRingStyle: StyleProp<ViewStyle>;
  overflowTextStyle: StyleProp<TextStyle>;
}

export const useAvatarGroup = ({ size = 'md' }: IAvatarGroupProps): IUseAvatarGroupResult => {
  const mode = useThemeMode();
  const tokens = avatarTokens[mode];
  const sizeTokens = tokens.dimension.sizes[size];
  const fontFamily = useFontFamily(tokens.dimension.initialsFontWeight);
  const { diameter } = sizeTokens;

  const rowStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const itemStyle = (index: number): StyleProp<ViewStyle> => ({
    marginLeft: index === 0 ? 0 : sizeTokens.overlap,
  });

  const overflowStyle: StyleProp<ViewStyle> = {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    backgroundColor: tokens.colors.overflowBackground,
  };

  const overflowRingStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    inset: 0,
    borderRadius: diameter / 2,
    borderWidth: tokens.dimension.ringWidth,
    borderColor: tokens.colors.overflowBorder,
  };

  const overflowTextStyle: StyleProp<TextStyle> = {
    fontFamily,
    fontSize: tokens.dimension.initialsFontSize[size],
    color: tokens.colors.overflowText,
  };

  return { rowStyle, itemStyle, overflowStyle, overflowRingStyle, overflowTextStyle };
};
