import type { IPasswordFieldBaseProps } from '@dsm/shared';

/**
 * Props of the React Native PasswordField.
 *
 * Extends the shared {@link IPasswordFieldBaseProps} contract with the
 * mobile-specific handlers and `autoComplete`.
 */
export interface IPasswordFieldProps extends IPasswordFieldBaseProps {
  /** Called with the new value on every keystroke. */
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /**
   * Maps to `TextInput`'s `autoComplete`.
   *
   * **Do not turn this off.** bDS is explicit: breaking password managers makes
   * people pick worse passwords. Use `'new-password'` on a sign-up or
   * change-password screen.
   *
   * @defaultValue `'current-password'`
   */
  autoComplete?: 'current-password' | 'new-password';
}
