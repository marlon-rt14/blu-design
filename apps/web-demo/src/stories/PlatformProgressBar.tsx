import { ProgressBar as NativeProgressBar } from '@dsm/mobile';
import type { IProgressBarBaseProps } from '@dsm/shared';
import { ProgressBar as WebProgressBar } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformProgressBar}: the shared contract plus the platform switch. */
export interface IPlatformProgressBarProps extends IProgressBarBaseProps {
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native ProgressBar from the same props.
 *
 * Nothing to map: both take the shared contract unchanged. What differs is
 * inside — a CSS transition on one side, `Animated` on the other.
 */
export const PlatformProgressBar = ({
  platform = 'web',
  ...props
}: IPlatformProgressBarProps): ReactElement =>
  platform === 'native' ? <NativeProgressBar {...props} /> : <WebProgressBar {...props} />;
