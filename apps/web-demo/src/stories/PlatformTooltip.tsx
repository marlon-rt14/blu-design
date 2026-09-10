import { Tooltip as NativeTooltip } from '@dsm/mobile';
import type { ITooltipBaseProps } from '@dsm/shared';
import { Tooltip as WebTooltip } from '@dsm/web';
import type { ReactElement, ReactNode } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformTooltip}: the shared contract plus the trigger and the switch. */
export interface IPlatformTooltipProps extends ITooltipBaseProps {
  children: ReactNode;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Tooltip from the same props.
 *
 * Nothing to map — the contract is identical. What is **not** identical is how
 * the panel opens, and no prop controls that: pointing or focusing on web, a
 * long press on mobile. Flip the toolbar and the story stops responding to
 * hover, which is the point.
 */
export const PlatformTooltip = ({
  platform = 'web',
  ...props
}: IPlatformTooltipProps): ReactElement =>
  platform === 'native' ? <NativeTooltip {...props} /> : <WebTooltip {...props} />;
