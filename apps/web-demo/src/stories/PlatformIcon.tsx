import { Icon as NativeIcon } from '@dsm/mobile';
import type { IIconBaseProps } from '@dsm/shared';
import { Icon as WebIcon } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformIcon}: the shared Icon contract plus a platform
 * switch.
 */
export interface IPlatformIconProps extends IIconBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Icon from the same set of
 * shared props. The stub has no platform-specific handlers, so this is a
 * straight pass-through.
 */
export const PlatformIcon = ({ platform = 'web', ...props }: IPlatformIconProps): ReactElement =>
  platform === 'native' ? <NativeIcon {...props} /> : <WebIcon {...props} />;
