import { pageColorTokens } from '@dsm/shared';
import type { TThemeMode } from '@dsm/shared';
import type { CSSProperties, PropsWithChildren, ReactElement } from 'react';

import { ThemeProvider, useFontFamily, useThemeMode } from './theme';

/** Props of {@link BluProvider}. */
export interface IBluProviderProps extends PropsWithChildren {
  /**
   * Forces a theme mode instead of following the OS setting. Used by
   * Storybook's theme toolbar; app code should normally leave this unset.
   */
  mode?: TThemeMode;
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
 * @example
 * ```tsx
 * // App root — follows the OS theme setting:
 * <BluProvider><App /></BluProvider>
 * // Storybook — forced from the toolbar, sized to fill the canvas:
 * <BluProvider mode={globals.theme} style={{ minHeight: '100vh' }}><Story /></BluProvider>
 * ```
 */
export const BluProvider = ({ mode, className, style, children }: IBluProviderProps): ReactElement => (
  <ThemeProvider mode={mode}>
    <ThemedSurface className={className} style={style}>
      {children}
    </ThemedSurface>
  </ThemeProvider>
);
