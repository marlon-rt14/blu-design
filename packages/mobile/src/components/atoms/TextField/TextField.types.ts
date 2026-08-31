import type { ITextFieldBaseProps } from '@dsm/shared';
import type { KeyboardTypeOptions } from 'react-native';

/**
 * Props of the React Native TextField.
 *
 * Extends the shared {@link ITextFieldBaseProps} contract with the
 * mobile-specific bits: `TextInput` handlers and keyboard configuration.
 * Affix icons are `TIconName` on the shared base — not opaque `ReactNode`
 * slots.
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
}
