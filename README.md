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
| `pnpm test`          | Tests (jest in the React Native app)                     |
| `pnpm lint`          | oxlint in the web demo, eslint in the React Native one   |

The `packages/` are consumed as **TypeScript source** (`main` points at `src/index.ts`): they have no
build step, and Vite and Metro transpile them directly. Editing a design system component hot-reloads
in the web demo.

## Adding a component

Atomic design: `atoms/` → `molecules/` → `organisms/`. Every component is a folder following the same
file pattern (see `Button` as the reference):

```
packages/web/src/components/atoms/Button/
├── index.ts           # public barrel for the component
├── Button.tsx         # presentation, no styling logic
├── Button.types.ts    # IButtonProps extends IButtonBaseProps (from @dsm/shared)
├── useButton.ts       # hook that resolves styles from the props
└── Button.css         # styles (on mobile: Button.styles.ts with StyleSheet)
```

Steps:

1. **Contract in `@dsm/shared`** — `src/types/atoms/<name>.types.ts` with `I<Name>BaseProps` and its
   `T<Name>Variant` / `T<Name>Size`. No event handlers: each platform adds its own.
2. **Tokens in `@dsm/shared`** — `src/tokens/<name>.tokens.ts`, derived from the primitives
   (`colors`, `spacing`, `radii`, `typography`).
3. **Web and mobile implementations** — the five-file folder in each package.
4. **Barrels** — add it to the `index.ts` of its level (`atoms/index.ts`, and so on).

## Conventions

- Commit messages, code comments and JSDoc are written in English.
- Interfaces are prefixed with `I` (`IButtonProps`), type aliases with `T` (`TButtonVariant`).
- Component files and folders use `PascalCase`; everything else uses `camelCase`.
- Boolean props are prefixed with `is` (`isDisabled`).
- CSS classes are prefixed with `dsm-` and use BEM modifiers (`dsm-button--primary`).
- Web and mobile do not share styles: they share **types and tokens**.

## Monorepo notes

- **Turbo caching is disabled** (`"cache": false` on every task in `turbo.json`). A cache hit replays
  the logs and exit code of a previous run, and that green checkmark can look like something works
  when it was never re-executed. Turbo is kept here only for topological ordering and parallelism. To
  re-enable it, remove `"cache": false` from the specific task.
- `nodeLinker: hoisted` in `pnpm-workspace.yaml` gives a flat `node_modules`, because React Native
  autolinking (CocoaPods/Gradle) does not cope well with the symlinks of pnpm's isolated layout.
- `apps/react-native-demo/metro.config.js` adds `watchFolders` for the monorepo root and pins
  `nodeModulesPaths` together with `disableHierarchicalLookup`, so that Metro sees `packages/*` and
  uses a single copy of React.
- `apps/web-demo/vite.config.ts` uses `resolve.dedupe` for react/react-dom for the same reason.
- `packages/web/src/styles/tokens.css` is a manual mirror of the `@dsm/shared` tokens (CSS cannot
  import values from TypeScript). When a token changes, both places need updating.
