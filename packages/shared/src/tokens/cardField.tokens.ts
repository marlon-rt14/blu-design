import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TCardFieldSize } from '../types/atoms/cardField.types';

/** Container colours, keyed by the state that drives them. */
export interface ICardFieldContainerColorTokens {
  background: string;
  backgroundDisabled: string;
  backgroundReadOnly: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  borderError: string;
  borderDisabled: string;
  borderReadOnly: string;
  /** Low-alpha wash layered over the background on hover, in addition to the border. */
  overlayHover: string;
}

/** The label carries a default and a disabled state, nothing else. */
export interface ICardFieldLabelColorTokens {
  default: string;
  disabled: string;
}

/** Helper text also carries an error variant; the label does not. */
export interface ICardFieldHelperColorTokens extends ICardFieldLabelColorTokens {
  error: string;
}

/** Colours of the value the user types or sees. */
export interface ICardFieldValueColorTokens {
  placeholder: string;
  filled: string;
  disabled: string;
  readOnly: string;
}

/**
 * The plate the brand logo sits on.
 *
 * Only these two are tokenized. **The logo's own colours are not**, and that is
 * declared rather than overlooked: *"las marcas de tarjeta llevan su color de
 * marca, sin token, a propósito. Son logos de terceros: su color no es del
 * sistema y no cambia con el tema ni con el modo de contraste."*
 */
export interface ICardFieldBrandIconColorTokens {
  background: string;
  border: string;
}

/** Every colour a CardField needs, resolved for a single theme. */
export interface ICardFieldColorTokens {
  container: ICardFieldContainerColorTokens;
  label: ICardFieldLabelColorTokens;
  value: ICardFieldValueColorTokens;
  helper: ICardFieldHelperColorTokens;
  brandIcon: ICardFieldBrandIconColorTokens;
}

/** Metrics that change with `size`. */
export interface ICardFieldSizeTokens {
  /**
   * Height of the bordered box: 32 / 44 / 56.
   *
   * `md` and `lg` read `size/field/height/*`, but **`sm` reads
   * `size/control/height/sm`** — the field ramp has no `sm` entry. Same mapping
   * as the PasswordField.
   */
  height: number;
  /**
   * Height of the plate the brand logo sits on: **16 / 24 / 32**.
   *
   * Measured on the three filled `part='number'` variants at 4x (`877:75406`,
   * `877:75484`, `877:75562`) rather than inferred, and the first guess was
   * wrong — `size/icon/lg` (32) is the plate in `lg`, not the logo anywhere.
   *
   * The ramp is `size/icon/{sm,md,lg}` — **confirmed with `get_variable_defs` on
   * the variants themselves**, which is what the plate binds. bDS's declared
   * list names only `sm` and `lg` and omits the `md` step; the first attempt
   * here used `size/control/height/xs`, which is also 24 and was the wrong
   * token for the right number.
   */
  brandPlateHeight: number;
}

/** Metrics that do not change with `size`. */
export interface ICardFieldDimensionTokens {
  /**
   * Horizontal padding, `space/inset/md` (12) — **the same at every size**.
   *
   * It does not scale, and that is a known bug in this codebase's history: the
   * team's own checklist lists *"border radius and horizontal padding are the
   * same at every TextField size — they don't scale"* among the gotchas that
   * were each a real bug once.
   */
  paddingHorizontal: number;
  /** Vertical padding, `space/inset/xs` (4) — what lets the label float above the value. */
  paddingVertical: number;
  /** `radius/field/md` (12). Like the padding, the same at every size. */
  borderRadius: number;
  borderWidth: number;
  /**
   * The focus ring is **offset and two-tone**, not flush: `focus/ring/spread` (3)
   * outside a `focus/ring/offset` (1) gap. Another gotcha the team has already
   * paid for once.
   */
  focusRingSpread: number;
  focusRingOffset: number;
  /** Gap between the value and the brand plate, `space/inline/sm`. */
  brandGap: number;
  /**
   * Corner radius of the brand plate: **2**, from the primitive
   * `border-radius/xs`.
   *
   * Measured, and it is the one place this component reaches outside the
   * semantic `radius/*` family — deliberately, because that family has no step
   * this small: its smallest is `radius/control/sm` at 4. The plate's corners
   * are ~1.8 at all three sizes on Figma's own renders (`877:75406`,
   * `877:75484`, `877:75562`), constant while the plate grows 16 -> 24 -> 32.
   *
   * bDS declares `radius/pill` for this component and `get_variable_defs` does
   * report it bound somewhere in the variant's subtree, but **it is not the
   * plate**: a pill on a 36x24 box clamps to a 12 radius and the measurement
   * says 1.8. The first attempt here used `radius/field/md` (12) and produced
   * stadium-shaped plates — visible at `sm`, where 12 on a 16-tall box rounds
   * the whole thing away.
   */
  brandRadius: number;
  /**
   * The plate is a card, so it is **3:2** — 24x16, 36x24, 48x32 across the three
   * sizes, measured. The width comes from the height times this.
   */
  brandPlateAspect: number;
  /**
   * The logo is exactly **half the plate's width**, at every size: 12 of 24, 18
   * of 36, 24 of 48. Its height follows the mark's own proportions, which differ
   * per brand, so only the width is set.
   */
  brandLogoWidthRatio: number;
  /** Gap between the box and the helper line, `space/stack/xs`. */
  helperGap: number;
}

