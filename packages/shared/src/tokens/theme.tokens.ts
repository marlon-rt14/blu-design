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
 * The web typeface: **Mulish**.
 *
 * Reads `string.font.family.mulish`, the token that names that family, and not
 * `string.platform.font.family` — which it used to, and which broke on
 * 2026-09-28. That one is not "the design system's typeface": it is *the
 * typeface of whichever platform the export was generated for*, and the
 * Supernova run that day flipped `string.platform.variant` from `"Web"` to
 * `"iOS"`, so its value went from `"Mulish"` to `"SF Pro"` and all 32 web
 * components silently asked the browser for a font it does not have.
 *
 * Mobile does not come through here at all: it needs a face per weight
 * (`SFProText-Bold`), not a family name, so it maps `Platform.OS` to a face in
 * `@dsm/mobile`'s `theme/font.ts`.
 *
 * Carries no theme variance — read once from the default key.
 */
export const baseFontFamily: string = readThemeToken(
  themeSources[DEFAULT_THEME_SOURCE_KEY].string,
  'string.font.family.mulish',
);
