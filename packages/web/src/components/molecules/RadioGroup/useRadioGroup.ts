import { radioGroupTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IRadioGroupProps } from './RadioGroup.types';

/** Styles the RadioGroup needs to render. */
interface IUseRadioGroupResult {
  /** The `<fieldset>`, with the browser's own chrome stripped. */
  fieldsetStyle: CSSProperties;
  legendStyle: CSSProperties;
  /** The rows slot. No gap: each row brings its own height and inset. */
  rowsStyle: CSSProperties;
  helperStyle: CSSProperties;
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
  const legendFont = useFontFamily(typography.legend.fontWeight);
  const helperFont = useFontFamily(typography.helper.fontWeight);
  const inset = dimension.textInset[size];

  return {
    fieldsetStyle: {
      // A `<fieldset>` arrives with a border, a margin and asymmetric padding.
      // All of it goes: the group has no chrome and no lateral padding of its
      // own — that is screen margin, and it belongs to the screen.
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      margin: 0,
      padding: 0,
      border: 'none',
      minInlineSize: 'auto',
    },
    legendStyle: {
      // A `<legend>` also comes with its own padding, and inside a flex
      // fieldset it needs `display: block` to stop behaving like a legend box.
      display: 'block',
      float: 'none',
      width: '100%',
      padding: 0,
      // The indent that lines the legend up with the row's control, plus the
      // gap down to the rows.
      paddingInline: inset,
      paddingBottom: dimension.legendGap,
      color: colors.legend,
      fontFamily: legendFont,
      fontWeight: typography.legend.fontWeight,
      fontSize: typography.legend.fontSize,
      lineHeight: typography.legend.lineHeightRatio,
      letterSpacing: typography.legend.letterSpacing,
    },
    rowsStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    },
    helperStyle: {
      width: '100%',
      paddingInline: inset,
      paddingTop: dimension.helperGap,
      color: isInvalid ? colors.helperError : colors.helper,
      fontFamily: helperFont,
      fontWeight: typography.helper.fontWeight,
      fontSize: typography.helper.fontSize,
      lineHeight: typography.helper.lineHeightRatio,
      margin: 0,
    },
  };
};
