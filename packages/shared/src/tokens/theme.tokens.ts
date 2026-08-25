import { readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';

/** Page-level surface colors — the canvas both providers paint behind every component. */
export interface IPageColorTokens {
  background: string;
  text: string;
}

const readPageColors = (mode: TThemeMode): IPageColorTokens => {
  const { color } = themeSources[mode];
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
export const pageColorTokens: Record<TThemeMode, IPageColorTokens> = {
  light: readPageColors('light'),
  dark: readPageColors('dark'),
};

/**
 * The design system's brand typeface, e.g. `"Mulish"`.
 *
 * Carries no theme variance — read once from `light`. Each platform resolves
 * this into an actual loadable font differently: see `useFontFamily` in
 * `@dsm/web`'s and `@dsm/mobile`'s `theme/` modules.
 */
export const baseFontFamily: string = readThemeToken(
  themeSources.light.string,
  'string.platform.font.family',
);
