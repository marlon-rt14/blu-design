import type { Preview } from '@storybook/react-vite';

// Side-effect import: loads the design system token custom properties.
import '@dsm/web';

import './preview.css';

const preview: Preview = {
  // Autodocs are opt-in since Storybook 8. Enabling the tag globally means every
  // component gets a Docs page without having to remember to tag its meta.
  tags: ['autodocs'],
  /**
   * `platform` renders as a dropdown in the toolbar and decides which
   * implementation of a component the stories render. See
   * `src/stories/PlatformButton.tsx` for how a story consumes it.
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
  },
  initialGlobals: {
    platform: 'web',
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
