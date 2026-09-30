import { radioGroupTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveFontWeight, useThemeMode } from '../../../theme';
import type { IRadioGroupProps } from './RadioGroup.types';

/** Styles the RadioGroup needs to render. */
interface IUseRadioGroupResult {
  /** The group container. No lateral padding — that is screen margin. */
  groupStyle: StyleProp<ViewStyle>;
  legendStyle: StyleProp<TextStyle>;
  /** The rows slot. No gap: each row brings its own height and inset. */
  rowsStyle: StyleProp<ViewStyle>;
  helperStyle: StyleProp<TextStyle>;
}

/**
 * Resolves the RadioGroup's styles from the active theme and its props.
 *
 * No interaction state at all — the group is a container. Every state that
 * matters belongs to the rows, which is also why `isInvalid` only reaches the
 * helper text.
 *
 * @param props - The RadioGroup props.
 */
export const useRadioGroup = ({
  size = 'sm',
  isInvalid = false,
}: IRadioGroupProps): IUseRadioGroupResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = radioGroupTokens[mode];
  const inset = dimension.textInset[size];

  return {
    groupStyle: { alignItems: 'flex-start' },
    // See @dsm/mobile's TextField useTextField for why fontWeight never
    // selects the cut: the family is the system one.
    legendStyle: {
      width: '100%',
      paddingHorizontal: inset,
      paddingBottom: dimension.legendGap,
      color: colors.legend,
      fontWeight: resolveFontWeight(typography.legend.fontWeight),
      fontSize: typography.legend.fontSize,
      // React Native takes lineHeight in pixels, so the ratio is applied here.
      lineHeight: typography.legend.fontSize * typography.legend.lineHeightRatio,
      letterSpacing: typography.legend.letterSpacing,
    },
    rowsStyle: { alignItems: 'flex-start', width: '100%' },
    helperStyle: {
      width: '100%',
      paddingHorizontal: inset,
      paddingTop: dimension.helperGap,
      color: isInvalid ? colors.helperError : colors.helper,
      fontWeight: resolveFontWeight(typography.helper.fontWeight),
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.fontSize * typography.helper.lineHeightRatio,
    },
  };
};
