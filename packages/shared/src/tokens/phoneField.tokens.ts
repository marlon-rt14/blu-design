import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TPhoneFieldSize } from '../types/atoms/phoneField.types';

/** Container colours, keyed by the state that drives them. */
export interface IPhoneFieldContainerColorTokens {
  background: string;
  backgroundDisabled: string;
  border: string;
  borderFocus: string;
  borderError: string;
  borderDisabled: string;
  /**
   * Low-alpha wash layered over the container on hover.
   *
   * **Hover does not change the border here**, unlike the PasswordField.
   * `component/phonefield/container/border-hover` exists in the export but bDS
   * leaves it out of the component's declared token list, and the overlay is
   * what it names instead. Followed as declared.
   */
  overlayHover: string;
}

/**
 * Colours of the country selector that sits in front of the number.
 *
 * A group the PasswordField has no equivalent of, because its trailing action is
 * a LinkButton with its own tokens. Here the prefix is part of the field.
 */
export interface IPhoneFieldPrefixColorTokens {
  /** The dial code at rest, and once the field carries a value. */
  dialCode: string;
  dialCodeFilled: string;
  dialCodeDisabled: string;
  /**
   * Hairline around the circular flag, `component/phonefield/flag/border-default`.
   *
   * It exists because a flag with a white field — Japan, Poland — would
   * otherwise bleed into the container.
   */
  flagBorder: string;
  /** The chevron. */
  chevron: string;
  chevronDisabled: string;
  /**
   * The short rule between the prefix and the number.
   *
   * `component/phonefield/divider/bg-default`, which resolves to the same
   * `#ced4e3` as `border/divider/default`: it is **decorative**, and bDS says so
   * explicitly — *"el separador usa color/border/divider/* porque es decorativo;
   * el borde del campo usa color/border/input/*"*.
   */
  divider: string;
}

/** The label carries a default and a disabled state, nothing else. */
export interface IPhoneFieldLabelColorTokens {
  default: string;
  disabled: string;
}

/** Helper text also carries an error variant; the label does not. */
export interface IPhoneFieldHelperColorTokens extends IPhoneFieldLabelColorTokens {
  error: string;
}

/** Colours of the number the user types or sees. */
export interface IPhoneFieldValueColorTokens {
  placeholder: string;
  filled: string;
  disabled: string;
}

/**
 * Colours of the country list's surface.
 *
 * Read from `component/menu/surface/*` and the `elevation/overlay` ramp, which
 * is what bDS declares — the list is a Menu in the design file even though there
 * is no Menu component in this codebase yet. Reading the Menu's own tokens means
 * the surface is already right the day one exists.
 */
export interface IPhoneFieldMenuColorTokens {
  surface: string;
  border: string;
  shadowNear: string;
  shadowFar: string;
}

/** Every colour a PhoneField needs, resolved for a single theme. */
export interface IPhoneFieldColorTokens {
  container: IPhoneFieldContainerColorTokens;
  prefix: IPhoneFieldPrefixColorTokens;
  label: IPhoneFieldLabelColorTokens;
  value: IPhoneFieldValueColorTokens;
  helper: IPhoneFieldHelperColorTokens;
  menu: IPhoneFieldMenuColorTokens;
}

/** Metrics that change with `size`. */
export interface IPhoneFieldSizeTokens {
  /**
   * Height of the bordered box: 32 / 44 / 56.
   *
   * `md` and `lg` read `size/field/height/*`, but **`sm` reads
   * `size/control/height/sm`** — the field ramp has no `sm` entry. Same mapping
   * the PasswordField uses, and it lands on the 32 / 44 / 56 bDS states.
   *
   * bDS's declared token list omits `size/field/height/lg` while calling the
   * third size 56. Reading the ramp is the only way to get all three; the
   * omission is a slip in the list, not a different design.
   */
  height: number;
  /**
   * Horizontal padding: 8 in `sm`, 12 in `md` and `lg`.
   *
   * Both `space/inset/sm` and `space/inset/md` are declared, and the split
   * matches the rest of the family — the row components tie `sm` to `inset/sm`
   * and `md` to `inset/md`.
   */
  paddingHorizontal: number;
}

