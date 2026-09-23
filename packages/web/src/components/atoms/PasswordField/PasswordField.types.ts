import type { IPasswordFieldBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

/**
 * Props of the web PasswordField.
 *
 * Extends the shared {@link IPasswordFieldBaseProps} contract with the
 * web-specific bits: DOM event handlers, the native `name` attribute and
 * `autoComplete`.
 */
export interface IPasswordFieldProps extends IPasswordFieldBaseProps {
  /**
   * Whether Caps Lock is on, which the field warns about inside itself.
   *
   * **Web only, and that is why it lives here instead of in the shared
   * contract**: *"en móvil no existe Bloq Mayús: la prop no aplica y el aviso
   * no se monta"*. A prop that silently did nothing on one platform would be
   * worse than one that is not there.
   *
   * Detecting it is the caller's job — `event.getModifierState('CapsLock')` on
   * a key event — because the field does not listen to keys it does not own.
   *
   * @defaultValue `false`
   */
  capsLock?: boolean;
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
