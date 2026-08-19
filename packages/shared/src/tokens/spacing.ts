/**
 * Spacing scale, in unitless values.
 * Mobile consumes them as is; web converts them to `px`.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export type TSpacingName = keyof typeof spacing;
