import { textFieldTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ITextFieldProps } from './TextField.types';

/** Params of {@link useTextField}: the TextField props plus the live focus state. */
interface IUseTextFieldParams extends ITextFieldProps {
  /** Whether the underlying `TextInput` currently has focus. */
  isFocused: boolean;
}

/** Styles and derived values the TextField needs to render. */
interface IUseTextFieldResult {
  /** The ring layer: always reserves `focusRingSpread` of border, transparent unless focused — no layout shift on focus. */
  ringStyle: StyleProp<ViewStyle>;
  /** The bordered box: a row of [prefix icon, prefix text, content column, suffix text, suffix icon]. */
  fieldStyle: StyleProp<ViewStyle>;
  /** The label+value column, `flex: 1` so it fills the space affixes leave. */
  contentStyle: StyleProp<ViewStyle>;
  inputStyle: StyleProp<TextStyle>;
  labelStyle: StyleProp<TextStyle>;
  affixStyle: StyleProp<TextStyle>;
  iconStyle: StyleProp<ViewStyle>;
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
  /**
   * Whether to render the floating `label` element above the value. `label`
   * only ever floats once there's a value, and never at `size='small'` — see
   * `TTextFieldSize`. When this is `false`, `label` is `TextInput`'s
   * `placeholder` instead.
   */
  showFloatingLabel: boolean;
  /** `errorMessage` or `helperText` when `showHelper` is `true` and either is set; `undefined` otherwise. */
  displayedHelperText: string | undefined;
  /** `"n / max"` when `showCounter` is `true` and `maxLength` is set; `undefined` otherwise. */
  counterText: string | undefined;
}

// Figma's label/sm/strong text style tracks 0.24px — see the same constant in
// `@dsm/web`'s `TextField`'s `useTextField`.
const FLOATING_LABEL_LETTER_SPACING = 0.24;

/**
 * Resolves every color and metric the native TextField needs, from the active
 * theme, its size and its current state.
 *
 * React Native has no cascade or pseudo-classes, so `isFocused` is tracked
 * by the component (see `TextField.tsx`) and fed in here — the same shape
 * `@dsm/web`'s own `useTextField` uses for hover and focus (mobile has no
 * hover concept, so there is no `isHovered` here).
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
  showHelper = false,
  showCounter = false,
  value,
  maxLength,
  isFocused,
}: IUseTextFieldParams): IUseTextFieldResult => {
  const mode = useThemeMode();
  const tokens = textFieldTokens[mode];
  const colors = tokens.colors;
  const sizeTokens = tokens.sizes[size];
  const hasError = isInvalid || Boolean(errorMessage);
  const hasValue = value.length > 0;
  const showFloatingLabel = hasValue && size !== 'small';

  // Focus never recolors the container's own border — Figma's "focus" variant
  // keeps `border-default` and draws a separate ring outside the box instead
  // (see `ringStyle`). Error still changes it in place.
  const borderColor = isDisabled
    ? colors.container.borderDisabled
    : isReadOnly
      ? colors.container.borderReadOnly
      : hasError
        ? colors.container.borderError
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

  // The ring's own border always reserves `focusRingSpread` of space —
  // transparent unless focused — so toggling focus never shifts layout. Its
  // radius is the field's own radius plus the ring width, for a concentric
  // look (RN has no `box-shadow` to fake this in one layer, unlike web).
  const ringStyle: StyleProp<ViewStyle> = {
    borderRadius: tokens.dimension.borderRadius + tokens.dimension.focusRingSpread,
    borderWidth: tokens.dimension.focusRingSpread,
    borderColor: isFocused && !isDisabled && !isReadOnly ? colors.container.borderFocus : 'transparent',
  };

  const fieldStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.dimension.contentGap,
    minHeight: sizeTokens.minHeight,
    paddingHorizontal: tokens.dimension.paddingHorizontal,
    paddingVertical: sizeTokens.paddingVertical,
    borderRadius: tokens.dimension.borderRadius,
    borderWidth: tokens.dimension.borderWidth,
    borderColor,
    backgroundColor,
  };

  // Isolated from the affix row above so the floating label only ever
  // measures against its own column, not the icons/text on either side.
  const contentStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'center',
  };

  const affixColor = isDisabled ? colors.affix.disabled : colors.affix.default;
  const affixStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.content.fontWeight),
    fontSize: tokens.typography.content.fontSize,
    lineHeight: tokens.typography.content.lineHeight,
    color: affixColor,
  };

  // Only sizes/centers the slot — unlike web's `currentColor` trick, RN has
  // no way to tint an arbitrary child through a wrapping View's style; the
  // consumer's icon component takes its own `color` prop for that.
  const iconStyle: StyleProp<ViewStyle> = {
    width: tokens.iconSize[size],
    height: tokens.iconSize[size],
    alignItems: 'center',
    justifyContent: 'center',
  };

  // No numeric `fontWeight` alongside `fontFamily`: each Mulish-*.ttf is
  // already a single static weight (see theme/font.ts), and Android's font
  // resolver tries to append a "_bold"/"_italic" suffix onto the filename
  // when `fontWeight`/`fontStyle` is set, which would look for a file like
  // "Mulish-SemiBold_bold.ttf" that doesn't exist and silently fall back to
  // the system font. The weight is already baked into which file we picked.
  const inputStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.content.fontWeight),
    fontSize: tokens.typography.content.fontSize,
    lineHeight: tokens.typography.content.lineHeight,
    color: valueColor,
  };

  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.label.fontWeight),
    fontSize: tokens.typography.label.fontSize,
    lineHeight: tokens.typography.label.lineHeight,
    letterSpacing: FLOATING_LABEL_LETTER_SPACING,
    color: isDisabled ? colors.label.disabled : colors.label.default,
  };

  const helperColor = isDisabled
    ? colors.helper.disabled
    : hasError
      ? colors.helper.error
      : colors.helper.default;
  const helperStyle: StyleProp<TextStyle> = {
    flex: 1,
    paddingTop: tokens.dimension.footerSlotGap,
    fontFamily: resolveMulishFontFamily(tokens.typography.helper.fontWeight),
    fontSize: tokens.typography.helper.fontSize,
    lineHeight: tokens.typography.helper.lineHeight,
    color: helperColor,
  };

  const counterColor = isDisabled
    ? colors.counter.disabled
    : hasError
      ? colors.counter.error
      : colors.counter.default;
  const counterStyle: StyleProp<TextStyle> = {
    paddingTop: tokens.dimension.footerSlotGap,
    paddingLeft: tokens.dimension.footerInlineGap,
    fontFamily: resolveMulishFontFamily(tokens.typography.counter.fontWeight),
    fontSize: tokens.typography.counter.fontSize,
    lineHeight: tokens.typography.counter.lineHeight,
    color: counterColor,
    textAlign: 'right',
  };

  return {
    ringStyle,
    fieldStyle,
    contentStyle,
    inputStyle,
    labelStyle,
    affixStyle,
    iconStyle,
    helperStyle,
    counterStyle,
    placeholderTextColor: isDisabled ? colors.value.disabled : colors.value.placeholder,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    showFloatingLabel,
    displayedHelperText: showHelper ? errorMessage ?? helperText : undefined,
    counterText: showCounter && maxLength !== undefined ? `${value.length} / ${maxLength}` : undefined,
  };
};
