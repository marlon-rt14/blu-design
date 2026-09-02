import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TRadioGroupSize } from '../types/molecules/radioGroup.types';

/** Colours of the legend and the helper. */
export interface IRadioGroupColorTokens {
  legend: string;
  helper: string;
  /** Only the helper turns red in the invalid state; the rows are untouched. */
  helperError: string;
}

/** Metrics, per size where they vary. */
export interface IRadioGroupDimensionTokens {
  /**
   * Lateral indent of the legend and the helper: 8 / 12.
   *
   * **Not the group's padding** — the group has none. This exists so the
   * legend's first letter lands in the same column as the row's control, which
   * carries the same inset itself.
   */
  textInset: Record<TRadioGroupSize, number>;
  /** Between the legend and the rows. `space/stack/sm` (8). */
  legendGap: number;
  /** Between the rows and the helper. `space/stack/xs` (4) — tighter than above. */
  helperGap: number;
}

/** Typography of the legend and the helper. */
export interface IRadioGroupTypographyTokens {
  /** `text/label/sm/strong` — 12 / 800, the same treatment as a field's label. */
  legend: { fontSize: number; fontWeight: string; lineHeightRatio: number; letterSpacing: number };
  /** `text/caption/md/default` — 12 / 400. Same size as the legend, far lighter. */
  helper: { fontSize: number; fontWeight: string; lineHeightRatio: number };
}

/** Every token a RadioGroup needs, resolved for a single theme. */
export interface IRadioGroupTokens {
  colors: IRadioGroupColorTokens;
  dimension: IRadioGroupDimensionTokens;
  typography: IRadioGroupTypographyTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const LEGEND_LINE_HEIGHT_RATIO = 1.35;
const HELPER_LINE_HEIGHT_RATIO = 1.5;
/**
 * Figma reports the legend's `letterSpacing` as `2`, meaning 2 **per cent**.
 * At 12px that is 0.24px, which is what the generated CSS shows as
 * `tracking-[0.24px]`. Same conversion as the PasswordField's label.
 */
const LEGEND_LETTER_SPACING_RATIO = 0.02;

const readRadioGroupTokens = (mode: TThemeMode): IRadioGroupTokens => {
  const { color, dimension } = themeSources[mode];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.radiogroup.${path}`);

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
 * RadioGroup tokens, keyed by theme mode.
 *
 * Source: `color.component.radiogroup.*`, which arrived in the sync of
 * 2026-09-02 (`83833e8`) together with the checkboxgroup, switchgroup and
 * listgroup groups.
 *
 * Verified against Figma's component set `631:5791` on 2026-09-02: the legend is
 * `text/label/sm/strong` indented by `space/inset/{sm,md}` with
 * `space/stack/sm` below it, and the helper is `text/caption/md/default` with
 * `space/stack/xs` above. The rows slot itself carries no gap — each row brings
 * its own height and vertical inset.
 */
export const radioGroupTokens: Record<TThemeMode, IRadioGroupTokens> = {
  light: readRadioGroupTokens('light'),
  dark: readRadioGroupTokens('dark'),
};
