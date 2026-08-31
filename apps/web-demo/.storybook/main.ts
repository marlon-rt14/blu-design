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
        alias: {
          'react-native': 'react-native-web',
          // react-native-svg's web build reaches `resolveAssetUri`, which loads
          // the asset registry to turn a `require('./x.svg')` id into a URI.
          // That package is a React Native internal and is not in this tree —
          // but react-native-web ships the same module, exporting the same
          // `getAssetByID`. Mapping it there is the semantically correct fix,
          // not a stub: it keeps `SvgUri` and `LocalSvg` working if a story ever
          // wants them. Our own glyphs are inline paths and never touch it.
          '@react-native/assets-registry/registry':
            'react-native-web/dist/modules/AssetRegistry',
        },
        // `.web.*` first, which is how the React Native ecosystem ships browser
        // builds. `react-native-svg` needs it: its package.json has no `browser`
        // field, so `lib/module/index.js` resolves to `ReactNativeSVG.js` —
        // which imports `./fabric`, i.e. native components that do not exist
        // here. With these extensions it picks `ReactNativeSVG.web.js` instead.
        //
        // The `react-native` alias above does not cover it: rollup's alias
        // matches a bare specifier or one followed by `/`, so `react-native-svg`
        // is left alone, correctly.
        extensions: [
          '.web.mjs',
          '.web.js',
          '.web.mts',
          '.web.ts',
          '.web.jsx',
          '.web.tsx',
          '.mjs',
          '.js',
          '.mts',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ],
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
        // `react-native-svg` MUST be pre-bundled, not excluded: its
        // `lib/extract/transform.js` is a generated PEG parser that uses
        // `module.exports` inside an ESM directory, so served raw it fails with
        // "does not provide an export named 'parse'". Pre-bundling does the CJS
        // interop that Metro does natively.
        include: ['react-native-web', 'react-native-svg'],
        // The pre-bundler has its own resolver and does not read the
        // `resolve.extensions` above, so it needs the same `.web.*` priority —
        // otherwise it resolves `lib/module/index.js` to the native
        // `ReactNativeSVG.js`, walks into `fabric/`, and dies on
        // `react-native/Libraries/Utilities/codegenNativeComponent`.
        rolldownOptions: {
          resolve: {
            extensions: [
              '.web.mjs',
              '.web.js',
              '.web.ts',
              '.web.tsx',
              '.mjs',
              '.js',
              '.ts',
              '.tsx',
              '.json',
            ],
          },
        },
      },
    }),
};

export default config;
