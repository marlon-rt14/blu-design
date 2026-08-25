import type { ITextFieldBaseProps } from '@dsm/shared';
import type { ChangeEventHandler, FocusEventHandler } from 'react';

/**
 * Props of the web TextField.
 *
 * Extends the shared {@link ITextFieldBaseProps} contract with the
 * web-specific bits: DOM event handlers and the native `type` / `name`
 * attributes.
 */
export interface ITextFieldProps extends ITextFieldBaseProps {
  /** Called on every keystroke, like any controlled `<input>`. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /**
   * Maps to the native `type` attribute. Kept narrow to the types this
   * component styles and lays out correctly.
   *
   * @defaultValue `'text'`
   */
  type?: 'text' | 'email' | 'tel' | 'password';
  /** Maps to the native `name` attribute, for uncontrolled form submission. */
  name?: string;
}
