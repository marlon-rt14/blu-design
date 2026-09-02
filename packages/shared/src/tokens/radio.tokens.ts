import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TRadioSize } from '../types/atoms/radio.types';

/**
 * Composites an 8-digit `#rrggbbaa` overlay over an opaque `#rrggbb` base.
 *
 * bDS models the Radio's hover as an overlay layer rather than a colour swap:
 * `box/overlay-hover` is navy at 6% and it tints the border *and* the fill
 * together. Both surfaces underneath are opaque, so the result can be computed
 * once here instead of adding a translucent node to every platform.
 *
 * Exact, not approximate — verified against Figma's own render of the hover
 * variants: `#001e600f` over `#7c8396` gives `#757d93` and over `#ffffff` gives
 * `#f0f2f6`, which is what Figma paints to the pixel. Neither value exists as a
 * token, which is why they cannot simply be read.
 */
const compositeOverlay = (base: string, overlay: string): string => {
  const channel = (hex: string, at: number): number => parseInt(hex.slice(at, at + 2), 16);
  const alpha = overlay.length >= 9 ? channel(overlay, 7) / 255 : 1;
  const mix = (at: number): number =>
    Math.round(channel(base, at) * (1 - alpha) + channel(overlay, at) * alpha);

  return `#${[1, 3, 5].map((at) => mix(at).toString(16).padStart(2, '0')).join('')}`;
};

/** Colours of the box, the dot and the label for one interaction state. */
export interface IRadioStateColorTokens {
  /** Fill of the circle. */
  background: string;
  /** The 2px ring drawn *inside* the circle's edge. */
  border: string;
  /**
   * The inner dot, or `undefined` when the radio is unselected.
   *
   * Present but invisible when disabled and selected: bDS resolves
   * `dot/bg-disabled` to the same value as `box/bg-disabled`. Faithful to the
   * design, and a reported defect.
   */
  dot: string | undefined;
  label: string;
}

/** Every state, for one theme. Keyed by selection first because the two grids differ. */
export interface IRadioColorTokens {
  unselected: Record<'default' | 'hover' | 'pressed' | 'focus' | 'disabled', IRadioStateColorTokens>;
  selected: Record<'default' | 'hover' | 'pressed' | 'focus' | 'disabled', IRadioStateColorTokens>;
  /** The focus ring, shared with every other control. */
  borderFocus: string;
}

/** Metrics, per size where they vary. */
export interface IRadioDimensionTokens {
  /** Outer diameter of the circle: 16 / 24. */
  box: Record<TRadioSize, number>;
  /** Diameter of the dot: 8 / 12 — always exactly half the box. */
  dot: Record<TRadioSize, number>;
  /** `border/width/control-strong` (2), drawn inside the circle's edge. */
  borderWidth: number;
  /** Gap between the box and the label. `space/inline/sm` (8). */
  gap: number;
  /**
   * Minimum height of the row: 32 / 48.
   *
   * The whole row is the touch target, not just the circle — bDS states it
   * outright. At `md` this is `size/target/min` itself.
   */
  rowMinHeight: Record<TRadioSize, number>;
  focusRingSpread: number;
  /** See `IButtonFocusTokens.offset` for the note on the 1-vs-2 discrepancy. */
  focusRingOffset: number;
}

/** Label typography, per size. */
export interface IRadioTypographyTokens {
  fontSize: Record<TRadioSize, number>;
  fontWeight: string;
  /** The `body` text styles carry 1.5, and a text style never reaches the export. */
  lineHeightRatio: number;
}

/** Every token a Radio needs, resolved for a single theme. */
export interface IRadioTokens {
  colors: IRadioColorTokens;
  dimension: IRadioDimensionTokens;
  typography: IRadioTypographyTokens;
}

/** Baked into Figma's `body` text styles, which are not variables and never export. */
const LABEL_LINE_HEIGHT_RATIO = 1.5;

