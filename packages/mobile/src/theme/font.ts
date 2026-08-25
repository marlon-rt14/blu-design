/**
 * Maps a numeric font-weight token (as read from `theme/{base,dark}/typography.json`
 * via `readThemeTypography`) to the exact static Mulish font file `@dsm/mobile`
 * ships in `assets/fonts/`.
 *
 * React Native cannot select a weight out of a single variable font file the
 * way CSS `font-weight` does — each weight needs its own linked font file,
 * and both platforms resolve it by this exact string: Android by filename,
 * iOS by the font's PostScript name. Every `Mulish-*.ttf` in `assets/fonts/`
 * was renamed so its filename, family name and PostScript name are all this
 * same string, specifically so one value works on both platforms.
 *
 * These files must be linked into the consuming app's native projects once
 * (`npx react-native-asset` from the app, after `@dsm/mobile` is installed —
 * see README "Theming & tokens"). `BluProvider` cannot do this for you: bare
 * React Native has no way to load a font file at JS runtime, only at build
 * time via the native project.
 */
const MULISH_FONT_FAMILY_BY_WEIGHT: Record<string, string> = {
  '400': 'Mulish-Regular',
  '500': 'Mulish-Medium',
  '600': 'Mulish-SemiBold',
  '700': 'Mulish-Bold',
  '800': 'Mulish-ExtraBold',
};

/**
 * Resolves a typography token's `fontWeight` (e.g. `"600"`) to the Mulish
 * font file that renders it. Throws on an unknown weight instead of silently
 * falling back — a weight with no matching file means a new one needs
 * instancing into `assets/fonts/`, not a silently wrong render.
 */
export const resolveMulishFontFamily = (fontWeight: string): string => {
  const family = MULISH_FONT_FAMILY_BY_WEIGHT[fontWeight];
  if (!family) {
    throw new Error(
      `No Mulish font file for weight "${fontWeight}". Instance it into packages/mobile/assets/fonts/ and add it to MULISH_FONT_FAMILY_BY_WEIGHT.`,
    );
  }
  return family;
};
