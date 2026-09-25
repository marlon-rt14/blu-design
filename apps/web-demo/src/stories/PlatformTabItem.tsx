import { TabItem as NativeTabItem } from '@dsm/mobile';
import type { ITabItemBaseProps } from '@dsm/shared';
import { TabItem as WebTabItem } from '@dsm/web';
import { createElement } from 'react';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { NATIVE_ICONS, WEB_ICONS } from './iconRegistry';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformTabItem}: the shared contract plus a neutral handler. */
export interface IPlatformTabItemProps extends Omit<ITabItemBaseProps, 'leadingIcon'> {
  /** Fired when the tab is picked, on either platform. */
  onAction?: () => void;
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop takes the element — `leadingIcon={<IconUser01 size="sm" />}` —
   * but a Storybook control can only hand over a string, so the bridge builds
   * the platform's component at `sm`, the size the tab bar uses.
   */
  leadingIcon?: TIconExportName;
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
  leadingIcon,
  platform = 'web',
  ...props
}: IPlatformTabItemProps): ReactElement =>
  platform === 'native' ? (
    <NativeTabItem
      {...props}
      leadingIcon={
        leadingIcon === undefined ? undefined : createElement(NATIVE_ICONS[leadingIcon], { size: 'sm' })
      }
      onPress={onAction}
    />
  ) : (
    <WebTabItem
      {...props}
      leadingIcon={
        leadingIcon === undefined ? undefined : createElement(WEB_ICONS[leadingIcon], { size: 'sm' })
      }
      onChange={onAction}
    />
  );
