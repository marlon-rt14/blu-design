import {
  DEFAULT_THEME_SOURCE_KEY,
  fromThemeSources,
  THEME_BRANDS,
  THEME_MODES,
  themeSources,
} from '../themeSource/themes';
import type { TThemeBrand, TThemeMode, TThemeSourceKey } from '../themeSource/themes';
import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { buttonBrandSteps } from './button.brandSteps';
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
   * Which step of the Icon scale the slots get: **always `sm` (16)**.
   *
   * One value and not a per-size record, because the glyph does not scale with
   * the control at all — the icon is 16 in a 24px `xs` button and in a 56px
   * `lg` one. Measured on the component set (`14:2002`) rather than assumed:
   * the four size variants, both variants and all five appearances, 18 nodes,
   * every one binds `size/icon/sm`.
   *
   * It stays stated here instead of read because bDS ships no token for "the
   * Button's icon step" — Figma expresses the choice by *which* `size/icon/*`
   * it binds, and that is a binding, not a value.
   *
   * Was `{ xs: 'sm', sm: 'sm', md: 'md', lg: 'md' }` until 2026-09-30, which
   * rendered `md` and `lg` 8px too big. The JSDoc justified it with a quote —
   * *"porque la escala no tiene un paso de 20"* — that appears in no export,
   * current or pre-sync, and in no Supernova page. `iconButton.tokens.ts`
   * still carries the same quote and has not been measured.
   */
  iconSize: TIconSize;
  /**
   * `radius/action` — **12 at every size**, not a pill.
   *
   * It used to be one: the token moved from `9999px` to `12px` in the sync of
   * 2026-08-25. Verified on 2026-09-01 that Figma binds `radius/action` = 12 on
   * the Button component set, so the value and the design agree and nothing here
   * had to change — it is read at render time.
   *
   * The token's own **description still says pill** (*"RADIO DE BOTON: pildora.
   * Se usa el centinela de pildora y NO un valor fijo"*), which contradicts its
   * value. Stale prose in the export, reported upstream; `radius/pill` (9999)
   * still exists for whatever genuinely needs it.
   */
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
  /**
   * Thickness of the blue ring. Measured against Figma's own render of
   * `variant=primary, appearance=fill, size=md, state=focus` at 4x on
   * 2026-09-01: exactly 3px of `color/border/focus`, matching this token.
   */
  spread: number;
  /**
   * Transparent gap between the control and the ring.
   *
   * **Discrepancy, unresolved.** The token says 1; Figma renders 2. Its own
   * description says *"1 desde el 14-ago (antes 2)"*, so either Figma was never
   * updated after that change or the token got ahead of it. Reported; the value
   * is read rather than hardcoded, so whichever way design settles it arrives
   * through the sync.
   *
   * The gap is *not painted*. Both platforms draw the ring with `outline`, whose
   * offset leaves whatever is behind showing through — a painted band would have
   * to guess the surface, and would show as a halo the moment the control sits
   * on a card, on `bg/inverse` or on a photo. That guessing is the flaw the
   * token's own description admits to.
   */
  offset: number;
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

const readButtonTokens = (key: TThemeSourceKey): IButtonTokens => {
  const { color, dimension } = themeSources[key];
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
      // A choice of which token to read rather than a token of its own — see
      // IButtonDimensionTokens.iconSize. Measured on all 18 nodes of the set.
      iconSize: 'sm',
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
      offset: dimensionAt('focus.ring.offset'),
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
export const buttonTokens = fromThemeSources(readButtonTokens);


/**
 * The three Button colours that carry the brand, crossed with the semantic.
 *
 * ### The problem this solves
 *
 * `brand` and `mode` both own `color.json` and the export ships one folder per
 * axis value, never the cross product, so `resolveTheme` has to drop one and it
 * drops the brand (see {@link TThemeSourceKey}). For most tokens that is a gap
 * nobody notices. For the Button's fill it is the brand itself: ask for
 * `discover` in `dark` and you got blu's blue.
 *
 * ### Why it can be solved here and not in the theme key
 *
 * These three reach a **brand primitive** that is addressable by path —
 * `color.<tone>.brand.<brand>.<step>` — and those primitives are identical in
 * all 18 exported folders (60 paths checked, zero differences). So the cross
 * needs no new folder.
 *
 * It could have been a wider theme key, and that was measured and rejected: 90
 * keys already cost **141 ms and 41 MB** to resolve at import, and
 * `brand@mode@layout@platform` is 270 of them. Paying 3x the startup of the
 * whole token layer to cross 3 tokens of 2199 is the wrong trade. This record is
 * 5 brands x 6 modes x 3 values — 90 reads.
 *
 * ### What it does not cover
 *
 * Only `variant: 'primary'` + `appearance: 'fill'`. Section `07` of the Figma
 * frame lists 13 brand-moved Button tokens; the other 10 point at numeric ramp
 * steps or at `static/*` and are out of scope by decision. And system-wide the
 * brand moves 193 colour tokens, 140 of which the semantic also moves — the
 * other components stay as they are until design annotates them the same way.
 *
 * Which step each semantic takes is **generated**, not written here — see
 * {@link buttonBrandSteps}.
 */
export interface IButtonBrandColors {
  /** `component/button/primary/bg-default` for this brand and semantic. */
  background: string;
  backgroundHover: string;
  backgroundPressed: string;
}

/** Field of {@link IButtonBrandColors} to the section-`07` row that feeds it. */
const BRAND_FIELD_TOKEN = {
  background: 'primary/bg-default',
  backgroundHover: 'primary/bg-hover',
  backgroundPressed: 'primary/bg-pressed',
} as const satisfies Record<keyof IButtonBrandColors, keyof typeof buttonBrandSteps>;

/**
 * Resolves one brand's three fills for one semantic.
 *
 * The step carries its own tone (`light/fill-hc`), so the primitive path is the
 * brand spliced into the middle of it.
 */
const readBrandColors = (brand: TThemeBrand, mode: TThemeMode): IButtonBrandColors => {
  const at = (field: keyof IButtonBrandColors): string => {
    const [tone, step] = buttonBrandSteps[BRAND_FIELD_TOKEN[field]][mode].split('/');
    return readThemeToken(
      themeSources[DEFAULT_THEME_SOURCE_KEY].color,
      `color.color.${tone}.brand.${brand}.${step}`,
    );
  };
  return {
    background: at('background'),
    backgroundHover: at('backgroundHover'),
    backgroundPressed: at('backgroundPressed'),
  };
};

/**
 * See {@link IButtonBrandColors}.
 *
 * Read from {@link DEFAULT_THEME_SOURCE_KEY} on purpose, not from the live key:
 * the brand primitives are folder-invariant, so reading them per theme would be
 * 90x the work for 90x the same answer.
 */
export const buttonBrandColors: Record<TThemeBrand, Record<TThemeMode, IButtonBrandColors>> =
  THEME_BRANDS.reduce(
    (byBrand, brand) => ({
      ...byBrand,
      [brand]: THEME_MODES.reduce(
        (byMode, mode) => ({ ...byMode, [mode]: readBrandColors(brand, mode) }),
        {} as Record<TThemeMode, IButtonBrandColors>,
      ),
    }),
    {} as Record<TThemeBrand, Record<TThemeMode, IButtonBrandColors>>,
  );
