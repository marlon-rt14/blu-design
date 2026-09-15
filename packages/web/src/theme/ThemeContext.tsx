import {
  DEFAULT_THEME_BRAND,
  DEFAULT_THEME_MODE,
  resolveTheme,
} from '@dsm/shared';
import type { IResolvedTheme, IThemeRequest, TThemeMode, TThemeSourceKey } from '@dsm/shared';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren, ReactElement } from 'react';

const ThemeContext = createContext<IResolvedTheme>(resolveTheme());
const ReducedMotionContext = createContext<boolean>(false);

const getSystemThemeMode = (): TThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getSystemReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Props of {@link ThemeProvider}: the three theme axes, all optional.
 *
 * Leave `mode` unset and it follows the OS setting. Leave the others unset and
 * they stay at their defaults — `blu` and `compact`.
 */
export interface IThemeProviderProps extends PropsWithChildren, IThemeRequest {}

/**
 * Makes the active theme — and whether the OS asked for reduced motion —
 * available to every `@dsm/web` component via {@link useThemeMode} and
 * {@link usePrefersReducedMotion}.
 *
 * Takes the three axes bDS has: `brand`, `mode` and `layout`. It resolves them
 * to one exported theme through `resolveTheme`, which is where the awkward part
 * lives: **the export has no combinations**, so only one axis can leave its
 * default. Read `useResolvedTheme().isExact` to find out whether the request
 * survived.
 *
 * Without a `mode` it tracks `prefers-color-scheme` live through `matchMedia`,
 * the same idea as mobile's `Appearance.addChangeListener`. Components read
 * tokens from `tokens[key]` at render time instead of a CSS custom-property
 * cascade — see `useTextField` for the pattern.
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

  // An axis the caller stated beats one the OS merely prefers. Without this, a
  // screen that asks for `brand="discover"` on a machine set to dark would
  // resolve to dark and lose the brand — the export cannot have both, and the
  // brand is the one that was asked for out loud.
  const statedBrand = brand !== undefined && brand !== DEFAULT_THEME_BRAND;
  const effectiveMode = mode ?? (statedBrand ? DEFAULT_THEME_MODE : systemMode);

  return (
    <ThemeContext.Provider value={resolveTheme({ brand, mode: effectiveMode, layout })}>
      <ReducedMotionContext.Provider value={prefersReducedMotion}>
        {children}
      </ReducedMotionContext.Provider>
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
 * one won. Storybook uses it to say so on the canvas rather than let a toolbar
 * claim a combination that is not being rendered.
 */
export const useResolvedTheme = (): IResolvedTheme => useContext(ThemeContext);

/**
 * Reads whether the OS asked for reduced motion. Falls back to `false`
 * outside a {@link ThemeProvider}.
 *
 * Needed because components now build `transition` inline from JS instead of
 * hiding it behind a `@media (prefers-reduced-motion: reduce)` rule in CSS —
 * see `useTextField`.
 */
export const usePrefersReducedMotion = (): boolean => useContext(ReducedMotionContext);
