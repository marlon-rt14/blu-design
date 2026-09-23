import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';

/** Colours of the card and of the header. */
export interface IListGroupColorTokens {
  /**
   * The card's fill.
   *
   * **`component/card/surface/bg`, and that is measured, not assumed.** The dev
   * contract lists `component/listgroup/surface/bg`, which **does not exist in
   * the export** — there are co-token groups for `checkboxgroup`, `radiogroup`
   * and `switchgroup`, and none for `listgroup`. What the component binds in
   * Figma is the Card's, which is consistent with the description calling this
   * *"la tarjeta"*. Registered as a divergence.
   */
  surface: string;
  /** The section title. See {@link IListGroupTypographyTokens.header}. */
  header: string;
}

/** Metrics of the card and of the header. */
export interface IListGroupDimensionTokens {
  /** `radius/surface/md` (16). Measured on the component. */
  borderRadius: number;
  /**
   * Inset of the header, `space/inset/md` (12).
   *
   * **Not the group's padding** — the group has none, *"ese es margen de la
   * pantalla"*. It is the row's own text inset, so the title starts in the same
   * column as the rows' text. Same reasoning the CheckboxGroup writes down for
   * its legend.
   */
  headerInset: number;
}

/** Typography of the header. */
export interface IListGroupTypographyTokens {
  /**
   * `text/label/sm/strong` — 12 / 800, the treatment the sibling groups give
   * their legend.
   *
   * **Borrowed on purpose, and the only invented thing in this file.** The
   * header is in the dev contract's signature and **not in the Figma
   * component**, so there is nothing to measure: the file says outright
   * *"ninguno: el componente no tiene texto propio"*. Rather than invent a
   * size, this reads what a group's title already reads elsewhere — semantic
   * tokens, not another component's co-tokens. It changes the day Jetto draws
   * it.
   */
  header: { fontSize: number; fontWeight: string; lineHeightRatio: number; letterSpacing: number };
}

/** Every token a ListGroup needs, resolved for a single theme. */
export interface IListGroupTokens {
  colors: IListGroupColorTokens;
  dimension: IListGroupDimensionTokens;
  typography: IListGroupTypographyTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const HEADER_LINE_HEIGHT_RATIO = 1.35;
/** Figma reports the legend's `letterSpacing` as 2, meaning 2 **per cent**. */
const HEADER_LETTER_SPACING_RATIO = 0.02;

const readListGroupTokens = (key: TThemeSourceKey): IListGroupTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const headerFontSize = dimensionAt('font.size.label.sm');

  return {
    colors: {
      surface: colorAt('component.card.surface.bg'),
      // The semantic layer directly, because this component has no co-tokens at
      // all. The sibling groups' legends alias this same `text/secondary`.
      header: colorAt('color.text.secondary'),
    },
    dimension: {
      borderRadius: dimensionAt('radius.surface.md'),
      headerInset: dimensionAt('space.inset.md'),
    },
    typography: {
      header: {
        fontSize: headerFontSize,
        fontWeight: String(dimensionAt('font.weight.extrabold')),
        lineHeightRatio: HEADER_LINE_HEIGHT_RATIO,
        letterSpacing: headerFontSize * HEADER_LETTER_SPACING_RATIO,
      },
    },
  };
};

/**
 * ListGroup tokens, keyed by theme.
 *
 * **Four values, not the six the contract lists.** Measured by subtraction:
 * asking Figma for the variables of the whole component returns thirteen, and
 * asking for those of one `ListItem` inside returns eleven of them. What is
 * left — `radius/surface/md` and the surface — is the group's. The other four
 * the contract names (`size/control/height/lg`, `space/inline/sm`,
 * `space/inset/md`, `space/inset/xs`) belong to the rows, which bring them
 * themselves.
 *
 * `space/inset/md` appears on both sides of that subtraction and is read here
 * too, for the header — deliberately the row's own inset, so the two line up.
 */
export const listGroupTokens = fromThemeSources(readListGroupTokens);
