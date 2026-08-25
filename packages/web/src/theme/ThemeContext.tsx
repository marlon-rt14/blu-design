import type { TThemeMode } from '@dsm/shared';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren, ReactElement } from 'react';

const ThemeModeContext = createContext<TThemeMode>('light');
const ReducedMotionContext = createContext<boolean>(false);

const getSystemThemeMode = (): TThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getSystemReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Props of {@link ThemeProvider}. */
export interface IThemeProviderProps extends PropsWithChildren {
  /**
   * Forces a theme mode instead of following the OS setting. Used by
   * Storybook's theme toolbar; app code should normally leave this unset.
   */
  mode?: TThemeMode;
}

/**
 * Makes the active theme mode — and whether the OS asked for reduced motion —
 * available to every `@dsm/web` component via {@link useThemeMode} and
 * {@link usePrefersReducedMotion}.
 *
 * Without a `mode` override, it tracks `prefers-color-scheme` live through
 * `matchMedia`, the same idea as mobile's `Appearance.addChangeListener` (see
 * `@dsm/mobile`'s `ThemeContext.tsx`). Components read tokens from
 * `theme[mode]` at render time instead of a CSS custom-property cascade — see
 * `useTextField` for the pattern.
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
  const [systemMode, setSystemMode] = useState<TThemeMode>(getSystemThemeMode);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(getSystemReducedMotion);

  useEffect(() => {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onColorSchemeChange = (event: MediaQueryListEvent): void => {
      setSystemMode(event.matches ? 'dark' : 'light');
    };
    colorSchemeQuery.addEventListener('change', onColorSchemeChange);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(event.matches);
    };
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      colorSchemeQuery.removeEventListener('change', onColorSchemeChange);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <ThemeModeContext.Provider value={mode ?? systemMode}>
      <ReducedMotionContext.Provider value={prefersReducedMotion}>{children}</ReducedMotionContext.Provider>
    </ThemeModeContext.Provider>
  );
};

/** Reads the active theme mode. Falls back to `'light'` outside a {@link ThemeProvider}. */
export const useThemeMode = (): TThemeMode => useContext(ThemeModeContext);

/**
 * Reads whether the OS asked for reduced motion. Falls back to `false`
 * outside a {@link ThemeProvider}.
 *
 * Needed because components now build `transition` inline from JS instead of
 * hiding it behind a `@media (prefers-reduced-motion: reduce)` rule in CSS —
 * see `useTextField`.
 */
export const usePrefersReducedMotion = (): boolean => useContext(ReducedMotionContext);
