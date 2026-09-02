import type { IRadioBaseProps } from '@dsm/shared';
import type { ChangeEvent } from 'react';

/**
 * Props of the web Radio.
 *
 * Extends the shared {@link IRadioBaseProps} contract with the browser's own
 * radio semantics. The component renders a real `<input type="radio">`, which is
 * what makes `name` load-bearing: two radios sharing it become a group, and the
 * browser then supplies arrow-key navigation, a roving tab order and form
 * submission — exactly the behaviour bDS asks for in code, without us
 * reimplementing any of it.
 */
export interface IRadioProps extends IRadioBaseProps {
  /**
   * Groups radios together. Two inputs with the same `name` are mutually
   * exclusive and the arrow keys move between them.
   *
   * Optional here because a Radio can be driven purely from `isChecked`, but
   * omitting it gives up the browser's grouping — prefer setting it, or let
   * `RadioGroup` set it for you.
   */
  name?: string;
  /** Value submitted with the form when this option is the chosen one. */
  value?: string;
  /** Called when the user picks this option. Never fires while `isDisabled`. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
