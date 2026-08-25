import { baseFontFamily } from '@dsm/shared';

// Plain @fontsource/mulish, NOT @fontsource-variable/mulish — the variable
// package's @font-face registers as "Mulish Variable", which would silently
// not match the "Mulish" family every typography token specifies. Imported
// here, not from the package entry, so importing `BluProvider` is what pulls
// the typeface in.
import '@fontsource/mulish/400.css';
import '@fontsource/mulish/500.css';
import '@fontsource/mulish/600.css';
import '@fontsource/mulish/700.css';
import '@fontsource/mulish/800.css';

const WEB_FONT_FALLBACK = 'sans-serif';

/**
 * Resolves the design system's font stack for web.
 *
 * Takes a `fontWeight` for API symmetry with `@dsm/mobile`'s `useFontFamily`
 * (which needs it to pick a static font file), but ignores it: a single
 * `@font-face` family already covers every weight through the CSS imports
 * above.
 */
export const useFontFamily = (_fontWeight: string): string => `${baseFontFamily}, ${WEB_FONT_FALLBACK}`;
