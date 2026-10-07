import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';

export interface IEmptyStateColorTokens {
  title: string;
  body: string;
  /** `component.emptystate.icon` — `icon/secondary`. */
  icon: string;
}

export interface IEmptyStateDimensionTokens {
  /** `page` only — inline has no padding of its own, the block it sits in provides it. */
  padding: number;
  /** Graphic ↔ text block. */
  gapGraphic: number;
  /** Title ↔ body. */
  gapText: number;
  /** Text block ↔ the action group. */
  gapAction: number;
  /** Primary ↔ secondary action. */
  gapActions: number;
  iconSize: number;
  /** `page` only — the primary Button's floor width; `inline` hugs its label. */
  actionMinWidth: number;
}

export interface IEmptyStateTokens {
  colors: IEmptyStateColorTokens;
  dimension: IEmptyStateDimensionTokens;
  /** `text/title/lg` — `page` title. */
  titlePage: IThemeTypographyValue;
  /** `text/body/md/strong` — `inline` title. */
  titleInline: IThemeTypographyValue;
  /** `text/body/md/default` — `page` body. */
  bodyPage: IThemeTypographyValue;
  /** `text/body/sm/default` — `inline` body. */
  bodyInline: IThemeTypographyValue;
}

const readEmptyStateTokens = (key: TThemeSourceKey): IEmptyStateTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const composedTypographyAt = (sizePath: string, weightPath: string): IThemeTypographyValue => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt('font.line-height.normal') / 100),
      fontFamily: baseFontFamily,
    };
  };

  return {
    colors: {
      title: colorAt('component.emptystate.title'),
      body: colorAt('component.emptystate.body'),
      icon: colorAt('component.emptystate.icon'),
    },
    dimension: {
      padding: dimensionAt('component.emptystate.padding'),
      gapGraphic: dimensionAt('component.emptystate.gap.graphic'),
      gapText: dimensionAt('component.emptystate.gap.text'),
      gapAction: dimensionAt('component.emptystate.gap.action'),
      gapActions: dimensionAt('component.emptystate.gap.actions'),
      iconSize: dimensionAt('component.emptystate.icon.size'),
      actionMinWidth: dimensionAt('component.emptystate.action.min-width'),
    },
    titlePage: composedTypographyAt('font.size.title.lg', 'font.weight.extrabold'),
    titleInline: composedTypographyAt('font.size.body.md', 'font.weight.extrabold'),
    bodyPage: composedTypographyAt('font.size.body.md', 'font.weight.regular'),
    bodyInline: composedTypographyAt('font.size.body.sm', 'font.weight.regular'),
  };
};

/**
 * EmptyState tokens per theme.
 *
 * Source: `color.component.emptystate.*` and `dimension.component.emptystate.*`
 * (9 dedicated leaves), plus generic typography primitives. The nested
 * `Button` (`primary`, `fill`/`outline` derived from `layout`) and
 * `LinkButton` (`default`, `sm`) read their own tokens and are not
 * duplicated here.
 */
export const emptyStateTokens = fromThemeSources(readEmptyStateTokens);
