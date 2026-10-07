import {
  DEFAULT_THEME_BRAND,
  DEFAULT_THEME_LAYOUT,
  DEFAULT_THEME_MODE,
  DEFAULT_THEME_PLATFORM,
  resolveTheme,
} from '@dsm/shared';
import type {
  IResolvedTheme,
  TThemeBrand,
  TThemeLayout,
  TThemeMode,
  TThemePlatform,
} from '@dsm/shared';

/**
 * The three theme globals the toolbar sets, as Storybook hands them over:
 * loosely typed, because a global is only ever `unknown` to a story.
 */
export interface IThemeGlobals {
  brand?: unknown;
  mode?: unknown;
  layout?: unknown;
  platform?: unknown;
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
    platform: (globals.platform as TThemePlatform | undefined) ?? DEFAULT_THEME_PLATFORM,
  });

/** Which implementation a story should render. Mirrors every bridge's own `TPlatform`. */
export type TImplementation = 'web' | 'native';

/**
 * Maps the `platform` global onto the implementation to render.
 *
 * The toolbar offers three values but there are only two implementations, and
 * the mapping is not a shortcut — it is the reason there is one dropdown and not
 * two. `@dsm/web` only runs in a browser, so `web` is the only platform it can
 * be asked for; both mobile platforms render `@dsm/mobile`, and which of the two
 * they mean is what `ThemedStory` hands to the mobile `BluProvider`.
 *
 * Stories call this instead of casting the global, which is what they used to do
 * back when the global *was* the implementation.
 */
export const implementationFor = (globals: IThemeGlobals): TImplementation =>
  globals.platform === 'ios' || globals.platform === 'android' ? 'native' : 'web';

/**
 * Whether a component's tokens actually differ between iOS and Android.
 *
 * **Derived, not declared.** The alternative was a hand-kept list of which
 * components are platform-sensitive, and a list like that is wrong the moment
 * someone forgets to update it. This reads the component's own token record —
 * the same object its hook indexes — so it cannot disagree with what renders.
 *
 * Compares the two mobile platforms rather than all three: the web/native split
 * is already visible, since picking `React` swaps the implementation. What needs
 * saying is when iOS and Android look identical, because there the menu changes
 * and the canvas does not.
 *
 * @param tokens - The component's per-theme record, e.g. `buttonTokens`.
 * @param theme - The resolved theme, for the brand/mode/layout to hold fixed.
 */
export const divergesByPlatform = (
  tokens: Record<string, unknown>,
  theme: IResolvedTheme,
): boolean => {
  const at = (platform: TThemePlatform): unknown =>
    tokens[`${theme.mode === DEFAULT_THEME_MODE && theme.brand !== DEFAULT_THEME_BRAND ? theme.brand : theme.mode}@${theme.layout}@${platform}`];
  return JSON.stringify(at('ios')) !== JSON.stringify(at('android'));
};
