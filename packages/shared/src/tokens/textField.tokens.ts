import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';
import type { TTextFieldSize } from '../types/atoms/textField.types';

/** Container colors, keyed by the state that drives them. */
export interface ITextFieldContainerColorTokens {
  background: string;
  backgroundDisabled: string;
  backgroundReadOnly: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  borderError: string;
  borderDisabled: string;
  borderReadOnly: string;
  /** Low-alpha wash layered over the container on hover — not a solid background swap. */
  overlayHover: string;
}

/** Text colors for the value the user types or sees. */
export interface ITextFieldValueColorTokens {
  placeholder: string;
  filled: string;
  disabled: string;
  readOnly: string;
}

/** Colors shared by the label and the inline icon: a default and a disabled state, nothing else. */
export interface ITextFieldSupportColorTokens {
  default: string;
  disabled: string;
}

/** Helper text and the counter also carry an error variant; the label and icon do not. */
export interface ITextFieldFeedbackColorTokens extends ITextFieldSupportColorTokens {
  error: string;
}

/** Every color a TextField needs, resolved for a single theme. */
export interface ITextFieldColorTokens {
  container: ITextFieldContainerColorTokens;
  label: ITextFieldSupportColorTokens;
  value: ITextFieldValueColorTokens;
  helper: ITextFieldFeedbackColorTokens;
  counter: ITextFieldFeedbackColorTokens;
  icon: ITextFieldSupportColorTokens;
  /** The `prefix` / `suffix` affix text — a distinct color role from `value`, per Figma's own `affix/*` token group. */
  affix: ITextFieldSupportColorTokens;
}

/**
 * The metrics that actually vary by `TTextFieldSize` — height and vertical
 * padding. Border radius, horizontal padding and border width are the same
 * at every size (see `ITextFieldDimensionTokens`), confirmed against the
 * Figma node: all three sizes share one `rounded-[radius/field/md]` and one
 * `px-[space/inset/md]` on the container class.
 */
export interface ITextFieldSizeTokens {
  /** Floor of the container's height — see `ITextFieldDimensionTokens.paddingHorizontal` for why this isn't a fixed height. */
  minHeight: number;
  /**
   * Top/bottom padding. Zero at `small` and `medium` — those sizes center
   * their single line of content on `minHeight` alone; only `large` (which
   * fits a floating label above the value) adds any.
   */
  paddingVertical: number;
}

/** Metrics shared by every size — see `ITextFieldSizeTokens` for the ones that vary. */
export interface ITextFieldDimensionTokens {
  paddingHorizontal: number;
  borderRadius: number;
  borderWidth: number;
  /**
   * Spread of the outer focus ring — a separate absolutely-positioned layer
   * outside the container, not a change to the container's own border (see
   * `useTextField`'s doc comment on why focus never recolors `border`).
   */
  focusRingSpread: number;
  /** Padding-top of each footer slot (helper, counter) — see `ITextAreaDimensionTokens.footerSlotGap` for the shared reasoning. */
  footerSlotGap: number;
  /** Padding-left of the counter slot, pushing it away from the helper slot. */
  footerInlineGap: number;
  /** Gap between the affix icons/text and the label+value column inside the bordered box. */
  contentGap: number;
}

/** One resolved typography role: font weight, size, line height and family. */
export type ITextFieldTypographyRole = IThemeTypographyValue;

/**
 * TextField typography, one role per text element. Unlike the metrics, these
 * do not scale with `TTextFieldSize` — Figma defines a single type ramp for
 * the field regardless of height. Composed from primitives (`dimension.font.*`),
 * not read from `typography.component.inputs.input-text.*` — that composite
 * group resolves to unrelated values (confirmed against Figma's
 * `get_design_context`: it renders the label Regular/13px instead of
 * ExtraBold/12px). The node's own bound text styles — `text/label/sm/strong`
 * for the label, `text/body/md/default` for the value/affix, `text/caption/md/default`
 * for helper/counter — never landed as a `type: "typography"` composite in
 * the Style Dictionary export, only as the primitives they're built from.
 */
export interface ITextFieldTypographyTokens {
  /** The floating label — only ever shown at `medium` and `large` once there is a value. */
  label: ITextFieldTypographyRole;
  /** The value the user types or sees, and the placeholder role `label` plays while empty. */
  content: ITextFieldTypographyRole;
  /** Helper text / error message below the field. */
  helper: ITextFieldTypographyRole;
  /** The `"n / max"` character counter. */
  counter: ITextFieldTypographyRole;
}

