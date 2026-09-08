import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TListItemSize, TListItemState } from '../types/molecules/listItem.types';

/**
 * Composites an 8-digit `#rrggbbaa` overlay over an opaque `#rrggbb` base.
 *
 * Same technique as ChoiceItem's: `hover`/`pressed` are overlay layers over
 * the resting surface rather than distinct token colors.
 */
const compositeOverlay = (base: string, overlay: string): string => {
  const channel = (hex: string, at: number): number => parseInt(hex.slice(at, at + 2), 16);
  const alpha = overlay.length >= 9 ? channel(overlay, 7) / 255 : 1;
  const mix = (at: number): number =>
    Math.round(channel(base, at) * (1 - alpha) + channel(overlay, at) * alpha);

  return `#${[1, 3, 5].map((at) => mix(at).toString(16).padStart(2, '0')).join('')}`;
};

/** Colors of the row for one interaction state. */
export interface IListItemStateColorTokens {
  background: string;
  title: string;
  description: string;
  trailing: string;
  icon: string;
}

export interface IListItemColorTokens {
  state: Record<TListItemState, IListItemStateColorTokens>;
  /** The hairline under the row. */
  divider: string;
  /** The ring drawn over the whole row when focused. */
  borderFocus: string;
}

export interface IListItemDimensionTokens {
  /** Row floor: `size/target/min` (48), the same at both sizes — the row never has a fixed height. */
  minHeight: number;
  paddingHorizontal: Record<TListItemSize, number>;
  /** Vertical inset. `space/inset/xs` (4), the same at both sizes. */
  paddingVertical: number;
  /** Between the leading content and the text column. `space/inline/sm` (8). */
  gap: number;
  /** Between the title and the description. `space/stack/xs` (4). */
  contentGap: number;
  /** Thickness of the hairline. `border/width/divider` (1). */
  dividerWidth: number;
  focusRingSpread: number;
  focusRingOffset: number;
}

export interface IListItemTypographyTokens {
  /** `text/body/{sm,md}/default` — 14 / 16. */
  title: { fontSize: Record<TListItemSize, number>; fontWeight: string; lineHeightRatio: number };
  /** `text/caption/md/default` — 12 at both sizes. */
  description: { fontSize: number; fontWeight: string; lineHeightRatio: number };
  /**
   * `body/md/strong` — fixed at 16, semibold, regardless of `size`, so a
   * column of amounts lines up. Mulish's digits are already tabular-width in
   * every weight, so no extra font-feature CSS is needed to align them.
   */
  trailingText: { fontSize: number; fontWeight: string; lineHeightRatio: number };
}

export interface IListItemTokens {
  colors: IListItemColorTokens;
  dimension: IListItemDimensionTokens;
  typography: IListItemTypographyTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const LINE_HEIGHT_RATIO = 1.5;

const readListItemTokens = (mode: TThemeMode): IListItemTokens => {
  const { color, dimension } = themeSources[mode];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const at = (path: string): string => readThemeToken(color, `color.component.listitem.${path}`);

  const surface = at('surface.bg-default');
  const title = { on: at('content.title'), off: at('content.title-disabled') };
  const description = { on: at('content.description'), off: at('content.description-disabled') };
  const trailing = { on: at('content.trailing'), off: at('content.trailing-disabled') };
  const icon = { on: at('icon.icon-default'), off: at('icon.icon-disabled') };

  const active = { title: title.on, description: description.on, trailing: trailing.on, icon: icon.on };
  const quiet = { title: title.off, description: description.off, trailing: trailing.off, icon: icon.off };

  return {
    colors: {
      state: {
        default: { background: surface, ...active },
        hover: { background: compositeOverlay(surface, at('surface.overlay-hover')), ...active },
        pressed: { background: compositeOverlay(surface, at('surface.overlay-pressed')), ...active },
        focus: { background: surface, ...active },
        disabled: { background: at('surface.bg-disabled'), ...quiet },
      },
      divider: at('content.divider'),
      borderFocus: at('surface.border-focus'),
    },
    dimension: {
      minHeight: dimensionAt('size.target.min'),
      paddingHorizontal: {
        sm: dimensionAt('space.inset.sm'),
        md: dimensionAt('space.inset.md'),
      },
      paddingVertical: dimensionAt('space.inset.xs'),
      gap: dimensionAt('space.inline.sm'),
      contentGap: dimensionAt('space.stack.xs'),
      dividerWidth: dimensionAt('border.width.divider'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
    },
    typography: {
      title: {
        fontSize: { sm: dimensionAt('font.size.body.sm'), md: dimensionAt('font.size.body.md') },
        fontWeight: String(dimensionAt('font.weight.regular')),
        lineHeightRatio: LINE_HEIGHT_RATIO,
      },
      description: {
        fontSize: dimensionAt('font.size.caption.md'),
        fontWeight: String(dimensionAt('font.weight.regular')),
        lineHeightRatio: LINE_HEIGHT_RATIO,
      },
      trailingText: {
        fontSize: dimensionAt('font.size.body.md'),
        fontWeight: String(dimensionAt('font.weight.semibold')),
        lineHeightRatio: LINE_HEIGHT_RATIO,
      },
    },
  };
};

/**
 * ListItem tokens, keyed by theme mode.
 */
export const listItemTokens: Record<TThemeMode, IListItemTokens> = {
  light: readListItemTokens('light'),
  dark: readListItemTokens('dark'),
};
