import type { ITextFieldBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

/**
 * Props of the web TextField.
 *
 * Extends the shared {@link ITextFieldBaseProps} contract with what the
 * platform actually owns, and nothing else: focus events and the two native
 * attributes the contract lists under *"diferencias por plataforma"* — the
 * keyboard (`type`) and the name used for uncontrolled form submission.
 *
 * There is no `onChange` here. The contract's handler is `onChangeText`, in
 * the shared base, and this component unwraps the DOM event for it — the same
 * shape `@dsm/mobile` gets for free and the same one PasswordField already
 * uses.
 */
export interface ITextFieldProps extends ITextFieldBaseProps {
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /**
   * Maps to the native `type` attribute. Kept narrow to the types this
   * component styles and lays out correctly. Not a design decision — *"un
   * campo de monto con teclado alfabético es un error de implementación, no de
   * diseño"*.
   *
   * @defaultValue `'text'`
   */
  type?: 'text' | 'email' | 'tel' | 'password';
  /** Maps to the native `name` attribute, for uncontrolled form submission. */
  name?: string;
  /**
   * Hard ceiling on what can be typed, as the native attribute.
   *
   * Separate from {@link ITextFieldBaseProps.counter}, which only draws the
   * `"n / max"` line: a field can count without blocking, and block without
   * counting. Figma models neither.
   */
  maxLength?: number;
}
