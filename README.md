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

**Font**: one typeface per platform — **web Mulish, iOS SF Pro, and on Android the
device's own system font, which on stock is Roboto**. This is what
Supernova documented all along: `string.platform.font.family` is a **web-only** alias, and
iOS/Android are meant to use their OS system font. A product decision had overridden that and
branded both platforms with Mulish; it was reverted on 2026-09-29, so the code and the
documentation agree again.

- **Web**: `packages/web/src/theme/font.ts` self-hosts Mulish via `@fontsource/mulish` (imported
  per-weight — `400.css` through `800.css` — as a side effect of importing that module, which
  `BluProvider` does). Use the plain `@fontsource/mulish` package, not `@fontsource-variable/mulish`:
  the variable package's `@font-face` registers as `"Mulish Variable"`, which silently does not match
  the `"Mulish"` family every typography token specifies — a real bug that shipped once. Importing
  `@dsm/web` alone (without rendering `BluProvider`) no longer loads any font or global CSS beyond the
  legacy `Button` tokens — apps must render `<BluProvider>` at their root to get Mulish.

  `useFontFamily(fontWeight)` from `@dsm/web`'s `theme/` returns `"Mulish, sans-serif"`; it ignores
  the weight, since one `@font-face` family covers all five. It reads `baseFontFamily`, which reads
  **`string.font.family.mulish`** — the token that names the family. Deliberately *not*
  `string.platform.font.family`: that one names whichever platform the export was generated for, and
  when a Supernova sync flipped it from `"Mulish"` to `"SF Pro"` all 32 web components silently asked
  the browser for a font it does not have.

- **Mobile ships no font files, and sets no font family.** SF Pro *is* the iOS system font and
  Roboto *is* Android's, so leaving `fontFamily` unset is what selects them. Nothing to bundle,
  nothing to link with `react-native-asset`, nothing to license, and the face follows the OS instead
  of freezing at whatever release was downloaded.

  What carries the design instead is the **weight**, and this is the part that inverted. While
  mobile bundled Mulish, each `.ttf` was its own family (`Mulish-SemiBold`), so the weight lived in
  the family name and a numeric `fontWeight` was forbidden — Android would hunt for a nonexistent
  `Mulish-SemiBold_bold.ttf` and fall back silently. Now there is one family and the weight is the
  only thing that selects a cut:

  ```ts
  import { resolveFontWeight } from '@dsm/mobile';

  labelStyle = {
    fontWeight: resolveFontWeight(tokens.typography.label.fontWeight),
    fontSize: tokens.typography.label.fontSize,
  };
  ```

  **Never write `fontFamily` in a `@dsm/mobile` style** — not a literal, not `baseFontFamily` (that
  is web's Mulish). Both mistakes are invisible on a device: the system font is already the right
  one, so a family that fails to resolve just flattens every weight to regular.
  `apps/react-native-demo/__tests__/fontWeight.test.tsx` asserts the pair that catches it.

  Android interpolates the full 100–900 range from API 28 on; below that the system snaps to regular
  or bold and a 500 and a 600 look alike. `minSdk` is above that line.

  **On Android the system font is the OEM's to choose.** `/system/etc/fonts.xml`
  maps the `sans-serif` family, and it ships with the OS image: stock Android and
  Pixel point it at Roboto — verified on the emulator, and at the variable file,
  which is what makes the whole 100–900 range interpolate — but a Samsung can map
  it to One UI Sans and some skins let the user change it outright. So the promise
  is **"the device's system font"**, which is Roboto on stock, not "Roboto
  everywhere". That is the intended behaviour and not a gap to close: a phone
  looking like its own phone is the point of using the system face. iOS has no
  such variance — Apple does not let the system font be replaced.

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

## The props-to-tokens table is a gate, not a reference

**Before building a new component or touching an existing one, open
`docs/props-enlazadas-a-tokens.md` and read that component's section.** It records, per
Figma node property, which variable it binds, which axis actually moves it, and how far
our code is from producing the right value. It exists because none of that is guessable:
`radius/action` lives in the `4. Layout` collection and moves with **platform**, and the
Button's icon step was a hand-written value that had been wrong in two of four sizes
since the day it was written.

- **The component has a section** → read its rows first. A ⚠️ or ❌ there is work already
  scoped; do not rediscover it, and do not build on top of it without saying so.
- **It does not have a section** → **create it**, following the 15 rules at the top of
  that file. Measuring one component takes minutes and the method is written out step by
  step, endpoints included.
- **You confirm or correct a row** → update the file in the same commit. Rule 13. A table
  that claims green while the code is wrong is worse than no table.

Two things that file settles and that you should not re-derive:

- **Native vs hybrid is design's call, not ours.** The native components — the ones that
  redraw per OS, 15 as of 2026-10-01 — are listed in the Figma frame `Nativos e híbridos`
  (`1694:37`).
  Everything else is hybrid: one anatomy, and platform enters only through tokens
  (typography, touch target, colour, radii). A native component necessarily has
  `PLATAFORMA` rows; **having them does not make a component native** — measured, 23 of
  our 42 components diverge by platform and only 15 are native.
- **Both families still carry the brand and semantic themes.** Platform is a fourth axis
  on top, not a replacement.

**If you do not know where a token lives, ask until someone gives you the path.** Not a
guess, and not a row left half-filled: insist on the exact token path or address from the
dev who knows, and implement with that. A leaf read from the wrong place looks right
until it is rendered — `radius/action` returned a real number for weeks while being the
iOS one.

**Anything unclear about the design or about Figma goes to Jetto.** Do not close the gap
by inventing a row or by quoting a description you cannot find — the Button's icon
mapping was justified for a month with a sentence that exists in no export and in no
Supernova page.

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
