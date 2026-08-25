/**
 * `@dsm/shared` — the platform-agnostic layer of the design system.
 *
 * Exports the design tokens and the base type contracts that `@dsm/web` and
 * `@dsm/mobile` build on. Nothing here imports from React, React DOM or React
 * Native, so it is safe to consume from any runtime.
 */
export * from './themeSource';
export * from './tokens';
export * from './types';
