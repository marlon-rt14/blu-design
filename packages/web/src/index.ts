/**
 * `@dsm/web` — design system components for the browser.
 *
 * Built on the contracts and tokens of `@dsm/shared`. Components style
 * themselves inline from `theme[mode]` at render time (see `BluProvider` and
 * `useTextField`); the only CSS this package still ships is `tokens.css`
 * (legacy — `Button` hasn't migrated off it yet) and `pseudo.css`, for the
 * one thing an inline style cannot express: `::placeholder`. The Mulish
 * typeface loads from `BluProvider`'s `theme/font.ts`, not from here —
 * importing this package alone no longer pulls in fonts or global CSS.
 */
import './styles/tokens.css';
import './styles/pseudo.css';

export * from './components';
export * from './theme';
export * from './BluProvider';
