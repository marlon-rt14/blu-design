# Design System — monorepo

Design system monorepo: components live in `packages/` and are consumed by the demo apps in `apps/`.

## Structure

```
.
├── apps/
│   ├── web-demo/            # Vite + React + TS — consumes @dsm/web
│   └── react-native-demo/   # React Native bare (no Expo) — consumes @dsm/mobile
└── packages/
    ├── shared/              # @dsm/shared  — types and design tokens, platform agnostic
    ├── web/                 # @dsm/web     — web components (plain CSS)
    └── mobile/              # @dsm/mobile  — React Native components (StyleSheet)
```

`@dsm/shared` is the single source of truth for the contract: it defines the base types and the tokens.
`@dsm/web` and `@dsm/mobile` implement each platform on top of that contract.

## Requirements

- Node >= 22.11
- pnpm 11
- For iOS: Xcode + CocoaPods · For Android: JDK 17 + Android SDK

## Getting started

```bash
pnpm install

# iOS: once, and again whenever native dependencies change
cd apps/react-native-demo/ios && pod install && cd -
```

## Commands

| Command              | What it does                                             |
| -------------------- | -------------------------------------------------------- |
| `pnpm dev:web`       | Dev server for the web demo (Vite)                       |
| `pnpm start:mobile`  | Metro for the React Native demo                          |
| `pnpm ios`           | Builds and launches the demo on the iOS simulator        |
| `pnpm android`       | Builds and launches the demo on an emulator/device       |
| `pnpm typecheck`     | `tsc` across all 5 projects                              |
| `pnpm build`         | Production build of the web demo                         |
| `pnpm storybook`     | Storybook for the design system, on port 6006             |
| `pnpm build-storybook` | Static Storybook build into `storybook-static/`        |
| `pnpm test`          | Tests (jest in the React Native app)                     |
| `pnpm lint`          | oxlint in the web demo, eslint in the React Native one   |

The `packages/` are consumed as **TypeScript source** (`main` points at `src/index.ts`): they have no
build step, and Vite and Metro transpile them directly. Editing a design system component hot-reloads
in the web demo.

## Storybook

`pnpm storybook` serves a single Storybook that documents **both** implementations.
The **Platform** dropdown in the toolbar decides which one renders:

| Option | Package | How it renders |
| --- | --- | --- |
| React | `@dsm/web` | Natively in the browser |
| React Native | `@dsm/mobile` | Through react-native-web |

Stories are written once, against the shared `@dsm/shared` contract, and
`apps/web-demo/src/stories/PlatformButton.tsx` maps the neutral `onAction` prop to
whichever handler each platform expects (`onClick` vs `onPress`). Copy that helper's
shape when adding the next component.

Autodocs are enabled globally in `.storybook/preview.tsx`, so every component gets a
Docs page with its props table. The tables declare `argTypes` explicitly because
react-docgen cannot resolve props inherited from another package.

## Theming & tokens

Supernova's own pipeline — not Style Dictionary — is the source of resolved token JSON, synced into
`packages/shared/src/theme/{base,dark}/{color,dimension,typography,string}.json`. `base` is the light
theme; `dark` is dark. Both ship fully resolved (no `{alias}` refs left), keyed by a dot path that
mirrors Supernova's own token tree (e.g. `color.component.textfield.container.border-focus`).

- `packages/shared/src/theme/tokenPath.ts` — `readThemeToken` / `readThemeDimension` /
  `readThemeTypography` walk that JSON by path and throw if a token is missing, instead of silently
  rendering a blank style.
- `packages/shared/src/theme/themes.ts` — `themeSources` maps `'light' | 'dark'` to the parsed JSON.
  Dimension and typography currently carry no theme variance (`dark/dimension.json` ==
  `base/dimension.json`), so per-component token files read those from `themeSources.light` only —
  color is the only theme-variant axis today.
- `packages/shared/src/tokens/<name>.tokens.ts` — one file per component, reading the paths it needs
  via `tokenPath` and re-exporting them as typed, `Record<TThemeMode, ...>` / `Record<TSize, ...>`
  objects. See `textField.tokens.ts` as the reference.
- `packages/shared/scripts/generate-web-theme.mjs` — for web only: turns the same JSON into CSS custom
  properties in `packages/web/src/styles/textfield-theme.css` (`:root` for light,
  `[data-dsm-theme='dark']` for dark). Re-run with `pnpm --filter @dsm/shared build:theme-css` after
  Supernova syncs new values, and add a component's paths to its `*_PATHS` maps when it needs one.
  Mobile has no such step — `useTextField` reads the tokens straight from `@dsm/shared`, since React
  Native has no CSS cascade to theme through.
- The legacy hand-rolled tokens (`colors.ts`, `spacing.ts`, etc.) are frozen — kept only for `Button`,
  which predates this pipeline. Do not add new tokens there; new components read from `theme/`.

**Font**: `string.platform.font.family` (`"Mulish"`) is documented in Supernova as a **web-only**
alias — iOS/Android are "meant" to use their OS system font — but the product decision is to brand
both platforms with Mulish, so both actually load it:

- **Web**: `@dsm/web` self-hosts Mulish via `@fontsource/mulish` (imported per-weight — `400.css`
  through `800.css` — as a side effect in `packages/web/src/index.ts`). Use the plain
  `@fontsource/mulish` package, not `@fontsource-variable/mulish`: the variable package's `@font-face`
  registers as `"Mulish Variable"`, which silently does not match the `"Mulish"` family every
  typography token specifies — a real bug that shipped once. Every generated typography CSS variable
  also appends a `sans-serif` fallback.
