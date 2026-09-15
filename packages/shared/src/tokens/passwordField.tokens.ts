import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import { fromThemeSources, themeSources } from '../themeSource/themes';
import type { TThemeSourceKey } from '../themeSource/themes';
import type { TPasswordFieldSize } from '../types/atoms/passwordField.types';

/** Container colours, keyed by the state that drives them. */
export interface IPasswordFieldContainerColorTokens {
  background: string;
  backgroundDisabled: string;
  backgroundReadOnly: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  borderError: string;
  borderDisabled: string;
  borderReadOnly: string;
  /** Low-alpha wash layered over the container on hover — not a background swap. */
  overlayHover: string;
}

/** Colours of the value the user types or sees. */
export interface IPasswordFieldValueColorTokens {
  placeholder: string;
  filled: string;
  disabled: string;
  readOnly: string;
}

/** The label carries a default and a disabled state, nothing else. */
export interface IPasswordFieldLabelColorTokens {
  default: string;
  disabled: string;
}

/** Helper text also carries an error variant; the label does not. */
export interface IPasswordFieldHelperColorTokens extends IPasswordFieldLabelColorTokens {
  error: string;
}

/**
 * Every colour a PasswordField needs, resolved for a single theme.
 *
 * `color.component.passwordfield.*` is a strict subset of the TextField's: the
 * same `container`, `label`, `value` and `helper` groups with identical values,
 * minus `affix`, `counter` and `icon` — which this field has no slots for.
 *
 * The reveal action is **not** here: it is a LinkButton, and it carries its own
 * `color.component.linkbutton.*` tokens. Figma binds it that way too.
 */
export interface IPasswordFieldColorTokens {
  container: IPasswordFieldContainerColorTokens;
  label: IPasswordFieldLabelColorTokens;
  value: IPasswordFieldValueColorTokens;
  helper: IPasswordFieldHelperColorTokens;
}

/** Metrics that change with `size`. */
export interface IPasswordFieldSizeTokens {
  /**
   * Height of the bordered box: 32 / 44 / 56.
   *
   * `md` and `lg` read `size/field/height/*`, but **`sm` reads
   * `size/control/height/sm`** — `size/field/height` has no `sm` entry, so
   * Figma falls back to the control ramp. Not a mistake, and not derivable.
   */
  height: number;
}

/** Metrics that are the same at every size. */
export interface IPasswordFieldDimensionTokens {
  paddingHorizontal: number;
  borderRadius: number;
  borderWidth: number;
  /** Spread of the focus ring, drawn outside the container. */
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
  /** Gap between the content column and the reveal action. */
  actionGap: number;
  /** Padding above the helper slot. */
  helperGap: number;
  /**
   * Minimum touch target for the reveal action.
   *
   * bDS: *"Área táctil de la acción: mínimo 48x48 aunque el texto sea menor
   * (padding invisible)"*.
   */
  minTouchTarget: number;
}

/** One resolved typography role. */
export interface IPasswordFieldTypographyRole {
  fontWeight: string;
  fontSize: number;
  /** A **ratio**, not pixels — see {@link IPasswordFieldTypographyTokens}. */
  lineHeightRatio: number;
  /** Absolute, in pixels. `0` where the style tracks nothing. */
  letterSpacing: number;
}

/**
 * PasswordField typography.
 *
 * Composed from `font/*` primitives rather than read through
 * `readThemeTypography`, because Figma binds the text styles
 * `text/label/sm/strong` and `text/body/md/default` — and a Figma text style is
 * not a variable, so it never reaches the export. Only its constituent
 * variables do.
 *
 * This is why it does **not** use `typography.component.inputs.input-text.*`,
 * the group the TextField reads: Figma binds none of it, and its values
 * disagree (`text-holder` is 400/13px against the bound 800/12px, `content` is
 * 400/14px against 400/16px).
 *
 * The line-height ratios (1.35 and 1.5) and the label's 2% tracking have no
 * tokens either; they live in the text styles. They are hard-coded below.
 *
 * Note neither role changes with `size`: a `sm` field shows the same 16px value
 * as an `lg` one. Only the box gets shorter.
 */
