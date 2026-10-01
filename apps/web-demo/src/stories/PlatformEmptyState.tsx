import { EmptyState as NativeEmptyState } from '@dsm/mobile';
import type { IEmptyStateBaseProps } from '@dsm/shared';
import { EmptyState as WebEmptyState } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformEmptyState}: the shared contract plus the switch. */
export interface IPlatformEmptyStateProps extends IEmptyStateBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native EmptyState from the same
 * props. Nothing to map — `action.onPress`/`secondaryAction.onPress` are
 * already real handlers in the shared contract.
 */
export const PlatformEmptyState = ({
  platform = 'web',
  ...props
}: IPlatformEmptyStateProps): ReactElement =>
  platform === 'native' ? <NativeEmptyState {...props} /> : <WebEmptyState {...props} />;
