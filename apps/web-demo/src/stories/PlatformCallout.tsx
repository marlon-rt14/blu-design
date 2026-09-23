import { Callout as NativeCallout } from '@dsm/mobile';
import type { ICalloutBaseProps } from '@dsm/shared';
import { Callout as WebCallout } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformCallout}: the shared contract plus the switch. */
export interface IPlatformCalloutProps extends ICalloutBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Callout from the same props.
 *
 * Nothing to map — the contract is identical, `action.onPress` and
 * `onDismiss` included, unlike `Alert`'s own Platform wrapper which still
 * splits those into separate props.
 */
export const PlatformCallout = ({
  platform = 'web',
  ...props
}: IPlatformCalloutProps): ReactElement =>
  platform === 'native' ? <NativeCallout {...props} /> : <WebCallout {...props} />;
