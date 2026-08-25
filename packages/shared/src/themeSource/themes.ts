import baseColor from '../theme/base/color.json';
import baseDimension from '../theme/base/dimension.json';
import baseString from '../theme/base/string.json';
import baseTypography from '../theme/base/typography.json';
import darkColor from '../theme/dark/color.json';
import darkDimension from '../theme/dark/dimension.json';
import darkString from '../theme/dark/string.json';
import darkTypography from '../theme/dark/typography.json';

/**
 * A theme mode available in the design system.
 *
 * Backed by the `theme/base` (light) and `theme/dark` folders, synced
 * automatically from Supernova. Adding a mode (e.g. `hc-light`) means adding
 * its folder here once Supernova exports it — nothing else in this file
 * changes.
 */
export type TThemeMode = 'light' | 'dark';

/** The four Style-Dictionary-categorized token files Supernova exports per theme. */
export interface IThemeSource {
  color: unknown;
  dimension: unknown;
  typography: unknown;
  string: unknown;
}

/**
 * Raw, fully-resolved token trees per theme, straight from the Supernova
 * export. Component token modules (e.g. `textField.tokens.ts`) read out of
 * these with `readThemeToken` / `readThemeDimension` / `readThemeTypography`
 * instead of importing the JSON directly, so the path lookup and error
 * handling only live in one place.
 */
export const themeSources: Record<TThemeMode, IThemeSource> = {
  light: {
    color: baseColor,
    dimension: baseDimension,
    typography: baseTypography,
    string: baseString,
  },
  dark: {
    color: darkColor,
    dimension: darkDimension,
    typography: darkTypography,
    string: darkString,
  },
};

/** Every theme mode, in a stable order — useful when generating per-theme output. */
export const THEME_MODES: readonly TThemeMode[] = ['light', 'dark'];
