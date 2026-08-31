import type { ISwitchItemBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

/**
 * Props of the web SwitchItem — the iOS-canonical Switch usage: a list
 * row whose content is the label. The entire row is the control; focus
 * lands on the row, not the thumb.
 */
export interface ISwitchItemProps extends ISwitchItemBaseProps {
  /** Fired with the new checked value. Not called while `isDisabled`. */
  onChange?: (isChecked: boolean) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}
