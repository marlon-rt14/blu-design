import { ThemeProvider } from '@dsm/mobile';
import type { TThemeMode } from '@dsm/shared';
import type { Decorator, Preview } from '@storybook/react-vite';
import type { PropsWithChildren, ReactElement } from 'react';
import { useEffect } from 'react';

// Side-effect import: loads the design system token custom properties.
import '@dsm/web';

import './preview.css';

/**
 * Applies `theme` to the story canvas and to every `@dsm/mobile` component
 * rendered inside it.
 *
 * Web components read the theme through CSS custom properties scoped by the
 * `data-dsm-theme` attribute (see `textfield-theme.css` in `@dsm/web`), set
 * here as a side effect. Mobile components have no CSS cascade, so they get
 * the same value through `@dsm/mobile`'s `ThemeProvider` instead — wrapping
 * every story with it is harmless for web-rendered components, which simply
 * never read the context.
 */
const ThemedStory = ({
  theme,
  children,
}: PropsWithChildren<{ theme: TThemeMode }>): ReactElement => {
  useEffect(() => {
    document.documentElement.dataset['dsmTheme'] = theme;
  }, [theme]);

  return <ThemeProvider mode={theme}>{children}</ThemeProvider>;
};

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
