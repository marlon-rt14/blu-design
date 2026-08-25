import {
  textFieldBorderWidthTokens,
  textFieldColorTokens,
  textFieldSizeTokens,
  textFieldTypographyTokens,
} from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { ITextFieldProps } from './TextField.types';

/** Params of {@link useTextField}: the TextField props plus the live focus state. */
interface IUseTextFieldParams extends ITextFieldProps {
  /** Whether the underlying `TextInput` currently has focus. */
  isFocused: boolean;
}

/** Styles and derived values the TextField needs to render. */
interface IUseTextFieldResult {
  containerStyle: StyleProp<ViewStyle>;
  inputStyle: StyleProp<TextStyle>;
  labelStyle: StyleProp<TextStyle>;
  helperStyle: StyleProp<TextStyle>;
  counterStyle: StyleProp<TextStyle>;
  /** Color for `TextInput`'s `placeholderTextColor` — not expressible through `style`. */
  placeholderTextColor: string;
  /** Normalized disabled flag, safe to hand straight to `TextInput`'s `editable`. */
  isDisabled: boolean;
  /** Normalized read-only flag, safe to hand straight to `TextInput`'s `editable`. */
  isReadOnly: boolean;
  /** `true` when `isInvalid` or `errorMessage` is set. Drives the error-state footer announcement. */
  isInvalid: boolean;
  /** `errorMessage` when set, otherwise `helperText`. `undefined` when neither is set. */
  displayedHelperText: string | undefined;
  /** `"n / max"` when `maxLength` is set, otherwise `undefined`. */
  counterText: string | undefined;
}

const asFontWeight = (weight: string): TextStyle['fontWeight'] => weight as TextStyle['fontWeight'];

/**
 * Resolves every color and metric the native TextField needs, from the active
 * theme, its size and its current state.
 *
 * Unlike the web version, colors cannot be left to CSS: React Native has no
 * cascade or pseudo-classes, so `isFocused` is tracked by the component (see
 * `TextField.tsx`) and fed in here, and the active theme comes from
 * `useThemeMode()` instead of a `data-dsm-theme` attribute.
 *
 * @param params - The TextField props plus the current focus state.
 * @returns The resolved styles, normalized flags, and the text to render below the field.
 */
export const useTextField = ({
  size = 'medium',
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  errorMessage,
  helperText,
  value,
  maxLength,
  isFocused,
}: IUseTextFieldParams): IUseTextFieldResult => {
  const mode = useThemeMode();
  const colors = textFieldColorTokens[mode];
  const sizeTokens = textFieldSizeTokens[size];
  const hasError = isInvalid || Boolean(errorMessage);

  const borderColor = isDisabled
    ? colors.container.borderDisabled
    : isReadOnly
      ? colors.container.borderReadOnly
      : hasError
        ? colors.container.borderError
        : isFocused
          ? colors.container.borderFocus
          : colors.container.border;

  const backgroundColor = isDisabled
    ? colors.container.backgroundDisabled
    : isReadOnly
      ? colors.container.backgroundReadOnly
      : colors.container.background;

  const valueColor = isDisabled
    ? colors.value.disabled
    : isReadOnly
      ? colors.value.readOnly
      : colors.value.filled;

  const containerStyle: StyleProp<ViewStyle> = {
    height: sizeTokens.height,
    paddingHorizontal: sizeTokens.paddingHorizontal,
    borderRadius: sizeTokens.borderRadius,
    borderWidth:
      isFocused && !isDisabled && !isReadOnly
        ? textFieldBorderWidthTokens.focus
        : textFieldBorderWidthTokens.default,
    borderColor,
    backgroundColor,
    justifyContent: 'center',
  };

  // `fontFamily` is deliberately not set: per `string.platform.font.family`
  // in the token export, "Mulish" is the WEB alias only — iOS and Android
  // are meant to render in their own system font (San Francisco / Roboto),
  // so `fontWeight` alone is applied and RN falls back to the OS default.
  const inputStyle: StyleProp<TextStyle> = {
    fontSize: textFieldTypographyTokens.content.fontSize,
    lineHeight: textFieldTypographyTokens.content.lineHeight,
    fontWeight: asFontWeight(textFieldTypographyTokens.content.fontWeight),
    color: valueColor,
  };

  const labelStyle: StyleProp<TextStyle> = {
    fontSize: textFieldTypographyTokens.label.fontSize,
    lineHeight: textFieldTypographyTokens.label.lineHeight,
    fontWeight: asFontWeight(textFieldTypographyTokens.label.fontWeight),
    color: isDisabled ? colors.label.disabled : colors.label.default,
  };

  const helperColor = isDisabled
    ? colors.helper.disabled
    : hasError
      ? colors.helper.error
      : colors.helper.default;
  const helperStyle: StyleProp<TextStyle> = {
    fontSize: textFieldTypographyTokens.helper.fontSize,
    lineHeight: textFieldTypographyTokens.helper.lineHeight,
    fontWeight: asFontWeight(textFieldTypographyTokens.helper.fontWeight),
    color: helperColor,
  };

  const counterColor = isDisabled
    ? colors.counter.disabled
    : hasError
      ? colors.counter.error
      : colors.counter.default;
  const counterStyle: StyleProp<TextStyle> = {
    fontSize: textFieldTypographyTokens.counter.fontSize,
    lineHeight: textFieldTypographyTokens.counter.lineHeight,
    fontWeight: asFontWeight(textFieldTypographyTokens.counter.fontWeight),
    color: counterColor,
  };

  return {
    containerStyle,
    inputStyle,
    labelStyle,
    helperStyle,
    counterStyle,
    placeholderTextColor: isDisabled ? colors.value.disabled : colors.value.placeholder,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    displayedHelperText: errorMessage ?? helperText,
    counterText: maxLength !== undefined ? `${value.length} / ${maxLength}` : undefined,
  };
};
