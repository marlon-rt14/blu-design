import type { TButtonSize, TButtonVariant } from '../types/atoms/button.types';
import { colors } from './colors';
import { radii } from './radii';
import { spacing } from './spacing';
import { typography } from './typography';

export interface IButtonVariantTokens {
  background: string;
  backgroundPressed: string;
  backgroundDisabled: string;
  border: string;
  borderDisabled: string;
  label: string;
  labelDisabled: string;
}

export interface IButtonSizeTokens {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  borderRadius: number;
}

/**
 * Single source of truth for the Button colors.
 * `packages/mobile` consumes them directly, while `packages/web` mirrors them
 * as custom properties in `src/styles/tokens.css`.
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
