import type { IPasswordFieldBaseProps } from '@dsm/shared';
import type { ChangeEventHandler, FocusEventHandler } from 'react';

/**
 * Props of the web PasswordField.
 *
 * Extends the shared {@link IPasswordFieldBaseProps} contract with the
 * web-specific bits: DOM event handlers, the native `name` attribute and
 * `autoComplete`.
 */
export interface IPasswordFieldProps extends IPasswordFieldBaseProps {
  /** Called on every keystroke, like any controlled `<input>`. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Maps to the native `name` attribute, for uncontrolled form submission. */
  name?: string;
  /**
   * Maps to the native `autocomplete` attribute.
   *
   * **Do not turn this off.** bDS is explicit: disabling autocomplete or paste
   * breaks password managers, which makes people pick worse passwords. Use
   * `'new-password'` on a sign-up or change-password form.
   *
   * @defaultValue `'current-password'`
   */
  autoComplete?: 'current-password' | 'new-password';
}
