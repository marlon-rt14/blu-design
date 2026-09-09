import { TagGroup as NativeTagGroup } from '@dsm/mobile';
import type { ITagGroupBaseProps } from '@dsm/shared';
import { TagGroup as WebTagGroup } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformTagGroupProps extends ITagGroupBaseProps {
  platform?: TPlatform;
}

export const PlatformTagGroup = ({ platform = 'web', ...props }: IPlatformTagGroupProps): ReactElement =>
  platform === 'native' ? <NativeTagGroup {...props} /> : <WebTagGroup {...props} />;
