import { checkboxGroupTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ICheckboxGroupProps } from './CheckboxGroup.types';

/** Styles the CheckboxGroup needs to render. */
interface IUseCheckboxGroupResult {
  /** The `<fieldset>`, with the browser's own chrome stripped. */
  fieldsetStyle: CSSProperties;
  legendStyle: CSSProperties;
  /** The rows slot. No gap: each row brings its own height and inset. */
  rowsStyle: CSSProperties;
  helperStyle: CSSProperties;
}

/**
 * Resolves the CheckboxGroup's styles from the active theme and its props.
 *
 * No interaction state at all — the group is a container. Every state that
 * matters belongs to the rows, which is also why `isInvalid` only reaches the
 * helper text.
 */
export const useCheckboxGroup = ({
  size = 'sm',
  isInvalid = false,
}: ICheckboxGroupProps): IUseCheckboxGroupResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = checkboxGroupTokens[mode];
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
