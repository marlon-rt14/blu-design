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
  disabled: boolean;
  readOnly: boolean;
  /** `true` when there is an error message. */
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
  /** The Caps Lock chip inside the field. Web only. */
  capsLockStyle: CSSProperties;
  /** Wraps the meter and the requirements under the field. */
  blockStyle: CSSProperties;
  /** The strength word, coloured by level. */
  strengthWordStyle: CSSProperties;
  /** The requirements heading. */
  requirementsTitleStyle: CSSProperties;
  /** One requirement row. */
  requirementRowStyle: CSSProperties;
  /** A requirement's text. */
  requirementTextStyle: CSSProperties;
  /** Icon colour by whether the requirement is met. */
  requirementIconColor: (met: boolean) => string;
  /** The list, as a column. */
  requirementListStyle: CSSProperties;
  /** `error` if there is one, else `helperText`; `undefined` when neither. */
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
  disabled = false,
  readOnly = false,
  strength,
  error,
  helperText,
  isHovered,
  isFocused,
}: IUsePasswordFieldParams): IUsePasswordFieldResult => {
  const mode = useThemeMode();
  const tokens = passwordFieldTokens[mode];
  const fontFamily = useFontFamily(tokens.typography.value.fontWeight);
  const prefersReducedMotion = usePrefersReducedMotion();
  // The message *is* the error state: bDS forbids a red field with nothing
  // to read — *"el error lo comunica el mensaje, no el color"*.
  const hasError = error !== undefined && error !== '';
  const hasValue = value.length > 0;

  const state: TPasswordFieldState = disabled
    ? 'disabled'
    : readOnly
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

  const valueColor = disabled
    ? tokens.colors.value.disabled
    : readOnly
      ? tokens.colors.value.readOnly
      : hasValue
        ? tokens.colors.value.filled
        : tokens.colors.value.placeholder;

  const transition = prefersReducedMotion
    ? 'none'
    : 'border-color 120ms ease, background-color 120ms ease, outline-color 120ms ease';

  // `outline`, not `box-shadow`: only `outline-offset` leaves the gap
  // transparent. A field is almost always on a card or a form surface rather
  // than on the page background, so a painted gap would be the wrong colour
  // most of the time.
  const outline =
    isFocused && !disabled && !readOnly
      ? `${tokens.dimension.focusRingSpread}px solid ${tokens.colors.container.borderFocus}`
      : 'none';

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
      outline,
      outlineOffset: tokens.dimension.focusRingOffset,
      transition,
      cursor: disabled ? 'not-allowed' : undefined,
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
      color: disabled ? tokens.colors.label.disabled : tokens.colors.label.default,
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
      cursor: disabled ? 'not-allowed' : undefined,
      '--dsm-input-placeholder-color': disabled
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
      color: disabled
        ? tokens.colors.helper.disabled
        : hasError
          ? tokens.colors.helper.error
          : tokens.colors.helper.default,
    },
    disabled,
    readOnly,
    isInvalid: hasError,
    state,
    // Figma: the label rises only when there is a value, and at `sm` it never
    // rises at all — a filled `sm` field shows the value, not the label.
    showFloatingLabel: size !== 'sm' && hasValue,
    // "En estados sin valor la acción se oculta: no hay nada que revelar."
    showAction: hasValue,
    actionSize: size === 'sm' ? 'sm' : 'md',
    capsLockStyle: {
      alignItems: 'center',
      // A chip rather than a bare glyph: the token is a background, and on a
      // white field a grey icon alone would read as decoration.
      backgroundColor: disabled
        ? tokens.colors.capsLock.backgroundDisabled
        : tokens.colors.capsLock.background,
      borderRadius: tokens.dimension.strengthBarRadius,
      color: disabled ? tokens.colors.value.disabled : tokens.colors.value.filled,
      display: 'inline-flex',
      flexShrink: 0,
      padding: tokens.dimension.requirementRowGap,
    },
    blockStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.dimension.strengthGap,
      marginBlockStart: tokens.dimension.blockGap,
    },
    strengthWordStyle: {
      color: strength === undefined ? tokens.colors.helper.default : tokens.colors.strength.text[strength],
      fontFamily,
      fontSize: tokens.typography.caption.fontSize,
      fontWeight: tokens.typography.caption.fontWeight,
      lineHeight: tokens.typography.caption.lineHeightRatio,
    },
    requirementsTitleStyle: {
      color: tokens.colors.requirement.title,
      fontFamily,
      fontSize: tokens.typography.caption.fontSize,
      fontWeight: tokens.typography.caption.fontWeight,
      lineHeight: tokens.typography.caption.lineHeightRatio,
      marginBlockEnd: tokens.dimension.requirementRowGap,
    },
    requirementListStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.dimension.requirementRowGap,
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    requirementRowStyle: {
      alignItems: 'center',
      display: 'flex',
      gap: tokens.dimension.requirementGap,
    },
    requirementTextStyle: {
      color: tokens.colors.requirement.text,
      fontFamily,
      fontSize: tokens.typography.caption.fontSize,
      fontWeight: tokens.typography.caption.fontWeight,
      lineHeight: tokens.typography.caption.lineHeightRatio,
    },
    // Only two of the four states are reachable: the signature has a boolean.
    // `failed` and `disabled` have colours in the file and nothing to read them.
    requirementIconColor: (met: boolean): string =>
      disabled
        ? tokens.colors.requirement.iconDisabled
        : met
          ? tokens.colors.requirement.iconMet
          : tokens.colors.requirement.iconPending,
    // The presence of the text renders the line; there is no separate switch.
    displayedHelperText: error ?? helperText,
  };
};
