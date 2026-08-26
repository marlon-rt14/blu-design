import type { ITextFieldBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';
import type { KeyboardTypeOptions } from 'react-native';

/**
 * Props of the React Native TextField.
 *
 * Extends the shared {@link ITextFieldBaseProps} contract with the
 * mobile-specific bits: `TextInput` handlers and keyboard configuration.
 */
export interface ITextFieldProps extends ITextFieldBaseProps {
  /** Called on every keystroke, with the new text — `TextInput`'s convention. */
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /**
   * Maps to `TextInput`'s `keyboardType`.
   *
   * @defaultValue `'default'`
   */
  keyboardType?: KeyboardTypeOptions;
  /** Maps to `TextInput`'s `secureTextEntry`, for password fields. */
  isSecure?: boolean;
  /** Icon rendered before the value when `showPrefixIcon` is `true`. Any element — this library ships no bundled icon set. */
  prefixIcon?: ReactNode;
  /** Icon rendered after the value when `showSuffixIcon` is `true`. Any element — this library ships no bundled icon set. */
  suffixIcon?: ReactNode;
}
