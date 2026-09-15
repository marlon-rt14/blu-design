import { THEME_BRANDS, THEME_LAYOUTS, THEME_MODES, modesForBrand } from '@dsm/shared';
import type { Decorator, Preview } from '@storybook/react-vite';

import { themeFromGlobals } from '../src/stories/themeGlobals';

import { ThemedStory } from './ThemedStory';

import './preview.css';
import './native-fonts.css';

/** Applies the three theme toolbar globals to every story via {@link ThemedStory}. */
const withTheme: Decorator = (Story, context) => (
  <ThemedStory theme={themeFromGlobals(context.globals)}>
    <Story />
  </ThemedStory>
);

/** Turns `hc-light` into `HC light` for the dropdown, leaving `light` alone. */
const modeTitle = (mode: string): string =>
  mode.includes('-')
    ? `${mode.split('-')[0]?.toUpperCase() ?? ''} ${mode.split('-')[1] ?? ''}`
    : `${mode.charAt(0).toUpperCase()}${mode.slice(1)}`;

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
   * The other three are the theme axes, mirroring Figma's variable collections
   * one for one — `2. Brand`, `3. Semantic` and `4. Layout`. They are separate
   * dropdowns because that is how a designer thinks about them, even though the
   * export only contains one axis moved at a time: every value is offered and
   * the `FallbackNotice` in `ThemedStory.tsx` owns up to what actually rendered. See `withTheme`.
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
    brand: {
      description: 'Which product the screen belongs to — Figma’s “2. Brand” collection',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: THEME_BRANDS.map((brand) => ({
          value: brand,
          title: `${brand.charAt(0).toUpperCase()}${brand.slice(1)}`,
          // Says which modes that brand really has, so the fallback is visible
          // before it happens rather than only after.
          right: modesForBrand(brand).length === THEME_MODES.length ? 'all modes' : 'light only',
        })),
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'How much contrast the surface has — Figma’s “3. Semantic” collection',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: THEME_MODES.map((mode) => ({
          value: mode,
          title: modeTitle(mode),
          icon: mode.endsWith('dark') ? 'moon' : 'sun',
        })),
        dynamicTitle: true,
      },
    },
    layout: {
      description: 'How generous the spacing and type scale are — Figma’s “4. Layout” collection',
      toolbar: {
        title: 'Layout',
        icon: 'grow',
        items: THEME_LAYOUTS.map((layout) => ({
          value: layout,
          title: `${layout.charAt(0).toUpperCase()}${layout.slice(1)}`,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    platform: 'web',
    brand: 'blu',
    mode: 'light',
    layout: 'compact',
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
