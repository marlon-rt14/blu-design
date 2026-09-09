import { tagTokens, TAG_LINE_HEIGHT_RATIO } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ITagGroupProps } from './TagGroup.types';

interface IUseTagGroupResult {
  rowStyle: StyleProp<ViewStyle>;
  overflowStyle: StyleProp<ViewStyle>;
  overflowTextStyle: StyleProp<TextStyle>;
}

export const useTagGroup = ({ size = 'sm' }: ITagGroupProps): IUseTagGroupResult => {
  const mode = useThemeMode();
  const tokens = tagTokens[mode];
  const sizeTokens = tokens.dimension.sizes[size];
  // Neutral/outline reads as a counter rather than another labelled tone.
  const colors = tokens.colors.palettes.neutral.outline;
  const font = resolveMulishFontFamily(tokens.dimension.fontWeight);

  const rowStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: tokens.dimension.gap * 2,
    rowGap: tokens.dimension.gap * 2,
  };

  const overflowStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeTokens.height,
    paddingHorizontal: sizeTokens.paddingHorizontal,
    borderRadius: tokens.dimension.borderRadius,
    borderWidth: tokens.dimension.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.background,
  };

  const overflowTextStyle: StyleProp<TextStyle> = {
    color: colors.text,
    fontFamily: font,
    fontSize: sizeTokens.fontSize,
    lineHeight: sizeTokens.fontSize * TAG_LINE_HEIGHT_RATIO,
  };

  return { rowStyle, overflowStyle, overflowTextStyle };
};
