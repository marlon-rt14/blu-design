import { AvatarGroup as NativeAvatarGroup } from '@dsm/mobile';
import type { IAvatarGroupBaseProps } from '@dsm/shared';
import { AvatarGroup as WebAvatarGroup } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformAvatarGroupProps extends IAvatarGroupBaseProps {
  platform?: TPlatform;
}

export const PlatformAvatarGroup = ({ platform = 'web', ...props }: IPlatformAvatarGroupProps): ReactElement =>
  platform === 'native' ? <NativeAvatarGroup {...props} /> : <WebAvatarGroup {...props} />;
