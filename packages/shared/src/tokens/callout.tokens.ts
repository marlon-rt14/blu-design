import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TCalloutPalette } from '../types/atoms/callout.types';
import { baseFontFamily } from './theme.tokens';

/** Colours one palette paints with — its own dedicated `component.callout.*` leaf, not shared with Alert. */
export interface ICalloutPaletteColorTokens {
  /** `component.callout.{palette}.bg` — the tenuous fill. Not `info/muted`: that is Alert's, and reusing it makes a Callout read as a system notice. */
  bg: string;
  title: string;
  body: string;
  /**
   * `component.callout.{palette}.icon`.
   *
   * **Genuinely different per palette, not a fixed `icon/primary` for both**
   * — measured in the synced export: `brand` resolves to a brand-tinted
   * blue (matching `component.linkbutton.on-muted.icon-default`), `neutral`
   * resolves to plain `icon/primary`. Read straight from this leaf rather
   * than hand-picking a role, which sidesteps the open question in the dev
   * contract's own §07 (still marked "abierta" there) about whether the
   * icon should alias the active brand vertical — whatever Supernova baked
   * into this leaf for a given palette/mode/brand is simply what renders.
   */
  icon: string;
}

export interface ICalloutColorTokens {
  palettes: Record<TCalloutPalette, ICalloutPaletteColorTokens>;
}

export interface ICalloutDimensionTokens {
  padding: number;
  /** Row gap — between the icon, the content column, and the dismiss button. */
  gap: number;
  borderRadius: number;
  iconSize: number;
  /** Gap above the action link, below the body. Same primitive Alert's own `page`/`section` placements use. */
  actionPaddingTop: number;
  dismissSize: number;
  targetMin: number;
}

export interface ICalloutTokens {
  colors: ICalloutColorTokens;
  dimension: ICalloutDimensionTokens;
  /** `text/body/md/strong`. Do not read `typography.component.callout` — see Alert's own tokens for why this composite never exports. */
  title: IThemeTypographyValue;
  /** `text/body/md/default`. */
  body: IThemeTypographyValue;
}

const readCalloutTokens = (key: TThemeSourceKey): ICalloutTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const composedTypographyAt = (weightPath: string): IThemeTypographyValue => {
    const fontSize = dimensionAt('font.size.body.md');
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.normal') / 100),
      fontFamily: baseFontFamily,
    };
  };

  const paletteColors = (palette: TCalloutPalette): ICalloutPaletteColorTokens => ({
    bg: colorAt(`component.callout.${palette}.bg`),
    title: colorAt(`component.callout.${palette}.title`),
    body: colorAt(`component.callout.${palette}.body`),
    icon: colorAt(`component.callout.${palette}.icon`),
  });

  return {
    colors: {
      palettes: {
        brand: paletteColors('brand'),
        neutral: paletteColors('neutral'),
      },
    },
    dimension: {
      padding: dimensionAt('component.callout.padding'),
      gap: dimensionAt('component.callout.gap'),
      borderRadius: dimensionAt('component.callout.radius'),
      iconSize: dimensionAt('component.callout.icon.size'),
      actionPaddingTop: dimensionAt('space.inset.sm'),
      dismissSize: dimensionAt('size.control.height.xs'),
      targetMin: dimensionAt('size.target.min'),
    },
    title: composedTypographyAt('font.weight.extrabold'),
    body: composedTypographyAt('font.weight.regular'),
  };
};

/**
 * Callout tokens per theme.
 *
 * Source: `color.component.callout.*` (its own group — not shared with
 * Alert, and not `info/muted`) and `dimension.component.callout.*`, both new
 * as of this component. The nested `LinkButton` (`on-muted`/`sm`) and
 * `IconButton` (`veil`/`xs`) read their own tokens and are not duplicated
 * here — `space.inline.sm`/`space.inline.xs` and `radius.pill` in the dev
 * contract's own token list belong to those, not to this file.
 */
export const calloutTokens = fromThemeSources(readCalloutTokens);
