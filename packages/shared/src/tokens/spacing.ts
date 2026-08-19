/**
 * Spacing scale, in unitless values.
 *
 * Mobile consumes them as is (React Native treats numbers as density-independent
 * pixels); web converts them to `px`. Keeping them unitless is what allows a
 * single scale to serve both platforms.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/** Every valid key of {@link spacing}. */
export type TSpacingName = keyof typeof spacing;
