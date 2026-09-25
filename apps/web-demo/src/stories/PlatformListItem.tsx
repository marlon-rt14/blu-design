import { ListItem as NativeListItem } from '@dsm/mobile';
import type { IListItemBaseProps } from '@dsm/shared';
import { ListItem as WebListItem } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

export interface IPlatformListItemProps extends Omit<IListItemBaseProps, 'leading'> {
  /**
   * The leading glyph, **by export name** rather than as a node.
   *
   * The real prop is `leading: { icon } | { avatar }`; a control can only pass
   * strings, so the story picks a glyph here or initials in `avatarInitials`
   * and the bridge builds the union. Passing both, the icon wins — which is
   * the union's whole point made visible.
   */
  icon?: TIconExportName;
  /** Initials for the avatar branch of `leading`. Ignored when `icon` is set. */
  avatarInitials?: string;
  /** Fired when the row is pressed/clicked, on either platform. Omit for a non-interactive row. */
  onAction?: () => void;
  platform?: TPlatform;
}

export const PlatformListItem = ({
  icon,
  avatarInitials,
  onAction,
  platform = 'web',
  ...props
}: IPlatformListItemProps): ReactElement => {
  const glyph = iconNode(icon, platform, props.size ?? 'md');
  const leading: IListItemBaseProps['leading'] =
    glyph !== undefined
      ? { icon: glyph }
      : avatarInitials !== undefined
        ? { avatar: { initials: avatarInitials } }
        : undefined;
  return platform === 'native' ? (
    <NativeListItem {...props} leading={leading} onPress={onAction} />
  ) : (
    <WebListItem {...props} leading={leading} onClick={onAction} />
  );
};
