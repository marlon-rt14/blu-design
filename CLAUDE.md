# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A design-system monorepo (pnpm + Turbo). Components live in `packages/` and are consumed by demo apps
in `apps/`:

```
apps/
  web-demo/            # Vite + React + TS — consumes @dsm/web, hosts Storybook
  react-native-demo/   # React Native bare (no Expo) — consumes @dsm/mobile
packages/
  shared/  # @dsm/shared — platform-agnostic types + design tokens (the contract)
  web/     # @dsm/web    — web components (inline styles; Button still plain CSS)
  mobile/  # @dsm/mobile — React Native components (StyleSheet)
```

`@dsm/shared` defines the contract (base types + tokens); `@dsm/web` and `@dsm/mobile` each implement
it, diverging in presentation where the platform calls for it. Packages are consumed as **TypeScript
source** (`main` points at `src/index.ts`, no build step) — Vite and Metro transpile them directly, so
editing a component hot-reloads in the web demo.

Full narrative docs (theming pipeline history, font-loading mechanics, `BluProvider`, monorepo
plumbing) are in `README.md` — read it, but see "Theming & tokens" below first: the README's own
theming section describes an earlier two-mode (`base`/`dark`) version of the pipeline that the code has
since outgrown.

## Commands

```bash
pnpm install
pnpm dev:web             # Vite dev server for the web demo
pnpm start:mobile        # Metro for the React Native demo
pnpm ios                 # Build + launch the demo on iOS simulator
pnpm android              # Build + launch the demo on an emulator/device
pnpm typecheck            # tsc across all 5 projects (turbo run typecheck)
pnpm build                # Production build of the web demo
pnpm storybook             # Single Storybook documenting both platforms, port 6006
pnpm build-storybook        # Static Storybook build into storybook-static/
pnpm test                  # jest — currently only apps/react-native-demo has tests
pnpm lint                  # oxlint (web-demo) + eslint (react-native-demo)
```

Everything above is `turbo run <task> --filter=...` under the hood — see `package.json`. To run a
single package's task directly: `pnpm --filter <name> <script>` (e.g.
`pnpm --filter @dsm/web typecheck`, `pnpm --filter ReactNativeDemo test -- -t "<name>"`).

**Turbo caching is disabled everywhere** (`"cache": false` on every task in `turbo.json`) — a cache hit
replays a previous run's logs/exit code, which can look green without re-executing. Don't re-enable it
to "speed things up"; a passing `pnpm typecheck`/`pnpm lint` needs to be a real run.

There is no component-level test suite — `pnpm test` only runs the one smoke test in
`apps/react-native-demo/__tests__`. Verification for component work is
`pnpm typecheck && pnpm lint && pnpm build-storybook`, plus manually exercising the story in
Storybook.

iOS/Android native builds need `cd apps/react-native-demo/ios && pod install` once, and whenever native
deps change; Node >= 22.11, pnpm 11.

## Architecture

### Theming & tokens — the real current shape

Token source of truth: `packages/shared/src/theme/<folder>/{color,dimension,typography,string}.json`,
Supernova's own resolved export. **The sync pipeline replaces the whole `theme/` folder on every run —
nothing hand-written lives inside it.** There are now three independent theme axes (not just
light/dark):

