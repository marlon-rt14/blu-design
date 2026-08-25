/**
 * `@dsm/web` — design system components for the browser.
 *
 * Built on the contracts and tokens of `@dsm/shared`, styled with plain CSS.
 * Importing this package also loads the token custom properties and the
 * Mulish typeface, so consumers do not need a separate stylesheet or font
 * import.
 */

// Self-hosted Mulish (variable weight, no external font request) — brand
// typeface per `string.platform.font.family` in the Supernova token export.
import '@fontsource-variable/mulish';
// Tokens are loaded once, when the package is imported.
import './styles/tokens.css';
import './styles/textfield-theme.css';

export * from './components';
