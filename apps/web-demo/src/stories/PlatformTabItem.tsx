import { TabItem as NativeTabItem } from '@dsm/mobile';
import type { ITabItemBaseProps } from '@dsm/shared';
import { TabItem as WebTabItem } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformTabItem}: the shared contract plus a neutral handler. */
export interface IPlatformTabItemProps extends ITabItemBaseProps {
  /** Fired when the tab is picked, on either platform. */
  onAction?: () => void;
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native TabItem from the same props.
 *
 * The divergence worth watching is the handler name: web `onChange`,
 * mobile `onPress`.
 */
export const PlatformTabItem = ({
  onAction,
  platform = 'web',
  ...props
}: IPlatformTabItemProps): ReactElement =>
  platform === 'native' ? (
    <NativeTabItem {...props} onPress={onAction} />
  ) : (
    <WebTabItem {...props} onChange={onAction} />
  );
