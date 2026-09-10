import { IconButton as NativeIconButton } from '@dsm/mobile';
import * as MobileIcons from '@dsm/mobile/icons';
import type { IIconButtonBaseProps } from '@dsm/shared';
import { IconButton as WebIconButton } from '@dsm/web';
import * as WebIcons from '@dsm/web/icons';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformIconButton}: the shared contract plus the glyph and the switch. */
export interface IPlatformIconButtonProps extends IIconButtonBaseProps {
  /**
   * The glyph, **by export name** rather than by component.
   *
   * The real prop takes the component itself — `icon={IconTrash}` — but a
   * Storybook control can only hand over a string, so the story picks the
   * platform's version here.
   */
  icon: TIconExportName;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native IconButton from the same props.
 *
 * The only thing to map is the glyph, which has to come from the matching
 * package. `onPress` needs no mapping at all: unlike the Button, whose handler
 * is `onClick` on one side and `onPress` on the other, the development
 * documentation gives the IconButton the same name on both platforms.
 */
export const PlatformIconButton = ({
  icon,
  platform = 'web',
  ...props
}: IPlatformIconButtonProps): ReactElement =>
  platform === 'native' ? (
    <NativeIconButton {...props} icon={MobileIcons[icon]} />
  ) : (
    <WebIconButton {...props} icon={WebIcons[icon]} />
  );
