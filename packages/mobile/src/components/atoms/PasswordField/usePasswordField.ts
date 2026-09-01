import { passwordFieldTokens } from '@dsm/shared';
import type { TPasswordFieldState } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IPasswordFieldProps } from './PasswordField.types';

/** Params of {@link usePasswordField}: the props plus the live focus state. */
interface IUsePasswordFieldParams extends IPasswordFieldProps {
  /** Whether the underlying `TextInput` currently has focus. */
  isFocused: boolean;
}

/** Styles and derived values the PasswordField needs to render. */
interface IUsePasswordFieldResult {
  /**
   * The bordered box: a row of [content column, reveal action]. Also carries the
   * focus `outline`, which replaced the wrapper View that used to reserve it.
   */
  fieldStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  inputStyle: StyleProp<TextStyle>;
  /** Wraps the action so its touch target reaches `size/target/min`. */
  actionSlotStyle: StyleProp<ViewStyle>;
  helperStyle: StyleProp<TextStyle>;
  /** Colour for `TextInput`'s `placeholderTextColor` — not expressible through `style`. */
  placeholderTextColor: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
  /** Resolved state, exposed so stories and tests can assert on it. */
  state: TPasswordFieldState;
  /** Whether the floating label renders. Never at `size='sm'`. */
  showFloatingLabel: boolean;
  /** Whether the reveal action renders — nothing to reveal while empty. */
  showAction: boolean;
  /** The action's own size: `sm` mirrors the field, everything else is `md`. */
  actionSize: 'sm' | 'md';
  displayedHelperText: string | undefined;
}

/**
 * Resolves every colour and metric the native PasswordField needs, from the
 * active theme, its props and its current focus state.
 *
 * Same shape as `@dsm/mobile`'s `useTextArea`. There is no hover — a touch
 * screen has none — so the state ladder is one rung shorter than web's.
 *
 * @param params - The PasswordField props plus the current focus state.
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
  isFocused,
}: IUsePasswordFieldParams): IUsePasswordFieldResult => {
  const mode = useThemeMode();
  const tokens = passwordFieldTokens[mode];
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
          : hasValue
            ? 'filled'
            : 'default';

  // Focus never recolors the container's own border — Figma keeps
  // `border-default` and draws a separate ring outside the box instead.
  const borderColor =
    state === 'disabled'
      ? tokens.colors.container.borderDisabled
      : state === 'readonly'
        ? tokens.colors.container.borderReadOnly
        : state === 'error'
          ? tokens.colors.container.borderError
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

  const { label, value: valueType } = tokens.typography;

  return {
    // The focus ring is an `outline` on this very box, not a wrapper View with a
    // reserved border. It is ignored by layout, so nothing has to be reserved to
    // keep focusing from resizing the field, and `outlineOffset` leaves the gap
    // transparent — a field almost always sits on a card or a form surface, so a
    // painted gap would be the wrong colour most of the time.
    fieldStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: tokens.dimension.actionGap,
      height: tokens.size[size].height,
      paddingHorizontal: tokens.dimension.paddingHorizontal,
      borderRadius: tokens.dimension.borderRadius,
      borderWidth: tokens.dimension.borderWidth,
      borderColor,
      backgroundColor,
      ...(isFocused && !isDisabled && !isReadOnly
        ? {
            outlineWidth: tokens.dimension.focusRingSpread,
            outlineOffset: tokens.dimension.focusRingOffset,
            outlineColor: tokens.colors.container.borderFocus,
            outlineStyle: 'solid' as const,
          }
        : {}),
    },
    // See @dsm/mobile's TextField useTextField for why fontWeight never
    // accompanies fontFamily here — same Android font-resolver constraint.
    labelStyle: {
      fontFamily: resolveMulishFontFamily(label.fontWeight),
      fontSize: label.fontSize,
      lineHeight: label.fontSize * label.lineHeightRatio,
      letterSpacing: label.letterSpacing,
      color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
    },
    inputStyle: {
      padding: 0,
      margin: 0,
      fontFamily: resolveMulishFontFamily(valueType.fontWeight),
      fontSize: valueType.fontSize,
      lineHeight: valueType.fontSize * valueType.lineHeightRatio,
      color: valueColor,
    },
    // The action's text is short, so its own box falls under the minimum touch
    // target. The invisible padding bDS asks for goes here, not on the
    // LinkButton, which has no idea it is being used inside a field.
    actionSlotStyle: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      minHeight: tokens.dimension.minTouchTarget,
      minWidth: tokens.dimension.minTouchTarget,
    },
    helperStyle: {
      paddingTop: tokens.dimension.helperGap,
      fontFamily: resolveMulishFontFamily(label.fontWeight),
      fontSize: label.fontSize,
      lineHeight: label.fontSize * label.lineHeightRatio,
      color: isDisabled
        ? tokens.colors.helper.disabled
        : hasError
          ? tokens.colors.helper.error
          : tokens.colors.helper.default,
    },
    placeholderTextColor: isDisabled
      ? tokens.colors.value.disabled
      : tokens.colors.value.placeholder,
    isDisabled,
    isReadOnly,
    isInvalid: hasError,
    state,
    showFloatingLabel: size !== 'sm' && hasValue,
    showAction: hasValue,
    actionSize: size === 'sm' ? 'sm' : 'md',
    displayedHelperText: showHelper ? errorMessage ?? helperText : undefined,
  };
};