- **`TThemeBrand`**: `'blu' | 'titanium' | 'discover' | 'clubmiles' | 'grandtable'` — which product a
  screen belongs to (Figma's "Brand" collection); moves ~180 color tokens.
- **`TThemeMode`**: `'light' | 'dark' | 'mc-light' | 'mc-dark' | 'hc-light' | 'hc-dark'` — contrast
  level (Figma's "Semantic" collection); the widest axis, ~1042 color tokens.
- **`TThemeLayout`**: `'compact' | 'regular' | 'expanded'` — spacing/type-scale density per form factor
  (Figma's "Layout" collection); touches ~34 dimension tokens only, zero color tokens.

Defaults: `blu` / `light` / `compact`. `brand` and `mode` both own `color.json` and **cannot both leave
their default at once** — the Supernova export ships one folder per axis value, not the full N×M×P
cross product, so `resolveTheme()` (in `packages/shared/src/themeSource/themes.ts`) picks the axis that
was explicitly requested and reports `isExact: false` when a combination isn't actually exported (e.g.
`discover` + `hc-light`). `layout` is orthogonal to the other two (disjoint dimension keys) and always
composes cleanly via `composeDimension`. Everything is indexed by `TThemeSourceKey` = `` `${brand-or-mode}@${layout}` ``
(e.g. `'dark@compact'`), exposed as `themeSources` and read with `readThemeToken` / `readThemeDimension`
/ `readThemeTypography` (`packages/shared/src/themeSource/`, barrel-exported from `@dsm/shared`) —
never import the JSON or hand-roll a literal value directly in a component or `.tokens.ts` file.

- `packages/shared/src/tokens/<name>.tokens.ts` — one file per component, reading `color`, `dimension`
  **and** `typography` per key (dimension is *not* fully mode-invariant — e.g. elevation shadows differ
  by mode) and re-exporting `Record<TThemeSourceKey, I<Name>Tokens>`, nesting any size/state variant
  axis *inside* each entry. See `textField.tokens.ts` / `textArea.tokens.ts`.
- `packages/shared/src/tokens/theme.tokens.ts` — page-level root tokens (`pageColorTokens`) plus
  `baseFontFamily` (`"Mulish"`, **web only** — see "Font" below).
- Legacy hand-rolled tokens (`colors.ts`, `spacing.ts`, …) are frozen, kept only for `Button` (which
  predates this pipeline). Never add new tokens there.

**No build step on either platform.** A component's `use<Name>.ts` hook calls `useThemeMode()` (returns
the active `TThemeSourceKey`), indexes into `<name>Tokens[key]`, and returns plain style objects —
`CSSProperties` on web, `StyleSheet`-compatible objects on mobile. `ThemeProvider` (`@dsm/web`'s and
`@dsm/mobile`'s, both under `theme/`) takes `brand?`/`mode?`/`layout?`, resolves them through
`resolveTheme`, and exposes `useThemeMode()` / `useResolvedTheme()` (key + axes + `isExact`) via
context. Leaving `mode` unset tracks `prefers-color-scheme` live (`matchMedia` on web,
`Appearance.addChangeListener` on mobile) unless a non-default `brand` was explicitly requested, in
which case the stated brand wins over the system mode. `@dsm/web` also exposes
`usePrefersReducedMotion()` — components build `transition` strings in JS (no CSS, no
`@media (prefers-reduced-motion)`) and must check this before animating.

The one thing that must stay in real CSS: `::placeholder` (a pseudo-element, no inline-style
equivalent) — `TextField`/`TextArea` apply the shared `dsm-input` class and set
`--dsm-input-placeholder-color` inline; see `packages/web/src/styles/pseudo.css`. Extend that file for
a new component's pseudo-selector needs rather than adding a new CSS file.

**Font**: per platform — **web Mulish, iOS SF Pro, and on Android the device's own system
font, which on stock is Roboto** (an OEM maps the `sans-serif` family itself, so a Samsung may
show One UI Sans — that is the intended native behaviour, not a gap). Web self-hosts Mulish via
`@fontsource/mulish`, pulled in by `BluProvider` (plain package, not the `-variable` one — the
variable build registers as `"Mulish Variable"` and silently breaks token matching).

**Mobile sets no font family at all, on purpose.** SF Pro is the iOS system font and Roboto is
Android's, so leaving `fontFamily` unset is what selects them: `@dsm/mobile` ships no font files,
links no native assets, and licenses nothing. **Never write `fontFamily` in a `@dsm/mobile` style**
— not a literal and not `baseFontFamily`, which is web's Mulish. The weight carries everything
there: `fontWeight: resolveFontWeight(tokens.typography.<slot>.fontWeight)`, read from
`dimension.font.weight.*` like any other token. Setting a family that does not resolve, or omitting
the weight, both look almost right on a device — every cut collapses to regular — so check the
render, not the types.

### Adding a component

Atomic design: `atoms/` → `molecules/` → `organisms/`. Every component is a four-file folder, same
shape on both platforms — `TextField`/`TextArea` are the reference implementation to copy (not
`Button`, which predates the tokens pipeline and still uses per-file CSS):

```
packages/web/src/components/atoms/<Name>/
├── index.ts            # public barrel
├── <Name>.tsx           # presentation: local hover/focus state, no token math
├── <Name>.types.ts       # I<Name>Props extends I<Name>BaseProps (from @dsm/shared)
└── use<Name>.ts           # hook resolving style objects from tokens + props + state
```

Steps: (1) contract in `@dsm/shared` — `src/types/atoms/<name>.types.ts`, `I<Name>BaseProps`, no event
handlers, check the component's *own* Figma variant axes rather than copying a sibling's; (2) tokens in
`@dsm/shared` — `src/tokens/<name>.tokens.ts` per the pattern above; (3)/(4) the four-file folder in
`@dsm/web` and `@dsm/mobile`; (5) barrels (`atoms/index.ts` etc.) in both packages; (6) Storybook — a
`Platform<Name>.tsx` wrapper in `apps/web-demo/src/stories/` mapping the neutral story prop to each
platform's event handler (e.g. `onAction` → `onClick`/`onPress`) plus `<Name>.stories.tsx` covering
every Figma state; (7) `pnpm typecheck && pnpm lint && pnpm build-storybook`.

For any real component build (new component, new variant/size/state, new token wiring), read
`.cursor/skills/developing-design-system-components/SKILL.md` first — it is the canonical, much more
detailed checklist: a hard-stop MCP gate (Figma is the primary design reference, Supernova is scoped to
property/variant enumeration only, Figma wins on any disagreement), and a long list of real shipped
bugs/gotchas per component (floating-label rules, focus-ring geometry, `lineHeight` unit traps, etc.).
Don't re-derive those from scratch — that file exists precisely because they weren't obvious the first
time.

Three rules from it that decide the shape of a new component, so they are worth knowing before you
open it:

- **The `«Name» · Dev` frame is the contract.** Its section `01 · Firma de código` is what the frame
  itself calls *"lo que desarrollo copia"* — copy it whole, names and shape. The practical
  consequence is the `show*` note above: a slot renders because its content was passed.
- **Every glyph goes through our own `Icon`.** It owns the box (`size/icon/*`), the colour
  (`color/icon/*`) and the `0 0 24 24` grid; a published glyph *is* an `Icon` with its paths inside.
  Never hand-roll an `<svg>`, never resize one with `width`/`height`.
- **An icon that arrives through a prop is a `ReactNode`.** `TIconName` was deleted: a name needs a
  registry, a registry references all 1170 glyphs, and that defeats the per-section entry points.
  The caller imports the glyph and passes the element.

### Storybook

One Storybook instance documents both implementations; a **Platform** toolbar dropdown picks which one
renders (`@dsm/web` natively, `@dsm/mobile` through `react-native-web`). Stories are written once
against the shared `@dsm/shared` contract. Autodocs are enabled globally
(`apps/web-demo/.storybook/preview.tsx`); prop tables declare `argTypes` explicitly since react-docgen
can't resolve props inherited from another package.

## Conventions

- Interfaces prefixed `I` (`IButtonProps`), type aliases prefixed `T` (`TButtonVariant`).
- Component files/folders: `PascalCase`. Everything else: `camelCase`.
- Boolean props prefixed `is` (`isDisabled`). The Figma-driven `show*` visibility flags are being
  retired component by component as each one's **dev contract** is honoured: the contracts say *"la
  presencia del nombre sustituye al booleano"*, so a slot renders because its content was passed, not
  because a boolean was flipped. TextField, ListItem, Tag, Chip and Tabs are already on that rule (and
  their `isDisabled`/`isReadOnly` became `disabled`/`readOnly` with it); the components that still have
  `show*` and `is*` keep them until their own contract is read. The exception that survives on purpose
  is a boolean with no content to infer from — `ListItem`'s `divider`, `ProgressBar`'s `showHeader`.
- CSS classes prefixed `dsm-`, BEM modifiers (`dsm-button--primary`) — legacy `Button` only; new
  components have no CSS files beyond the shared `pseudo.css` placeholder seam.
- Web and mobile share **types and token values only**, never styles or presentation logic — each
  platform is expected to diverge (e.g. web `Button` is an uppercase pill with hover lift, mobile is a
  rounded rectangle).
- Commit messages, code comments, and JSDoc are written in English.

## Monorepo plumbing (only matters when touching root config)

- **One React for the whole workspace**, forced via `overrides` in `pnpm-workspace.yaml`: React Native
  0.87 pins `react@19.2.3` exactly (its bundled renderer requires that version); the web app is aligned
  down to match rather than left on a newer one, since a flat `node_modules` can otherwise end up with
  two React instances ("Invalid hook call").
- `nodeLinker: hoisted` in `pnpm-workspace.yaml` — flat `node_modules`, because RN autolinking
  (CocoaPods/Gradle) doesn't cope with pnpm's symlinked layout.
- `apps/react-native-demo/metro.config.js` adds `watchFolders` for the repo root and pins
  `nodeModulesPaths`/`disableHierarchicalLookup` so Metro sees `packages/*` through one copy of React;
  `apps/web-demo/vite.config.ts` uses `resolve.dedupe` for the same reason.
- `packages/web/src/styles/tokens.css` manually mirrors `@dsm/shared` tokens (CSS can't import from TS)
  — update both places when a token changes.
- Path aliases (`@dsm/shared`, `@dsm/web`, `@dsm/web/icons/*`, `@dsm/mobile`, `@dsm/mobile/icons/*`)
  are declared once in `tsconfig.base.json` and consumed by every project's `tsconfig.json`. The
  icon subpaths are wildcards: there is **one entry point per section** (`@dsm/web/icons/layout`),
  19 of them, and no barrel over them — see `scripts/generate-icons.mjs`.
