import { BluProvider as MobileBluProvider } from '@dsm/mobile';
import type { IResolvedTheme, TThemePlatform } from '@dsm/shared';
import { BluProvider as WebBluProvider } from '@dsm/web';
import type { PropsWithChildren, ReactElement } from 'react';

import { divergesByPlatform } from '../src/stories/themeGlobals';

/** The axes the fallback notice names. `platform` is absent because it never falls back. */
const AXES = ['brand', 'mode', 'layout'] as const;

/**
 * Says so on the canvas when the platform menu is on a mobile platform but the
 * component reads the same tokens on both.
 *
 * Storybook cannot vary a toolbar's items per story, so iOS and Android are
 * offered for every component. Most render identically under the two, and a menu
 * that changes nothing looks broken — this owns up to it instead. It fires off
 * the component's own token record rather than off a list, so it cannot claim
 * one thing while the canvas shows another.
 */
const NoDivergenceNotice = ({ platform }: { platform: TThemePlatform }): ReactElement => (
  <div
    style={{
      alignSelf: 'stretch',
      marginBottom: 16,
      padding: '8px 12px',
      borderRadius: 8,
      border: '1px solid rgba(127, 127, 127, 0.35)',
      fontSize: 12,
      lineHeight: 1.5,
      opacity: 0.75,
    }}
  >
    Este componente no diverge por plataforma: iOS y Android leen los mismos valores, así que
    esto es lo que se ve en los dos. Estás en <code>{platform}</code>.
  </div>
);

/**
 * Says so on the canvas when the toolbar asks for a theme the export cannot
 * produce — and names the axis that gave way.
 *
 * **Written to warn, not to explain.** An earlier version of this ran four lines
 * of prose above every story, and the reader's actual question — *why is this
 * still here now that the brand cross works?* — was buried in the middle of it.
 * The answer that matters is the symptom they can see: `primary · fill` is the
 * requested brand and its three siblings are not, so one row shows two brands.
 * The reasoning lives here instead, where it is read by whoever needs it rather
 * than by whoever is looking at a button.
 *
 * There is exactly one such case: **a brand in a non-default mode.** Brand and
 * mode both come out of `color.json` and no exported folder carries both, so
 * `resolveTheme` keeps the mode. Layout is never dropped, because it composes
 * with either — it moves no colour at all, and the dimension tokens it moves do
 * not overlap the mode's.
 *
 * It reads `requested` against the effective values rather than guessing, which
 * matters: an earlier version of this notice ended with "only `blu` has all six
 * modes" no matter what, so asking for `dark` + `regular` on the default brand
 * blamed the brand for a layout that had merely been coarsely resolved.
 *
 * Deliberately styled with hard-coded colours and not with tokens: a warning
 * about the theme being wrong is the one thing on the page that must not change
 * with the theme.
 */
const FallbackNotice = ({ brand, mode, layout, requested }: IResolvedTheme): ReactElement => (
  <div
    style={{
      backgroundColor: '#fff4e5',
      border: '1px solid #ffb74d',
      borderRadius: 8,
      color: '#663c00',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontSize: 12,
      lineHeight: 1.5,
      marginBottom: 16,
      maxWidth: 620,
      padding: '8px 12px',
    }}
  >
    {AXES.filter((axis) => ({ brand, mode, layout })[axis] !== requested[axis]).map((axis) => (
      <strong key={axis}>
        Pediste <code>{requested[axis]}</code>, se está pintando{' '}
        <code>{{ brand, mode, layout }[axis]}</code>.{' '}
      </strong>
    ))}
    Solo el relleno de <code>primary · fill</code> está cruzado de verdad. Todo lo demás —{' '}
    <code>soft</code>, <code>outline</code>, <code>ghost</code>, el fondo — sale en{' '}
    <code>{brand}</code>, así que vas a ver botones de dos marcas en la misma pantalla.
  </div>
);

/**
 * Applies the resolved theme to the story canvas and to every component
 * rendered inside it, on both platforms.
 *
 * Neither platform has a CSS cascade to lean on for this anymore — `@dsm/web`
 * dropped its `data-dsm-theme` attribute in favour of resolving tokens from
 * `tokens[key]` at render time (see `useTextField`), the same approach mobile
 * always used. So both platforms get their own `BluProvider` here: the web one
 * feeds `useThemeMode()` to `@dsm/web` components AND paints the actual canvas
 * background/text/font (see its own doc comment); the mobile one feeds the same
 * axes to `@dsm/mobile` components. Nesting them is harmless — each provider is
 * only read by its own platform's components.
 *
 * The axes are passed through rather than the resolved key, so that each
 * provider runs the same `resolveTheme` a real app would and there is no second
 * code path to keep honest.
 *
 * **`theme.requested`, not the effective axes.** This used to pass `theme.brand`,
 * which is already the *outcome* of the fallback — so a `discover` + `dark`
 * request reached the provider as `blu` + `dark` and the provider re-resolved an
 * answer instead of the question. That was invisible until the brand cross
 * landed: `crossedBrand` reads `requested.brand` precisely to survive the
 * fallback, and there was nothing left to survive. A real app passes what the
 * screen asked for, so this has to as well. The notice below keeps reading the
 * effective values, which is what it is for.
 *
 * Centers its children itself, in place of Storybook's `layout: 'centered'`
 * parameter — that parameter centers via a flex container with
 * `align-items: center`, which shrinks this `<div>` down to its content's width
 * instead of letting it paint full-bleed. Every story sets `layout: 'fullscreen'`
 * for that reason.
 *
 * Lives outside `preview.tsx` so that file exports the config and nothing else,
 * which is what Vite's fast refresh needs to keep working.
 */
export const ThemedStory = ({
  theme,
  tokens,
  children,
}: PropsWithChildren<{
  theme: IResolvedTheme;
  /**
   * The story component's per-theme token record, if its meta declared one
   * through `parameters.platformTokens`. Only used to decide whether to show
   * {@link NoDivergenceNotice} — a story that declares nothing gets no notice,
   * which is the honest answer when nobody has measured the component yet.
   */
  tokens?: Record<string, unknown>;
}>): ReactElement => (
  <WebBluProvider
    brand={theme.requested.brand}
    layout={theme.requested.layout}
    mode={theme.requested.mode}
    platform={theme.requested.platform}
    style={{
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      padding: 24,
    }}
  >
    {theme.isExact ? null : <FallbackNotice {...theme} />}
    {theme.platform !== 'web' && tokens !== undefined && !divergesByPlatform(tokens, theme) ? (
      <NoDivergenceNotice platform={theme.platform} />
    ) : null}
    <MobileBluProvider
      brand={theme.requested.brand}
      layout={theme.requested.layout}
      mode={theme.requested.mode}
      platform={theme.requested.platform}
    >
      {children}
    </MobileBluProvider>
  </WebBluProvider>
);
