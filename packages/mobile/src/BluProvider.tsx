import type { TThemeMode } from '@dsm/shared';
import type { PropsWithChildren, ReactElement } from 'react';

import { ThemeProvider } from './theme';

/** Props of {@link BluProvider}. */
export interface IBluProviderProps extends PropsWithChildren {
  /**
   * Forces a theme mode instead of following the OS setting. Used by
   * Storybook's theme toolbar; app code should normally leave this unset.
   */
  mode?: TThemeMode;
}

/**
 * Root wrapper for `@dsm/mobile` — wrap your app in this once, at the top.
 *
 * Sets up the active theme mode (see {@link useThemeMode}) for every themed
 * component below it. It does **not** load the Mulish typeface: bare React
 * Native has no runtime API to inject a font file the way a JS provider
 * could — fonts are a native build concern, linked once ahead of time.
 *
 * Required one-time setup per consuming app (already done for
 * `apps/react-native-demo`, redo only if `@dsm/mobile`'s font set changes):
 *
 * ```bash
 * pnpm --filter <app> add -D react-native-asset
 * # react-native.config.js: assets: ['<path-to>/@dsm/mobile/assets/fonts']
 * npx react-native-asset
 * ```
 *
 * See README "Theming & tokens" for the full explanation, including why
 * mobile uses Mulish at all despite the token's own "web-only" description.
 *
 * @example
 * ```tsx
 * // App root — follows the OS theme setting:
 * <BluProvider><App /></BluProvider>
 * // Storybook — forced from the toolbar:
 * <BluProvider mode={globals.theme}><Story /></BluProvider>
 * ```
 */
export const BluProvider = ({ mode, children }: IBluProviderProps): ReactElement => (
  <ThemeProvider mode={mode}>{children}</ThemeProvider>
);
