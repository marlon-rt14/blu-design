import type { ISkeletonBaseProps } from '@dsm/shared';
import { Skeleton as NativeSkeleton } from '@dsm/mobile';
import { Skeleton as WebSkeleton } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformSkeleton}: the shared contract plus the switch. */
export interface IPlatformSkeletonProps extends ISkeletonBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Skeleton from the same props.
 */
export const PlatformSkeleton = ({
  platform = 'web',
  ...props
}: IPlatformSkeletonProps): ReactElement =>
  platform === 'native' ? <NativeSkeleton {...props} /> : <WebSkeleton {...props} />;
