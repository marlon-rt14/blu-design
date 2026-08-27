import { passwordFieldTokens } from '@dsm/shared';
import type { TPasswordFieldState } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IPasswordFieldProps } from './PasswordField.types';

/** Params of {@link usePasswordField}: the props plus the live interaction state. */
interface IUsePasswordFieldParams extends IPasswordFieldProps {
  isHovered: boolean;
  isFocused: boolean;
}

/**
 * `CSSProperties` plus the custom property `pseudo.css`'s `::placeholder` rule
 * reads — same pattern as `TextField` and `TextArea`.
 */
interface IPasswordInputStyle extends CSSProperties {
  '--dsm-input-placeholder-color'?: string;
}

/** Styles and derived values the PasswordField needs to render. */
interface IUsePasswordFieldResult {
  /** The outer column: bordered box + helper. */
  wrapperStyle: CSSProperties;
  /** The bordered box: a row of [content column, reveal action]. */
  fieldStyle: CSSProperties;
  /** The label+value column, `flex: 1` so it fills the space the action leaves. */
  contentStyle: CSSProperties;
  labelStyle: CSSProperties;
  inputStyle: IPasswordInputStyle;
  /** Wraps the action so its touch target reaches `size/target/min`. */
  actionSlotStyle: CSSProperties;
  helperStyle: CSSProperties;
  isDisabled: boolean;
  isReadOnly: boolean;
  /** `true` when `isInvalid` or `errorMessage` is set. */
  isInvalid: boolean;
  /** Resolved state, exposed so stories and tests can assert on it. */
  state: TPasswordFieldState;
  /**
   * Whether the floating `label` element renders above the value. It only
   * floats once there is a value, and **never at `size='sm'`**. When `false`,
   * `label` becomes the input's `placeholder` instead.
   */
  showFloatingLabel: boolean;
  /** Whether the reveal action renders — there is nothing to reveal while empty. */
  showAction: boolean;
  /** The action's own size: `sm` mirrors the field, everything else is `md`. */
  actionSize: 'sm' | 'md';
  /** `errorMessage` or `helperText` when `showHelper` is `true`; `undefined` otherwise. */
  displayedHelperText: string | undefined;
}

/**
 * Resolves every style and derived value the PasswordField needs, from the
 * active theme, its props and its current interaction state.
 *
 * Same shape as `@dsm/web`'s `useTextField`: the component owns the interaction
 * state and passes it in.
 *
 * @param params - The PasswordField props plus the current hover/focus state.
 * @returns The resolved styles, normalized flags, and what to render.
 */
export const usePasswordField = ({
  value,
  size = 'md',
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  errorMessage,
  helperText,
  showHelper = false,
  isHovered,
  isFocused,
}: IUsePasswordFieldParams): IUsePasswordFieldResult => {
  const mode = useThemeMode();
  const tokens = passwordFieldTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.value.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasError = isInvalid || Boolean(errorMessage);
  const hasValue = value.length > 0;

  const state: TPasswordFieldState = isDisabled
    ? 'disabled'
    : isReadOnly
      ? 'readonly'
      : hasError
        ? 'error'
        : isFocused
          ? 'focus'
          : isHovered
            ? 'hover'
            : hasValue
              ? 'filled'
              : 'default';

  // Focus never recolors the container's own border — Figma's `focus` variant
  // keeps `border-default` and draws a separate ring outside the box instead.
  // Hover and error still change it in place.
  const borderColor =
    state === 'disabled'
      ? tokens.colors.container.borderDisabled
      : state === 'readonly'
        ? tokens.colors.container.borderReadOnly
        : state === 'error'
          ? tokens.colors.container.borderError
          : state === 'hover'
            ? tokens.colors.container.borderHover
            : tokens.colors.container.border;

  const backgroundColor =
    state === 'disabled'
      ? tokens.colors.container.backgroundDisabled
      : state === 'readonly'
        ? tokens.colors.container.backgroundReadOnly
        : tokens.colors.container.background;

  const valueColor = isDisabled
    ? tokens.colors.value.disabled
    : isReadOnly
      ? tokens.colors.value.readOnly
      : hasValue
        ? tokens.colors.value.filled
        : tokens.colors.value.placeholder;

  const transition = prefersReducedMotion
    ? 'none'
    : 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease';

  const boxShadow =
    isFocused && !isDisabled && !isReadOnly
      ? `0 0 0 ${tokens.dimension.focusRingSpread}px ${tokens.colors.container.borderFocus}`
      : undefined;

  // Hover's translucent wash, layered as a second background image over the
  // solid one — same technique as TextField and TextArea.
  const backgroundImage =
    state === 'hover'
      ? `linear-gradient(${tokens.colors.container.overlayHover}, ${tokens.colors.container.overlayHover})`
      : undefined;

  const { label, value: valueType } = tokens.typography;

  return {
    wrapperStyle: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      fontFamily,
    },
    fieldStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: tokens.dimension.actionGap,
      width: '100%',
      height: tokens.size[size].height,
      paddingInline: tokens.dimension.paddingHorizontal,
      borderRadius: tokens.dimension.borderRadius,
      border: `${tokens.dimension.borderWidth}px solid ${borderColor}`,
      backgroundColor,
      backgroundImage,
      boxShadow,
      transition,
      cursor: isDisabled ? 'not-allowed' : undefined,
    },
    contentStyle: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1,
      minWidth: 0,
    },
    labelStyle: {
      fontFamily,
      fontWeight: label.fontWeight,
      fontSize: label.fontSize,
      lineHeight: label.lineHeightRatio,
      letterSpacing: label.letterSpacing,
      color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
    },
    inputStyle: {
      boxSizing: 'border-box',
      width: '100%',
      minWidth: 0,
      border: 'none',
      padding: 0,
      margin: 0,
      backgroundColor: 'transparent',
      fontFamily,
      fontWeight: valueType.fontWeight,
      fontSize: valueType.fontSize,
      lineHeight: valueType.lineHeightRatio,
      color: valueColor,
      outline: 'none',
      cursor: isDisabled ? 'not-allowed' : undefined,
      '--dsm-input-placeholder-color': isDisabled
        ? tokens.colors.value.disabled
        : tokens.colors.value.placeholder,
    },
    // The action's text is short, so its own box falls well under the minimum
    // touch target. The invisible padding bDS asks for goes here rather than on
    // the LinkButton, which has no idea it is being used inside a field.
    actionSlotStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexShrink: 0,
      minHeight: tokens.dimension.minTouchTarget,
      minWidth: tokens.dimension.minTouchTarget,
    },
    helperStyle: {
      paddingTop: tokens.dimension.helperGap,
      fontFamily,
      fontWeight: label.fontWeight,
      fontSize: label.fontSize,
      lineHeight: label.lineHeightRatio,
      color: isDisabled
        ? tokens.colors.helper.disabled
        : hasError
          ? tokens.colors.helper.error
          : tokens.colors.helper.default,
    },
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    state,
    // Figma: the label rises only when there is a value, and at `sm` it never
    // rises at all — a filled `sm` field shows the value, not the label.
    showFloatingLabel: size !== 'sm' && hasValue,
    // "En estados sin valor la acción se oculta: no hay nada que revelar."
    showAction: hasValue,
    actionSize: size === 'sm' ? 'sm' : 'md',
    displayedHelperText: showHelper ? errorMessage ?? helperText : undefined,
  };
};