/** Metrics that do not change with `size`. */
export interface IPhoneFieldDimensionTokens {
  borderRadius: number;
  borderWidth: number;
  focusRingSpread: number;
  /**
   * Height of the rule between the prefix and the number: **16**, from
   * `component/phonefield/divider/height`.
   *
   * A co-token of its own rather than the field height, because the rule is
   * shorter than the box on purpose — it separates without reaching the edges.
   */
  dividerHeight: number;
  /** Thickness of that rule, `border/width/default`: 1, and 2 in high contrast. */
  dividerWidth: number;
  /** Flag and chevron both take `size/icon/sm` (16). */
  iconSize: number;
  /** `radius/pill` — the flag is a circle, which is why it needs a radius at all. */
  flagRadius: number;
  /** Gap between the flag and the dial code, `space/inline/xs`. */
  prefixGap: number;
  /** Gap between the prefix block and the number, `space/inline/sm`. */
  valueGap: number;
  /** Gap between the box and the helper line, `space/stack/xs`. */
  helperGap: number;
  /**
   * Minimum touch target for the country trigger, `size/target/min` (48).
   *
   * **Not in bDS's declared list of 47, and the component cannot be built
   * without it**: the prefix is *"un control dentro del campo, con su propia
   * área tocable de size/target/min"*. The token's own description explains why
   * the number is 48 and not 44 — *"cumple iOS (44) y Android (48) a la vez. NO
   * se deriva del tamano del icono ni de la altura visual del control"* — which
   * matters here, because in `sm` the field is only 32 tall and the target has
   * to reach past it without moving the layout.
   */
  minTouchTarget: number;
  /**
   * Distance from the field to the list, `space/stack/xs` (4).
   *
   * The same token as {@link IPhoneFieldDimensionTokens.helperGap} and the same
   * value bDS states for the popover — *"a 4 px del campo"*.
   */
  menuOffset: number;
  /**
   * `z/dropdown` — the panel has to clear whatever the form already stacks.
   * Only web reads it: on native the sheet is a `Modal`, which is its own
   * window.
   */
  menuZIndex: number;
  /** Radius of the list surface, `radius/surface/md` — the surface ramp, not the field one. */
  menuRadius: number;
  menuShadowNearY: number;
  menuShadowNearBlur: number;
  menuShadowFarY: number;
  menuShadowFarBlur: number;
}

/** One resolved text style: the three the component uses. */
export interface IPhoneFieldTextStyleTokens {
  fontWeight: string;
  fontSize: number;
  lineHeightRatio: number;
  letterSpacing: number;
}

/**
 * The three text styles bDS declares: `text/label/sm/strong`,
 * `text/body/md/default` and `text/caption/md/default`.
 */
export interface IPhoneFieldTypographyTokens {
  label: IPhoneFieldTextStyleTokens;
  value: IPhoneFieldTextStyleTokens;
  helper: IPhoneFieldTextStyleTokens;
}

/** Every token a PhoneField needs, resolved for a single theme. */
export interface IPhoneFieldTokens {
  colors: IPhoneFieldColorTokens;
  size: Record<TPhoneFieldSize, IPhoneFieldSizeTokens>;
  dimension: IPhoneFieldDimensionTokens;
  typography: IPhoneFieldTypographyTokens;
  fontFamily: string;
}

/** Line-height ratio of Figma's `text/label/sm/strong`. Not a token. */
const LABEL_LINE_HEIGHT_RATIO = 1.35;
/** Line-height ratio of Figma's `text/body/md/default`. Not a token. */
const VALUE_LINE_HEIGHT_RATIO = 1.5;
/** Line-height ratio of Figma's `text/caption/md/default`. Not a token. */
const HELPER_LINE_HEIGHT_RATIO = 1.35;
/**
 * Tracking of `text/label/sm/strong`, as a fraction of the font size.
 *
 * Figma reports `letterSpacing: 2`, which is 2 **per cent** — 0.24px at the
 * label's 12px. Kept as a ratio, like the PasswordField, so it stays right if
 * the label size ever moves.
 */
const LABEL_LETTER_SPACING_RATIO = 0.02;

