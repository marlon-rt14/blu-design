import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import type { TIconSize } from '../types/atoms/icon.types';
import type { TIconButtonAppearance, TIconButtonSize } from '../types/atoms/iconButton.types';

/**
 * Every colour one appearance needs, across all five states.
 *
 * The optional members are the shape of the group, not laziness: the export
 * carries 44 co-tokens and they are not evenly spread. `ghost` and `on-inverse`
 * have no `bg-default` and no `bg-disabled` — they are transparent at rest and
 * stay transparent when disabled. Only `brand` and `neutral` have a
 * `border-disabled`.
 */
export interface IIconButtonAppearanceColorTokens {
  /** Fill at rest. `undefined` on `ghost` and `on-inverse`, which have none. */
  background?: string;
  backgroundHover: string;
  backgroundPressed: string;
  /**
   * Fill while disabled. `undefined` on `ghost` and `on-inverse`.
   *
   * On `veil`, `on-media` and `on-scene` it is **the same value as
   * `background`**, and that is deliberate: bDS calls it an exception to the
   * disabled rule, because there the veil *is* the silhouette that
   * `color/bg/disabled` would flatten. Only the glyph goes quiet.
   */
  backgroundDisabled?: string;
  icon: string;
  iconDisabled: string;
  /**
   * Border drawn only while disabled, and only on `brand` and `neutral`.
   *
   * The rule exists to give back the silhouette that a flat disabled fill
   * takes away. The veil-based appearances opt out of it for the reason above.
   */
  borderDisabled?: string;
  /**
   * Colour of the focus ring for this appearance.
   *
   * Four of the seven share `focus/border`; `on-inverse`, `on-scene` and
   * `on-media` each have their own. Focus is the same gesture everywhere and
   * does not change colour to suit a surface — these three exist because the
   * generic blue measured 1.82 against a light brand scene and 1.37 over light
   * media, both well under what WCAG 1.4.11 asks.
   */
  focusRing: string;
}

/** Metrics of the control, its glyph and its focus ring. */
export interface IIconButtonDimensionTokens {
  /** Edge of the control, square: 24 · 32 · 44 · 56. */
  size: Record<TIconButtonSize, number>;
  /**
   * Step of the glyph — **not** the control's own ramp, and a step name rather
   * than a number, because that is what `Icon` takes.
   *
   * Measured on all four variants: `xs` and `sm` both bind `size/icon/sm` (16),
   * `md` binds `size/icon/md` (24) and `lg` binds `size/icon/lg` (32). `xs`
   * skipping its own `size/icon/xs` (12) is the interesting one, and it is what
   * the file does — at 12 a glyph inside a control is a smudge.
   *
   * Note this ramp is **not** the Button's, which tops out at `md` for both
   * `md` and `lg` *"porque la escala no tiene un paso de 20"*. An icon-only
   * control can afford the bigger glyph, and at `lg` it takes it.
   */
  iconSize: Record<TIconButtonSize, TIconSize>;
  /**
   * `radius/pill` (9999), which is what makes the square a circle.
   *
   * **Not `radius/action`.** Supernova's written description says
   * `radius/action` turns it into a circle, but that token is 12 — on a 24px
   * control it is a rounded square, not a circle. `radius/pill` is what the
   * four sampled variants actually bind.
   */
  borderRadius: number;
  /** Width of the disabled border on `brand` and `neutral`. */
  borderWidth: number;
  focusRingSpread: number;
  focusRingOffset: number;
  /**
   * `size/target/min` (48), the touch target `xs` (24) and `sm` (32) fall short
   * of.
   *
   * bDS puts the area on the container's outer padding rather than on the
   * visual box. Mobile can honour that inside the component with `hitSlop`,
   * which grows the target without moving the layout; on web it stays with
   * whoever hosts the button.
   */
  targetMin: number;
}

/** Every token an IconButton needs, resolved for a single theme. */
export interface IIconButtonTokens {
  colors: Record<TIconButtonAppearance, IIconButtonAppearanceColorTokens>;
  dimension: IIconButtonDimensionTokens;
}

const readIconButtonTokens = (mode: TThemeMode): IIconButtonTokens => {
  const { color, dimension } = themeSources[mode];
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.iconbutton.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const focus = {
    generic: colorAt('focus.border'),
    onInverse: colorAt('focus.border-on-inverse'),
    onScene: colorAt('focus.border-on-scene'),
    onMedia: colorAt('focus.border-on-media'),
  };

  /** The five members every appearance has, plus its ring. */
  const common = (
    name: TIconButtonAppearance,
    focusRing: string,
  ): IIconButtonAppearanceColorTokens => ({
    backgroundHover: colorAt(`${name}.bg-hover`),
    backgroundPressed: colorAt(`${name}.bg-pressed`),
    icon: colorAt(`${name}.icon-default`),
    iconDisabled: colorAt(`${name}.icon-disabled`),
    focusRing,
  });

  /** `brand` and `neutral`: a fill at rest, and a border once disabled. */
  const filled = (name: 'brand' | 'neutral'): IIconButtonAppearanceColorTokens => ({
    ...common(name, focus.generic),
    background: colorAt(`${name}.bg-default`),
    backgroundDisabled: colorAt(`${name}.bg-disabled`),
    borderDisabled: colorAt(`${name}.border-disabled`),
  });

  /** `veil`, `on-media` and `on-scene`: the veil survives disabled, no border. */
  const veiled = (
    name: 'veil' | 'on-media' | 'on-scene',
    focusRing: string,
  ): IIconButtonAppearanceColorTokens => ({
    ...common(name, focusRing),
    background: colorAt(`${name}.bg-default`),
    backgroundDisabled: colorAt(`${name}.bg-disabled`),
  });

  return {
    colors: {
      brand: filled('brand'),
      neutral: filled('neutral'),
      // Transparent at rest and while disabled: only hover and pressed paint.
      ghost: common('ghost', focus.generic),
      'on-inverse': common('on-inverse', focus.onInverse),
      veil: veiled('veil', focus.generic),
      'on-scene': veiled('on-scene', focus.onScene),
      'on-media': veiled('on-media', focus.onMedia),
    },
    dimension: {
      size: {
        xs: dimensionAt('size.control.height.xs'),
        sm: dimensionAt('size.control.height.sm'),
        md: dimensionAt('size.control.height.md'),
        lg: dimensionAt('size.control.height.lg'),
      },
      // A mapping between two token scales rather than a token of its own, so
      // it is stated here instead of read — same as the Button. `xs` takes the
      // `sm` step on purpose; see `iconSize` above.
      iconSize: { xs: 'sm', sm: 'sm', md: 'md', lg: 'lg' },
      borderRadius: dimensionAt('radius.pill'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      targetMin: dimensionAt('size.target.min'),
    },
  };
};

/**
 * IconButton tokens, keyed by theme mode.
 *
 * Source: the 44 co-tokens of `color.component.iconbutton.*` — all of them are
 * read — plus `dimension.*`. The mapping was read out of the Figma component
 * (`53:6442`) and its development documentation (`1018:86824`), and the size
 * ramp was measured on all four variants rather than taken from the prose.
 *
 * One value in that prose does not match the file and the file wins: Supernova
 * says `on-media` deepens to 64% when pressed, while the token is `#000000b8`,
 * which is 72%. Default (48%) and hover (56%) do match. Reported to design.
 */
export const iconButtonTokens: Record<TThemeMode, IIconButtonTokens> = {
  light: readIconButtonTokens('light'),
  dark: readIconButtonTokens('dark'),
};
