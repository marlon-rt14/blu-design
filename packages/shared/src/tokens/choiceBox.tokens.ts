import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';

export interface IChoiceBoxSurfaceColorTokens {
  background: string;
  backgroundSelected: string;
  backgroundDisabled: string;
  borderDefault: string;
  borderSelected: string;
  borderDisabled: string;
  borderFocus: string;
  overlayHover: string;
  overlayPressed: string;
}

export interface IChoiceBoxTextColorTokens {
  default: string;
  disabled: string;
}

export interface IChoiceBoxColorTokens {
  surface: IChoiceBoxSurfaceColorTokens;
  title: IChoiceBoxTextColorTokens;
  description: IChoiceBoxTextColorTokens;
  focusRingGap: string;
}

export interface IChoiceBoxDimensionTokens {
  paddingHorizontal: number;
  paddingVertical: number;
  /** Condensed padding for `variant='compact'`. */
  paddingCompact: number;
  borderRadius: number;
  /** Always-applied border width — stays constant so selection never shifts layout. */
  borderWidth: number;
  /** Extra inset ring width layered on top of `borderWidth` when selected. */
  selectionRingWidth: number;
  /** Vertical gap between title and description. */
  gap: number;
  /** Gap between the media/control row and the text block in `tile`. */
  blockGap: number;
  /** Horizontal gap between icon, content and control in `row` and `tile`. */
  gapInline: number;
  /** Minimum row height (`row` only) — tile and compact size to their content. */
  minHeight: number;
  focusRingOffset: number;
  focusRingSpread: number;
}

export interface IChoiceBoxTypographyTokens {
  title: IThemeTypographyValue;
  description: IThemeTypographyValue;
}

export interface IChoiceBoxTokens {
  colors: IChoiceBoxColorTokens;
  dimension: IChoiceBoxDimensionTokens;
  typography: IChoiceBoxTypographyTokens;
}

const readChoiceBoxTokens = (key: TThemeSourceKey): IChoiceBoxTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.choicebox.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const composedTypographyAt = (
    sizePath: string,
    weightPath: string,
    lineHeightRatioPath: string,
  ): IThemeTypographyValue => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt(lineHeightRatioPath) / 100),
      fontFamily: baseFontFamily,
    };
  };

  return {
    colors: {
      surface: {
        background: colorAt('surface.bg-unselected'),
        backgroundSelected: colorAt('surface.bg-selected'),
        backgroundDisabled: colorAt('surface.bg-disabled'),
        borderDefault: colorAt('surface.border-unselected'),
        borderSelected: colorAt('surface.border-selected'),
        borderDisabled: colorAt('surface.border-disabled'),
        borderFocus: colorAt('surface.border-focus'),
        overlayHover: colorAt('surface.overlay-hover'),
        overlayPressed: colorAt('surface.overlay-pressed'),
      },
      title: {
        default: colorAt('title.text-default'),
        disabled: colorAt('title.text-disabled'),
      },
      description: {
        default: readThemeToken(color, 'color.color.text.secondary'),
        disabled: colorAt('description.text-disabled'),
      },
      focusRingGap: readThemeToken(color, 'color.color.canvas.surface.primary'),
    },
    dimension: {
      paddingHorizontal: dimensionAt('space.inset.md'),
      paddingVertical: dimensionAt('space.inset.md'),
      paddingCompact: dimensionAt('space.inset.sm'),
      borderRadius: dimensionAt('radius.surface.sm'),
      borderWidth: dimensionAt('border.width.default'),
      selectionRingWidth: dimensionAt('border.width.indicator') - dimensionAt('border.width.default'),
      gap: dimensionAt('space.stack.xs'),
      blockGap: dimensionAt('space.stack.sm'),
      gapInline: dimensionAt('space.inline.sm'),
      minHeight: dimensionAt('size.target.min'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
    typography: {
      title: composedTypographyAt('font.size.title.md', 'font.weight.semibold', 'font.line-height.normal'),
      description: composedTypographyAt('font.size.body.sm', 'font.weight.regular', 'font.line-height.normal'),
    },
  };
};

export const choiceBoxTokens = fromThemeSources(readChoiceBoxTokens);
