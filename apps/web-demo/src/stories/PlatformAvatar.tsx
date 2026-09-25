import { Avatar as NativeAvatar } from '@dsm/mobile';
import type { IAvatarBaseProps, TAvatarSize, TIconSize } from '@dsm/shared';
import { Avatar as WebAvatar } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

export interface IPlatformAvatarProps extends Omit<IAvatarBaseProps, 'icon'> {
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  icon?: TIconExportName;
  platform?: TPlatform;
}

/**
 * The step an avatar's glyph takes.
 *
 * Identity, which is what the component itself applied before the slot became a
 * node. It is not a clean fit: the avatar's own scale is
 * `component/avatar/size/glyph/*` = 12 · 16 · 20 · 28, and `size/icon/*` has no
 * 20 or 28 — so `md` and `lg` land on 24 and 32. Both are 4px off their target
 * and there is nothing closer, which is why identity is the pick that shipped.
 */
const glyphSize = (size: TAvatarSize): TIconSize => size;

export const PlatformAvatar = ({ icon, platform = 'web', ...props }: IPlatformAvatarProps): ReactElement => {
  const glyph = iconNode(icon, platform, glyphSize(props.size ?? 'md'));
  return platform === 'native' ? (
    <NativeAvatar {...props} icon={glyph} />
  ) : (
    <WebAvatar {...props} icon={glyph} />
  );
};
