import { readThemeDimension } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';

/**
 * Metrics the ButtonGroup itself owns.
 *
 * Nested Buttons resolve their own tokens. Dev lists 18 leaves that include
 * Button colours / type from the documentation instances — those do not travel
 * with the group (Dev: *"no configura botones, los acomoda"*).
 */
export interface IButtonGroupDimensionTokens {
  /** Horizontal gap — `space/inline/md` (12). Live node `981:63842`. */
  gapInline: number;
  /** Vertical gap — `space/stack/md` (12). Live node `981:63843`. */
  gapStack: number;
}

export interface IButtonGroupTokens {
  dimension: IButtonGroupDimensionTokens;
}

const readButtonGroupTokens = (mode: TThemeMode): IButtonGroupTokens => {
  const { dimension } = themeSources[mode];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  return {
    dimension: {
      gapInline: dimensionAt('space.inline.md'),
      gapStack: dimensionAt('space.stack.md'),
    },
  };
};

/**
 * ButtonGroup tokens per theme.
 *
 * Source: `dimension.space.inline.md` (row) and `dimension.space.stack.md`
 * (column). Same numeric value today; separate leaves so density can diverge.
 */
export const buttonGroupTokens: Record<TThemeMode, IButtonGroupTokens> = {
  light: readButtonGroupTokens('light'),
  dark: readButtonGroupTokens('dark'),
};
