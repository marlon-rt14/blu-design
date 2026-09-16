import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TChipSize } from '../types/atoms/chip.types';

/** One state's paint — every combination the component actually renders resolves to one of these. */
export interface IChipStateColorTokens {
  background: string;
  border: string;
  /** Translucent wash layered over `background`, not a solid swap — same pattern as TextField's hover. */
  overlay: string | undefined;
}

export interface IChipColorTokens {
  unselected: IChipStateColorTokens;
  unselectedHover: IChipStateColorTokens;
  unselectedPressed: IChipStateColorTokens;
  unselectedDisabled: IChipStateColorTokens;
  selected: IChipStateColorTokens;
  selectedHover: IChipStateColorTokens;
  selectedPressed: IChipStateColorTokens;
  selectedDisabled: IChipStateColorTokens;
  /** Ring painted on top of any of the above when focus-visible — never a border recolor. */
  borderFocus: string;
  labelDefault: string;
  labelSelected: string;
  labelDisabled: string;
  iconDefault: string;
  iconSelected: string;
  iconDisabled: string;
}

export interface IChipSizeDimensionTokens {
  /** Fixed height — 32 / 24 — not a floor: a Chip never wraps to more than one line. */
  height: number;
  paddingHorizontal: number;
  fontSize: number;
}

export interface IChipDimensionTokens {
  sizes: Record<TChipSize, IChipSizeDimensionTokens>;
  /** Between the leading icon, the label and the remove glyph. `space/inline/xs` (4). */
  gap: number;
  /** `radius/pill` — a Chip is fully rounded, unlike Tag's squared `radius/control/sm`. */
  borderRadius: number;
  /** `border/width/default` (1) — a Chip always shows a border, selected or not. */
  borderWidth: number;
  /** `focus/ring/spread` — a flush ring, no offset gap (Chip's own contract lists no offset token). */
  focusRingSpread: number;
  fontWeight: string;
}

export interface IChipTokens {
  colors: IChipColorTokens;
  dimension: IChipDimensionTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const LINE_HEIGHT_RATIO = 1.5;

const readChipTokens = (key: TThemeSourceKey): IChipTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.chip.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const borderDefault = colorAt('surface.border-default');
  const bgDefault = colorAt('surface.bg-default');
  const bgSelected = colorAt('surface.bg-selected');
  const bgDisabled = colorAt('surface.bg-disabled');

  return {
    colors: {
      unselected: { background: bgDefault, border: borderDefault, overlay: undefined },
      unselectedHover: { background: bgDefault, border: borderDefault, overlay: colorAt('surface.overlay-hover') },
      unselectedPressed: { background: bgDefault, border: borderDefault, overlay: colorAt('surface.overlay-pressed') },
      unselectedDisabled: { background: bgDisabled, border: colorAt('surface.border-disabled'), overlay: undefined },
      selected: { background: bgSelected, border: colorAt('surface.border-selected'), overlay: undefined },
      selectedHover: { background: bgSelected, border: colorAt('surface.border-selected'), overlay: colorAt('surface.overlay-selected-hover') },
      selectedPressed: {
        background: colorAt('surface.bg-selected-pressed'),
        border: colorAt('surface.border-selected-pressed'),
        overlay: undefined,
      },
      selectedDisabled: { background: bgDisabled, border: colorAt('surface.border-selected-disabled'), overlay: undefined },
      borderFocus: colorAt('surface.border-focus'),
      labelDefault: colorAt('label.text-default'),
      labelSelected: colorAt('label.text-selected'),
      labelDisabled: colorAt('label.text-disabled'),
      iconDefault: colorAt('icon.icon-default'),
      iconSelected: colorAt('icon.icon-selected'),
      iconDisabled: colorAt('icon.icon-disabled'),
    },
    dimension: {
      sizes: {
        sm: {
          height: dimensionAt('size.control.height.sm'),
          paddingHorizontal: dimensionAt('space.inset.sm'),
          fontSize: dimensionAt('font.size.label.md'),
        },
        xs: {
          height: dimensionAt('size.control.height.xs'),
          paddingHorizontal: dimensionAt('space.inset.xs'),
          fontSize: dimensionAt('font.size.label.sm'),
        },
      },
      gap: dimensionAt('space.inline.xs'),
      borderRadius: dimensionAt('radius.pill'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      fontWeight: String(dimensionAt('font.weight.regular')),
    },
  };
};

/** Re-exported so consumers can format a line-height from `fontSize` without hardcoding the ratio again. */
export const CHIP_LINE_HEIGHT_RATIO = LINE_HEIGHT_RATIO;

export const chipTokens = fromThemeSources(readChipTokens);
