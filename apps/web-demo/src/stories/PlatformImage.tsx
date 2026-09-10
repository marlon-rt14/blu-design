import { Image as NativeImage } from '@dsm/mobile';
import type { IImageBaseProps } from '@dsm/shared';
import { Image as WebImage } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformImageProps extends IImageBaseProps {
  platform?: TPlatform;
}

export const PlatformImage = ({ platform = 'web', ...props }: IPlatformImageProps): ReactElement =>
  platform === 'native' ? <NativeImage {...props} /> : <WebImage {...props} />;
