import { ListItem as NativeListItem } from '@dsm/mobile';
import type { IListItemBaseProps } from '@dsm/shared';
import { ListItem as WebListItem } from '@dsm/web';
import type { ReactElement, ReactNode } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformListItemProps extends IListItemBaseProps {
  /** Content of the `trailing` slot — an Icon in this demo. Decorative on both platforms. */
  trailing?: ReactNode;
  /** Fired when the row is pressed/clicked, on either platform. Omit for a non-interactive row. */
  onAction?: () => void;
  platform?: TPlatform;
}

export const PlatformListItem = ({ onAction, platform = 'web', ...props }: IPlatformListItemProps): ReactElement =>
  platform === 'native' ? (
    <NativeListItem {...props} onPress={onAction} />
  ) : (
    <WebListItem {...props} onClick={onAction} />
  );
