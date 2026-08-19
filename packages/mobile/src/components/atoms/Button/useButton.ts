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

interface IUseButtonParams extends IButtonProps {
  isPressed: boolean;
}

interface IUseButtonResult {
  containerStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  isDisabled: boolean;
}

/**
 * Composes the native Button styles from variant, size and state.
 * Array order matters: the last entry wins.
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
