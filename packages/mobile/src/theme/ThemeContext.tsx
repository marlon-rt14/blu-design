import { DEFAULT_THEME_BRAND, DEFAULT_THEME_MODE, resolveTheme } from '@dsm/shared';
import type { IResolvedTheme, IThemeRequest, TThemeMode, TThemeSourceKey } from '@dsm/shared';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren, ReactElement } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext<IResolvedTheme>(resolveTheme());

/**
 * Props of {@link ThemeProvider}: the three theme axes, all optional.
 *
 * Leave `mode` unset and it follows the OS setting. Leave the others unset and
 * they stay at their defaults — `blu` and `compact`.
 */
export interface IThemeProviderProps extends PropsWithChildren, IThemeRequest {}

/**
 * Makes the active theme available to every `@dsm/mobile` component via
 * {@link useThemeMode}.
 *
 * Takes the three axes bDS has: `brand`, `mode` and `layout`. It resolves them
 * to one exported theme through `resolveTheme`, where the awkward part lives:
 * **the export has no combinations**, so only one axis can leave its default.
 * Read `useResolvedTheme().isExact` to find out whether the request survived.
 *
 * Without a `mode` it tracks `Appearance.getColorScheme()` live — flipping the
 * OS setting updates every themed component without a restart. There is no CSS
 * cascade on React Native, so this context is the equivalent of `@dsm/web`'s
 * own `ThemeContext`: both platforms resolve the same per-theme token records
 * from `@dsm/shared` at render time.
 *
 * @example
 * ```tsx
 * // App root — follows the OS setting, default brand:
 * <ThemeProvider><App /></ThemeProvider>
 * // A screen that belongs to another product:
 * <ThemeProvider brand="discover"><Checkout /></ThemeProvider>
 * // Storybook — every axis forced from the toolbar:
 * <ThemeProvider brand={globals.brand} mode={globals.mode}><Story /></ThemeProvider>
 * ```
 */
export const ThemeProvider = ({
  brand,
  mode,
  layout,
  children,
}: IThemeProviderProps): ReactElement => {
  const [systemMode, setSystemMode] = useState<TThemeMode>(
    () => Appearance.getColorScheme() ?? 'light',
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemMode(colorScheme ?? 'light');
    });
    return () => subscription.remove();
  }, []);

  // An axis the caller stated beats one the OS merely prefers. Without this, a
  // screen that asks for `brand="discover"` on a phone set to dark would
  // resolve to dark and lose the brand — the export cannot have both, and the
  // brand is the one that was asked for out loud.
  const statedBrand = brand !== undefined && brand !== DEFAULT_THEME_BRAND;
  const effectiveMode = mode ?? (statedBrand ? DEFAULT_THEME_MODE : systemMode);

  return (
    <ThemeContext.Provider value={resolveTheme({ brand, mode: effectiveMode, layout })}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Reads the key of the exported theme in effect — what token records are indexed
 * by.
 *
 * Kept under this name because that is what every component calls, and for the
 * default brand and layout the key *is* the mode. When a brand is in play the
 * key is the brand's, since that is the folder the values come from. Use
 * {@link useResolvedTheme} when you need the axes rather than the key.
 */
export const useThemeMode = (): TThemeSourceKey => useContext(ThemeContext).key;

/**
 * Reads the whole resolution: the key, the axes actually in effect, and whether
 * the request was exact.
 *
 * `isExact` is `false` when more than one axis left its default and the widest
 * one won.
 */
export const useResolvedTheme = (): IResolvedTheme => useContext(ThemeContext);
