import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TAccordionAppearance, TAccordionSize } from '../types/molecules/accordion.types';
import { baseFontFamily } from './theme.tokens';

/** Colours one appearance paints with. */
export interface IAccordionAppearanceColorTokens {
  title: string;
  titleDisabled: string;
  content: string;
  icon: string;
  iconDisabled: string;
  chevron: string;
  chevronDisabled: string;
  /** Wash layered over the header on hover — web only, there is no hover on touch. */
  overlayHover: string;
  overlayPressed: string;
  borderFocus: string;
  /** Between items — not drawn after the last one. */
  divider: string;
}

export interface IAccordionColorTokens {
  appearances: Record<TAccordionAppearance, IAccordionAppearanceColorTokens>;
}

export interface IAccordionDimensionTokens {
  headerMinHeight: Record<TAccordionSize, number>;
  headerPaddingX: number;
  headerPaddingY: number;
  /** Between the leading icon, the title, and the chevron. */
  headerGap: number;
  contentPaddingTop: number;
  contentPaddingBottom: number;
  iconSize: number;
  chevronSize: number;
  /** No dedicated `focus.ring.*` leaves for Accordion — reads the generic primitive, same as Switch/Tabs/Chip's flush ring. */
  focusRingSpread: number;
}

export interface IAccordionTokens {
  colors: IAccordionColorTokens;
  dimension: IAccordionDimensionTokens;
  /** `text/body/md/strong`. */
  title: IThemeTypographyValue;
  /** `text/body/md/default`. */
  content: IThemeTypographyValue;
}

const readAccordionTokens = (key: TThemeSourceKey): IAccordionTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const appearanceColors = (appearance: TAccordionAppearance): IAccordionAppearanceColorTokens => ({
    title: colorAt(`component.accordion.${appearance}.title`),
    titleDisabled: colorAt(`component.accordion.${appearance}.title-disabled`),
    content: colorAt(`component.accordion.${appearance}.content`),
    icon: colorAt(`component.accordion.${appearance}.icon`),
    iconDisabled: colorAt(`component.accordion.${appearance}.icon-disabled`),
    chevron: colorAt(`component.accordion.${appearance}.chevron`),
    chevronDisabled: colorAt(`component.accordion.${appearance}.chevron-disabled`),
    overlayHover: colorAt(`component.accordion.${appearance}.overlay-hover`),
    overlayPressed: colorAt(`component.accordion.${appearance}.overlay-pressed`),
    borderFocus: colorAt(`component.accordion.${appearance}.border-focus`),
    divider: colorAt(`component.accordion.${appearance}.divider`),
  });

  const composedTypographyAt = (weightPath: string): IThemeTypographyValue => {
    const fontSize = dimensionAt('font.size.body.md');
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.normal') / 100),
      fontFamily: baseFontFamily,
    };
  };

  return {
    colors: {
      appearances: {
        default: appearanceColors('default'),
        'on-scene': appearanceColors('on-scene'),
        'on-inverse': appearanceColors('on-inverse'),
      },
    },
    dimension: {
      headerMinHeight: {
        sm: dimensionAt('component.accordion.header.min-height.sm'),
        lg: dimensionAt('component.accordion.header.min-height.lg'),
      },
      headerPaddingX: dimensionAt('component.accordion.header.padding-x'),
      headerPaddingY: dimensionAt('component.accordion.header.padding-y'),
      headerGap: dimensionAt('component.accordion.header.gap'),
      contentPaddingTop: dimensionAt('component.accordion.content.padding-top'),
      contentPaddingBottom: dimensionAt('component.accordion.content.padding-bottom'),
      iconSize: dimensionAt('component.accordion.icon.size'),
      chevronSize: dimensionAt('component.accordion.chevron.size'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
    title: composedTypographyAt('font.weight.extrabold'),
    content: composedTypographyAt('font.weight.regular'),
  };
};

/**
 * Accordion tokens per theme.
 *
 * Source: `color.component.accordion.*` (11 leaves × 3 appearances) and
 * `dimension.component.accordion.*` (9 leaves), all new with this
 * component. No nested component reads its own tokens — the chevron is a
 * fixed glyph coloured from this file, not a separate IconButton/Icon
 * token read.
 */
export const accordionTokens = fromThemeSources(readAccordionTokens);
