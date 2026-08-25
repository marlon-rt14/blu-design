import { textAreaTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ITextAreaProps } from './TextArea.types';

/** Params of {@link useTextArea}: the TextArea props plus the live hover/focus state. */
interface IUseTextAreaParams extends ITextAreaProps {
  /** Whether the pointer currently sits over the `<textarea>`. */
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
  containerStyle: CSSProperties;
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
  /** `errorMessage` when set, otherwise `helperText`. `undefined` when neither is set. */
  displayedHelperText: string | undefined;
  /** `"n/max"` when `maxLength` is set, otherwise `undefined` — note: no spaces, unlike TextField's `"n / max"`. */
  counterText: string | undefined;
  /** The container's height floor — see `ITextAreaDimensionTokens.minHeight` in `@dsm/shared`. */
  minHeight: number;
}

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

  const borderColor = isDisabled
    ? tokens.colors.container.borderDisabled
    : isReadOnly
      ? tokens.colors.container.borderReadOnly
      : hasError
        ? tokens.colors.container.borderError
        : isFocused
          ? tokens.colors.container.borderFocus
          : isHovered
            ? tokens.colors.container.borderHover
            : tokens.colors.container.border;

  const borderWidth =
    isFocused && !isDisabled && !isReadOnly ? tokens.dimension.borderWidth.focus : tokens.dimension.borderWidth.default;

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

  const transition = prefersReducedMotion
    ? 'none'
    : 'border-color 120ms ease, background-color 120ms ease, height 120ms ease';

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.dimension.stackGap,
    fontFamily,
  };

  const labelStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.label.fontWeight,
    fontSize: tokens.typography.label.fontSize,
    lineHeight: `${tokens.typography.label.lineHeight}px`,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  const textareaStyle: ITextAreaFieldStyle = {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: tokens.dimension.minHeight,
    padding: `${tokens.dimension.paddingVertical}px ${tokens.dimension.paddingHorizontal}px`,
    borderRadius: tokens.dimension.borderRadius,
    border: `${borderWidth}px solid ${borderColor}`,
    backgroundColor,
    fontFamily,
    fontWeight: tokens.typography.content.fontWeight,
    fontSize: tokens.typography.content.fontSize,
    lineHeight: `${tokens.typography.content.lineHeight}px`,
    color: valueColor,
    outline: 'none',
    resize: 'none',
    transition,
    cursor: isDisabled ? 'not-allowed' : undefined,
    '--dsm-input-placeholder-color': placeholderColor,
  };

  const footerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: tokens.dimension.footerInlineGap,
  };

  const helperColor = isDisabled
    ? tokens.colors.helper.disabled
    : hasError
      ? tokens.colors.helper.error
      : tokens.colors.helper.default;
  const helperStyle: CSSProperties = {
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
    fontFamily,
    fontWeight: tokens.typography.counter.fontWeight,
    fontSize: tokens.typography.counter.fontSize,
    lineHeight: `${tokens.typography.counter.lineHeight}px`,
    color: helperColor,
  };

  return {
    containerStyle,
    labelStyle,
    textareaStyle,
    footerStyle,
    helperStyle,
    counterStyle,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    hasValue,
    displayedHelperText: errorMessage ?? helperText,
    counterText: maxLength !== undefined ? `${value.length}/${maxLength}` : undefined,
    minHeight: tokens.dimension.minHeight,
  };
};
