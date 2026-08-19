import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import {
  buttonStyles,
  containerSizeStyles,
  containerVariantDisabledStyles,
  containerVariantPressedStyles,
  containerVariantStyles,
  labelSizeStyles,
  labelVariantDisabledStyles,
  labelVariantStyles,
} from './Button.styles';
import type { IButtonProps } from './Button.types';

/** Params of {@link useButton}: the Button props plus the live press state. */
interface IUseButtonParams extends IButtonProps {
  /** Whether the button is currently being pressed. Drives the pressed styles. */
  isPressed: boolean;
}

/** Styles the Button needs to render, derived from its props and state. */
interface IUseButtonResult {
  /** Style array for the `Pressable` container. */
  containerStyle: StyleProp<ViewStyle>;
  /** Style array for the label `Text`. */
  labelStyle: StyleProp<TextStyle>;
  /** Normalized disabled flag, safe to hand straight to `Pressable`. */
  isDisabled: boolean;
}

/**
 * Composes the native Button styles from variant, size and state.
 *
 * Returns arrays rather than flattened objects so React Native can merge them
 * itself. **Array order matters: the last entry wins**, which is why the
 * disabled styles come last and override the pressed ones.
 *
 * @param params - The Button props plus the current press state.
 * @returns The container and label style arrays, and the normalized disabled flag.
 */
export const useButton = ({
  variant = 'primary',
  size = 'medium',
  isDisabled = false,
  isPressed,
}: IUseButtonParams): IUseButtonResult => {
  const containerStyle: StyleProp<ViewStyle> = [
    buttonStyles.container,
    containerVariantStyles[variant],
    containerSizeStyles[size],
    isPressed && !isDisabled ? containerVariantPressedStyles[variant] : null,
    isDisabled ? containerVariantDisabledStyles[variant] : null,
  ];

  const labelStyle: StyleProp<TextStyle> = [
    buttonStyles.label,
    labelVariantStyles[variant],
    labelSizeStyles[size],
    isDisabled ? labelVariantDisabledStyles[variant] : null,
  ];

  return { containerStyle, labelStyle, isDisabled };
};
