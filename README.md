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
Toolbar globals:

| Global | Values | Role |
| --- | --- | --- |
| **Platform** | React / React Native | Which package renders (`@dsm/web` vs `@dsm/mobile` via react-native-web) |
| **Brand** | blu, titanium, discover, … | Figma `2. Brand` |
| **Mode** | light, dark, mc-*, hc-* | Figma `3. Semantic` |
| **Layout** | compact, regular, expanded | Figma `4. Layout` |

`ThemedStory` + `themeFromGlobals` resolve those three axes through `resolveTheme` and pass
`brand` / `mode` / `layout` into both `BluProvider`s. Stories that need a surface colour read
`themeFromGlobals(globals).key` then `themeSources[key]` — see `Button.stories.tsx`. Do **not**
read a legacy `globals.theme`.

Stories are written once against `@dsm/shared`. `PlatformButton.tsx` maps neutral handlers
(`onAction` → `onClick` / `onPress`); copy that shape for new components.

Autodocs are enabled globally in `.storybook/preview.tsx`. Declare `argTypes` explicitly —
react-docgen cannot resolve props inherited from another package.

## Theming & tokens

Themes are **three axes** (brand × mode × layout), composed into
`TThemeSourceKey` keys like `light@compact`. Supernova exports flat folders under
`packages/shared/src/theme/<folder>/{color,dimension,typography,string}.json`
(modes, brands, layouts). Fully resolved (no `{alias}` refs). Dot paths mirror Supernova
(e.g. `color.component.textfield.container.border-focus`).

**`theme/` holds nothing but that JSON.** Sync replaces the whole folder; readers live in
`packages/shared/src/themeSource/` (barrel-exported from `@dsm/shared`):

- `tokenPath.ts` — `readThemeToken` / `readThemeDimension` / `readThemeTypography` (throw if missing).
- `themes.ts` — `themeSources: Record<TThemeSourceKey, IThemeSource>` (30 composed entries),
  `resolveTheme`, `fromThemeSources`, `DEFAULT_THEME_SOURCE_KEY`, axis lists. Layout composes with
  colour sources (`composeDimension`); brand + non-default mode falls back (mode wins, `isExact: false`).
- `tokens/<name>.tokens.ts` — **always** `export const xTokens = fromThemeSources(readXTokens)`.
  Nest size/state inside each entry. See `divider.tokens.ts` / `alert.tokens.ts`. Never
  `{ light: …, dark: … }` or `themeSources['light']` — those keys do not exist and crash module init.
- `tokens/theme.tokens.ts` — `pageColorTokens` + `baseFontFamily`.
- Legacy hand-rolled tokens (`colors.ts`, …) are frozen for old `Button` only.

**No build step.** `useThemeMode()` returns `TThemeSourceKey`; hooks index `<name>Tokens[key]` and
return plain style objects. `useResolvedTheme()` when you need axes / `isExact`. Type a single
theme's bag with `TTokensOf<typeof xTokens>`.

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

**`BluProvider`** is the root wrapper every consuming app renders once —
`<BluProvider><App /></BluProvider>` — on **both** platforms:

- Optional `brand` / `mode` / `layout` (`IThemeRequest`). Omit `mode` → follow OS colour scheme
  (unless a non-default brand is stated — then stay on default light so brand isn't dropped).
- Mobile: theme context for `@dsm/mobile` (fonts are a native link step, above).
- Web: same for `@dsm/web`, plus paints root `backgroundColor` / `color` / `fontFamily` from
  `pageColorTokens` / `useFontFamily`. Accepts `className` / `style`.
- Storybook: `ThemedStory` nests both providers with all three axes from the toolbar.
- `@dsm/web` also exposes `usePrefersReducedMotion()` — components build `transition` in JS and need
  this instead of a `@media (prefers-reduced-motion)` rule.

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
2. **Tokens in `@dsm/shared`** — `src/tokens/<name>.tokens.ts` with
   `fromThemeSources((key) => { … themeSources[key] … })`. Nest size/state inside each
   `TThemeSourceKey` entry. Never `{ light, dark }` or `themeSources['light']`. See
   "Theming & tokens" and `divider.tokens.ts`.
3. **Web and mobile implementations** — the four-file folder in each package, `use<Name>.ts` resolving
   styles from `<name>Tokens[useThemeMode()]` (`TThemeSourceKey`) plus local interaction state
   (hover/focus as React state on web; focus-only on mobile).
4. **Barrels** — add it to the `index.ts` of its level (`atoms/index.ts`, and so on).
5. **Storybook** — `Platform<Name>.tsx` + `<Name>.stories.tsx`. Surface colours via
   `themeFromGlobals(globals).key` — not `globals.theme`. Cover every Figma state and independent
   prop combo. See "Storybook" above.

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
