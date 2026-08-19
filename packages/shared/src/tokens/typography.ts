/**
 * Typographic scale shared by both platforms.
 *
 * Font sizes are unitless (see {@link spacing} for the rationale).
 */
export const typography = {
  /** Font sizes, unitless. Mobile uses them directly, web converts them to `px`. */
  fontSizes: {
    sm: 14,
    md: 16,
    lg: 18,
  },
  /**
   * Font weights as strings.
   *
   * React Native only accepts numeric weights in string form (`'600'`), and the
   * same value is valid in CSS, so one representation covers both platforms.
   */
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
  },
} as const;

/** Every valid key of `typography.fontSizes`. */
export type TFontSizeName = keyof typeof typography.fontSizes;

/** Every valid key of `typography.fontWeights`. */
export type TFontWeightName = keyof typeof typography.fontWeights;
