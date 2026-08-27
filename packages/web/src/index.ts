/**
 * `@dsm/web` — design system components for the browser.
 *
 * Built on the contracts and tokens of `@dsm/shared`. Every component styles
 * itself inline from `theme[mode]` at render time (see `BluProvider`,
 * `useTextField` and `useButton`) — `Button` was the last holdout and has now
 * migrated, so no component reads a stylesheet.
 *
 * Two CSS files still ship. `pseudo.css` is load-bearing: `::placeholder` is a
 * pseudo-element and has no inline-style equivalent. `tokens.css` is not — it
 * only survives because `apps/web-demo/src/App.css` still uses its primitives
 * for the demo page's chrome, and belongs in that app instead.
 *
 * The Mulish typeface loads from `BluProvider`'s `theme/font.ts`, not from here
 * — importing this package alone no longer pulls in fonts.
 */
import './styles/tokens.css';
import './styles/pseudo.css';

export * from './components';
export * from './theme';
export * from './BluProvider';
