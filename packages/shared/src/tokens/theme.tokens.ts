import { readThemeToken } from '../themeSource/tokenPath';
import { DEFAULT_THEME_SOURCE_KEY, fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';

/** Page-level surface colors — the canvas both providers paint behind every component. */
export interface IPageColorTokens {
  background: string;
  text: string;
}

const readPageColors = (key: TThemeSourceKey): IPageColorTokens => {
  const { color } = themeSources[key];
  return {
    background: readThemeToken(color, 'color.color.canvas.background.page'),
    text: readThemeToken(color, 'color.color.text.primary'),
  };
};

/**
 * Page-level tokens, keyed by theme mode.
 *
 * `BluProvider` on both platforms paints its root surface from this — see
 * `packages/web/src/BluProvider.tsx` and `packages/mobile/src/BluProvider.tsx`.
 */
export const pageColorTokens = fromThemeSources(readPageColors);

/**
 * The design system's brand typeface, e.g. `"Mulish"`.
 *
 * Carries no theme variance — read once from `light`. Each platform resolves
 * this into an actual loadable font differently: see `useFontFamily` in
 * `@dsm/web`'s and `@dsm/mobile`'s `theme/` modules.
 */
export const baseFontFamily: string = readThemeToken(
  themeSources[DEFAULT_THEME_SOURCE_KEY].string,
  'string.platform.font.family',
);
