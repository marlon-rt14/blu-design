import { pageColorTokens } from '@dsm/shared';
import type { IThemeRequest } from '@dsm/shared';
import type { CSSProperties, PropsWithChildren, ReactElement } from 'react';

import { ThemeProvider, useFontFamily, useThemeMode } from './theme';

/** Props of {@link BluProvider}. */
export interface IBluProviderProps extends PropsWithChildren, IThemeRequest {
  /** Extra class applied to the root element, e.g. to size it in Storybook. */
  className?: string;
  /** Extra inline styles, merged after the theme's own background/text/font. */
  style?: CSSProperties;
}

const ThemedSurface = ({
  className,
  style,
  children,
}: PropsWithChildren<{ className?: string; style?: CSSProperties }>): ReactElement => {
  const mode = useThemeMode();
  const colors = pageColorTokens[mode];
  const fontFamily = useFontFamily('400');

  return (
    <div
      className={className}
      style={{ backgroundColor: colors.background, color: colors.text, fontFamily, ...style }}
    >
      {children}
    </div>
  );
};

/**
 * Root wrapper for `@dsm/web` — wrap your app in this once, at the top.
 *
 * Sets up the active theme mode (see {@link useThemeMode}) for every themed
 * component below it, loads the Mulish typeface (see `theme/font.ts` — this
 * is the one place web and mobile genuinely diverge: web can load a font
 * file at runtime, bare React Native cannot), and paints its own root
 * element with the theme's page background/text/font so a themed page never
 * needs its own CSS for those three properties.
 *
 * Takes the three theme axes bDS has — `brand`, `mode` and `layout` — and
 * resolves them to one exported theme. Only one of them can leave its default,
 * because the export has no combinations; see `resolveTheme` in `@dsm/shared`.
 *
 * @example
 * ```tsx
 * // App root — follows the OS theme setting, default brand:
 * <BluProvider><App /></BluProvider>
 * // A screen that belongs to another product:
 * <BluProvider brand="discover"><Checkout /></BluProvider>
 * // Storybook — forced from the toolbar, sized to fill the canvas:
 * <BluProvider brand={globals.brand} mode={globals.mode} style={{ minHeight: '100vh' }}><Story /></BluProvider>
 * ```
 */
export const BluProvider = ({
  brand,
  mode,
  layout,
  className,
  style,
  children,
}: IBluProviderProps): ReactElement => (
  <ThemeProvider brand={brand} layout={layout} mode={mode}>
    <ThemedSurface className={className} style={style}>
      {children}
    </ThemedSurface>
  </ThemeProvider>
);
