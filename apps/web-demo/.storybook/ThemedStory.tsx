import { BluProvider as MobileBluProvider } from '@dsm/mobile';
import type { IResolvedTheme } from '@dsm/shared';
import { BluProvider as WebBluProvider } from '@dsm/web';
import type { PropsWithChildren, ReactElement } from 'react';

/** The three axes, in the order the notice names them. */
const AXES = ['brand', 'mode', 'layout'] as const;

/**
 * Says so on the canvas when the toolbar asks for a theme the export cannot
 * produce — and names the axis that gave way.
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
    <strong>
      Rendering {brand} · {mode} · {layout}.
    </strong>{' '}
    {AXES.filter((axis) => ({ brand, mode, layout })[axis] !== requested[axis]).map((axis) => (
      <span key={axis}>
        <code>
          {axis}: {requested[axis]}
        </code>{' '}
        fell back to <code>{{ brand, mode, layout }[axis]}</code>.{' '}
      </span>
    ))}
    Brand and mode both come out of <code>color.json</code> and no exported folder carries both, so
    the mode wins — it moves ~1042 colour tokens against the brand&rsquo;s 180, and it is the one
    carrying contrast. Layout is unaffected: it composes with either.
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
 * The three axes are passed through rather than the resolved key, so that each
 * provider runs the same `resolveTheme` a real app would and there is no second
 * code path to keep honest.
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
  children,
}: PropsWithChildren<{ theme: IResolvedTheme }>): ReactElement => (
  <WebBluProvider
    brand={theme.brand}
    layout={theme.layout}
    mode={theme.mode}
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
    <MobileBluProvider brand={theme.brand} layout={theme.layout} mode={theme.mode}>
      {children}
    </MobileBluProvider>
  </WebBluProvider>
);
