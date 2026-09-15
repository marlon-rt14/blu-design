import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TDividerAppearance } from '../types/atoms/divider.types';

/** Every token a Divider needs, resolved for a single theme. */
export interface IDividerTokens {
  /**
   * The line colour per appearance, from `component/divider/line/*`.
   *
   * The three are a real intensity ramp and they all move with the mode — in
   * `light` they run `#e5e8f1` / `#ced4e3` / `#7c8396`, and in `dark`
   * `#232c41` / `#616778` / `#7d8497`. **The brands do not touch them**: all four
   * brand folders carry light's values, which is consistent with the brand axis
   * only moving the groups that hold a brand colour.
   */
  line: Record<TDividerAppearance, string>;
  /**
   * Thickness of the line, from `border/width/divider`.
   *
   * **1 in light and dark, 2 in both high-contrast modes**, and read rather than
   * written because that is the whole point: in those modes the separation
   * cannot lean on tint, so a hardcoded 1 silently breaks them.
   *
   * It is the same token in both orientations — Figma binds it on the horizontal
   * and the vertical variants alike — so it is the height of a horizontal line
   * and the width of a vertical one.
   *
   * Not to be confused with `border/width/default`, which happens to hold the
   * same four values but is documented as *"grosor de borde de control"*. bDS's
   * own development page names `default` in one table and `divider` in another;
   * `divider` is the one the component actually binds, checked against all six
   * variants.
   */
  thickness: number;
}

const readDividerTokens = (key: TThemeSourceKey): IDividerTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);

  return {
    line: {
      subtle: colorAt('component.divider.line.subtle'),
      default: colorAt('component.divider.line.default'),
      strong: colorAt('component.divider.line.strong'),
    },
    thickness: readThemeDimension(dimension, 'dimension.border.width.divider'),
  };
};

/**
 * Divider tokens, keyed by theme.
 *
 * Four tokens in total, which is exactly what bDS declares the component
 * consumes: `border/width/divider` plus the three `component/divider/line/*`.
 * No typography — the Divider has no text of its own — and no state colours,
 * because it has no states.
 */
export const dividerTokens = fromThemeSources(readDividerTokens);
