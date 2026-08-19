import type { IButtonBaseProps } from '@dsm/shared';
import type { MouseEvent } from 'react';

/**
 * Props of the web Button.
 *
 * Extends the shared {@link IButtonBaseProps} contract with the web-specific
 * bits: a mouse event handler and the native `type` attribute.
 */
export interface IButtonProps extends IButtonBaseProps {
  /**
   * Called when the button is clicked. Not called while `isDisabled` is `true`,
   * because the underlying element carries the `disabled` attribute.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Maps to the `type` attribute of the underlying `<button>`. Defaults to
   * `'button'` so the component never submits a surrounding form by accident.
   *
   * @defaultValue `'button'`
   */
  type?: 'button' | 'submit' | 'reset';
}
