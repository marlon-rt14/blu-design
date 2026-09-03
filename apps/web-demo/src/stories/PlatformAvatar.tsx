import { Avatar as NativeAvatar } from '@dsm/mobile';
import type { IAvatarBaseProps } from '@dsm/shared';
import { Avatar as WebAvatar } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformAvatarProps extends IAvatarBaseProps {
  platform?: TPlatform;
}

export const PlatformAvatar = ({ platform = 'web', ...props }: IPlatformAvatarProps): ReactElement =>
  platform === 'native' ? <NativeAvatar {...props} /> : <WebAvatar {...props} />;
