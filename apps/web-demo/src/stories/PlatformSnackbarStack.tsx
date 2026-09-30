import { SnackbarStack as NativeSnackbarStack } from '@dsm/mobile';
import type { ISnackbarStackBaseProps } from '@dsm/shared';
import { SnackbarStack as WebSnackbarStack } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TPlatform } from './PlatformSnackbar';

export interface IPlatformSnackbarStackProps extends ISnackbarStackBaseProps {
  platform?: TPlatform;
}

/** Renders the web or React Native pile. `expanded` is already on the contract. */
export const PlatformSnackbarStack = ({
  platform = 'web',
  ...props
}: IPlatformSnackbarStackProps): ReactElement =>
  platform === 'native' ? <NativeSnackbarStack {...props} /> : <WebSnackbarStack {...props} />;
