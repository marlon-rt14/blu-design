export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export type TRadiusName = keyof typeof radii;
