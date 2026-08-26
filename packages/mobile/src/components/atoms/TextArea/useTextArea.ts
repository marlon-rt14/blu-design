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
  /** The ring layer: always reserves `focusRingSpread` of border, transparent unless focused — no layout shift on focus. */
  ringStyle: StyleProp<ViewStyle>;
  /** The bordered box: border, background, radius, padding. */
  fieldStyle: StyleProp<ViewStyle>;
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
  /** `true` when `isInvalid` or `errorMessage` is set. */
  isInvalid: boolean;
  /** Whether the label should float above the field instead of acting as its placeholder. */
  hasValue: boolean;
  /** `errorMessage` or `helperText` when `showHelper` is `true` and either is set; `undefined` otherwise. */
  displayedHelperText: string | undefined;
  /** `"n/max"` when `showCounter` is `true` and `maxLength` is set; `undefined` otherwise. */
  counterText: string | undefined;
  /**
   * The `TextInput`'s own starting height — `numberOfLines` worth of the
   * content type role's line height, with no padding of its own (that lives
   * on the bordered box now, see `fieldStyle`). The box's `minHeight` is the
   * real floor, enforced by layout regardless of this value.
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
  showHelper = false,
  showCounter = false,
  value,
  maxLength,
  isFocused,
  numberOfLines,
}: IUseTextAreaParams): IUseTextAreaResult => {
  const mode = useThemeMode();
  const tokens = textAreaTokens[mode];
  const hasError = isInvalid || Boolean(errorMessage);
  const hasValue = value.length > 0;

  // Focus never recolors the container's own border — Figma's "focus" variant
  // keeps `border-default` and draws a separate ring outside the box instead
  // (see `ringStyle`). Error still changes it in place.
  const borderColor = isDisabled
    ? tokens.colors.container.borderDisabled
    : isReadOnly
      ? tokens.colors.container.borderReadOnly
      : hasError
        ? tokens.colors.container.borderError
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

  // The ring's own border always reserves `focusRingSpread` of space —
  // transparent unless focused — so toggling focus never shifts layout. Its
  // radius is the field's own radius plus the ring width, for a concentric
  // look (RN has no `box-shadow` to fake this in one layer, unlike web).
  const ringStyle: StyleProp<ViewStyle> = {
    borderRadius: tokens.dimension.borderRadius + tokens.dimension.focusRingSpread,
    borderWidth: tokens.dimension.focusRingSpread,
    borderColor: isFocused && !isDisabled && !isReadOnly ? tokens.colors.container.borderFocus : 'transparent',
  };

  const fieldStyle: StyleProp<ViewStyle> = {
    minHeight: tokens.dimension.minHeight,
    paddingVertical: tokens.dimension.paddingVertical,
    paddingHorizontal: tokens.dimension.paddingHorizontal,
    borderRadius: tokens.dimension.borderRadius,
    borderWidth: tokens.dimension.borderWidth,
    borderColor,
    backgroundColor,
  };

  // See @dsm/mobile's TextField useTextField for why fontWeight never
  // accompanies fontFamily here — same Android font-resolver constraint.
  const inputStyle: StyleProp<TextStyle> = {
    padding: 0,
    margin: 0,
    fontFamily: resolveMulishFontFamily(tokens.typography.content.fontWeight),
    fontSize: tokens.typography.content.fontSize,
    lineHeight: tokens.typography.content.lineHeight,
    color: valueColor,
    textAlignVertical: 'top',
  };

  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.label.fontWeight),
    fontSize: tokens.typography.label.fontSize,
    lineHeight: tokens.typography.label.lineHeight,
    // Figma's label/sm/strong text style tracks 0.24px — see the same
    // constant in @dsm/web's TextField useTextField.
    letterSpacing: 0.24,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  const helperColor = isDisabled
    ? tokens.colors.helper.disabled
    : hasError
      ? tokens.colors.helper.error
      : tokens.colors.helper.default;
  const helperStyle: StyleProp<TextStyle> = {
    flex: 1,
    paddingTop: tokens.dimension.footerSlotGap,
    fontFamily: resolveMulishFontFamily(tokens.typography.helper.fontWeight),
    fontSize: tokens.typography.helper.fontSize,
    lineHeight: tokens.typography.helper.lineHeight,
    color: helperColor,
  };

  // Counter inherits the helper's color rather than having its own scale —
  // see @dsm/web's TextArea useTextArea for the token evidence.
  const counterStyle: StyleProp<TextStyle> = {
    paddingTop: tokens.dimension.footerSlotGap,
    paddingLeft: tokens.dimension.footerInlineGap,
    fontFamily: resolveMulishFontFamily(tokens.typography.counter.fontWeight),
    fontSize: tokens.typography.counter.fontSize,
    lineHeight: tokens.typography.counter.lineHeight,
    color: helperColor,
    textAlign: 'right',
  };

  return {
    ringStyle,
    fieldStyle,
    inputStyle,
    labelStyle,
    helperStyle,
    counterStyle,
    placeholderTextColor: isDisabled ? tokens.colors.value.disabled : tokens.colors.value.placeholder,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    hasValue,
    displayedHelperText: showHelper ? errorMessage ?? helperText : undefined,
    counterText: showCounter && maxLength !== undefined ? `${value.length}/${maxLength}` : undefined,
    startingHeight: tokens.typography.content.lineHeight * numberOfLines,
  };
};