const readRadioTokens = (mode: TThemeMode): IRadioTokens => {
  const { color, dimension } = themeSources[mode];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const at = (path: string): string => readThemeToken(color, `color.component.radio.${path}`);

  const box = {
    bg: at('box.bg-default'),
    bgSelected: at('box.bg-selected'),
    bgDisabled: at('box.bg-disabled'),
    border: at('box.border-default'),
    borderSelected: at('box.border-selected'),
    borderDisabled: at('box.border-disabled'),
    // Named for hover, painted on **pressed** — that is what Figma renders, and
    // the naming is a reported defect. Hover uses the overlay instead.
    borderPressed: at('box.border-hover'),
    overlayHover: at('box.overlay-hover'),
  };
  const dot = {
    bg: at('dot.bg-default'),
    bgPressed: at('dot.bg-pressed'),
    bgDisabled: at('dot.bg-disabled'),
  };
  const label = { text: at('label.text-default'), disabled: at('label.text-disabled') };

  const hovered = (base: string): string => compositeOverlay(base, box.overlayHover);

  return {
    colors: {
      unselected: {
        default: { background: box.bg, border: box.border, dot: undefined, label: label.text },
        hover: {
          background: hovered(box.bg),
          border: hovered(box.border),
          dot: undefined,
          label: label.text,
        },
        pressed: {
          background: box.bg,
          border: box.borderPressed,
          dot: undefined,
          label: label.text,
        },
        // Identical to `default`: in Figma the focus variant renders exactly the
        // same, because the ring is clipped away by the circle's own clip path.
        // The ring this component actually draws is an outline, added below.
        focus: { background: box.bg, border: box.border, dot: undefined, label: label.text },
        disabled: {
          background: box.bgDisabled,
          border: box.borderDisabled,
          dot: undefined,
          label: label.disabled,
        },
      },
      selected: {
        default: {
          background: box.bgSelected,
          border: box.borderSelected,
          dot: dot.bg,
          label: label.text,
        },
        hover: {
          background: hovered(box.bgSelected),
          border: hovered(box.borderSelected),
          dot: dot.bg,
          label: label.text,
        },
        // Only the dot darkens; the box keeps its resting colours.
        pressed: {
          background: box.bgSelected,
          border: box.borderSelected,
          dot: dot.bgPressed,
          label: label.text,
        },
        focus: {
          background: box.bgSelected,
          border: box.borderSelected,
          dot: dot.bg,
          label: label.text,
        },
        // The dot is resolved but invisible — same value as the background.
        disabled: {
          background: box.bgDisabled,
          border: box.borderDisabled,
          dot: dot.bgDisabled,
          label: label.disabled,
        },
      },
      borderFocus: at('box.border-focus'),
    },
    dimension: {
      box: { sm: dimensionAt('size.icon.sm'), md: dimensionAt('size.icon.md') },
      dot: { sm: dimensionAt('size.icon.2xs'), md: dimensionAt('size.icon.xs') },
      borderWidth: dimensionAt('border.width.control-strong'),
      gap: dimensionAt('space.inline.sm'),
      rowMinHeight: {
        sm: dimensionAt('size.control.height.sm'),
        md: dimensionAt('size.target.min'),
      },
      focusRingSpread: dimensionAt('focus.ring.spread'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
    },
    typography: {
      fontSize: { sm: dimensionAt('font.size.body.sm'), md: dimensionAt('font.size.body.md') },
      fontWeight: String(dimensionAt('font.weight.regular')),
      lineHeightRatio: LABEL_LINE_HEIGHT_RATIO,
    },
  };
};

/**
 * Radio tokens, keyed by theme mode.
 *
 * Source: `color.component.radio.*` and `dimension.*`. Verified on 2026-09-01 by
 * measuring Figma's own render of all 20 variants at 4x — every colour, the
 * 2px inside border, the box at 24/16 and the dot at exactly half of it.
 *
 * Three defects found in that pass and reproduced rather than corrected:
 * - `focus` renders identically to `default`; the ring is clipped away.
 * - `box/border-hover` is painted on **pressed**, and hover uses the overlay.
 * - a disabled selected radio loses its dot.
 */
export const radioTokens: Record<TThemeMode, IRadioTokens> = {
  light: readRadioTokens('light'),
  dark: readRadioTokens('dark'),
};
