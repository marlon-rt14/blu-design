import { BluProvider as MobileBluProvider } from '@dsm/mobile';
import type { TThemeMode } from '@dsm/shared';
import { BluProvider as WebBluProvider } from '@dsm/web';
import type { Decorator, Preview } from '@storybook/react-vite';
import type { PropsWithChildren, ReactElement } from 'react';

import './preview.css';

/**
 * Applies `theme` to the story canvas and to every component rendered inside
 * it, on both platforms.
 *
 * Neither platform has a CSS cascade to lean on for this anymore — `@dsm/web`
 * dropped its `data-dsm-theme` attribute in favour of resolving tokens from
 * `theme[mode]` at render time (see `useTextField`), the same approach
 * mobile always used. So both platforms get their own `BluProvider` here:
 * the web one feeds `useThemeMode()` to `@dsm/web` components AND paints the
 * actual canvas background/text/font (see its own doc comment); the mobile
 * one feeds the same mode to `@dsm/mobile` components. Nesting them is
 * harmless — each provider is only read by its own platform's components.
 */
const ThemedStory = ({ theme, children }: PropsWithChildren<{ theme: TThemeMode }>): ReactElement => (
  <WebBluProvider mode={theme} style={{ minHeight: '100vh', padding: 24 }}>
    <MobileBluProvider mode={theme}>{children}</MobileBluProvider>
  </WebBluProvider>
);

/** Applies the `theme` toolbar global to every story via {@link ThemedStory}. */
const withTheme: Decorator = (Story, context) => (
  <ThemedStory theme={context.globals['theme'] as TThemeMode}>
    <Story />
  </ThemedStory>
);

const preview: Preview = {
  // Autodocs are opt-in since Storybook 8. Enabling the tag globally means every
  // component gets a Docs page without having to remember to tag its meta.
  tags: ['autodocs'],
  decorators: [withTheme],
  /**
   * `platform` renders as a dropdown in the toolbar and decides which
   * implementation of a component the stories render. See
   * `src/stories/PlatformButton.tsx` for how a story consumes it.
   *
   * `theme` renders alongside it and decides which theme mode — `light` or
   * `dark` — every story renders in, on both platforms. See `withTheme` above.
   */
  globalTypes: {
    platform: {
      description: 'Which implementation of the component to render',
      toolbar: {
        title: 'Platform',
        icon: 'switchalt',
        items: [
          { value: 'web', title: 'React', icon: 'browser' },
          { value: 'native', title: 'React Native', icon: 'mobile' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Which theme mode the design system tokens resolve to',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    platform: 'web',
    theme: 'light',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
