import * as MobileIcons from '@dsm/mobile/icons';
import type { IIconBaseProps } from '@dsm/shared';
import * as WebIcons from '@dsm/web/icons';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformIcon}: the shared Icon contract, plus which glyph to
 * render and on which platform.
 */
export interface IPlatformIconProps extends IIconBaseProps {
  /** Which glyph to render, by its export name in `@dsm/{web,mobile}/icons`. */
  name: TIconExportName;
  /**
   * A literal colour, overriding `color`. **Mobile only** — web has
   * `currentColor` and needs no such channel, so this is dropped for the web
   * implementation rather than silently doing nothing.
   */
  tintColor?: string;
  /**
   * Implementation to render. Stories pass the `platform` toolbar global here.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native version of a glyph from the same
 * props.
 *
 * Unlike the other `Platform*` bridges this one also *picks* the component,
 * because the library exports 31 of them rather than one. Indexing the whole
 * module is exactly what the library tells consumers not to do — it references
 * every glyph and defeats tree-shaking — but a gallery has to reach all of them,
 * and Storybook is not shipped.
 *
 * Both modules export the same names by construction: they are generated
 * together from one Figma pull.
 */
export const PlatformIcon = ({
  name,
  platform = 'web',
  tintColor,
  ...props
}: IPlatformIconProps): ReactElement => {
  if (platform === 'native') {
    const NativeIcon = MobileIcons[name as keyof typeof MobileIcons];
    return <NativeIcon {...props} tintColor={tintColor} />;
  }

  const WebIcon = WebIcons[name];
  return <WebIcon {...props} />;
};
