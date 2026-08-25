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
    ├── web/                 # @dsm/web     — web components (inline styles; Button still plain CSS)
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

**`theme/` holds nothing but that JSON.** The sync pipeline replaces the whole folder on every run, so
no hand-written file lives inside it — the utilities that read it live one level up, in
`packages/shared/src/themeSource/` (barrel-exported, so components import from `@dsm/shared` directly):

- `packages/shared/src/themeSource/tokenPath.ts` — `readThemeToken` / `readThemeDimension` /
  `readThemeTypography` walk that JSON by path and throw if a token is missing, instead of silently
  rendering a blank style.
- `packages/shared/src/themeSource/themes.ts` — `themeSources` maps `'light' | 'dark'` to the parsed
  JSON (imported from `../theme/{base,dark}/*.json`). **Only `typography.json` and `string.json` are
  actually theme-invariant.** `dimension.json` is not — `dimension.elevation.{raised,overlay}.shadow.*`
  differs between `base` and `dark` — so component token files read `color`, `dimension` **and**
  `typography` per mode; never assume `light` is a safe stand-in for `dark` just because today's numbers
  happen to match.
- `packages/shared/src/tokens/<name>.tokens.ts` — one file per component, reading every path it needs
  via `tokenPath` and re-exporting a single `Record<TThemeMode, I<Name>Tokens>`, nesting size/state
  variants (e.g. `Record<TTextFieldSize, ...>`) *inside* each mode's entry rather than splitting them
  out as their own theme-invariant export. See `textField.tokens.ts` and `textArea.tokens.ts`.
- `packages/shared/src/tokens/theme.tokens.ts` — the page-level tokens both providers paint their root
  surface with (`pageColorTokens`), plus `baseFontFamily` (`"Mulish"`).
- The legacy hand-rolled tokens (`colors.ts`, `spacing.ts`, etc.) are frozen — kept only for `Button`,
  which predates this pipeline. Do not add new tokens there; new components read from `theme/`.

**No build step, on either platform.** Earlier revisions generated CSS custom properties for web
(`generate-web-theme.mjs` → `textfield-theme.css`, scoped by a `data-dsm-theme` attribute) and required
updating that generator's path list for every new component. That pipeline is gone. Both platforms now
resolve tokens the same way, at render time: a component's `use<Name>.ts` hook calls `useThemeMode()`,
indexes into `<name>Tokens[mode]`, and returns plain style objects — `CSSProperties` on web,
`StyleSheet`-compatible objects on mobile. Adding a component never touches a shared generator file
again; see "Adding a component" below.

**Font**: `string.platform.font.family` (`"Mulish"`) is documented in Supernova as a **web-only**
alias — iOS/Android are "meant" to use their OS system font — but the product decision is to brand
both platforms with Mulish, so both actually load it, through each platform's own `BluProvider`:

- **Web**: `packages/web/src/theme/font.ts` self-hosts Mulish via `@fontsource/mulish` (imported
  per-weight — `400.css` through `800.css` — as a side effect of importing that module, which
  `BluProvider` does). Use the plain `@fontsource/mulish` package, not `@fontsource-variable/mulish`:
  the variable package's `@font-face` registers as `"Mulish Variable"`, which silently does not match
  the `"Mulish"` family every typography token specifies — a real bug that shipped once. Importing
  `@dsm/web` alone (without rendering `BluProvider`) no longer loads any font or global CSS beyond the
  legacy `Button` tokens — apps must render `<BluProvider>` at their root to get Mulish.
- **Mobile**: bare React Native has no CSS cascade and no runtime font-loading API — a font must be a
  linked native asset, one static file per weight (RN cannot pick a weight out of a single variable
  font file the way CSS can). `packages/mobile/assets/fonts/Mulish-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf`
  are Google's official variable `Mulish[wght].ttf` (OFL-licensed) instanced per weight with
  `fonttools varLib.instancer`, then renamed so filename, family name **and** PostScript name are all
  the same string (`Mulish-<Weight>`) — iOS resolves fonts by PostScript name, Android by filename, so
  every field has to agree for one `fontFamily` string to work on both.

  Each consuming app links these fonts into its native projects once — `apps/react-native-demo` is
  already linked; redo this if `@dsm/mobile`'s font set changes:

  ```bash
  pnpm --filter <app> add -D react-native-asset   # already a devDependency of ReactNativeDemo
  # react-native.config.js: assets: ['<relative-path-to>/packages/mobile/assets/fonts']
  npx react-native-asset
  ```

  This is a one-time native build step, same spirit as `pod install` — `BluProvider` is JS-only and
  cannot inject a font file into the native project for you.

