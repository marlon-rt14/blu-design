import { Select as NativeSelect } from '@dsm/mobile';
import type { ISelectBaseProps } from '@dsm/shared';
import { Select as WebSelect } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformSelectProps extends ISelectBaseProps {
  onChange: (value: string) => void;
  platform?: TPlatform;
}

export const PlatformSelect = ({ platform = 'web', ...props }: IPlatformSelectProps): ReactElement =>
  platform === 'native' ? <NativeSelect {...props} /> : <WebSelect {...props} />;
