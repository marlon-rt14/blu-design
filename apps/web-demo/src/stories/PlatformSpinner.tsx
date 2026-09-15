import type { ISpinnerBaseProps } from '@dsm/shared';
import { Spinner as NativeSpinner } from '@dsm/mobile';
import { Spinner as WebSpinner } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformSpinner}: the shared contract plus the switch. */
export interface IPlatformSpinnerProps extends ISpinnerBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Spinner from the same props.
 */
export const PlatformSpinner = ({
  platform = 'web',
  ...props
}: IPlatformSpinnerProps): ReactElement =>
  platform === 'native' ? <NativeSpinner {...props} /> : <WebSpinner {...props} />;
