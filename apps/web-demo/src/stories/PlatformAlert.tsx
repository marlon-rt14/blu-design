import { Alert as NativeAlert } from '@dsm/mobile';
import type { IAlertBaseProps } from '@dsm/shared';
import { Alert as WebAlert } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformAlertProps extends IAlertBaseProps {
  onAction?: () => void;
  onDismiss?: () => void;
  platform?: TPlatform;
}

export const PlatformAlert = ({
  onAction,
  onDismiss,
  platform = 'web',
  ...props
}: IPlatformAlertProps): ReactElement =>
  platform === 'native' ? (
    <NativeAlert {...props} onAction={onAction} onDismiss={onDismiss} />
  ) : (
    <WebAlert {...props} onAction={onAction} onDismiss={onDismiss} />
  );
