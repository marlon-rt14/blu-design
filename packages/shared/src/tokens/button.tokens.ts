import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TButtonAppearance, TButtonSize, TButtonVariant } from '../types/atoms/button.types';
import type { TIconSize } from '../types/atoms/icon.types';

/**
 * Colors for one `variant` + `appearance` pairing, across every state.
 *
 * A field is `undefined` when the appearance genuinely has no token for it, not
 * as a fallback — read variant by variant out of the bDS Figma component rather
 * than inferred from the token names. The gaps are the interesting part:
 *
 * - `background` is absent on `outline`, `ghost` and `on-inverse`: they are
 *   transparent at rest and only wash on hover and press.
 * - `border` is absent on everything except `outline`. `fill` and `soft` still
 *   get a `borderDisabled`, which is the only state in which they draw one at
 *   all — so a disabled Button goes from 0 to 1px of border.
 * - There is no `backgroundFocus` field because **no `bg-focus` token exists
 *   anywhere** in the export. Focus reuses `background`; the affordance is the
 *   ring, not a fill change.
 * - There is no hover or pressed label colour either, nor a `borderHover`. Every
 *   non-disabled state reuses `label` / `border`.
 */
export interface IButtonSurfaceColorTokens {
  /** Fill at rest. `undefined` when the appearance is transparent at rest. */
  background: string | undefined;
  /** Wash on hover. Translucent (`#RRGGBBAA`) on `outline`, `ghost` and `on-inverse`. */
  backgroundHover: string;
  /** Fill on press. Opaque even where `backgroundHover` is translucent. */
  backgroundPressed: string;
  backgroundDisabled: string | undefined;
  /** Border at rest. Only `outline` has one. */
  border: string | undefined;
  borderPressed: string | undefined;
  /** Present on `fill`, `soft` and `outline`; absent on `ghost` and `on-inverse`. */
  borderDisabled: string | undefined;
  label: string;
  labelDisabled: string;
}

/**
 * Every appearance of `variant: 'primary'`.
 *
 * `on-inverse` lives here and only here — see {@link IButtonColorTokens.danger}.
 */
export type TButtonPrimaryColorTokens = Record<TButtonAppearance, IButtonSurfaceColorTokens>;

/**
 * Every appearance of `variant: 'danger'`, which is every appearance except
 * `on-inverse`.
 */
export type TButtonDangerColorTokens = Record<
  Exclude<TButtonAppearance, 'on-inverse'>,
  IButtonSurfaceColorTokens
>;

/**
 * Button colors for one theme, keyed by variant then appearance.
 *
 * The asymmetry between the two variants is expressed in the type on purpose:
 * `danger` has no `on-inverse` entry because bDS ships no tokens for that pair,
 * so `tokens.colors.danger['on-inverse']` does not compile.
 */
export interface IButtonColorTokens {
  primary: TButtonPrimaryColorTokens;
  /** No `on-inverse`: a destructive action does not belong on an inverted, ephemeral surface. */
  danger: TButtonDangerColorTokens;
}

/**
 * Button metrics.
 *
 * `height` and `paddingHorizontal` are keyed by size; everything else is the
 * same at every size, which is why it is not.
 */
export interface IButtonDimensionTokens {
  /** Control height: 24 / 32 / 44 / 56. Shared with the form fields' ramp. */
  height: Record<TButtonSize, number>;
  /**
   * Horizontal padding.
   *
   * Keyed by size but **offset from it**: `xs` reads `space/inset/sm`, `sm`
   * reads `inset/md`, and so on. There is no rule connecting the two axes, so
   * this cannot be derived — reading `inset/xs` for `size='xs'` would be wrong
   * by one step.
   */
  paddingHorizontal: Record<TButtonSize, number>;
  /** Same at every size. */
  minWidth: number;
  /** Gap between the label and an icon. `space/inline/sm` (8). */
  gap: number;
  /**
   * Which step of the Icon scale a button of each size uses.
   *
   * **Does not scale 1:1 with the control**, and cannot be derived: `xs` and
   * `sm` both take `size/icon/sm` (16), `md` and `lg` both take `size/icon/md`
   * (24) — *"porque la escala no tiene un paso de 20"*. Four button sizes map
   * onto two icon sizes.
   */
  iconSize: Record<TButtonSize, TIconSize>;
  /** `radius/action` — fully rounded, so the Button is a pill at every size. */
  borderRadius: number;
  /** Only applied when the resolved state actually has a border colour. */
  borderWidth: number;
  /**
   * Minimum touch target. `size='xs'` (24) is less than half of it, which is why
   * `@dsm/mobile` expands `hitSlop` up to this for every size that falls short.
   */
  minTouchTarget: number;
}

/** The focus ring: a layer outside the container, not a change to its border. */
export interface IButtonFocusTokens {
  spread: number;
  color: string;
  /** The blue ring does not read on an inverted surface, so that one is white. */
  colorOnInverse: string;
}

/**
 * Button typography.
 *
 * Composed from `dimension.font.*` and `string.platform.font.family` rather than
 * read through `readThemeTypography`, because
 * `typography.component.button.typography.*` is **stale**: its keys are
 * `primary | secondary | link` — the axis bDS dropped on 2025-08-20 — all three
 * hold the same `"400 16px/20px Mulish"`, and Figma does not bind any of them.
 * The Figma component composes its label from `font/size/label/{sm,md,lg}`,
 * `font/weight/medium` and `font/family/text` instead, which is what this
 * mirrors.
 *
 * There is no `lineHeight`: Figma sets it as a raw `1.35`, not a variable, and
 * the container's fixed height centres the label anyway.
 */
