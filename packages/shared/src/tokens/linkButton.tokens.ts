import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type {
  TLinkButtonAppearance,
  TLinkButtonSize,
} from '../types/atoms/linkButton.types';

/**
 * Colours for one appearance, across every state.
 *
 * Every field is present for all four appearances — unlike the Button, whose
 * appearances have genuinely different token sets, `color.component.linkbutton`
 * is a complete 4 × 6 grid. Read variant by variant out of the Figma component:
 * all 48 variants bind `component/linkbutton/<appearance>/<key>`, so this
 * consumes the component layer rather than the `color/text/link/*` semantics it
 * aliases.
 *
 * There is no background of any kind. `hover` and `pressed` change the *text*
 * colour, not a surface — a link has none to tint. That is the one place the
 * LinkButton departs from the rest of Core.
 */
export interface ILinkButtonAppearanceColorTokens {
  text: string;
  textHover: string;
  textPressed: string;
  textVisited: string;
  textDisabled: string;
  /**
   * Colour of the focus ring for this appearance.
   *
   * Per-appearance rather than a single `color/border/focus`, because the blue
   * ring does not read on an inverted surface or over a photo: `on-inverse` and
   * `on-scene` resolve to white.
   */
  borderFocus: string;
}

/** Every appearance's colours, for one theme. */
export type TLinkButtonColorTokens = Record<
  TLinkButtonAppearance,
  ILinkButtonAppearanceColorTokens
>;

/** Metrics for the link. */
export interface ILinkButtonDimensionTokens {
  /**
   * Height of the link, per size: 24 / 21.
   *
   * **Derived, not read from a token.** The component hugs its text, so the
   * height *is* the line box: `fontSize × lineHeightRatio`. Figma's variants
   * measure exactly 24 and 21, which is 16 × 1.5 and 14 × 1.5.
   */
  height: Record<TLinkButtonSize, number>;
  /** Gap between the label and an icon. `space/inline/xs` (4) — not the Button's `inline/sm` (8). */
  gap: number;
  /** Thickness of the focus ring, drawn outside the text box. */
  focusRingSpread: number;
  /**
   * Transparent gap between the control and the focus ring, from
   * `focus/ring/offset`.
   *
   * Both platforms draw the ring with `outline`, whose offset leaves whatever is
   * behind showing through. A painted gap would have to guess the surface and
   * would halo over a card, over `bg/inverse` or over a photo.
   *
   * The token says 1 and Figma renders 2 — see `IButtonFocusTokens.offset` for
   * the full note. Read rather than hardcoded, so design's answer arrives
   * through the sync.
   */
  focusRingOffset: number;
  /** `radius/control/sm` (4) — the ring's corner radius. The link itself has no radius. */
  focusRingRadius: number;
  /**
   * Minimum touch target. Both sizes fall well below it (24 and 21 against 48),
   * which is why `hitSlop` is not optional on a standalone LinkButton.
   */
  minTouchTarget: number;
}

/** Typography for the link. */
export interface ILinkButtonTypographyTokens {
  /**
   * `'600'` — a string, so it plugs straight into each platform's
   * `useFontFamily`, which needs it to pick a static font file on mobile.
   *
   * The component's written description says the link styles are **Bold**, but
   * all 48 Figma variants bind `font/weight/semibold` (600) and the text style
   * itself reads `style: SemiBold`. Reviewed on 2026-08-26: the bound variable
   * wins over the prose, since it is what the file actually renders. If design
   * confirms Bold was the intent, this becomes `font.weight.bold` (700) — one
   * line.
   */
  fontWeight: string;
  /** Label size per link size: 16 / 14, from `font/size/body/*`. */
  fontSize: Record<TLinkButtonSize, number>;
  /**
   * Line height as a **ratio**, not pixels.
   *
   * This has **no token**: 1.5 is baked into Figma's `text/link/*` text styles,
   * and a text style is not a variable, so it never reaches the export. It is
   * load-bearing rather than cosmetic — the component's height is the line box,
   * so getting this wrong makes the link the wrong height.
   *
   * A ratio is also the one typography value the two platforms cannot share:
   * CSS `line-height: 1.5` is a multiplier, while React Native's `lineHeight`
   * is pixels. Each platform converts it; see `ILinkButtonDimensionTokens.height`.
   */
  lineHeightRatio: number;
}

/** Every token a LinkButton needs, resolved for a single theme. */
export interface ILinkButtonTokens {
  colors: TLinkButtonColorTokens;
  dimension: ILinkButtonDimensionTokens;
  typography: ILinkButtonTypographyTokens;
}

/**
 * The line-height ratio of Figma's `text/link/*` styles.
 *
 * Hard-coded because it is not a token — see
 * {@link ILinkButtonTypographyTokens.lineHeightRatio}.
 */
const LINK_LINE_HEIGHT_RATIO = 1.5;

const APPEARANCES: readonly TLinkButtonAppearance[] = [
  'default',
  'on-inverse',
  'on-muted',
  'on-scene',
];

const readLinkButtonTokens = (mode: TThemeMode): ILinkButtonTokens => {
  const { color, dimension } = themeSources[mode];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.linkbutton.${path}`);

  const readAppearance = (
    appearance: TLinkButtonAppearance,
  ): ILinkButtonAppearanceColorTokens => ({
    text: colorAt(`${appearance}.text-default`),
    textHover: colorAt(`${appearance}.text-hover`),
    textPressed: colorAt(`${appearance}.text-pressed`),
    textVisited: colorAt(`${appearance}.text-visited`),
    textDisabled: colorAt(`${appearance}.text-disabled`),
    borderFocus: colorAt(`${appearance}.border-focus`),
  });

  const fontSize: Record<TLinkButtonSize, number> = {
    md: dimensionAt('font.size.body.md'),
    sm: dimensionAt('font.size.body.sm'),
  };

  return {
    colors: Object.fromEntries(
      APPEARANCES.map((appearance) => [appearance, readAppearance(appearance)]),
    ) as TLinkButtonColorTokens,
    dimension: {
      height: {
        md: fontSize.md * LINK_LINE_HEIGHT_RATIO,
        sm: fontSize.sm * LINK_LINE_HEIGHT_RATIO,
      },
      gap: dimensionAt('space.inline.xs'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      focusRingRadius: dimensionAt('radius.control.sm'),
      minTouchTarget: dimensionAt('size.target.min'),
    },
    typography: {
      fontWeight: String(dimensionAt('font.weight.semibold')),
      fontSize,
      lineHeightRatio: LINK_LINE_HEIGHT_RATIO,
    },
  };
};

/**
 * LinkButton tokens, keyed by theme mode.
 *
 * Source: `color.component.linkbutton.*` and `dimension.*` in `theme/base`
 * (light) and `theme/dark`. Both platforms pick the right entry at render time
 * via `useThemeMode()`.
 *
 * 21 of the 24 colour tokens differ between the two themes. Notably `on-inverse`
 * *swaps* rather than shifts (`#9abaf2` ⇄ `#2760aa`), because the inverted
 * surface itself flips with the mode. And `on-scene` — which the written
 * description calls "the only one with a fixed colour, no mode" — is only fixed
 * in three of its six tokens: `text-default`, `text-disabled` and `border-focus`
 * hold across themes, while `text-hover`, `text-pressed` and `text-visited` do
 * not. The tokens win; reading per theme costs nothing here.
 */
export const linkButtonTokens: Record<TThemeMode, ILinkButtonTokens> = {
  light: readLinkButtonTokens('light'),
  dark: readLinkButtonTokens('dark'),
};
