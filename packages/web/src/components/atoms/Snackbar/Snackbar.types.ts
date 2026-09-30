import type { ISnackbarBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

/**
 * Props of the web Snackbar.
 *
 * `action.onPress` and `onDismiss` live on the shared contract. These two
 * are the dismiss control's DOM focus events.
 */
export interface ISnackbarProps extends ISnackbarBaseProps {
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
}
