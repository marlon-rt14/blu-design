import { baseFontFamily } from '@dsm/shared';

// Self-hosted Mulish, one file per weight the design system actually uses
// (must match packages/mobile/assets/fonts/, so the same type ramp renders
// consistently on both platforms). Registers as font-family "Mulish", not
// "Mulish Variable" — deliberately NOT @fontsource-variable/mulish, whose
// @font-face declares "Mulish Variable" and would silently not match the
// "Mulish" family every typography token specifies.
//
// Lives here, not in the package entry, so importing `BluProvider` is what
// pulls the typeface in — the same "provider owns the font" shape mobile's
// BluProvider doc comment describes, even though mobile can't actually load
// a file at runtime and web can.
import '@fontsource/mulish/400.css';
import '@fontsource/mulish/500.css';
import '@fontsource/mulish/600.css';
import '@fontsource/mulish/700.css';
import '@fontsource/mulish/800.css';

// The token value is just "Mulish" — Supernova defines the intended family,
// not a web fallback stack.
const WEB_FONT_FALLBACK = 'sans-serif';

/**
 * Resolves the design system's font stack for web.
 *
 * Takes a `fontWeight` for API symmetry with `@dsm/mobile`'s
 * `useFontFamily` (which needs it to pick a static font file — see that
 * module's doc comment), but ignores it: a single `@font-face` family
 * already covers every weight through the CSS imports above, unlike bare
 * React Native, which needs one linked file per weight.
 */
export const useFontFamily = (_fontWeight: string): string => `${baseFontFamily}, ${WEB_FONT_FALLBACK}`;
