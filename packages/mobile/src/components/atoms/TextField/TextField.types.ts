import type { ITextFieldBaseProps } from '@dsm/shared';
import type { KeyboardTypeOptions } from 'react-native';

/**
 * Props of the React Native TextField.
 *
 * Extends the shared {@link ITextFieldBaseProps} contract with what the
 * platform actually owns, and nothing else: the `TextInput` focus handlers and
 * the keyboard. The contract lists the keyboard under *"diferencias por
 * plataforma"* precisely because it is not a design decision — *"un campo de
 * monto con teclado alfabético es un error de implementación, no de diseño"*.
 *
 * `onChangeText` is **not** here: it is in the shared base, where the contract
 * puts it, and `TextInput` happens to already speak it.
 */
export interface ITextFieldProps extends ITextFieldBaseProps {
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
  /**
   * Hard ceiling on what can be typed, as `TextInput`'s own attribute.
   *
   * Separate from {@link ITextFieldBaseProps.counter}, which only draws the
   * `"n / max"` line: a field can count without blocking, and block without
   * counting. Figma models neither.
   */
  maxLength?: number;
}
