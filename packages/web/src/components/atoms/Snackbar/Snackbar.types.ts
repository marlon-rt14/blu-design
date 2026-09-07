import type { ISnackbarBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

export interface ISnackbarProps extends ISnackbarBaseProps {
  /** Fired when the action LinkButton is activated. Not called if `showAction` is off. */
  onAction?: () => void;
  /**
   * Fired on close, swipe-down, or when the 6s dwell elapses. The bar does
   * not unmount itself — the host does.
   */
  onDismiss?: () => void;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
}
