import { AvatarGroup as NativeAvatarGroup } from '@dsm/mobile';
import type { IAvatarGroupBaseProps, IAvatarGroupItem, TAvatarSize, TIconSize } from '@dsm/shared';
import { AvatarGroup as WebAvatarGroup } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

/** One item as a story writes it: the glyph by export name, not as a node. */
export interface IPlatformAvatarGroupItem extends Omit<IAvatarGroupItem, 'icon'> {
  icon?: TIconExportName;
}

export interface IPlatformAvatarGroupProps extends Omit<IAvatarGroupBaseProps, 'avatars'> {
  avatars: IPlatformAvatarGroupItem[];
  platform?: TPlatform;
}

/** The same step {@link PlatformAvatar} takes — the group owns the size. */
const glyphSize = (size: TAvatarSize): TIconSize => size;

export const PlatformAvatarGroup = ({
  avatars,
  platform = 'web',
  ...props
}: IPlatformAvatarGroupProps): ReactElement => {
  const size = glyphSize(props.size ?? 'md');
  const resolved = avatars.map((item) => ({ ...item, icon: iconNode(item.icon, platform, size) }));
  return platform === 'native' ? (
    <NativeAvatarGroup {...props} avatars={resolved} />
  ) : (
    <WebAvatarGroup {...props} avatars={resolved} />
  );
};
