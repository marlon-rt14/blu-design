import type { ICheckboxBaseProps } from '@dsm/shared';

export interface ICheckboxProps extends ICheckboxBaseProps {
  /** Fired with the new checked value. Not called while `isDisabled`. */
  onValueChange?: (isChecked: boolean) => void;
}
