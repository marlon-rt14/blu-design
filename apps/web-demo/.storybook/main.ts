import type { StorybookConfig } from '@storybook/react-vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

/**
 * Resolves the absolute path of a package.
 *
 * Needed in a monorepo, where a dependency may not live in the nearest
 * node_modules.
 */
const getAbsolutePath = (value: string): string =>
  dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-docs')],
  framework: getAbsolutePath('@storybook/react-vite'),
  features: {
    // Left on (this is the default), and stated explicitly so the behaviour is
    // discoverable: this is what puts a `+` badge next to a component in the
    // sidebar. It is a *change status* — that component's story file is new or
    // modified relative to git — not anything about the component itself, and it
    // clears once the file is committed. Set it to `false` to remove the badge;
    // that also disables `experimentalReview`, which builds on it.
    //
    // Note this file has no hot reload: changing it needs a Storybook restart.
    changeDetection: true,
  },
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        // This alias is what lets the @dsm/mobile components render in a
        // browser. It is scoped to Storybook on purpose: the demo app's own
        // vite.config.ts stays untouched and keeps building without it.
        alias: { 'react-native': 'react-native-web' },
        // Workspace packages can end up with their own copy of react, and two
        // instances break hooks — the native Button uses useState.
        dedupe: ['react', 'react-dom'],
      },
      define: {
        // Globals that React Native code paths expect to exist.
        __DEV__: JSON.stringify(true),
        global: 'globalThis',
      },
      optimizeDeps: {
        // Workspace packages ship as TypeScript source, so they have to go
        // through the transform pipeline instead of being pre-bundled.
        exclude: ['@dsm/mobile', '@dsm/shared', '@dsm/web'],
        include: ['react-native-web'],
      },
    }),
};

export default config;