/** Every token a TextField needs, resolved for a single theme. */
export interface ITextFieldTokens {
  colors: ITextFieldColorTokens;
  sizes: Record<TTextFieldSize, ITextFieldSizeTokens>;
  dimension: ITextFieldDimensionTokens;
  typography: ITextFieldTypographyTokens;
  /**
   * Inline icon size (prefix/suffix slots), unitless. `large` steps up to
   * `size.icon.md` (24) while `small`/`medium` share `size.icon.sm` (16) —
   * confirmed against Figma's own instance-swap binding per size.
   */
  iconSize: Record<TTextFieldSize, number>;
}

const readTextFieldTokens = (mode: TThemeMode): ITextFieldTokens => {
  const { color, dimension } = themeSources[mode];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.textfield.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  // `font.line-height.*` primitives are literal percentages mis-typed as
  // `px` upstream (e.g. `"135px"` means 135%, i.e. a 1.35 multiplier) — see
  // that token's own description in `dimension.json`.
  const composedTypographyAt = (
    sizePath: string,
    weightPath: string,
    lineHeightRatioPath: string,
  ): ITextFieldTypographyRole => {
    const fontSize = dimensionAt(sizePath);
    return {
      fontWeight: String(dimensionAt(weightPath)),
      fontSize,
      lineHeight: fontSize * (dimensionAt(lineHeightRatioPath) / 100),
      fontFamily: baseFontFamily,
    };
  };

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
      counter: {
        default: colorAt('counter.text-default'),
        error: colorAt('counter.text-error'),
        disabled: colorAt('counter.text-disabled'),
      },
      icon: {
        default: colorAt('icon.icon-default'),
        disabled: colorAt('icon.icon-disabled'),
      },
      affix: {
        default: colorAt('affix.text-default'),
        disabled: colorAt('affix.text-disabled'),
      },
    },
    // `small` has no dedicated `size.field.height.*` entry — it shares
    // `size.control.height.sm` (32) with the small button, a pairing
    // Supernova's own token description calls out explicitly.
    sizes: {
      small: {
        minHeight: dimensionAt('size.control.height.sm'),
        paddingVertical: 0,
      },
      medium: {
        minHeight: dimensionAt('size.field.height.md'),
        paddingVertical: 0,
      },
      large: {
        minHeight: dimensionAt('size.field.height.lg'),
        paddingVertical: dimensionAt('space.inset.xs'),
      },
    },
    dimension: {
      paddingHorizontal: dimensionAt('space.inset.md'),
      borderRadius: dimensionAt('radius.field.md'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      footerSlotGap: dimensionAt('space.stack.xs'),
      footerInlineGap: dimensionAt('space.inline.sm'),
      contentGap: dimensionAt('space.inline.sm'),
    },
    typography: {
      label: composedTypographyAt('font.size.label.sm', 'font.weight.extrabold', 'font.line-height.snug'),
      content: composedTypographyAt('font.size.body.md', 'font.weight.regular', 'font.line-height.normal'),
      helper: composedTypographyAt('font.size.caption.md', 'font.weight.regular', 'font.line-height.normal'),
      counter: composedTypographyAt('font.size.caption.md', 'font.weight.regular', 'font.line-height.normal'),
    },
    iconSize: {
      small: dimensionAt('size.icon.sm'),
      medium: dimensionAt('size.icon.sm'),
      large: dimensionAt('size.icon.md'),
    },
  };
};

/**
 * TextField tokens, keyed by theme mode.
 *
 * Source: `color.component.textfield.*` and `dimension.*` in `theme/base`
 * (light) and `theme/dark` — typography is composed from `dimension.font.*`
 * primitives, see `ITextFieldTypographyTokens`. Read every field per mode,
 * not just color — `dimension.json` is not fully theme-invariant
 * (`dimension.elevation.*.shadow.*` differs), so nothing here assumes
 * `light` is a safe stand-in for `dark`, even where today's values happen to
 * match. Both platforms pick the right entry at render time via
 * `useThemeMode()`.
 */
export const textFieldTokens: Record<TThemeMode, ITextFieldTokens> = {
  light: readTextFieldTokens('light'),
  dark: readTextFieldTokens('dark'),
};
