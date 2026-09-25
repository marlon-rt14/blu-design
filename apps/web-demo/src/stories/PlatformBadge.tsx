import { Badge as NativeBadge } from '@dsm/mobile';
import type { IBadgeBaseProps } from '@dsm/shared';
import { Badge as WebBadge } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformBadge}: the shared contract plus the switch. */
export interface IPlatformBadgeProps extends IBadgeBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Badge from the same props.
 *
 * Nothing to map — the contract is identical, and Badge has no interaction
 * states or event handlers on either platform.
 */
export const PlatformBadge = ({
  platform = 'web',
  ...props
}: IPlatformBadgeProps): ReactElement | null =>
  platform === 'native' ? <NativeBadge {...props} /> : <WebBadge {...props} />;
