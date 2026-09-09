import { Tag as NativeTag } from '@dsm/mobile';
import type { ITagBaseProps } from '@dsm/shared';
import { Tag as WebTag } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformTagProps extends ITagBaseProps {
  onRemove?: () => void;
  platform?: TPlatform;
}

export const PlatformTag = ({ platform = 'web', ...props }: IPlatformTagProps): ReactElement =>
  platform === 'native' ? <NativeTag {...props} /> : <WebTag {...props} />;
