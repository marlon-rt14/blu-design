import { Snackbar as NativeSnackbar } from '@dsm/mobile';
import type { ISnackbarBaseProps } from '@dsm/shared';
import { Snackbar as WebSnackbar } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformSnackbarProps extends ISnackbarBaseProps {
  onAction?: () => void;
  onDismiss?: () => void;
  platform?: TPlatform;
}

export const PlatformSnackbar = ({
  onAction,
  onDismiss,
  platform = 'web',
  ...props
}: IPlatformSnackbarProps): ReactElement =>
  platform === 'native' ? (
    <NativeSnackbar {...props} onAction={onAction} onDismiss={onDismiss} />
  ) : (
    <WebSnackbar {...props} onAction={onAction} onDismiss={onDismiss} />
  );
