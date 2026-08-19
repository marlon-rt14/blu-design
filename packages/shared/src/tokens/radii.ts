/**
 * Corner radius scale, in unitless values.
 *
 * Same convention as {@link spacing}: mobile uses the numbers directly, web
 * turns them into `px`.
 */
export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

/** Every valid key of {@link radii}. */
export type TRadiusName = keyof typeof radii;
