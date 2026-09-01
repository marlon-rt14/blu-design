import { textAreaTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ITextAreaProps } from './TextArea.types';

/** Params of {@link useTextArea}: the TextArea props plus the live hover/focus state. */
interface IUseTextAreaParams extends ITextAreaProps {
  /** Whether the pointer currently sits over the field's bordered box. */
  isHovered: boolean;
  /** Whether the `<textarea>` currently has focus. */
  isFocused: boolean;
}

/**
 * `CSSProperties` plus the custom property `pseudo.css`'s `::placeholder`
 * rule reads — see the same pattern in `@dsm/web`'s `TextField`.
 */
interface ITextAreaFieldStyle extends CSSProperties {
  '--dsm-input-placeholder-color'?: string;
}

/** Styles and derived values the TextArea needs to render. */
interface IUseTextAreaResult {
  /** The outer column: bordered box + footer, no gap of its own — see `ITextAreaDimensionTokens.footerSlotGap`. */
  wrapperStyle: CSSProperties;
  /** The bordered box: border, background, radius, padding and the hover/focus treatments. */
  fieldStyle: CSSProperties;
  labelStyle: CSSProperties;
  textareaStyle: ITextAreaFieldStyle;
  footerStyle: CSSProperties;
  helperStyle: CSSProperties;
  counterStyle: CSSProperties;
  /** Normalized disabled flag, safe to hand straight to the `<textarea>`. */
  isDisabled: boolean;
  /** Normalized read-only flag, safe to hand straight to the `<textarea>`. */
  isReadOnly: boolean;
  /** Whether the field is in its invalid state — `isInvalid` or a set `errorMessage`. */
  isInvalid: boolean;
  /**
   * Whether the label should float above the field instead of acting as its
   * placeholder — Figma's rule: "sube solo cuando hay un valor" (a focused,
   * empty field is `focus`, not `filled`; it does not float).
   */
  hasValue: boolean;
  /** `errorMessage` or `helperText` when `showHelper` is `true` and either is set; `undefined` otherwise. */
  displayedHelperText: string | undefined;
  /** `"n/max"` when `showCounter` is `true` and `maxLength` is set; `undefined` otherwise — note: no spaces, unlike TextField's `"n / max"`. */
  counterText: string | undefined;
}

// Figma's label/sm/strong text style tracks 0.24px — see the same constant in
// `@dsm/web`'s `TextField`'s `useTextField`.
const FLOATING_LABEL_LETTER_SPACING = '0.24px';

/**
 * Resolves every style and derived value the TextArea needs, from the active
 * theme (`useThemeMode()`), its props, and its current interaction state.
 *
 * Same shape as `@dsm/web`'s `useTextField`, minus a size axis (TextArea has
 * none — see `ITextAreaBaseProps`) and with `hasValue` replacing a `size`-like
 * concept for driving the floating label.
 *
 * @param params - The TextArea props plus the current hover/focus state.
 * @returns The resolved styles, normalized flags, and the text to render below the field.
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
  isHovered,
  isFocused,
}: IUseTextAreaParams): IUseTextAreaResult => {
  const mode = useThemeMode();
  const tokens = textAreaTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.content.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasError = isInvalid || Boolean(errorMessage);
  const hasValue = value.length > 0;

  // Focus never recolors the container's own border — Figma's "focus" variant
  // keeps `border-default` and draws a separate ring outside the box instead
  // (see `boxShadow` below). Hover and error still change it in place.
  const borderColor = isDisabled
    ? tokens.colors.container.borderDisabled
    : isReadOnly
      ? tokens.colors.container.borderReadOnly
      : hasError
        ? tokens.colors.container.borderError
        : isHovered
          ? tokens.colors.container.borderHover
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

  const placeholderColor = isDisabled ? tokens.colors.value.disabled : tokens.colors.value.placeholder;

  const transition = prefersReducedMotion ? 'none' : 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease';

  // Offset ring: 1px `canvas/surface` gap, then blue out to `spread`.
  // Visible blue = spread − offset. Same as TextField.
  const { focusRingOffset, focusRingSpread } = tokens.dimension;
  const boxShadow =
    isFocused && !isDisabled && !isReadOnly
      ? `0 0 0 ${focusRingOffset}px ${tokens.colors.focusRingGap}, 0 0 0 ${focusRingSpread}px ${tokens.colors.container.borderFocus}`
      : undefined;

  // Hover's translucent wash (`overlayHover`), layered as a second background
  // image over `backgroundColor` — see the same technique in `TextField`.
  const backgroundImage =
    isHovered && !isFocused && !isDisabled && !isReadOnly && !hasError
      ? `linear-gradient(${tokens.colors.container.overlayHover}, ${tokens.colors.container.overlayHover})`
      : undefined;

  const wrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontFamily,
  };

  const fieldStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: tokens.dimension.minHeight,
    padding: `${tokens.dimension.paddingVertical}px ${tokens.dimension.paddingHorizontal}px`,
    borderRadius: tokens.dimension.borderRadius,
    border: `${tokens.dimension.borderWidth}px solid ${borderColor}`,
    backgroundColor,
    backgroundImage,
    boxShadow,
    transition,
    cursor: isDisabled ? 'not-allowed' : undefined,
  };

  const labelStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.label.fontWeight,
    fontSize: tokens.typography.label.fontSize,
    lineHeight: `${tokens.typography.label.lineHeight}px`,
    letterSpacing: FLOATING_LABEL_LETTER_SPACING,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  const textareaStyle: ITextAreaFieldStyle = {
    boxSizing: 'border-box',
    display: 'block',
    width: '100%',
    border: 'none',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    fontFamily,
    fontWeight: tokens.typography.content.fontWeight,
    fontSize: tokens.typography.content.fontSize,
    lineHeight: `${tokens.typography.content.lineHeight}px`,
    color: valueColor,
    outline: 'none',
    resize: 'none',
    cursor: isDisabled ? 'not-allowed' : undefined,
    '--dsm-input-placeholder-color': placeholderColor,
  };

  const footerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  const helperColor = isDisabled
    ? tokens.colors.helper.disabled
    : hasError
      ? tokens.colors.helper.error
      : tokens.colors.helper.default;
  const helperStyle: CSSProperties = {
    flex: 1,
    paddingTop: tokens.dimension.footerSlotGap,
    fontFamily,
    fontWeight: tokens.typography.helper.fontWeight,
    fontSize: tokens.typography.helper.fontSize,
    lineHeight: `${tokens.typography.helper.lineHeight}px`,
    color: helperColor,
  };

  // The counter inherits the helper's color rather than having its own scale
  // — confirmed in the theme export (`color.component.textarea.counter.*`
  // mirrors `.helper.*` value for value), and in the Figma description: "El
  // contador toma el mismo color que la ayuda, asi que en error tambien se
  // pone rojo."
  const counterStyle: CSSProperties = {
    flexShrink: 0,
    paddingTop: tokens.dimension.footerSlotGap,
    paddingLeft: tokens.dimension.footerInlineGap,
    fontFamily,
    fontWeight: tokens.typography.counter.fontWeight,
    fontSize: tokens.typography.counter.fontSize,
    lineHeight: `${tokens.typography.counter.lineHeight}px`,
    color: helperColor,
    textAlign: 'right',
  };

  return {
    wrapperStyle,
    fieldStyle,
    labelStyle,
    textareaStyle,
    footerStyle,
    helperStyle,
    counterStyle,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    hasValue,
    displayedHelperText: showHelper ? errorMessage ?? helperText : undefined,
    counterText: showCounter && maxLength !== undefined ? `${value.length}/${maxLength}` : undefined,
  };
};
