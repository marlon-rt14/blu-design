import type { IAlertBaseProps } from '@dsm/shared';

export interface IAlertProps extends IAlertBaseProps {
  /** Fired when the action LinkButton is pressed. Not called if `showAction` is off. */
  onAction?: () => void;
  /** Fired when the dismiss control is pressed. Not called if `showDismiss` is off. */
  onDismiss?: () => void;
}
