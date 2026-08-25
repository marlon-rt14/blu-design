import { readThemeDimension, readThemeToken, readThemeTypography } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
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
}

/** Metrics that scale with `TTextFieldSize`. */
export interface ITextFieldSizeTokens {
  /** Container height, unitless. */
  height: number;
  /** Container corner radius, unitless. */
  borderRadius: number;
  /** Container horizontal padding, unitless. */
  paddingHorizontal: number;
}

/** Border widths, unitless. Same value at rest, on hover and when read-only; focus gets a thicker ring. */
export interface ITextFieldBorderWidthTokens {
  default: number;
  focus: number;
}

/** Vertical gap between label/field/footer, and the horizontal gap inside the footer. Unitless. */
export interface ITextFieldLayoutTokens {
  stackGap: number;
  inlineGap: number;
}

/** One resolved typography role: font weight, size, line height and family. */
export type ITextFieldTypographyRole = IThemeTypographyValue;

/**
 * TextField typography, one role per text element. Unlike the metrics, these
 * do not scale with `TTextFieldSize` — Supernova defines a single type ramp
 * for the field regardless of height.
 */
export interface ITextFieldTypographyTokens {
  /** The label above the value. */
  label: ITextFieldTypographyRole;
  /** The value the user types or sees. */
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
  borderWidth: ITextFieldBorderWidthTokens;
  layout: ITextFieldLayoutTokens;
  typography: ITextFieldTypographyTokens;
  /** Inline icon size, unitless — the "icon next to text" step of the icon scale. Reserved for a future icon slot. */
  iconSize: number;
}

const readTextFieldTokens = (mode: TThemeMode): ITextFieldTokens => {
  const { color, dimension, typography } = themeSources[mode];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.textfield.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  const typographyAt = (path: string): ITextFieldTypographyRole =>
    readThemeTypography(typography, `typography.component.inputs.input-text.typography.${path}`);

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
    },
    // `dimension.size.field.height.md` (44) and `.lg` (56) pair with
    // `dimension.radius.field.sm` (16) and `.md` (24) respectively —
    // Supernova named the two scales independently, so the pairing is
    // re-established here.
    sizes: {
      medium: {
        height: dimensionAt('size.field.height.md'),
        borderRadius: dimensionAt('radius.field.sm'),
        paddingHorizontal: dimensionAt('space.inset.lg'),
      },
      large: {
        height: dimensionAt('size.field.height.lg'),
        borderRadius: dimensionAt('radius.field.md'),
        paddingHorizontal: dimensionAt('space.inset.lg'),
      },
    },
    borderWidth: {
      default: dimensionAt('border.width.default'),
      focus: dimensionAt('border.width.focus'),
    },
    layout: {
      stackGap: dimensionAt('space.inset.xs'),
      inlineGap: dimensionAt('space.inset.sm'),
    },
    typography: {
      label: typographyAt('text-holder'),
      content: typographyAt('content'),
      helper: typographyAt('helper'),
      counter: typographyAt('character-count'),
    },
    iconSize: dimensionAt('size.icon.sm'),
  };
};

/**
 * TextField tokens, keyed by theme mode.
 *
 * Source: `color.component.textfield.*`, `dimension.*` and
 * `typography.component.inputs.input-text.*` in `theme/base` (light) and
 * `theme/dark`. Read every field per mode, not just color — `dimension.json`
 * is not fully theme-invariant (`dimension.elevation.*.shadow.*` differs),
 * so nothing here assumes `light` is a safe stand-in for `dark`, even where
 * today's values happen to match. Both platforms pick the right entry at
 * render time via `useThemeMode()`.
 */
export const textFieldTokens: Record<TThemeMode, ITextFieldTokens> = {
  light: readTextFieldTokens('light'),
  dark: readTextFieldTokens('dark'),
};