const readPhoneFieldTokens = (key: TThemeSourceKey): IPhoneFieldTokens => {
  const { color, dimension, string } = themeSources[key];
  const fieldAt = (path: string): string =>
    readThemeToken(color, `color.component.phonefield.${path}`);
  const colorAt = (path: string): string => readThemeToken(color, `color.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const labelSize = dimensionAt('font.size.label.sm');
  const valueSize = dimensionAt('font.size.body.md');
  const helperSize = dimensionAt('font.size.caption.md');
  const regular = String(dimensionAt('font.weight.regular'));

  return {
    colors: {
      container: {
        background: fieldAt('container.bg-default'),
        backgroundDisabled: fieldAt('container.bg-disabled'),
        border: fieldAt('container.border-default'),
        borderFocus: fieldAt('container.border-focus'),
        borderError: fieldAt('container.border-error'),
        borderDisabled: fieldAt('container.border-disabled'),
        overlayHover: fieldAt('container.overlay-hover'),
      },
      prefix: {
        dialCode: fieldAt('dialcode.text-default'),
        dialCodeFilled: fieldAt('dialcode.text-filled'),
        // Not in bDS's declared list of 47, and the component plainly needs it:
        // a disabled field has to grey its prefix along with everything else.
        // The token exists in the export, so it is read rather than faked.
        dialCodeDisabled: fieldAt('dialcode.text-disabled'),
        flagBorder: fieldAt('flag.border-default'),
        // Same: the declared list carries `size/icon/sm` for the chevron but no
        // colour for it. These two are the only icon colours the group has.
        chevron: fieldAt('icon.icon-default'),
        chevronDisabled: fieldAt('icon.icon-disabled'),
        divider: fieldAt('divider.bg-default'),
      },
      label: {
        default: fieldAt('label.text-default'),
        disabled: fieldAt('label.text-disabled'),
      },
      value: {
        placeholder: fieldAt('value.text-placeholder'),
        filled: fieldAt('value.text-filled'),
        disabled: fieldAt('value.text-disabled'),
      },
      helper: {
        default: fieldAt('helper.text-default'),
        error: fieldAt('helper.text-error'),
        disabled: fieldAt('helper.text-disabled'),
      },
      menu: {
        surface: colorAt('component.menu.surface.bg'),
        border: colorAt('component.menu.surface.border'),
        // Single `color.` — the elevation ramp sits at the top level of the
        // export, next to `color.color.*`. Same as the Card and the Snackbar.
        shadowNear: colorAt('elevation.overlay.shadow.near'),
        shadowFar: colorAt('elevation.overlay.shadow.far'),
      },
    },
    size: {
      sm: {
        height: dimensionAt('size.control.height.sm'),
        paddingHorizontal: dimensionAt('space.inset.sm'),
      },
      md: {
        height: dimensionAt('size.field.height.md'),
        paddingHorizontal: dimensionAt('space.inset.md'),
      },
      lg: {
        height: dimensionAt('size.field.height.lg'),
        paddingHorizontal: dimensionAt('space.inset.md'),
      },
    },
    dimension: {
      borderRadius: dimensionAt('radius.field.md'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      dividerHeight: dimensionAt('component.phonefield.divider.height'),
      dividerWidth: dimensionAt('border.width.default'),
      iconSize: dimensionAt('size.icon.sm'),
      flagRadius: dimensionAt('radius.pill'),
      prefixGap: dimensionAt('space.inline.xs'),
      valueGap: dimensionAt('space.inline.sm'),
      helperGap: dimensionAt('space.stack.xs'),
      minTouchTarget: dimensionAt('size.target.min'),
      menuOffset: dimensionAt('space.stack.xs'),
      menuZIndex: dimensionAt('z.dropdown'),
      menuRadius: dimensionAt('radius.surface.md'),
      menuShadowNearY: dimensionAt('elevation.overlay.shadow.near-y'),
      menuShadowNearBlur: dimensionAt('elevation.overlay.shadow.near-blur'),
      menuShadowFarY: dimensionAt('elevation.overlay.shadow.far-y'),
      menuShadowFarBlur: dimensionAt('elevation.overlay.shadow.far-blur'),
    },
    typography: {
      label: {
        fontWeight: String(dimensionAt('font.weight.extrabold')),
        fontSize: labelSize,
        lineHeightRatio: LABEL_LINE_HEIGHT_RATIO,
        letterSpacing: labelSize * LABEL_LETTER_SPACING_RATIO,
      },
      value: {
        fontWeight: regular,
        fontSize: valueSize,
        lineHeightRatio: VALUE_LINE_HEIGHT_RATIO,
        letterSpacing: 0,
      },
      helper: {
        fontWeight: regular,
        fontSize: helperSize,
        lineHeightRatio: HELPER_LINE_HEIGHT_RATIO,
        letterSpacing: 0,
      },
    },
    fontFamily: readThemeToken(string, 'string.platform.font.family'),
  };
};

/**
 * PhoneField tokens, keyed by theme.
 *
 * bDS declares 47 tokens for this component and all 47 were found in the export,
 * checked one by one. Three more are read beyond that list because the component
 * visibly needs them and they exist: `dialcode/text-disabled`,
 * `icon/icon-default` and `icon/icon-disabled`.
 *
 * Five of the 27 `component/phonefield/*` colours are deliberately **not** read:
 * `container/border-hover` (bDS puts hover on the overlay instead), and the
 * `border-warning`, `border-success`, `helper/text-warning` and
 * `helper/text-success` pairs — the contract has no warning or success state, so
 * reading them would invent one.
 */
export const phoneFieldTokens = fromThemeSources(readPhoneFieldTokens);
