import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TPopoverSize } from '../types/molecules/popover.types';
import { baseFontFamily } from './theme.tokens';

/**
 * Colour roles Popover needs, resolved for one theme.
 *
 * **Reused from Menu, not a `component.popover.*` group of its own** — the
 * dev contract is explicit: *"MISMOS TOKENS QUE EL MENU"*. Same reasoning
 * Coachmark already follows for `.TipPointer`'s tokens.
 */
export interface IPopoverColorTokens {
  surface: string;
  border: string;
  headerText: string;
  overlayShadowNear: string;
  overlayShadowFar: string;
}

export interface IPopoverSizeDimensionTokens {
  headerHeight: number;
  padding: number;
}

/** Metrics of the shell, gaps, and elevation. */
export interface IPopoverDimensionTokens {
  sizes: Record<TPopoverSize, IPopoverSizeDimensionTokens>;
  borderWidth: number;
  borderRadius: number;
  /** Between the header and the content, and around the dismiss button. */
  gap: number;
  overlayShadowNearY: number;
  overlayShadowNearBlur: number;
  overlayShadowFarY: number;
  overlayShadowFarBlur: number;
  /** Stacking — `z/popover`, the same leaf Coachmark already reads. */
  zIndex: number;
}

export interface IPopoverHeaderTypography {
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  lineHeight: number;
}

export interface IPopoverTokens {
  colors: IPopoverColorTokens;
  dimension: IPopoverDimensionTokens;
  header: IPopoverHeaderTypography;
}

const readPopoverTokens = (key: TThemeSourceKey): IPopoverTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  // Live type: `text/label/sm/strong` — same primitives TextField's own
  // floating label composes by hand, since this text style never landed as
  // a `type: "typography"` composite in the export.
  const headerFontSize = dimensionAt('font.size.label.sm');
  const headerLineHeightRatio = dimensionAt('font.line-height.snug') / 100;

  return {
    colors: {
      surface: colorAt('component.menu.surface.bg'),
      border: colorAt('component.menu.surface.border'),
      headerText: colorAt('component.menu.header.text'),
      overlayShadowNear: colorAt('elevation.overlay.shadow.near'),
      overlayShadowFar: colorAt('elevation.overlay.shadow.far'),
    },
    dimension: {
      sizes: {
        md: {
          headerHeight: dimensionAt('size.field.height.md'),
          padding: dimensionAt('space.inset.md'),
        },
        sm: {
          headerHeight: dimensionAt('size.control.height.sm'),
          padding: dimensionAt('space.inset.sm'),
        },
      },
      borderWidth: dimensionAt('border.width.default'),
      borderRadius: dimensionAt('radius.surface.md'),
      gap: dimensionAt('space.inset.xs'),
      overlayShadowNearY: dimensionAt('elevation.overlay.shadow.near-y'),
      overlayShadowNearBlur: dimensionAt('elevation.overlay.shadow.near-blur'),
      overlayShadowFarY: dimensionAt('elevation.overlay.shadow.far-y'),
      overlayShadowFarBlur: dimensionAt('elevation.overlay.shadow.far-blur'),
      zIndex: dimensionAt('z.popover_1'),
    },
    header: {
      fontFamily: baseFontFamily,
      fontWeight: String(dimensionAt('font.weight.extrabold')),
      fontSize: headerFontSize,
      lineHeight: headerFontSize * headerLineHeightRatio,
    },
  };
};

/**
 * Popover tokens per theme.
 *
 * Source: `color.component.menu.*` (surface + header — shared with Menu by
 * design), `elevation.overlay`, and `dimension.*`. The nested dismiss
 * `IconButton` reads its own tokens (`ghost`/`xs`, including `radius/pill`)
 * and is not duplicated here.
 */
export const popoverTokens = fromThemeSources(readPopoverTokens);
