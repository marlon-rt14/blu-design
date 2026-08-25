import { readThemeDimension, readThemeToken, readThemeTypography } from '../theme/tokenPath';
import type { IThemeTypographyValue } from '../theme/tokenPath';
import { themeSources } from '../theme/themes';
import type { TThemeMode } from '../theme/themes';
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

const readTextFieldColors = (mode: TThemeMode): ITextFieldColorTokens => {
  const { color } = themeSources[mode];
  const at = (path: string): string => readThemeToken(color, `color.component.textfield.${path}`);

  return {
    container: {
      background: at('container.bg-default'),
      backgroundDisabled: at('container.bg-disabled'),
      backgroundReadOnly: at('container.bg-readonly'),
      border: at('container.border-default'),
      borderHover: at('container.border-hover'),
      borderFocus: at('container.border-focus'),
      borderError: at('container.border-error'),
      borderDisabled: at('container.border-disabled'),
      borderReadOnly: at('container.border-readonly'),
      overlayHover: at('container.overlay-hover'),
    },
    label: {
      default: at('label.text-default'),
      disabled: at('label.text-disabled'),
    },
    value: {
      placeholder: at('value.text-placeholder'),
      filled: at('value.text-filled'),
      disabled: at('value.text-disabled'),
      readOnly: at('value.text-readonly'),
    },
    helper: {
      default: at('helper.text-default'),
      error: at('helper.text-error'),
      disabled: at('helper.text-disabled'),
    },
    counter: {
      default: at('counter.text-default'),
      error: at('counter.text-error'),
      disabled: at('counter.text-disabled'),
    },
    icon: {
      default: at('icon.icon-default'),
      disabled: at('icon.icon-disabled'),
    },
  };
};

/**
 * TextField colors, keyed by theme mode.
 *
 * Source: `color.component.textfield.*` in `theme/base` (light) and
 * `theme/dark`. Both platforms pick the right entry at render time based on
 * the active theme — web through the `data-dsm-theme` attribute (see
 * `textfield-theme.css` in `@dsm/web`), mobile through `useThemeMode()`.
 */
export const textFieldColorTokens: Record<TThemeMode, ITextFieldColorTokens> = {
  light: readTextFieldColors('light'),
  dark: readTextFieldColors('dark'),
};

// Dimension and typography tokens carry no theme variance today —
// `theme/dark/dimension.json` and `.../typography.json` are byte-identical to
// their `theme/base` counterparts: layout doesn't change with color mode.
// Reading from `light` is a deliberate choice, not an oversight — if a mode
// ever needs its own metrics, this is the one place that would change.
const dimensionSource = themeSources.light.dimension;
const typographySource = themeSources.light.typography;

/** Metrics that scale with `TTextFieldSize`. */
export interface ITextFieldSizeTokens {
  /** Container height, unitless. */
  height: number;
  /** Container corner radius, unitless. */
  borderRadius: number;
  /** Container horizontal padding, unitless. */
  paddingHorizontal: number;
}

/**
 * TextField metrics, keyed by size.
 *
 * `dimension.size.field.height.md` (44) and `.lg` (56) pair with
 * `dimension.radius.field.sm` (16) and `.md` (24) respectively — Supernova
 * named the two scales independently, so the pairing is re-established here.
 */
export const textFieldSizeTokens: Record<TTextFieldSize, ITextFieldSizeTokens> = {
  medium: {
    height: readThemeDimension(dimensionSource, 'dimension.size.field.height.md'),
    borderRadius: readThemeDimension(dimensionSource, 'dimension.radius.field.sm'),
    paddingHorizontal: readThemeDimension(dimensionSource, 'dimension.space.inset.lg'),
  },
  large: {
    height: readThemeDimension(dimensionSource, 'dimension.size.field.height.lg'),
    borderRadius: readThemeDimension(dimensionSource, 'dimension.radius.field.md'),
    paddingHorizontal: readThemeDimension(dimensionSource, 'dimension.space.inset.lg'),
  },
};

/** Border widths, unitless. Same value at rest, on hover and when read-only; focus gets a thicker ring. */
export interface ITextFieldBorderWidthTokens {
  default: number;
  focus: number;
}

export const textFieldBorderWidthTokens: ITextFieldBorderWidthTokens = {
  default: readThemeDimension(dimensionSource, 'dimension.border.width.default'),
  focus: readThemeDimension(dimensionSource, 'dimension.border.width.focus'),
};

/** Vertical gap between label/field/footer, and the horizontal gap inside the footer. Unitless. */
export interface ITextFieldLayoutTokens {
  stackGap: number;
  inlineGap: number;
}

export const textFieldLayoutTokens: ITextFieldLayoutTokens = {
  stackGap: readThemeDimension(dimensionSource, 'dimension.space.inset.xs'),
  inlineGap: readThemeDimension(dimensionSource, 'dimension.space.inset.sm'),
};

/** Inline icon size, unitless — the "icon next to text" step of the icon scale. Reserved for a future icon slot. */
export const textFieldIconSize: number = readThemeDimension(dimensionSource, 'dimension.size.icon.sm');

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

const typographyAt = (path: string): ITextFieldTypographyRole =>
  readThemeTypography(typographySource, `typography.component.inputs.input-text.typography.${path}`);

export const textFieldTypographyTokens: ITextFieldTypographyTokens = {
  label: typographyAt('text-holder'),
  content: typographyAt('content'),
  helper: typographyAt('helper'),
  counter: typographyAt('character-count'),
};
