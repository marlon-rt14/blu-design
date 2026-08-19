import type { TButtonSize, TButtonVariant } from '../types/atoms/button.types';
import { colors } from './colors';
import { radii } from './radii';
import { spacing } from './spacing';
import { typography } from './typography';

/**
 * Colors a single Button variant needs, across every interaction state.
 *
 * Every field is a resolved color string so that both platforms can consume it
 * without further processing.
 */
export interface IButtonVariantTokens {
  /** Background at rest. */
  background: string;
  /** Background while the button is pressed or hovered. */
  backgroundPressed: string;
  /** Background when the button is disabled. */
  backgroundDisabled: string;
  /** Border color at rest. `'transparent'` for variants without a visible border. */
  border: string;
  /** Border color when the button is disabled. */
  borderDisabled: string;
  /** Label color at rest. */
  label: string;
  /** Label color when the button is disabled. */
  labelDisabled: string;
}

/**
 * Metrics a single Button size needs.
 *
 * All values are unitless: mobile passes them straight to `StyleSheet`, web
 * mirrors them as `px` custom properties.
 */
export interface IButtonSizeTokens {
  /** Vertical padding, unitless. */
  paddingVertical: number;
  /** Horizontal padding, unitless. */
  paddingHorizontal: number;
  /** Label font size, unitless. */
  fontSize: number;
  /** Corner radius, unitless. */
  borderRadius: number;
}

/**
 * Single source of truth for the Button colors, keyed by variant.
 *
 * `packages/mobile` consumes this directly inside `StyleSheet.create`, while
 * `packages/web` mirrors it as custom properties in `src/styles/tokens.css`
 * because CSS cannot import values from TypeScript. Changing a color here means
 * changing it in that file too.
 */
export const buttonVariantTokens: Record<TButtonVariant, IButtonVariantTokens> = {
  primary: {
    background: colors.blue600,
    backgroundPressed: colors.blue700,
    backgroundDisabled: colors.slate200,
    border: 'transparent',
    borderDisabled: 'transparent',
    label: colors.white,
    labelDisabled: colors.slate400,
  },
  secondary: {
    background: colors.white,
    backgroundPressed: colors.slate100,
    backgroundDisabled: colors.slate100,
    border: colors.slate300,
    borderDisabled: colors.slate200,
    label: colors.slate900,
    labelDisabled: colors.slate400,
  },
};

/**
 * Single source of truth for the Button metrics, keyed by size.
 *
 * Every value is derived from the primitive scales ({@link spacing},
 * {@link radii}, {@link typography}) rather than hardcoded, so widening a scale
 * propagates to the component.
 */
export const buttonSizeTokens: Record<TButtonSize, IButtonSizeTokens> = {
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSizes.sm,
    borderRadius: radii.sm,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSizes.md,
    borderRadius: radii.md,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    fontSize: typography.fontSizes.lg,
    borderRadius: radii.lg,
  },
};
