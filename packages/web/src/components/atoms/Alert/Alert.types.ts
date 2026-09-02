import type { IAlertBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

export interface IAlertProps extends IAlertBaseProps {
  /** Fired when the action LinkButton is activated. Not called if `showAction` is off. */
  onAction?: () => void;
  /** Fired when dismiss is activated. Not called if `showDismiss` is off. */
  onDismiss?: () => void;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
}
