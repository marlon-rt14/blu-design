import { Snackbar as NativeSnackbar } from '@dsm/mobile';
import type { ISnackbarBaseProps } from '@dsm/shared';
import { Snackbar as WebSnackbar } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

export interface IPlatformSnackbarProps extends ISnackbarBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Snackbar. `action` and
 * `onDismiss` are already on the shared contract.
 */
export const PlatformSnackbar = ({
  platform = 'web',
  ...props
}: IPlatformSnackbarProps): ReactElement =>
  platform === 'native' ? <NativeSnackbar {...props} /> : <WebSnackbar {...props} />;
