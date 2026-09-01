import type { ICheckboxBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

export interface ICheckboxProps extends ICheckboxBaseProps {
  /** Fired with the new checked value. Not called while `isDisabled`. */
  onChange?: (isChecked: boolean) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  id?: string;
  name?: string;
}
