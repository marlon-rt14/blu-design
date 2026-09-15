import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';

/**
 * Colours of one digit box.
 *
 * Note what is missing: there is no `bg-error` and no `bg-focus`. Error changes
 * only the border, and focus changes nothing about the box itself — the ring is
 * drawn outside it. Both measured against Figma rather than assumed.
 */
export interface IOTPFieldDigitColorTokens {
  background: string;
  backgroundDisabled: string;
  border: string;
  borderError: string;
  borderDisabled: string;
  /**
   * Colour of the ring around the active box.
   *
   * Named `border-focus` in the token set, which is misleading: it is **not**
   * the box's border on focus. Measured at 4x, a focused box keeps its grey
   * `border-default` and gains a separate ring of this colour outside it.
   */
  borderFocus: string;
}

/** The digits themselves carry a default and a disabled colour, nothing else. */
export interface IOTPFieldCharColorTokens {
  default: string;
  disabled: string;
}

/** Helper text also carries an error variant; the digits do not. */
export interface IOTPFieldHelperColorTokens extends IOTPFieldCharColorTokens {
  error: string;
}

/** Every colour an OTPField needs, resolved for a single theme. */
export interface IOTPFieldColorTokens {
  digit: IOTPFieldDigitColorTokens;
  char: IOTPFieldCharColorTokens;
  helper: IOTPFieldHelperColorTokens;
}

/** Metrics of the row of boxes and the helper under it. */
export interface IOTPFieldDimensionTokens {
  /**
   * Edge of one box — **both** its width and its height, 56 each.
   *
   * There is no width token: Figma binds `size/field/height/lg` and the box is
   * square. Measured at 4x, `length=4` is exactly 248 wide (4 x 56 + 3 x 8) and
   * `length=6` is 376, which only holds if the width is the height.
   */
  boxSize: number;
  /** Space between boxes, from `space/inline/sm`. */
  gap: number;
  borderRadius: number;
  borderWidth: number;
  /** Spread of the ring drawn around the active box. */
  focusRingSpread: number;
  /**
   * Transparent gap between the active box and its ring, from
   * `focus/ring/offset`.
   *
   * The token says 1 and Figma renders 2 — the same disagreement the Button
   * carries, and the same resolution: read the token, because that is what the
   * sync will correct when design answers. See `IButtonFocusTokens.offset`.
   *
   * Worth knowing that the ring lands in the gap between boxes: spread plus
   * offset is 4 against an 8px gap, so nothing may clip it. Neither platform
   * puts `overflow: hidden` on the row.
   */
  focusRingOffset: number;
  /** Space between the row of boxes and the helper, from `space/stack/sm`. */
  helperGap: number;
}

/** One resolved typography role. */
export interface IOTPFieldTypographyRole {
  fontWeight: string;
  fontSize: number;
  /** A **ratio**, not pixels — CSS takes it as given, React Native needs it multiplied. */
  lineHeightRatio: number;
}

/**
 * OTPField typography.
 *
 * Composed from `font/*` primitives, because the text style Figma binds —
 * `text/otp/default` — **is not in the export**. A Figma text style is not a
 * variable, so it never reaches the token pipeline; only the variables inside it
 * do. Same situation as the PasswordField's `text/label/sm/strong`.
 *
 * The digit style is deliberately Mulish rather than a mono face. bDS: *"Usa
 * text/otp, que sigue en Mulish porque sus dígitos ya son tabulares"* — the
 * digits are the same width already, so the boxes do not shift as the code is
 * typed.
 *
 * **`text/otp` also declares `letterSpacing: 8`, and it is dropped here.** That
 * value is for a single text run holding every digit, where it does the spacing
 * between them. We do not lay it out that way: each box paints one character,
 * and the space between digits is `gap` between boxes. Measured at 4x, Figma's
 * own digits sit centred in their boxes (off by 0.75px and 0.12px, which is
 * glyph shape), so applying the tracking per box would push each one off centre
 * by 4px — reproducing a number that describes a layout we do not use.
 */
export interface IOTPFieldTypographyTokens {
  /** One digit. ExtraBold at 24px, which is what makes the boxes read as a code. */
  digit: IOTPFieldTypographyRole;
  /** The helper line, and the resend countdown that usually lives in it. */
  helper: IOTPFieldTypographyRole;
}

/** Every token an OTPField needs, resolved for a single theme. */
export interface IOTPFieldTokens {
  colors: IOTPFieldColorTokens;
  dimension: IOTPFieldDimensionTokens;
  typography: IOTPFieldTypographyTokens;
}

/** Line-height ratio of Figma's `text/otp/default`. Not a token. */
const DIGIT_LINE_HEIGHT_RATIO = 1.2;
/** Line-height ratio of Figma's `text/caption/md/default`. Not a token. */
const HELPER_LINE_HEIGHT_RATIO = 1.5;

const readOTPFieldTokens = (key: TThemeSourceKey): IOTPFieldTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.otpfield.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  return {
    colors: {
      digit: {
        background: colorAt('digit.bg-default'),
        backgroundDisabled: colorAt('digit.bg-disabled'),
        border: colorAt('digit.border-default'),
        borderError: colorAt('digit.border-error'),
        borderDisabled: colorAt('digit.border-disabled'),
        borderFocus: colorAt('digit.border-focus'),
      },
      char: {
        default: colorAt('char.text-default'),
        disabled: colorAt('char.text-disabled'),
      },
      helper: {
        default: colorAt('helper.text-default'),
        error: colorAt('helper.text-error'),
        disabled: colorAt('helper.text-disabled'),
      },
    },
    dimension: {
      boxSize: dimensionAt('size.field.height.lg'),
      gap: dimensionAt('space.inline.sm'),
      borderRadius: dimensionAt('radius.field.sm'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      helperGap: dimensionAt('space.stack.sm'),
    },
    typography: {
      digit: {
        fontWeight: String(dimensionAt('font.weight.extrabold')),
        fontSize: dimensionAt('font.size.otp'),
        lineHeightRatio: DIGIT_LINE_HEIGHT_RATIO,
      },
      helper: {
        fontWeight: String(dimensionAt('font.weight.regular')),
        fontSize: dimensionAt('font.size.caption.md'),
        lineHeightRatio: HELPER_LINE_HEIGHT_RATIO,
      },
    },
  };
};

/**
 * OTPField tokens, keyed by theme mode.
 *
 * Source: `color.component.otpfield.*` and `dimension.*`. All 11 colour tokens
 * of the group are read and all 11 differ between the two themes. The mapping
 * was read out of the Figma component (`fa49190b`) one variant at a time and
 * then verified by measuring the renders at 4x.
 *
 * One co-token Figma binds is deliberately left unread: `space/inset/sm` sits on
 * the box as padding, but the box is a fixed 56 square with its digit centred,
 * so the padding never decides anything. Reading it would suggest it does.
 */
export const otpFieldTokens = fromThemeSources(readOTPFieldTokens);
