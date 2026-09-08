import { Card as NativeCard } from '@dsm/mobile';
import type { ICardBaseProps } from '@dsm/shared';
import { Card as WebCard } from '@dsm/web';
import type { ReactElement, ReactNode } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformCard}: the shared contract plus the platform switch. */
export interface IPlatformCardProps extends ICardBaseProps {
  children?: ReactNode;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Card from the same props.
 *
 * There is nothing to map: the Card has no handlers, so both implementations
 * take the identical shared contract. The one thing that does not translate is
 * the children — a story has to pass DOM to one and `react-native` elements to
 * the other, which is why the stories build their filler per platform rather
 * than sharing it.
 */
export const PlatformCard = ({
  platform = 'web',
  ...props
}: IPlatformCardProps): ReactElement =>
  platform === 'native' ? <NativeCard {...props} /> : <WebCard {...props} />;
