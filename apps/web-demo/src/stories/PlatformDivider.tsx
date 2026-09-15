import { Divider as NativeDivider } from '@dsm/mobile';
import type { IDividerBaseProps } from '@dsm/shared';
import { Divider as WebDivider } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformDivider}: the shared contract plus the platform switch. */
export interface IPlatformDividerProps extends IDividerBaseProps {
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Divider from the same props.
 *
 * Nothing to map at all: the Divider has no handlers, no children and no text,
 * so both implementations take the shared contract unchanged. This is the
 * thinnest bridge in the demo, and that is the point — the two platforms differ
 * only in the element they emit and in how they declare themselves decorative.
 */
export const PlatformDivider = ({
  platform = 'web',
  ...props
}: IPlatformDividerProps): ReactElement =>
  platform === 'native' ? <NativeDivider {...props} /> : <WebDivider {...props} />;
