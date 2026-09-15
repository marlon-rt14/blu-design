import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TChoiceItemSize, TChoiceItemState } from '../types/molecules/choiceItem.types';

/**
 * Composites an 8-digit `#rrggbbaa` overlay over an opaque `#rrggbb` base.
 *
 * The row's `hover` and `pressed` are overlay layers rather than colour swaps,
 * exactly like the Radio's. Verified to the channel against Figma's render of
 * all 40 variants: 6% over white gives `#f0f2f6` and 10% gives `#e5e8ef`, which
 * is what Figma paints. Neither exists as a token, so neither can be read.
 */
const compositeOverlay = (base: string, overlay: string): string => {
  const channel = (hex: string, at: number): number => parseInt(hex.slice(at, at + 2), 16);
  const alpha = overlay.length >= 9 ? channel(overlay, 7) / 255 : 1;
  const mix = (at: number): number =>
    Math.round(channel(base, at) * (1 - alpha) + channel(overlay, at) * alpha);

  return `#${[1, 3, 5].map((at) => mix(at).toString(16).padStart(2, '0')).join('')}`;
};

/** Colours of the row for one interaction state. */
export interface IChoiceItemStateColorTokens {
  /**
   * The row's surface.
   *
   * The same value whether the row is chosen or not, and untouched when
   * disabled — measured across all 40 Figma variants. Only `hover` and
   * `pressed` move it, and they do it by compositing an overlay.
   */
  background: string;
  label: string;
  description: string;
  trailing: string;
}

/** Every state, for one theme. */
export interface IChoiceItemColorTokens {
  state: Record<TChoiceItemState, IChoiceItemStateColorTokens>;
  /** The hairline under the row. */
  divider: string;
  /** The ring drawn over the whole row when focused. */
  borderFocus: string;
}

/** Metrics, per size where they vary. */
export interface IChoiceItemDimensionTokens {
  /** Row height: 48 (`size/target/min`) / 56 (`size/control/height/lg`). */
  minHeight: Record<TChoiceItemSize, number>;
  /**
   * Lateral inset: 8 / 12.
   *
   * Load-bearing beyond the row: a `RadioGroup` indents its legend by the same
   * amount so the two start in the same column.
   */
  paddingHorizontal: Record<TChoiceItemSize, number>;
  /** Vertical inset. `space/inset/xs` (4), the same at both sizes. */
  paddingVertical: number;
  /** Between the control and the content. `space/inline/sm` (8). */
  gap: number;
  /** Between the label and the description. `space/stack/xs` (4). */
  contentGap: number;
  /** Thickness of the hairline. `border/width/divider` (1). */
  dividerWidth: number;
  focusRingSpread: number;
  /** See `IButtonFocusTokens.offset` for the note on the 1-vs-2 discrepancy. */
  focusRingOffset: number;
}

/** Typography, per size where it varies. */
export interface IChoiceItemTypographyTokens {
  /** `text/body/{sm,md}/default` — 14 / 16. */
  label: { fontSize: Record<TChoiceItemSize, number>; fontWeight: string; lineHeightRatio: number };
  /** `text/caption/md/default` — 12 at both sizes. */
  description: { fontSize: number; fontWeight: string; lineHeightRatio: number };
  /** `text/body/sm/default` — 14 at both sizes. */
  trailing: { fontSize: number; fontWeight: string; lineHeightRatio: number };
}

/** Every token a ChoiceItem needs, resolved for a single theme. */
export interface IChoiceItemTokens {
  colors: IChoiceItemColorTokens;
  dimension: IChoiceItemDimensionTokens;
  typography: IChoiceItemTypographyTokens;
}

/** Baked into Figma's text styles, which are not variables and never export. */
const LINE_HEIGHT_RATIO = 1.5;

const readChoiceItemTokens = (key: TThemeSourceKey): IChoiceItemTokens => {
  const { color, dimension } = themeSources[key];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const at = (path: string): string => readThemeToken(color, `color.component.choiceitem.${path}`);
  const semanticAt = (path: string): string => readThemeToken(color, `color.color.${path}`);

  const surface = at('surface.bg-unselected');
  const label = { on: at('label.text-default'), off: at('label.text-disabled') };
  // `component/choiceitem/description/text-default` is the one co-token Figma
  // binds that the export does not carry. It aliases `color/text/secondary`,
  // verified equal in both themes, so this reads the alias — a hardcoded hex
  // would be wrong in dark mode. Swap it when the sync brings it.
  const description = { on: semanticAt('text.secondary'), off: at('description.text-disabled') };
  const trailing = { on: at('trailing.text-default'), off: at('trailing.text-disabled') };

  const active = { label: label.on, description: description.on, trailing: trailing.on };
  const quiet = { label: label.off, description: description.off, trailing: trailing.off };

  return {
    colors: {
      state: {
        default: { background: surface, ...active },
        hover: { background: compositeOverlay(surface, at('surface.overlay-hover')), ...active },
        pressed: { background: compositeOverlay(surface, at('surface.overlay-pressed')), ...active },
        // The surface does not move; the ring is the whole affordance.
        focus: { background: surface, ...active },
        // Nor here — only the text goes quiet. Measured, not assumed.
        disabled: { background: surface, ...quiet },
      },
      divider: at('divider.bg-default'),
      borderFocus: at('surface.border-focus'),
    },
    dimension: {
      minHeight: {
        sm: dimensionAt('size.target.min'),
        md: dimensionAt('size.control.height.lg'),
      },
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
      label: {
        fontSize: { sm: dimensionAt('font.size.body.sm'), md: dimensionAt('font.size.body.md') },
        fontWeight: String(dimensionAt('font.weight.regular')),
        lineHeightRatio: LINE_HEIGHT_RATIO,
      },
      description: {
        fontSize: dimensionAt('font.size.caption.md'),
        fontWeight: String(dimensionAt('font.weight.regular')),
        lineHeightRatio: LINE_HEIGHT_RATIO,
      },
      trailing: {
        fontSize: dimensionAt('font.size.body.sm'),
        fontWeight: String(dimensionAt('font.weight.regular')),
        lineHeightRatio: LINE_HEIGHT_RATIO,
      },
    },
  };
};

/**
 * ChoiceItem tokens, keyed by theme mode.
 *
 * Verified on 2026-09-02 by measuring Figma's render of all 40 variants at 2x:
 * the row surface is `#ffffff` in every state except hover and pressed, which
 * are the 6% and 10% overlays composited over it, and `selected` never moves it.
 *
 * Four co-tokens in the export are **left unread on purpose**:
 * `surface/bg-selected`, `indicator/bg-default`, `surface/overlay-selected` and
 * `surface/overlay-selected-hover`. bDS stopped using them on 2025-09-01 when
 * the selected tint and the indicator bar were removed, and kept them in
 * Foundations rather than deleting them. Consuming them would paint something
 * the design has retired.
 */
export const choiceItemTokens = fromThemeSources(readChoiceItemTokens);
