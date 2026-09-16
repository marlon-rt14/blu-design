import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import {
  TOOLTIP_POINTER_DEPTH,
  TOOLTIP_POINTER_INSET,
  TOOLTIP_POINTER_LENGTH,
} from './tooltip.tokens';

/** Colour roles a Coachmark needs, resolved for one theme. */
export interface ICoachmarkColorTokens {
  /**
   * Panel fill — elevated / floating surface, **not** inverse.
   *
   * Light card with controls: *"claro = apareció solo y trae controles, oscuro =
   * lo pediste vos"* (Tooltip). Co-token aliases `canvas/surface/elevated`.
   */
  surface: string;
  border: string;
  title: string;
  body: string;
  /** Sunken fill behind the Image when `media="image"`. */
  media: string;
  /** Step index in the footer — `text/secondary`. */
  step: string;
  /** `.TipPointer` fill with `tone="floating"`. */
  pointer: string;
  /** `.TipPointer` stroke with `tone="floating"`. */
  pointerBorder: string;
  overlayShadowNear: string;
  overlayShadowFar: string;
}

/** Metrics of the card, gaps, tip reserve and elevation. */
export interface ICoachmarkDimensionTokens {
  /** Fixed card width. Figma copy *"Ancho 320 fijo"* — not a theme leaf. */
  width: number;
  padding: number;
  blockGap: number;
  inlineGap: number;
  borderWidth: number;
  borderRadius: number;
  /**
   * Tip reserve on the outer shell — `space/8`, **not** `space/inset/sm`
   * (which becomes 12 in expanded density and would detach the tip).
   */
  tipReserve: number;
  /** How far the tip sits inside the card — same as Tooltip / `.TipPointer`. */
  pointerInset: number;
  pointerLength: number;
  pointerDepth: number;
  /**
   * Tip base offset from the card corner on start/end alignments:
   * radius (16) + mitre (2) = 24. Figma copy, not a single leaf.
   */
  pointerEdgeInset: number;
  dismissSize: number;
  dismissIconSize: number;
  targetMin: number;
  mediaDismissInset: number;
  overlayShadowNearY: number;
  overlayShadowNearBlur: number;
  overlayShadowFarY: number;
  overlayShadowFarBlur: number;
  /**
   * Stacking — layout alias `z/popover` (1200). The set description says
   * "z/overlay (1200)" but the leaf that names Coachmark is `z.popover_1`.
   */
  zIndex: number;
  /**
   * Enter duration. Figma copy *"150 ms"*; no 150 leaf exists — closest
   * semantic duration is `motion/duration/fast` (100).
   */
  enterDurationMs: number;
}

export interface ICoachmarkTokens {
  colors: ICoachmarkColorTokens;
  dimension: ICoachmarkDimensionTokens;
  title: IThemeTypographyValue;
  body: IThemeTypographyValue;
  step: IThemeTypographyValue;
}

/**
 * Title↔body gap is **zero** — same Alert / Tooltip rule: the air lives inside
 * the line box. eBay puts 8; we do not.
 */
export const COACHMARK_TITLE_BODY_GAP = 0;

/**
 * Fixed card width. Searched `dimension.json` for 320 as a coachmark leaf —
 * none. Do not invent a path.
 */
export const COACHMARK_WIDTH_PX = 320;

/**
 * Tip base from the corner on start/end: `radius/surface/md` (16) + 2 mitre.
 * Documented on the live set; not a single token.
 */
export const COACHMARK_POINTER_EDGE_INSET_PX = 24;

const readCoachmarkTokens = (key: TThemeSourceKey): ICoachmarkTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const titleFontSize = dimensionAt('font.size.body.md');
  // Live node `137:18048` binds body to `text/body/sm/default` (14). The set
  // prose still says `text/body/md/default` — the node wins.
  const bodyFontSize = dimensionAt('font.size.body.sm');
  const stepFontSize = dimensionAt('font.size.label.sm');
  const lineHeightRatio = dimensionAt('font.line-height.normal') / 100;

  return {
    colors: {
      surface: colorAt('component.coachmark.surface.bg'),
      border: colorAt('component.coachmark.surface.border'),
      title: colorAt('component.coachmark.content.title'),
      body: colorAt('component.coachmark.content.body'),
      media: colorAt('component.coachmark.media.bg'),
      step: colorAt('component.coachmark.footer.step'),
      pointer: colorAt('component.tippointer.punta.bg-floating'),
      pointerBorder: colorAt('component.tippointer.punta.border-floating'),
      overlayShadowNear: colorAt('elevation.overlay.shadow.near'),
      overlayShadowFar: colorAt('elevation.overlay.shadow.far'),
    },
    dimension: {
      width: COACHMARK_WIDTH_PX,
      padding: dimensionAt('space.inset.lg'),
      blockGap: dimensionAt('space.stack.lg'),
      inlineGap: dimensionAt('space.inline.sm'),
      borderWidth: dimensionAt('border.width.default'),
      borderRadius: dimensionAt('radius.surface.md'),
      tipReserve: dimensionAt('space.8'),
      pointerInset: TOOLTIP_POINTER_INSET,
      pointerLength: TOOLTIP_POINTER_LENGTH,
      pointerDepth: TOOLTIP_POINTER_DEPTH,
      pointerEdgeInset: COACHMARK_POINTER_EDGE_INSET_PX,
      dismissSize: dimensionAt('size.control.height.xs'),
      dismissIconSize: dimensionAt('size.icon.sm'),
      targetMin: dimensionAt('size.target.min'),
      mediaDismissInset: dimensionAt('space.inset.sm'),
      overlayShadowNearY: dimensionAt('elevation.overlay.shadow.near-y'),
      overlayShadowNearBlur: dimensionAt('elevation.overlay.shadow.near-blur'),
      overlayShadowFarY: dimensionAt('elevation.overlay.shadow.far-y'),
      overlayShadowFarBlur: dimensionAt('elevation.overlay.shadow.far-blur'),
      zIndex: dimensionAt('z.popover_1'),
      enterDurationMs: dimensionAt('motion.duration.fast'),
    },
    // Live type: `text/body/md/strong` + `text/body/sm/default`.
    title: {
      fontWeight: String(dimensionAt('font.weight.extrabold')),
      fontSize: titleFontSize,
      lineHeight: titleFontSize * lineHeightRatio,
      fontFamily: baseFontFamily,
    },
    body: {
      fontWeight: String(dimensionAt('font.weight.regular')),
      fontSize: bodyFontSize,
      lineHeight: bodyFontSize * lineHeightRatio,
      fontFamily: baseFontFamily,
    },
    step: {
      fontWeight: String(dimensionAt('font.weight.regular')),
      fontSize: stepFontSize,
      lineHeight: stepFontSize * lineHeightRatio,
      fontFamily: baseFontFamily,
    },
  };
};

/**
 * Coachmark tokens per theme.
 *
 * Source: `color.component.coachmark.*`, `color.component.tippointer.punta.*`
 * (floating tone), `elevation.overlay`, and `dimension.*`. Nested Button /
 * IconButton / Image read their own tokens.
 */
export const coachmarkTokens = fromThemeSources(readCoachmarkTokens);