- **Both platforms** expose a `useFontFamily(fontWeight)` hook from their `theme/` module, for one
  shared seam even though the implementations differ completely: web's ignores the weight (a single
  `@font-face` family already covers every weight) and returns `"Mulish, sans-serif"`; mobile's is an
  alias for `resolveMulishFontFamily`, mapping the weight to the exact linked `.ttf`. Component hooks
  call this instead of hand-building a font stack, so a future rebrand only touches this one function
  per platform.

**`BluProvider`** is the root wrapper every consuming app renders once, at the top —
`<BluProvider><App /></BluProvider>` — and now exists on **both** platforms:

- `@dsm/mobile`'s sets up the active theme mode (`useThemeMode`) for every themed component below it.
  It does not and cannot load fonts (see above); font linking is a native build step, done once per app.
- `@dsm/web`'s does the same for `@dsm/web` components, **and** paints its own root element's
  `backgroundColor` / `color` / `fontFamily` from `pageColorTokens[mode]` and `useFontFamily` — so a
  themed page never needs its own CSS for those three properties, and loads Mulish (see above). Accepts
  `className` / `style` passthrough so an app can size it (e.g. `style={{ minHeight: '100vh' }}`).
- Both accept the same `mode?: TThemeMode` override, used by Storybook's theme toolbar
  (`apps/web-demo/.storybook/preview.tsx` nests both, one per platform, under a single `theme` global).
- `@dsm/web` also exposes `usePrefersReducedMotion()` from the same `theme/` module — with CSS gone,
  components build their own `transition` string in JS and need this to decide whether to skip it,
  instead of hiding behind a `@media (prefers-reduced-motion: reduce)` rule.

## Adding a component

Atomic design: `atoms/` → `molecules/` → `organisms/`. Every component is a four-file folder, the same
shape on both platforms (see `TextField` / `TextArea` as the reference — they're built on the `theme/`
pipeline above; `Button` still uses the frozen legacy tokens and per-file CSS):

```
packages/web/src/components/atoms/TextArea/
├── index.ts             # public barrel for the component
├── TextArea.tsx          # presentation: local hover/focus state, no token math
├── TextArea.types.ts     # ITextAreaProps extends ITextAreaBaseProps (from @dsm/shared)
└── useTextArea.ts        # hook that resolves style objects from the tokens + props + state
```

No CSS file: `use<Name>.ts` returns `CSSProperties` (web) or `StyleSheet`-compatible objects (mobile),
resolved from `<name>Tokens[useThemeMode()]`. The one thing that must stay in CSS is `::placeholder` —
it's a pseudo-element, with no inline-style equivalent — so both `TextField` and `TextArea` apply the
shared `dsm-input` class and set `--dsm-input-placeholder-color` inline; see
`packages/web/src/styles/pseudo.css`. Don't add another CSS file for a new component unless it needs
its own genuinely-CSS-only pseudo-selector — extend `pseudo.css`, don't create a new one.

Steps:

1. **Contract in `@dsm/shared`** — `src/types/atoms/<name>.types.ts` with `I<Name>BaseProps` and its
   variant/size type aliases, if it has any. No event handlers: each platform adds its own. Check the
   component's *own* Figma variant axes before copying another component's shape — `TextField` has a
   `size` axis, `TextArea` does not; don't generalize one onto the other.
2. **Tokens in `@dsm/shared`** — `src/tokens/<name>.tokens.ts`, reading `color`, `dimension` **and**
   `typography` from `theme/{base,dark}` via `tokenPath`, all per mode (see "Theming & tokens" above —
   `dimension` is not fully theme-invariant). Collapse everything into one
   `Record<TThemeMode, I<Name>Tokens>`; nest a size/state axis inside each mode's entry, don't split it
   into its own top-level export. Never hand-roll a value that already exists in that JSON.
3. **Web and mobile implementations** — the four-file folder in each package, `use<Name>.ts` resolving
   styles from `<name>Tokens[mode]` plus local interaction state (hover/focus tracked as React state on
   web, since there are no pseudo-classes to lean on; focus-only on mobile, since touch has no hover).
4. **Barrels** — add it to the `index.ts` of its level (`atoms/index.ts`, and so on).
5. **Storybook** — a `Platform<Name>.tsx` wrapper in `apps/web-demo/src/stories/` (mapping the neutral
   story prop to each platform's event handler) plus `<Name>.stories.tsx` covering every Figma `state`
   and every independent prop combination (e.g. `TextArea`'s helper/counter footer slots, which can be
   toggled on/off independently). See "Storybook" above.

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
