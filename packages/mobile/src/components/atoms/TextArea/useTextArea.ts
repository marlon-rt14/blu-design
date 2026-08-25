import { textAreaTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ITextAreaProps } from './TextArea.types';

/** Params of {@link useTextArea}: the TextArea props plus the live focus state and line count. */
interface IUseTextAreaParams extends ITextAreaProps {
  /** Whether the underlying `TextInput` currently has focus. */
  isFocused: boolean;
  /** Resolved `numberOfLines`, used to compute {@link IUseTextAreaResult.startingHeight}. */
  numberOfLines: number;
}

/** Styles and derived values the TextArea needs to render. */
interface IUseTextAreaResult {
  fieldStyle: StyleProp<TextStyle & ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  helperStyle: StyleProp<TextStyle>;
  counterStyle: StyleProp<TextStyle>;
  /** Color for `TextInput`'s `placeholderTextColor` — not expressible through `style`. */
  placeholderTextColor: string;
  /** Normalized disabled flag, safe to hand straight to `TextInput`'s `editable`. */
  isDisabled: boolean;
  /** Normalized read-only flag, safe to hand straight to `TextInput`'s `editable`. */
  isReadOnly: boolean;
  /** `true` when `isInvalid` or `errorMessage` is set. */
  isInvalid: boolean;
  /** Whether the label should float above the field instead of acting as its placeholder. */
  hasValue: boolean;
  /** `errorMessage` when set, otherwise `helperText`. `undefined` when neither is set. */
  displayedHelperText: string | undefined;
  /** `"n/max"` when `maxLength` is set, otherwise `undefined`. */
  counterText: string | undefined;
  /** The field's height floor — see `ITextAreaDimensionTokens.minHeight` in `@dsm/shared`. */
  minHeight: number;
  /**
   * The field's height before `onContentSizeChange` reports a real
   * measurement — `numberOfLines` worth of the content type role's line
   * height, plus vertical padding, clamped to `minHeight`.
   */
  startingHeight: number;
}

/**
 * Resolves every color, metric and starting size the native TextArea needs,
 * from the active theme, its props and its current focus state.
 *
 * Same shape as `@dsm/mobile`'s `useTextField`, minus a size axis (TextArea
 * has none) and with `hasValue` driving the floating label instead of a
 * `size`-dependent rule.
 *
 * @param params - The TextArea props plus the current focus state and resolved line count.
 * @returns The resolved styles, normalized flags, and the text/sizes to render.
 */
export const useTextArea = ({
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  errorMessage,
  helperText,
  value,
  maxLength,
  isFocused,
  numberOfLines,
}: IUseTextAreaParams): IUseTextAreaResult => {
  const mode = useThemeMode();
  const tokens = textAreaTokens[mode];
  const hasError = isInvalid || Boolean(errorMessage);
  const hasValue = value.length > 0;

  const borderColor = isDisabled
    ? tokens.colors.container.borderDisabled
    : isReadOnly
      ? tokens.colors.container.borderReadOnly
      : hasError
        ? tokens.colors.container.borderError
        : isFocused
          ? tokens.colors.container.borderFocus
          : tokens.colors.container.border;

  const backgroundColor = isDisabled
    ? tokens.colors.container.backgroundDisabled
    : isReadOnly
      ? tokens.colors.container.backgroundReadOnly
      : tokens.colors.container.background;

  const valueColor = isDisabled
    ? tokens.colors.value.disabled
    : isReadOnly
      ? tokens.colors.value.readOnly
      : tokens.colors.value.filled;

  const fieldStyle: StyleProp<TextStyle & ViewStyle> = {
    minHeight: tokens.dimension.minHeight,
    paddingVertical: tokens.dimension.paddingVertical,
    paddingHorizontal: tokens.dimension.paddingHorizontal,
    borderRadius: tokens.dimension.borderRadius,
    borderWidth:
      isFocused && !isDisabled && !isReadOnly
        ? tokens.dimension.borderWidth.focus
        : tokens.dimension.borderWidth.default,
    borderColor,
    backgroundColor,
    // See @dsm/mobile's TextField useTextField for why fontWeight never
    // accompanies fontFamily here — same Android font-resolver constraint.
    fontFamily: resolveMulishFontFamily(tokens.typography.content.fontWeight),
    fontSize: tokens.typography.content.fontSize,
    lineHeight: tokens.typography.content.lineHeight,
    color: valueColor,
  };

  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.label.fontWeight),
    fontSize: tokens.typography.label.fontSize,
    lineHeight: tokens.typography.label.lineHeight,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  const helperColor = isDisabled
    ? tokens.colors.helper.disabled
    : hasError
      ? tokens.colors.helper.error
      : tokens.colors.helper.default;
  const helperStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.helper.fontWeight),
    fontSize: tokens.typography.helper.fontSize,
    lineHeight: tokens.typography.helper.lineHeight,
    color: helperColor,
  };

  // Counter inherits the helper's color rather than having its own scale —
  // see @dsm/web's TextArea useTextArea for the token evidence.
  const counterStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.counter.fontWeight),
    fontSize: tokens.typography.counter.fontSize,
    lineHeight: tokens.typography.counter.lineHeight,
    color: helperColor,
  };

  const startingHeight = Math.max(
    tokens.dimension.minHeight,
    tokens.dimension.paddingVertical * 2 + tokens.typography.content.lineHeight * numberOfLines,
  );

  return {
    fieldStyle,
    labelStyle,
    helperStyle,
    counterStyle,
    placeholderTextColor: isDisabled ? tokens.colors.value.disabled : tokens.colors.value.placeholder,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    hasValue,
    displayedHelperText: errorMessage ?? helperText,
    counterText: maxLength !== undefined ? `${value.length}/${maxLength}` : undefined,
    minHeight: tokens.dimension.minHeight,
    startingHeight,
  };
};
