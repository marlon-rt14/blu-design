import { tagTokens, TAG_LINE_HEIGHT_RATIO } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ITagProps } from './Tag.types';

interface IUseTagResult {
  rootStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  iconColor: string;
  removeButtonStyle: StyleProp<ViewStyle>;
}

/**
 * Resolves every style the Tag needs. There is no interaction state to
 * derive — bDS removed Tag's `state` axis entirely: a Tag is read, not
 * touched (`showRemove`'s button is its own separate target, not the tag).
 */
export const useTag = ({
  appearance = 'soft',
  palette = 'neutral',
  size = 'sm',
}: ITagProps): IUseTagResult => {
  const mode = useThemeMode();
  const tokens = tagTokens[mode];
  const colors = tokens.colors.palettes[palette][appearance];
  const sizeTokens = tokens.dimension.sizes[size];
  const font = resolveMulishFontFamily(tokens.dimension.fontWeight);

  return {
    rootStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: tokens.dimension.gap,
      height: sizeTokens.height,
      paddingHorizontal: sizeTokens.paddingHorizontal,
      borderRadius: tokens.dimension.borderRadius,
      borderWidth: colors.border ? tokens.dimension.borderWidth : 0,
      borderColor: colors.border ?? 'transparent',
      backgroundColor: colors.background,
      alignSelf: 'flex-start',
    },
    labelStyle: {
      color: colors.text,
      fontFamily: font,
      fontSize: sizeTokens.fontSize,
      lineHeight: sizeTokens.fontSize * TAG_LINE_HEIGHT_RATIO,
    },
    iconColor: colors.icon,
    removeButtonStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: tokens.dimension.removeTargetSize,
      height: tokens.dimension.removeTargetSize,
      borderRadius: tokens.dimension.removeTargetSize / 2,
    },
  };
};
