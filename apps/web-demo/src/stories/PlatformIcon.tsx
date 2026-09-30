import type { IIconBaseProps } from '@dsm/shared';
import type { ReactElement } from 'react';

import { NATIVE_ICONS, WEB_ICONS } from './iconRegistry';
import type { TIconExportName } from './iconNames';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * Props of {@link PlatformIcon}: the shared Icon contract, plus which glyph to
 * render and on which platform.
 */
export interface IPlatformIconProps extends IIconBaseProps {
  /** Which glyph to render, by its export name in `@dsm/{web,mobile}/icons/<section>`. */
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
 * because the library exports 1170 of them across 19 section modules rather
 * than one. Reaching all of them at once is exactly what the library tells
 * consumers not to do — which is why `iconRegistry.ts` exists here and not
 * there, and why Storybook, not being shipped, is the only place it may.
 *
 * Both platforms export the same names by construction: they are generated
 * together from one Figma pull.
 */
export const PlatformIcon = ({
  name,
  platform = 'web',
  tintColor,
  ...props
}: IPlatformIconProps): ReactElement => {
  if (platform === 'native') {
    const NativeIcon = NATIVE_ICONS[name as keyof typeof NATIVE_ICONS];
    return <NativeIcon {...props} tintColor={tintColor} />;
  }

  const WebIcon = WEB_ICONS[name];
  return <WebIcon {...props} />;
};