/** One resolved text style. */
export interface ICardFieldTextStyleTokens {
  fontWeight: string;
  fontSize: number;
  lineHeightRatio: number;
  letterSpacing: number;
}

/**
 * The three text styles bDS declares: `text/label/sm/strong`,
 * `text/body/md/default` and `text/caption/md/default`.
 */
export interface ICardFieldTypographyTokens {
  label: ICardFieldTextStyleTokens;
  value: ICardFieldTextStyleTokens;
  helper: ICardFieldTextStyleTokens;
}

/** Every token a CardField needs, resolved for a single theme. */
export interface ICardFieldTokens {
  colors: ICardFieldColorTokens;
  size: Record<TCardFieldSize, ICardFieldSizeTokens>;
  dimension: ICardFieldDimensionTokens;
  typography: ICardFieldTypographyTokens;
  fontFamily: string;
}

/**
 * The brand plate's width over its height. A credit card's proportion, measured
 * identical at all three sizes: 24/16, 36/24 and 48/32. Not a token.
 */
const BRAND_PLATE_ASPECT = 1.5;
/**
 * The logo's width over the plate's width — exactly a half at all three sizes,
 * measured. Not a token.
 */
const BRAND_LOGO_WIDTH_RATIO = 0.5;

/** Line-height ratio of Figma's `text/label/sm/strong`. Not a token. */
const LABEL_LINE_HEIGHT_RATIO = 1.35;
/** Line-height ratio of Figma's `text/body/md/default`. Not a token. */
const VALUE_LINE_HEIGHT_RATIO = 1.5;
/** Line-height ratio of Figma's `text/caption/md/default`. Not a token. */
const HELPER_LINE_HEIGHT_RATIO = 1.35;
/**
 * Tracking of `text/label/sm/strong`, as a fraction of the font size — Figma
 * reports `letterSpacing: 2`, which is 2 per cent. Kept as a ratio so it stays
 * right if the label size moves.
 */
const LABEL_LETTER_SPACING_RATIO = 0.02;

const readCardFieldTokens = (key: TThemeSourceKey): ICardFieldTokens => {
  const { color, dimension, string } = themeSources[key];
  const fieldAt = (path: string): string =>
    readThemeToken(color, `color.component.cardfield.${path}`);
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
        backgroundReadOnly: fieldAt('container.bg-readonly'),
        border: fieldAt('container.border-default'),
        borderHover: fieldAt('container.border-hover'),
        borderFocus: fieldAt('container.border-focus'),
        borderError: fieldAt('container.border-error'),
        borderDisabled: fieldAt('container.border-disabled'),
        borderReadOnly: fieldAt('container.border-readonly'),
        overlayHover: fieldAt('container.overlay-hover'),
      },
      label: {
        default: fieldAt('label.text-default'),
        disabled: fieldAt('label.text-disabled'),
      },
      value: {
        placeholder: fieldAt('value.text-placeholder'),
        filled: fieldAt('value.text-filled'),
        disabled: fieldAt('value.text-disabled'),
        readOnly: fieldAt('value.text-readonly'),
      },
      helper: {
        default: fieldAt('helper.text-default'),
        error: fieldAt('helper.text-error'),
        disabled: fieldAt('helper.text-disabled'),
      },
      brandIcon: {
        background: fieldAt('brandicon.bg-default'),
        border: fieldAt('brandicon.border-default'),
      },
    },
    size: {
      sm: {
        height: dimensionAt('size.control.height.sm'),
        brandPlateHeight: dimensionAt('size.icon.sm'),
      },
      md: {
        height: dimensionAt('size.field.height.md'),
        brandPlateHeight: dimensionAt('size.icon.md'),
      },
      lg: {
        height: dimensionAt('size.field.height.lg'),
        brandPlateHeight: dimensionAt('size.icon.lg'),
      },
    },
    dimension: {
      paddingHorizontal: dimensionAt('space.inset.md'),
      paddingVertical: dimensionAt('space.inset.xs'),
      borderRadius: dimensionAt('radius.field.md'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      brandGap: dimensionAt('space.inline.sm'),
      brandRadius: dimensionAt('border-radius.xs'),
      brandPlateAspect: BRAND_PLATE_ASPECT,
      brandLogoWidthRatio: BRAND_LOGO_WIDTH_RATIO,
      helperGap: dimensionAt('space.stack.xs'),
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
 * CardField tokens, keyed by theme. All 41 paths were verified against the
 * export before this file was written.
 *
 * **bDS's declared list of 28 is incomplete**, and by a wide margin: it omits
 * `container/border-error`, `border-focus`, `border-hover`, `overlay-hover`,
 * `bg-readonly`, `border-readonly`, `value/text-filled`, `value/text-readonly`,
 * `helper/text-error` and both `brandicon` tokens — thirteen tokens the contract
 * plainly needs, since it has `error`, `readOnly` and `brand`, and focus is a
 * state. Plus `focus/ring/offset`, which the ring needs to be the offset
 * two-tone one the fields use. They all exist in the export, so they are read.
 *
 * Four are deliberately **not** read: `container/border-warning`,
 * `border-success`, `helper/text-warning` and `helper/text-success`. Figma's
 * `validation` axis has those states; the code contract has only `error`, so
 * reading them would invent a state the signature cannot reach.
 */
export const cardFieldTokens = fromThemeSources(readCardFieldTokens);
