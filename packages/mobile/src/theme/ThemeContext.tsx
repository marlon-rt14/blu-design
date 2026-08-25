import type { TThemeMode } from '@dsm/shared';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren, ReactElement } from 'react';
import { Appearance } from 'react-native';

const ThemeModeContext = createContext<TThemeMode>('light');

/** Props of {@link ThemeProvider}. */
export interface IThemeProviderProps extends PropsWithChildren {
  /**
   * Forces a theme mode instead of following the OS setting. Used by
   * Storybook's theme toolbar; app code should normally leave this unset.
   */
  mode?: TThemeMode;
}

/**
 * Makes the active theme mode available to every `@dsm/mobile` component via
 * {@link useThemeMode}.
 *
 * Without a `mode` override, it tracks `Appearance.getColorScheme()` live —
 * flipping the OS setting updates every themed component without a restart.
 * There is no CSS cascade on React Native, so this context is the equivalent
 * of the web `data-dsm-theme` attribute (see `textfield-theme.css` in
 * `@dsm/web`).
 *
 * @example
 * ```tsx
 * // App root — follows the OS setting:
 * <ThemeProvider><App /></ThemeProvider>
 * // Storybook — forced from the toolbar:
 * <ThemeProvider mode={globals.theme}><Story /></ThemeProvider>
 * ```
 */
export const ThemeProvider = ({ mode, children }: IThemeProviderProps): ReactElement => {
  const [systemMode, setSystemMode] = useState<TThemeMode>(
    () => Appearance.getColorScheme() ?? 'light',
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemMode(colorScheme ?? 'light');
    });
    return () => subscription.remove();
  }, []);

  return <ThemeModeContext.Provider value={mode ?? systemMode}>{children}</ThemeModeContext.Provider>;
};

/** Reads the active theme mode. Falls back to `'light'` outside a {@link ThemeProvider}. */
export const useThemeMode = (): TThemeMode => useContext(ThemeModeContext);
