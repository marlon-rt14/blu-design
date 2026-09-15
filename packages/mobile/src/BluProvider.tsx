import type { IThemeRequest } from '@dsm/shared';
import type { PropsWithChildren, ReactElement } from 'react';

import { ThemeProvider } from './theme';

/** Props of {@link BluProvider}. */
export interface IBluProviderProps extends PropsWithChildren, IThemeRequest {}

/**
 * Root wrapper for `@dsm/mobile` — wrap your app in this once, at the top.
 *
 * Sets up the active theme mode (see {@link useThemeMode}) for every themed
 * component below it. It does **not** load the Mulish typeface: bare React
 * Native has no runtime API to inject a font file the way a JS provider
 * could — fonts are a native build concern, linked once ahead of time (see
 * `theme/font.ts`'s `resolveMulishFontFamily` / `useFontFamily`, and
 * `react-native.config.js` in the consuming app). `@dsm/web`'s `BluProvider`
 * does not have this limitation — it loads Mulish itself, from its own
 * `theme/font.ts`.
 *
 * @example
 * ```tsx
 * // App root — follows the OS theme setting:
 * <BluProvider><App /></BluProvider>
 * // Storybook — forced from the toolbar:
 * <BluProvider brand={globals.brand} mode={globals.mode}><Story /></BluProvider>
 * ```
 */
export const BluProvider = ({
  brand,
  mode,
  layout,
  children,
}: IBluProviderProps): ReactElement => (
  <ThemeProvider brand={brand} layout={layout} mode={mode}>
    {children}
  </ThemeProvider>
);
