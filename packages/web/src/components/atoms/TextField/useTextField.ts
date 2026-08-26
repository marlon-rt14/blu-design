import { textFieldTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ITextFieldProps } from './TextField.types';

/** Params of {@link useTextField}: the TextField props plus the live hover/focus state. */
interface IUseTextFieldParams extends ITextFieldProps {
  /** Whether the pointer currently sits over the field's bordered box. */
  isHovered: boolean;
  /** Whether the `<input>` currently has focus. */
  isFocused: boolean;
}

/**
 * `CSSProperties` plus the one custom property `pseudo.css`'s `::placeholder`
 * rule reads — that pseudo-element cannot be set from an inline `style`
 * object, so the color travels through this custom property instead.
 */
interface IInputStyle extends CSSProperties {
  '--dsm-input-placeholder-color'?: string;
}

/** Styles and derived values the TextField needs to render. */
interface IUseTextFieldResult {
  /** The outer column: bordered box + footer, no gap of its own — see `ITextFieldDimensionTokens.footerSlotGap`. */
  wrapperStyle: CSSProperties;
  /** The bordered box: a row of [prefix icon, prefix text, content column, suffix text, suffix icon]. */
  fieldStyle: CSSProperties;
  /** The label+value column, `flex: 1` so it fills the space affixes leave. */
  contentStyle: CSSProperties;
  labelStyle: CSSProperties;
  inputStyle: IInputStyle;
  affixStyle: CSSProperties;
  iconStyle: CSSProperties;
  footerStyle: CSSProperties;
  helperStyle: CSSProperties;
  counterStyle: CSSProperties;
  /** Normalized disabled flag, safe to hand straight to the `<input>`. */
  isDisabled: boolean;
  /** Normalized read-only flag, safe to hand straight to the `<input>`. */
  isReadOnly: boolean;
  /** Whether the field is in its invalid state — `isInvalid` or a set `errorMessage`. */
  isInvalid: boolean;
  /**
   * Whether to render the floating `label` element above the value. `label`
   * only ever floats once there's a value, and never at `size='small'` — see
   * `TTextFieldSize`. When this is `false`, `label` is the `<input>`'s
   * `placeholder` instead.
   */
  showFloatingLabel: boolean;
  /** `errorMessage` or `helperText` when `showHelper` is `true` and either is set; `undefined` otherwise. */
  displayedHelperText: string | undefined;
  /** `"n / max"` when `showCounter` is `true` and `maxLength` is set; `undefined` otherwise. */
  counterText: string | undefined;
}

// Figma's label/sm/strong text style tracks 0.24px. Not part of the typography
// token shorthand (`readThemeTypography` only carries weight/size/lineHeight/
// family) — get_design_context surfaced it separately, so it's hardcoded here
// rather than invented.
const FLOATING_LABEL_LETTER_SPACING = '0.24px';

/**
 * Resolves every style and derived value the TextField needs, from the
 * active theme (`useThemeMode()`), its size, and its current props and
 * interaction state.
 *
 * Hover and focus are tracked by the component (see `TextField.tsx`) and fed
 * in here — the same shape `@dsm/mobile`'s `useTextField` uses.
 *
 * @param params - The TextField props plus the current hover/focus state.
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
  isHovered,
  isFocused,
}: IUseTextFieldParams): IUseTextFieldResult => {
  const mode = useThemeMode();
  const tokens = textFieldTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.content.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasError = isInvalid || Boolean(errorMessage);
  const hasValue = value.length > 0;
  const sizeTokens = tokens.sizes[size];
  const showFloatingLabel = hasValue && size !== 'small';

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

  const transition = prefersReducedMotion
    ? 'none'
    : 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease';

  // A solid `box-shadow` reproduces Figma's outer focusRing layer (a bordered
  // box inset by its own width, hugging the container with no gap) without an
  // extra DOM node — it follows `borderRadius` the same way that layer does.
  const boxShadow =
    isFocused && !isDisabled && !isReadOnly
      ? `0 0 0 ${tokens.dimension.focusRingSpread}px ${tokens.colors.container.borderFocus}`
      : undefined;

  // Hover's translucent wash (`overlayHover`) is layered as a second
  // background image over `backgroundColor` — one fewer node than Figma's
  // separate overlay layer, same rgba() wash. Only the plain hover state gets
  // it: focus, disabled, read-only and error all suppress it in Figma too.
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.dimension.contentGap,
    width: '100%',
    minHeight: sizeTokens.minHeight,
    padding: `${sizeTokens.paddingVertical}px ${tokens.dimension.paddingHorizontal}px`,
    borderRadius: tokens.dimension.borderRadius,
    border: `${tokens.dimension.borderWidth}px solid ${borderColor}`,
    backgroundColor,
    backgroundImage,
    boxShadow,
    transition,
    cursor: isDisabled ? 'not-allowed' : undefined,
  };

  // The label+value stack, isolated from the affix row above so the
  // floating label only ever measures against its own column, not the
  // icons/text on either side.
  const contentStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  };

  const affixColor = isDisabled ? tokens.colors.affix.disabled : tokens.colors.affix.default;
  const affixStyle: CSSProperties = {
    flexShrink: 0,
    fontFamily,
    fontWeight: tokens.typography.content.fontWeight,
    fontSize: tokens.typography.content.fontSize,
    lineHeight: `${tokens.typography.content.lineHeight}px`,
    color: affixColor,
    whiteSpace: 'nowrap',
  };

  const iconColor = isDisabled ? tokens.colors.icon.disabled : tokens.colors.icon.default;
  const iconStyle: CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: tokens.iconSize[size],
    height: tokens.iconSize[size],
    color: iconColor,
  };

  const labelStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.label.fontWeight,
    fontSize: tokens.typography.label.fontSize,
    lineHeight: `${tokens.typography.label.lineHeight}px`,
    letterSpacing: FLOATING_LABEL_LETTER_SPACING,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  const inputStyle: IInputStyle = {
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

  const counterColor = isDisabled
    ? tokens.colors.counter.disabled
    : hasError
      ? tokens.colors.counter.error
      : tokens.colors.counter.default;
  const counterStyle: CSSProperties = {
    flexShrink: 0,
    paddingTop: tokens.dimension.footerSlotGap,
    paddingLeft: tokens.dimension.footerInlineGap,
    fontFamily,
    fontWeight: tokens.typography.counter.fontWeight,
    fontSize: tokens.typography.counter.fontSize,
    lineHeight: `${tokens.typography.counter.lineHeight}px`,
    color: counterColor,
    textAlign: 'right',
  };

  return {
    wrapperStyle,
    fieldStyle,
    contentStyle,
    labelStyle,
    inputStyle,
    affixStyle,
    iconStyle,
    footerStyle,
    helperStyle,
    counterStyle,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    showFloatingLabel,
    displayedHelperText: showHelper ? errorMessage ?? helperText : undefined,
    counterText: showCounter && maxLength !== undefined ? `${value.length} / ${maxLength}` : undefined,
  };
};
