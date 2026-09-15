import {
  DEFAULT_THEME_BRAND,
  DEFAULT_THEME_LAYOUT,
  DEFAULT_THEME_MODE,
  resolveTheme,
} from '@dsm/shared';
import type { IResolvedTheme, TThemeBrand, TThemeLayout, TThemeMode } from '@dsm/shared';

/**
 * The three theme globals the toolbar sets, as Storybook hands them over:
 * loosely typed, because a global is only ever `unknown` to a story.
 */
export interface IThemeGlobals {
  brand?: unknown;
  mode?: unknown;
  layout?: unknown;
}

/**
 * Turns the `brand` / `mode` / `layout` toolbar globals into the resolved theme.
 *
 * Lives here rather than in `preview.tsx` because the stories need it too: any
 * story that paints its own surface — `Button`'s `on-inverse` row, `Icon`'s
 * `OnSurfaces`, `LinkButton`'s `on-scene` — reads a colour out of
 * `themeSources[key]`, and the key is no longer one of the globals. It is the
 * *outcome* of the three, since the export has no combinations.
 *
 * @param globals - The story context's `globals`.
 * @returns The key to read tokens with, the axes in effect, and `isExact`.
 *
 * @example
 * ```tsx
 * render: (args, { globals }) => {
 *   const { key } = themeFromGlobals(globals);
 *   return <div style={{ background: readThemeToken(themeSources[key].color, token) }} />;
 * }
 * ```
 */
export const themeFromGlobals = (globals: IThemeGlobals): IResolvedTheme =>
  resolveTheme({
    brand: (globals.brand as TThemeBrand | undefined) ?? DEFAULT_THEME_BRAND,
    mode: (globals.mode as TThemeMode | undefined) ?? DEFAULT_THEME_MODE,
    layout: (globals.layout as TThemeLayout | undefined) ?? DEFAULT_THEME_LAYOUT,
  });
