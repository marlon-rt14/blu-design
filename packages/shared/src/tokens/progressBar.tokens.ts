import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TProgressBarSize, TProgressStatus } from '../types/atoms/progressBar.types';

/** Colours of the track, the five fills and the two header texts. */
export interface IProgressBarColorTokens {
  /**
   * The rail behind the fill, `component/progressbar/track/bg`.
   *
   * bDS promises it separates from `page`, `surface` and `raised` by at least
   * **1.24**, which is why it is a co-token and not a border colour: it has to
   * be visible on three different backgrounds without a line.
   */
  track: string;
  /**
   * The fill, one per status. All five clear **3:1 against the track in the
   * four modes**, which is what lets the bar mean something at a glance.
   */
  fill: Record<TProgressStatus, string>;
  /** `text/body/sm/default` colour — what is progressing. */
  label: string;
  /** `text/body/sm/strong` colour — the percentage. */
  value: string;
}

/** Metrics. */
export interface IProgressBarDimensionTokens {
  /**
   * Height of the track per size: **12 · 8 · 4**.
   *
   * **Not a co-token, and bDS says why**: `size/bar/height/sm` is shared with
   * the PasswordStrength meter, so it is a shared role rather than a private
   * measurement — *"los co-tokens de medida existen solo donde hay un único
   * consumidor"*. A Slider or a Meter would join the same three.
   *
   * The layout axis does not move them: 4/8/12 in `compact` and in `expanded`
   * alike, measured.
   */
  height: Record<TProgressBarSize, number>;
  /** `radius/pill` (9999), on the track and on the fill. */
  borderRadius: number;
  /** Between the header and the bar, `space/stack/xs` (4). */
  headerGap: number;
  /** Between the label and the percentage, `space/inline/sm` (8). */
  headerSpacing: number;
}

/** One resolved text style. */
export interface IProgressBarTextStyleTokens {
  fontSize: number;
  fontWeight: string;
  lineHeightRatio: number;
}

/** Typography of the two header texts. */
export interface IProgressBarTypographyTokens {
  /** `text/body/sm/default` — 14 / 400. */
  label: IProgressBarTextStyleTokens;
  /** `text/body/sm/strong` — 14 / 800. */
  value: IProgressBarTextStyleTokens;
}

/** How the fill moves when the value changes. */
export interface IProgressBarMotionTokens {
  /** `motion/duration/normal` (200 ms). */
  duration: number;
  /** `motion/easing/standard` — *"para cambios dentro de la pantalla"*. */
  easing: string;
}

/** Every token a ProgressBar needs, resolved for a single theme. */
export interface IProgressBarTokens {
  colors: IProgressBarColorTokens;
  dimension: IProgressBarDimensionTokens;
  typography: IProgressBarTypographyTokens;
  motion: IProgressBarMotionTokens;
  fontFamily: string;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const BODY_LINE_HEIGHT_RATIO = 1.5;

const readProgressBarTokens = (key: TThemeSourceKey): IProgressBarTokens => {
  const { color, dimension, string } = themeSources[key];
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.progressbar.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const fontSize = dimensionAt('font.size.body.sm');

  return {
    colors: {
      track: colorAt('track.bg'),
      fill: {
        brand: colorAt('fill.brand'),
        accent: colorAt('fill.accent'),
        success: colorAt('fill.success'),
        warning: colorAt('fill.warning'),
        danger: colorAt('fill.danger'),
      },
      label: colorAt('header.label'),
      value: colorAt('header.value'),
    },
    dimension: {
      height: {
        sm: dimensionAt('size.bar.height.sm'),
        md: dimensionAt('size.bar.height.md'),
        lg: dimensionAt('size.bar.height.lg'),
      },
      borderRadius: dimensionAt('radius.pill'),
      headerGap: dimensionAt('space.stack.xs'),
      headerSpacing: dimensionAt('space.inline.sm'),
    },
    typography: {
      label: {
        fontSize,
        fontWeight: String(dimensionAt('font.weight.regular')),
        lineHeightRatio: BODY_LINE_HEIGHT_RATIO,
      },
      value: {
        fontSize,
        fontWeight: String(dimensionAt('font.weight.extrabold')),
        lineHeightRatio: BODY_LINE_HEIGHT_RATIO,
      },
    },
    motion: {
      duration: dimensionAt('motion.duration.normal'),
      easing: readThemeToken(string, 'string.motion.easing.standard'),
    },
    fontFamily: readThemeToken(string, 'string.platform.font.family'),
  };
};

/**
 * ProgressBar tokens, keyed by theme.
 *
 * **Eight co-tokens and nothing raw**, which bDS states as an achievement
 * rather than a default: *"tokenizado completo. Cero valores crudos en las 75
 * variantes."* Five fills, the track and the two header texts.
 *
 * Two notes the file leaves for whoever reads the colours and finds them
 * suspiciously simple:
 *
 * - **The intermediate layer was collapsed on purpose.** `track/bg` and
 *   `fill/brand` used to go through `color/fill/bar/*`, a family that served
 *   only this component. Its per-mode calibration moved down into `track/bg`,
 *   `fill/brand` now points at `color/fill/brand/default` — it was an exact
 *   duplicate in all six modes — and the three tokens of that family were
 *   deleted, `color/fill/bar/veil` included, which had no consumer at all.
 *   **The resolved values did not move.**
 * - **The heights are not co-tokens**, and that is a rule rather than an
 *   oversight — see {@link IProgressBarDimensionTokens.height}.
 */
export const progressBarTokens = fromThemeSources(readProgressBarTokens);
