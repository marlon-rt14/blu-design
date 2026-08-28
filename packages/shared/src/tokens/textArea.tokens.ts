import { readThemeDimension, readThemeToken } from '../themeSource/tokenPath';
import type { IThemeTypographyValue } from '../themeSource/tokenPath';
import { themeSources } from '../themeSource/themes';
import type { TThemeMode } from '../themeSource/themes';
import { baseFontFamily } from './theme.tokens';

/** Container colors, keyed by the state that drives them. */
export interface ITextAreaContainerColorTokens {
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
export interface ITextAreaValueColorTokens {
  placeholder: string;
  filled: string;
  disabled: string;
  readOnly: string;
}

/** Colors for the floating label: a default and a disabled state, nothing else. */
export interface ITextAreaSupportColorTokens {
  default: string;
  disabled: string;
}

/** Helper text and the counter also carry an error variant; the label does not. */
export interface ITextAreaFeedbackColorTokens extends ITextAreaSupportColorTokens {
  error: string;
}

/**
 * Every color a TextArea needs, resolved for a single theme.
 *
 * Unlike `ITextFieldColorTokens`, there is no `icon` group —
 * `color.component.textarea.*` in the theme export has none.
 */
export interface ITextAreaColorTokens {
  container: ITextAreaContainerColorTokens;
  label: ITextAreaSupportColorTokens;
  value: ITextAreaValueColorTokens;
  helper: ITextAreaFeedbackColorTokens;
  counter: ITextAreaFeedbackColorTokens;
}

/**
 * Metrics for the field. Unlike `ITextFieldSizeTokens`, this is not keyed by
 * a size — TextArea has a single `state` variant axis, no size axis (see
 * `ITextAreaBaseProps`).
 */
export interface ITextAreaDimensionTokens {
  /**
   * The floor of the container's height, not its height — the field grows
   * with content above this. The actual starting height comes from the
   * platform's `rows` / `numberOfLines` prop, not from a token.
   */
  minHeight: number;
  borderRadius: number;
  paddingHorizontal: number;
  paddingVertical: number;
  borderWidth: number;
  /**
   * Spread of the outer focus ring — a separate absolutely-positioned layer
   * outside the container, not a change to the container's own border (see
   * `useTextArea`'s doc comment on why focus never recolors `border`).
   */
  focusRingSpread: number;
  /** Padding-top of each footer slot (helper, counter) — the 4px separator
   * from the field lives here, not in a root gap, specifically so either
   * slot can be hidden independently without leaving a hole. See
   * `ITextAreaBaseProps.helperText` / `.maxLength`. */
  footerSlotGap: number;
  /** Padding-left of the counter slot, pushing it away from the helper slot. */
  footerInlineGap: number;
}

/** One resolved typography role: font weight, size, line height and family. */
export type ITextAreaTypographyRole = IThemeTypographyValue;

/**
 * TextArea typography, one role per text element. Composed from primitives
 * (`dimension.font.*`), not read from `typography.component.inputs.input-text.*`
 * — that composite group resolves to unrelated values (confirmed against
 * Figma's `get_design_context`: it renders the label Regular/13px instead of
 * ExtraBold/12px). The node's own bound text styles — `text/label/sm/strong`
 * for the label, `text/body/md/default` for the value, `text/caption/md/default`
 * for helper/counter — never landed as a `type: "typography"` composite in
 * the Style Dictionary export, only as the primitives they're built from.
 */
export interface ITextAreaTypographyTokens {
  /** The floating label. */
  label: ITextAreaTypographyRole;
  /** The value the user types or sees. */
  content: ITextAreaTypographyRole;
  /** Helper text / error message in the footer's left slot. */
  helper: ITextAreaTypographyRole;
  /** The `"n/max"` character counter in the footer's right slot. */
  counter: ITextAreaTypographyRole;
}

/** Every token a TextArea needs, resolved for a single theme. */
export interface ITextAreaTokens {
  colors: ITextAreaColorTokens;
  dimension: ITextAreaDimensionTokens;
  typography: ITextAreaTypographyTokens;
}

const readTextAreaTokens = (mode: TThemeMode): ITextAreaTokens => {
  const { color, dimension } = themeSources[mode];
  const colorAt = (path: string): string => readThemeToken(color, `color.component.textarea.${path}`);
  const dimensionAt = (path: string): number => readThemeDimension(dimension, `dimension.${path}`);
  // `font.line-height.*` primitives are literal percentages mis-typed as
  // `px` upstream (e.g. `"135px"` means 135%, i.e. a 1.35 multiplier) — see
  // that token's own description in `dimension.json`.
  const composedTypographyAt = (
    sizePath: string,
    weightPath: string,
    lineHeightRatioPath: string,
  ): ITextAreaTypographyRole => {
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
    },
    dimension: {
      minHeight: dimensionAt('size.field.height.md'),
      borderRadius: dimensionAt('radius.field.md'),
      paddingHorizontal: dimensionAt('space.inset.md'),
      paddingVertical: dimensionAt('space.inset.sm'),
      borderWidth: dimensionAt('border.width.default'),
      focusRingSpread: dimensionAt('focus.ring.spread'),
      footerSlotGap: dimensionAt('space.stack.xs'),
      footerInlineGap: dimensionAt('space.inline.sm'),
    },
    typography: {
      label: composedTypographyAt('font.size.label.sm', 'font.weight.extrabold', 'font.line-height.snug'),
      content: composedTypographyAt('font.size.body.md', 'font.weight.regular', 'font.line-height.normal'),
      helper: composedTypographyAt('font.size.caption.md', 'font.weight.regular', 'font.line-height.normal'),
      counter: composedTypographyAt('font.size.caption.md', 'font.weight.regular', 'font.line-height.normal'),
    },
  };
};

/**
 * TextArea tokens, keyed by theme mode.
 *
 * Source: `color.component.textarea.*` and `dimension.*` in `theme/base`
 * (light) and `theme/dark`. Both platforms pick the right entry at render
 * time via `useThemeMode()`.
 */
export const textAreaTokens: Record<TThemeMode, ITextAreaTokens> = {
  light: readTextAreaTokens('light'),
  dark: readTextAreaTokens('dark'),
};