export interface IPasswordFieldTypographyTokens {
  /** The floating label. ExtraBold and small, so it reads as a caption. */
  label: IPasswordFieldTypographyRole;
  /** The value, and the placeholder when the label stands in for one. */
  value: IPasswordFieldTypographyRole;
}

/** Every token a PasswordField needs, resolved for a single theme. */
export interface IPasswordFieldTokens {
  colors: IPasswordFieldColorTokens;
  size: Record<TPasswordFieldSize, IPasswordFieldSizeTokens>;
  dimension: IPasswordFieldDimensionTokens;
  typography: IPasswordFieldTypographyTokens;
}

/** Line-height ratio of Figma's `text/label/sm/strong`. Not a token. */
const LABEL_LINE_HEIGHT_RATIO = 1.35;
/** Line-height ratio of Figma's `text/body/md/default`. Not a token. */
const VALUE_LINE_HEIGHT_RATIO = 1.5;
/**
 * Tracking of `text/label/sm/strong`, as a fraction of the font size.
 *
 * Figma reports it as `letterSpacing: 2`, which is 2 **per cent** — 0.24px at
 * the label's 12px. The TextField already hard-codes that resolved `0.24px`;
 * keeping the ratio means it stays right if the label size ever changes.
 */
const LABEL_LETTER_SPACING_RATIO = 0.02;

const readPasswordFieldTokens = (key: TThemeSourceKey): IPasswordFieldTokens => {
  const { color, dimension } = themeSources[key];
  const colorAt = (path: string): string =>
    readThemeToken(color, `color.component.passwordfield.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);

  const labelSize = dimensionAt('font.size.label.sm');
  const valueSize = dimensionAt('font.size.body.md');

  return {
    colors: {
      container: {
        background: colorAt('container.bg-default'),
        backgroundDisabled: colorAt('container.bg-disabled'),
        backgroundReadOnly: colorAt('container.bg-readonly'),
        border: colorAt('container.border-default'),
        borderHover: colorAt('container.border-hover'),
        borderFocus: colorAt('container.border-focus'),
        borderError: colorAt('container.border-error'),
        borderDisabled: colorAt('container.border-disabled'),
        borderReadOnly: colorAt('container.border-readonly'),
        overlayHover: colorAt('container.overlay-hover'),
      },
      label: {
        default: colorAt('label.text-default'),
        disabled: colorAt('label.text-disabled'),
      },
      value: {
        placeholder: colorAt('value.text-placeholder'),
        filled: colorAt('value.text-filled'),
        disabled: colorAt('value.text-disabled'),
        readOnly: colorAt('value.text-readonly'),
      },
      helper: {
        default: colorAt('helper.text-default'),
        error: colorAt('helper.text-error'),
        disabled: colorAt('helper.text-disabled'),
      },
    },
    size: {
      sm: { height: dimensionAt('size.control.height.sm') },
      md: { height: dimensionAt('size.field.height.md') },
      lg: { height: dimensionAt('size.field.height.lg') },
    },
    dimension: {
      paddingHorizontal: dimensionAt('space.inset.md'),
      borderRadius: dimensionAt('radius.field.md'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      focusRingOffset: dimensionAt('focus.ring.offset'),
      actionGap: dimensionAt('space.inline.sm'),
      helperGap: dimensionAt('space.stack.xs'),
      minTouchTarget: dimensionAt('size.target.min'),
    },
    typography: {
      label: {
        fontWeight: String(dimensionAt('font.weight.extrabold')),
        fontSize: labelSize,
        lineHeightRatio: LABEL_LINE_HEIGHT_RATIO,
        letterSpacing: labelSize * LABEL_LETTER_SPACING_RATIO,
      },
      value: {
        fontWeight: String(dimensionAt('font.weight.regular')),
        fontSize: valueSize,
        lineHeightRatio: VALUE_LINE_HEIGHT_RATIO,
        letterSpacing: 0,
      },
    },
  };
};

/**
 * PasswordField tokens, keyed by theme mode.
 *
 * Source: `color.component.passwordfield.*` and `dimension.*`. All 19 colour
 * tokens differ between the two themes. The mapping was read out of the Figma
 * component (`20:4164`) one variant at a time.
 */
export const passwordFieldTokens = fromThemeSources(readPasswordFieldTokens);
