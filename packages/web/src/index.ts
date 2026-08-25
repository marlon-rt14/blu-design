/**
 * `@dsm/web` — design system components for the browser.
 *
 * Built on the contracts and tokens of `@dsm/shared`, styled with plain CSS.
 * Importing this package also loads the token custom properties and the
 * Mulish typeface, so consumers do not need a separate stylesheet or font
 * import.
 */

// Self-hosted Mulish, one file per weight the design system actually uses
// (must match packages/mobile/assets/fonts/, so the same type ramp renders
// consistently on both platforms). Registers as font-family "Mulish", not
// "Mulish Variable" — deliberately NOT @fontsource-variable/mulish, whose
// @font-face declares "Mulish Variable" and would silently not match the
// "Mulish" family every typography token specifies.
import '@fontsource/mulish/400.css';
import '@fontsource/mulish/500.css';
import '@fontsource/mulish/600.css';
import '@fontsource/mulish/700.css';
import '@fontsource/mulish/800.css';
// Tokens are loaded once, when the package is imported.
import './styles/tokens.css';
import './styles/textfield-theme.css';

export * from './components';
