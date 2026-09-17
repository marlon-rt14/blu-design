import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TMenuSize } from '../types/molecules/menu.types';

/** Every color a row paints with — background is resolved by state in the hook, not pre-baked here. */
export interface IMenuItemColorTokens {
  bgDefault: string;
  /** Solid background of a selected row's resting state — shared with ChoiceItem/ChoiceBox. */
  bgSelected: string;
  /** Wash layered over `bgDefault` on hover. */
  overlayHover: string;
  /** Wash layered over `bgDefault` (or `bgSelected`) on press. */
  overlayPressed: string;
  /** Wash layered over `bgSelected` on hover — there is no separate combined token for selected+pressed; stack this with `overlayPressed`. */
  overlaySelected: string;
  borderFocus: string;
  label: string;
  labelDisabled: string;
  description: string;
  descriptionDisabled: string;
  trailing: string;
  trailingDisabled: string;
  iconDefault: string;
  iconDisabled: string;
  /** The selected-row check mark — fixed color, not derived from state. */
  iconBrand: string;
}

export interface IMenuColorTokens {
  surfaceBg: string;
  surfaceBorder: string;
  item: IMenuItemColorTokens;
  headerText: string;
  emptyText: string;
}

export interface IMenuSizeDimensionTokens {
  /** Row floor — `size/control/height/sm` (32) or `size/field/height/md` (44). Never a fixed height. */
  minHeight: number;
  paddingHorizontal: number;
  /** Shared by the label and the trailing text at this size. */
  labelFontSize: number;
}

export interface IMenuDimensionTokens {
  sizes: Record<TMenuSize, IMenuSizeDimensionTokens>;
  /** Vertical inset, the same at both sizes. `space/inset/xs` (4). */
  paddingVertical: number;
  /** Between the leading icon and the text column. `space/inline/sm` (8). */
  gap: number;
  /** Between the label and the description. `space/stack/xs` (4). */
  contentGap: number;
  /** `font/size/caption/md` (12), fixed regardless of size. */
  descriptionFontSize: number;
  fontWeight: string;
  /** `size/icon/sm` (16) — the only icon size Menu's own contract lists, fixed at both sizes. */
  iconSize: number;
  /** `radius/control/sm` (4) — shared by the panel's own corners and each row's hover/pressed/selected highlight. */
  borderRadius: number;
  borderWidth: number;
  focusRingSpread: number;
}

export interface IMenuTokens {
  colors: IMenuColorTokens;
  dimension: IMenuDimensionTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const LINE_HEIGHT_RATIO = 1.5;

const readMenuTokens = (key: TThemeSourceKey): IMenuTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.menu.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  return {
    colors: {
      surfaceBg: colorAt('surface.bg'),
      surfaceBorder: colorAt('surface.border'),
      item: {
        bgDefault: colorAt('item.bg-default'),
        bgSelected: colorAt('item.bg-selected'),
        overlayHover: colorAt('item.overlay-hover'),
        overlayPressed: colorAt('item.overlay-pressed'),
        overlaySelected: colorAt('item.overlay-selected'),
        borderFocus: colorAt('item.border-focus'),
        label: colorAt('item.label'),
        labelDisabled: colorAt('item.label-disabled'),
        description: colorAt('item.description'),
        descriptionDisabled: colorAt('item.description-disabled'),
        trailing: colorAt('item.trailing'),
        trailingDisabled: colorAt('item.trailing-disabled'),
        iconDefault: colorAt('item.icon-default'),
        iconDisabled: colorAt('item.icon-disabled'),
        iconBrand: colorAt('item.icon-brand'),
      },
      headerText: colorAt('header.text'),
      emptyText: colorAt('empty.text'),
    },
    dimension: {
      sizes: {
        sm: {
          minHeight: dimensionAt('size.control.height.sm'),
          paddingHorizontal: dimensionAt('space.inset.sm'),
          labelFontSize: dimensionAt('font.size.body.sm'),
        },
        md: {
          minHeight: dimensionAt('size.field.height.md'),
          paddingHorizontal: dimensionAt('space.inset.md'),
          labelFontSize: dimensionAt('font.size.body.md'),
        },
      },
      paddingVertical: dimensionAt('space.inset.xs'),
      gap: dimensionAt('space.inline.sm'),
      contentGap: dimensionAt('space.stack.xs'),
      descriptionFontSize: dimensionAt('font.size.caption.md'),
      fontWeight: String(dimensionAt('font.weight.regular')),
      iconSize: dimensionAt('size.icon.sm'),
      borderRadius: dimensionAt('radius.control.sm'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
    },
  };
};

/** Re-exported so consumers can format a line-height from a font size without hardcoding the ratio again. */
export const MENU_LINE_HEIGHT_RATIO = LINE_HEIGHT_RATIO;

export const menuTokens = fromThemeSources(readMenuTokens);
