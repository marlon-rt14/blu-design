export const typography = {
  fontSizes: {
    sm: 14,
    md: 16,
    lg: 18,
  },
  /**
   * Stored as strings because React Native only accepts numeric font weights
   * in string form ('600'), and the same value is valid in CSS.
   */
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
  },
} as const;

export type TFontSizeName = keyof typeof typography.fontSizes;
export type TFontWeightName = keyof typeof typography.fontWeights;