- **Mobile**: bare React Native has no CSS cascade and no runtime font-loading API — a font must be a
  linked native asset, one static file per weight (RN cannot pick a weight out of a single variable
  font file the way CSS can). `packages/mobile/assets/fonts/Mulish-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf`
  are Google's official variable `Mulish[wght].ttf` (OFL-licensed) instanced per weight with
  `fonttools varLib.instancer`, then renamed so filename, family name **and** PostScript name are all
  the same string (`Mulish-<Weight>`) — iOS resolves fonts by PostScript name, Android by filename, so
  every field has to agree for one `fontFamily` string to work on both. `theme/font.ts`'s
  `resolveMulishFontFamily(fontWeight)` maps a typography token's numeric weight to the right file;
  `useTextField` (and every future component's hook) uses it instead of setting a numeric
  `fontWeight` — pairing a resolved `fontFamily` with a numeric `fontWeight` makes Android's font
  resolver hunt for a nonexistent suffixed variant (e.g. `Mulish-SemiBold_bold.ttf`) and silently fall
  back to the system font.

  Each consuming app links these fonts into its native projects once — `apps/react-native-demo` is
  already linked; redo this if `@dsm/mobile`'s font set changes:

  ```bash
  pnpm --filter <app> add -D react-native-asset   # already a devDependency of ReactNativeDemo
  # react-native.config.js: assets: ['<relative-path-to>/packages/mobile/assets/fonts']
  npx react-native-asset
  ```

  This is a one-time native build step, same spirit as `pod install` — `BluProvider` (see below) is
  JS-only and cannot inject a font file into the native project for you.

**`BluProvider`** (`@dsm/mobile`) is the root wrapper every consuming app renders once, at the top:
`<BluProvider><App /></BluProvider>`. It sets up the active theme mode (`useThemeMode`) for every
themed component below it — the mobile equivalent of the web `data-dsm-theme` attribute. It does not
and cannot load fonts (see above); font linking is a native build step, done once per app.

## Adding a component

Atomic design: `atoms/` → `molecules/` → `organisms/`. Every component is a folder following the same
file pattern (see `TextField` as the reference — it is the first component built on the `theme/`
pipeline above; `Button` still uses the frozen legacy tokens):

```
packages/web/src/components/atoms/TextField/
├── index.ts             # public barrel for the component
├── TextField.tsx         # presentation, no styling logic
├── TextField.types.ts    # ITextFieldProps extends ITextFieldBaseProps (from @dsm/shared)
├── useTextField.ts       # hook that resolves styles from the props
└── TextField.css         # styles (on mobile: TextField.styles.ts with StyleSheet)
```

Steps:

1. **Contract in `@dsm/shared`** — `src/types/atoms/<name>.types.ts` with `I<Name>BaseProps` and its
   `T<Name>Variant` / `T<Name>Size`. No event handlers: each platform adds its own.
2. **Tokens in `@dsm/shared`** — `src/tokens/<name>.tokens.ts`, reading from `theme/{base,dark}` via
   `tokenPath` (see "Theming & tokens" above). Never hand-roll a value that already exists in that JSON.
3. **Web and mobile implementations** — the five-file folder in each package. Web adds the component's
   color/dimension/typography paths to `generate-web-theme.mjs` and regenerates the CSS; mobile reads
   the token file directly.
4. **Barrels** — add it to the `index.ts` of its level (`atoms/index.ts`, and so on).
5. **Storybook** — a `Platform<Name>.tsx` wrapper in `apps/web-demo/src/stories/` (mapping the neutral
   story prop to each platform's event handler) plus `<Name>.stories.tsx`. See "Storybook" above.

## Conventions

- Commit messages, code comments and JSDoc are written in English.
- Interfaces are prefixed with `I` (`IButtonProps`), type aliases with `T` (`TButtonVariant`).
- Component files and folders use `PascalCase`; everything else uses `camelCase`.
- Boolean props are prefixed with `is` (`isDisabled`).
- CSS classes are prefixed with `dsm-` and use BEM modifiers (`dsm-button--primary`).
- Web and mobile do not share styles: they share **types and token values**. Each platform
  owns its own presentation and is expected to diverge where the platform calls for it — the
  web Button is a pill with an uppercase label and a hover lift, the native one is a rounded
  rectangle.

## Monorepo notes

- **Turbo caching is disabled** (`"cache": false` on every task in `turbo.json`). A cache hit replays
  the logs and exit code of a previous run, and that green checkmark can look like something works
  when it was never re-executed. Turbo is kept here only for topological ordering and parallelism. To
  re-enable it, remove `"cache": false` from the specific task.
- **One React for the whole workspace**, forced with `overrides` in `pnpm-workspace.yaml`.
  React Native 0.87 pins react 19.2.3 because its bundled renderer is built against
  that version, while the web app asks for a newer one. With a flat `node_modules`
  only one can win the root and the other gets nested copies — two React instances,
  which surface as "Invalid hook call". Aligning on React Native's version is the safe
  direction; the web app is happy on it.
- `nodeLinker: hoisted` in `pnpm-workspace.yaml` gives a flat `node_modules`, because React Native
  autolinking (CocoaPods/Gradle) does not cope well with the symlinks of pnpm's isolated layout.
- `apps/react-native-demo/metro.config.js` adds `watchFolders` for the monorepo root and pins
  `nodeModulesPaths` together with `disableHierarchicalLookup`, so that Metro sees `packages/*` and
  uses a single copy of React.
- `apps/web-demo/vite.config.ts` uses `resolve.dedupe` for react/react-dom for the same reason.
- `packages/web/src/styles/tokens.css` is a manual mirror of the `@dsm/shared` tokens (CSS cannot
  import values from TypeScript). When a token changes, both places need updating.
