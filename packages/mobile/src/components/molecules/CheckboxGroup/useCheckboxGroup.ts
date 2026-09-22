import { checkboxGroupTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ICheckboxGroupProps } from './CheckboxGroup.types';

/** Styles the CheckboxGroup needs to render. */
interface IUseCheckboxGroupResult {
  /** The group container. No lateral padding — that is screen margin. */
  groupStyle: StyleProp<ViewStyle>;
  legendStyle: StyleProp<TextStyle>;
  /** The rows slot. No gap: each row brings its own height and inset. */
  rowsStyle: StyleProp<ViewStyle>;
  helperStyle: StyleProp<TextStyle>;
}

/**
 * Resolves the CheckboxGroup's styles from the active theme and its props.
 *
 * No interaction state at all — the group is a container. Every state that
 * matters belongs to the rows, which is also why `isInvalid` only reaches
 * the helper text.
 *
 * Do not set `fontWeight` next to `fontFamily` — Android would look for a
 * suffixed Mulish file and fall back to the system font.
 */
export const useCheckboxGroup = ({
  size = 'sm',
  isInvalid = false,
}: ICheckboxGroupProps): IUseCheckboxGroupResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = checkboxGroupTokens[mode];
  const inset = dimension.textInset[size];

  return {
    groupStyle: { alignItems: 'flex-start' },
    legendStyle: {
      width: '100%',
      paddingHorizontal: inset,
      paddingBottom: dimension.legendGap,
      color: colors.legend,
      fontFamily: resolveMulishFontFamily(typography.legend.fontWeight),
      fontSize: typography.legend.fontSize,
      lineHeight: typography.legend.fontSize * typography.legend.lineHeightRatio,
      letterSpacing: typography.legend.letterSpacing,
    },
    rowsStyle: { alignItems: 'flex-start', width: '100%' },
    helperStyle: {
      width: '100%',
      paddingHorizontal: inset,
      paddingTop: dimension.helperGap,
      color: isInvalid ? colors.helperError : colors.helper,
      fontFamily: resolveMulishFontFamily(typography.helper.fontWeight),
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.fontSize * typography.helper.lineHeightRatio,
    },
  };
};
