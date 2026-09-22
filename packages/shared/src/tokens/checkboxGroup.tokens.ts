import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TCheckboxGroupSize } from '../types/molecules/checkboxGroup.types';

/** Colours of the legend and the helper. */
export interface ICheckboxGroupColorTokens {
  legend: string;
  helper: string;
  /** Only the helper turns red in the invalid state; the rows are untouched. */
  helperError: string;
}

/** Metrics, per size where they vary. */
export interface ICheckboxGroupDimensionTokens {
  /**
   * Lateral indent of the legend and the helper: 8 / 12.
   *
   * **Not the group's padding** — the group has none. This exists so the
   * legend's first letter lands in the same column as the row's control,
   * which carries the same inset itself.
   */
  textInset: Record<TCheckboxGroupSize, number>;
  /** Between the legend and the rows. `space/stack/sm` (8). */
  legendGap: number;
  /** Between the rows and the helper. `space/stack/xs` (4) — tighter than above. */
  helperGap: number;
}

/** Typography of the legend and the helper. */
export interface ICheckboxGroupTypographyTokens {
  /** `text/label/sm/strong` — 12 / 800, the same treatment as a field's label. */
  legend: { fontSize: number; fontWeight: string; lineHeightRatio: number; letterSpacing: number };
  /** `text/caption/md/default` — 12 / 400. Same size as the legend, far lighter. */
  helper: { fontSize: number; fontWeight: string; lineHeightRatio: number };
}

/** Every token a CheckboxGroup needs, resolved for a single theme. */
export interface ICheckboxGroupTokens {
  colors: ICheckboxGroupColorTokens;
  dimension: ICheckboxGroupDimensionTokens;
  typography: ICheckboxGroupTypographyTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const LEGEND_LINE_HEIGHT_RATIO = 1.35;
const HELPER_LINE_HEIGHT_RATIO = 1.5;
/**
 * Figma reports the legend's `letterSpacing` as `2`, meaning 2 **per cent**.
 * At 12px that is 0.24px. Same conversion as RadioGroup.
 */
const LEGEND_LETTER_SPACING_RATIO = 0.02;

const readCheckboxGroupTokens = (key: TThemeSourceKey): ICheckboxGroupTokens => {
  const { color, dimension } = themeSources[key];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.checkboxgroup.${path}`);

  const legendFontSize = dimensionAt('font.size.label.sm');

  return {
    // The group's own co-tokens. They alias `color/text/secondary` and
    // `color/text/danger`, so reading either gives the same value today — but
    // reading the co-token is the point: changing the group's role is then a
    // change in Foundations, without touching a line here.
    colors: {
      legend: colorAt('legend.text-default'),
      helper: colorAt('helper.text-default'),
      helperError: colorAt('helper.text-error'),
    },
    dimension: {
      textInset: { sm: dimensionAt('space.inset.sm'), md: dimensionAt('space.inset.md') },
      legendGap: dimensionAt('space.stack.sm'),
      helperGap: dimensionAt('space.stack.xs'),
    },
    typography: {
      legend: {
        fontSize: legendFontSize,
        fontWeight: String(dimensionAt('font.weight.extrabold')),
        lineHeightRatio: LEGEND_LINE_HEIGHT_RATIO,
        letterSpacing: legendFontSize * LEGEND_LETTER_SPACING_RATIO,
      },
      helper: {
        fontSize: dimensionAt('font.size.caption.md'),
        fontWeight: String(dimensionAt('font.weight.regular')),
        lineHeightRatio: HELPER_LINE_HEIGHT_RATIO,
      },
    },
  };
};

/**
 * CheckboxGroup tokens, keyed by theme.
 *
 * Source: `color.component.checkboxgroup.*`, which arrived in the sync of
 * 2026-09-02 (`83833e8`) together with the radiogroup, switchgroup and
 * listgroup groups.
 *
 * **Ported when the component was recovered.** It was written against the two
 * modes the theme system had then; the key is a `color@layout` pair now, and
 * `fromThemeSources` resolves all thirty. Nothing else about the file changed.
 *
 * Verified against Figma's component set `631:5792` on 2026-09-02: the legend
 * is `text/label/sm/strong` indented by `space/inset/{sm,md}` with
 * `space/stack/sm` below it, and the helper is `text/caption/md/default`
 * with `space/stack/xs` above. The rows slot itself carries no gap — each
 * row brings its own height and vertical inset.
 */
export const checkboxGroupTokens = fromThemeSources(readCheckboxGroupTokens);