export interface IButtonTypographyTokens {
  /**
   * `'500'` — a string, so it plugs straight into each platform's
   * `useFontFamily`, which needs it to pick a static font file on mobile.
   */
  fontWeight: string;
  /**
   * Label size per Button size: 12 / 12 / 14 / 16.
   *
   * Note `xs` and `sm` share `font/size/label/sm` — there is no
   * `font/size/label/xs` in the export.
   */
  fontSize: Record<TButtonSize, number>;
}

/** Every token a Button needs, resolved for a single theme. */
export interface IButtonTokens {
  colors: IButtonColorTokens;
  dimension: IButtonDimensionTokens;
  typography: IButtonTypographyTokens;
  focus: IButtonFocusTokens;
}

/**
 * Which token group in `color.component.button.*` backs a given pairing.
 *
 * `outline` and `ghost` share the `-quiet` group and differ only in which keys
 * they read: ghost is exactly outline minus its three `border-*` keys.
 */
const groupFor = (variant: TButtonVariant, appearance: TButtonAppearance): string => {
  if (appearance === 'on-inverse') {
    return 'primary-on-inverse';
  }
  if (appearance === 'fill') {
    return variant;
  }
  if (appearance === 'soft') {
    return `${variant}-soft`;
  }
  return `${variant}-quiet`;
};

const readSurface = (
  colorTree: unknown,
  variant: TButtonVariant,
  appearance: TButtonAppearance,
): IButtonSurfaceColorTokens => {
  const group = groupFor(variant, appearance);
  const at = (key: string): string =>
    readThemeToken(colorTree, `color.component.button.${group}.${key}`);
  const isSolid = appearance === 'fill' || appearance === 'soft';
  const isOutlined = appearance === 'outline';

  return {
    background: isSolid ? at('bg-default') : undefined,
    backgroundHover: at('bg-hover'),
    backgroundPressed: at('bg-pressed'),
    backgroundDisabled: isSolid ? at('bg-disabled') : undefined,
    border: isOutlined ? at('border-default') : undefined,
    borderPressed: isOutlined ? at('border-pressed') : undefined,
    borderDisabled: isSolid || isOutlined ? at('border-disabled') : undefined,
    label: at('text-default'),
    labelDisabled: at('text-disabled'),
  };
};

const readButtonTokens = (mode: TThemeMode): IButtonTokens => {
  const { color, dimension } = themeSources[mode];
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const surface = (variant: TButtonVariant, appearance: TButtonAppearance): IButtonSurfaceColorTokens =>
    readSurface(color, variant, appearance);

  return {
    colors: {
      primary: {
        fill: surface('primary', 'fill'),
        soft: surface('primary', 'soft'),
        outline: surface('primary', 'outline'),
        ghost: surface('primary', 'ghost'),
        'on-inverse': surface('primary', 'on-inverse'),
      },
      danger: {
        fill: surface('danger', 'fill'),
        soft: surface('danger', 'soft'),
        outline: surface('danger', 'outline'),
        ghost: surface('danger', 'ghost'),
      },
    },
    dimension: {
      height: {
        xs: dimensionAt('size.control.height.xs'),
        sm: dimensionAt('size.control.height.sm'),
        md: dimensionAt('size.control.height.md'),
        lg: dimensionAt('size.control.height.lg'),
      },
      paddingHorizontal: {
        xs: dimensionAt('space.inset.sm'),
        sm: dimensionAt('space.inset.md'),
        md: dimensionAt('space.inset.lg'),
        lg: dimensionAt('space.inset.xl'),
      },
      minWidth: dimensionAt('size.control.min-width'),
      gap: dimensionAt('space.inline.sm'),
      // A mapping between two token scales rather than a token of its own, so
      // it is stated here instead of read: bDS defines it in prose only.
      iconSize: { xs: 'sm', sm: 'sm', md: 'md', lg: 'md' },
      borderRadius: dimensionAt('radius.action'),
      borderWidth: dimensionAt('border.width.default'),
      minTouchTarget: dimensionAt('size.target.min'),
    },
    typography: {
      fontWeight: String(dimensionAt('font.weight.medium')),
      fontSize: {
        xs: dimensionAt('font.size.label.sm'),
        sm: dimensionAt('font.size.label.sm'),
        md: dimensionAt('font.size.label.md'),
        lg: dimensionAt('font.size.label.lg'),
      },
    },
    focus: {
      spread: dimensionAt('focus.ring.spread'),
      color: readThemeToken(color, 'color.color.border.focus'),
      colorOnInverse: readThemeToken(color, 'color.color.border.focus.on-inverse'),
    },
  };
};

/**
 * Button tokens, keyed by theme mode.
 *
 * Source: `color.component.button.*`, `dimension.*` and `string.*` in
 * `theme/base` (light) and `theme/dark`. Both platforms pick the right entry at
 * render time via `useThemeMode()`.
 *
 * The mapping from Figma variant to token was read out of the Figma component
 * one cell at a time — 45 combinations of variant × appearance × state, plus the
 * four sizes — rather than inferred from token names. The behaviours that only
 * surface that way are documented on {@link IButtonSurfaceColorTokens} and
 * {@link IButtonDimensionTokens.paddingHorizontal}.
 */
export const buttonTokens: Record<TThemeMode, IButtonTokens> = {
  light: readButtonTokens('light'),
  dark: readButtonTokens('dark'),
};
