/**
 * `@dsm/web` — design system components for the browser.
 *
 * Built on the contracts and tokens of `@dsm/shared`, styled with plain CSS.
 * Importing this package also loads the token custom properties, so consumers
 * do not need a separate stylesheet import.
 */

// Tokens are loaded once, when the package is imported.
import './styles/tokens.css';

export * from './components';
