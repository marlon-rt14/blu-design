import { buttonSizeTokens, buttonVariantTokens, typography } from '@dsm/shared';
import type { TButtonSize, TButtonVariant } from '@dsm/shared';
import { StyleSheet } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

/** Styles shared by every Button, regardless of variant or size. */
export const buttonStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
});

/** Container styles at rest, keyed by variant. */
export const containerVariantStyles: Record<TButtonVariant, ViewStyle> = StyleSheet.create({
  primary: {
    backgroundColor: buttonVariantTokens.primary.background,
    borderColor: buttonVariantTokens.primary.border,
  },
  secondary: {
    backgroundColor: buttonVariantTokens.secondary.background,
    borderColor: buttonVariantTokens.secondary.border,
  },
});

/** Container styles while pressed, keyed by variant. Layered on top of the resting styles. */
export const containerVariantPressedStyles: Record<TButtonVariant, ViewStyle> = StyleSheet.create({
  primary: {
    backgroundColor: buttonVariantTokens.primary.backgroundPressed,
  },
  secondary: {
    backgroundColor: buttonVariantTokens.secondary.backgroundPressed,
  },
});

/** Container styles when disabled, keyed by variant. Applied last so they win. */
export const containerVariantDisabledStyles: Record<TButtonVariant, ViewStyle> = StyleSheet.create({
  primary: {
    backgroundColor: buttonVariantTokens.primary.backgroundDisabled,
    borderColor: buttonVariantTokens.primary.borderDisabled,
  },
  secondary: {
    backgroundColor: buttonVariantTokens.secondary.backgroundDisabled,
    borderColor: buttonVariantTokens.secondary.borderDisabled,
  },
});

/** Label styles at rest, keyed by variant. */
export const labelVariantStyles: Record<TButtonVariant, TextStyle> = StyleSheet.create({
  primary: { color: buttonVariantTokens.primary.label },
  secondary: { color: buttonVariantTokens.secondary.label },
});

/** Label styles when disabled, keyed by variant. */
export const labelVariantDisabledStyles: Record<TButtonVariant, TextStyle> = StyleSheet.create({
  primary: { color: buttonVariantTokens.primary.labelDisabled },
  secondary: { color: buttonVariantTokens.secondary.labelDisabled },
});

/** Container padding and radius, keyed by size. Values come from `buttonSizeTokens`. */
export const containerSizeStyles: Record<TButtonSize, ViewStyle> = StyleSheet.create({
  small: {
    paddingVertical: buttonSizeTokens.small.paddingVertical,
    paddingHorizontal: buttonSizeTokens.small.paddingHorizontal,
    borderRadius: buttonSizeTokens.small.borderRadius,
  },
  medium: {
    paddingVertical: buttonSizeTokens.medium.paddingVertical,
    paddingHorizontal: buttonSizeTokens.medium.paddingHorizontal,
    borderRadius: buttonSizeTokens.medium.borderRadius,
  },
  large: {
    paddingVertical: buttonSizeTokens.large.paddingVertical,
    paddingHorizontal: buttonSizeTokens.large.paddingHorizontal,
    borderRadius: buttonSizeTokens.large.borderRadius,
  },
});

/** Label font size, keyed by size. Values come from `buttonSizeTokens`. */
export const labelSizeStyles: Record<TButtonSize, TextStyle> = StyleSheet.create({
  small: { fontSize: buttonSizeTokens.small.fontSize },
  medium: { fontSize: buttonSizeTokens.medium.fontSize },
  large: { fontSize: buttonSizeTokens.large.fontSize },
});
