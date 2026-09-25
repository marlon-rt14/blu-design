import { ListItem as NativeListItem } from '@dsm/mobile';
import type { IListItemBaseProps } from '@dsm/shared';
import { ListItem as WebListItem } from '@dsm/web';
import type { ReactElement, ReactNode } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

export interface IPlatformListItemProps extends Omit<IListItemBaseProps, 'icon'> {
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  icon?: TIconExportName;
  /** Content of the `trailing` slot — an Icon in this demo. Decorative on both platforms. */
  trailing?: ReactNode;
  /** Fired when the row is pressed/clicked, on either platform. Omit for a non-interactive row. */
  onAction?: () => void;
  platform?: TPlatform;
}

export const PlatformListItem = ({
  icon,
  onAction,
  platform = 'web',
  ...props
}: IPlatformListItemProps): ReactElement => {
  const glyph = iconNode(icon, platform, props.size ?? 'md');
  return platform === 'native' ? (
    <NativeListItem {...props} icon={glyph} onPress={onAction} />
  ) : (
    <WebListItem {...props} icon={glyph} onClick={onAction} />
  );
};
