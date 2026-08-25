---
name: developing-design-system-components
description: >-
  Build or extend a design-system component (web + React Native) in this
  monorepo, consuming tokens from the Supernova theme export and shipping
  Storybook stories for both platforms. Use when adding a new component
  under packages/web or packages/mobile, adding a size/variant/state to an
  existing one, or wiring a component to new tokens.
---

# Developing design system components

Read `README.md` first — "Theming & tokens", "Adding a component" and
"Storybook" sections are the source of truth for structure and commands.
This skill is the checklist and the gotchas that aren't obvious from reading
the code once.

## Workflow

Copy this checklist and work through it in order:

```
- [ ] 1. Contract: src/types/atoms/<name>.types.ts in @dsm/shared (I<Name>BaseProps, no event handlers)
- [ ] 2. Tokens: src/tokens/<name>.tokens.ts in @dsm/shared, reading theme/{base,dark} via themeSource
- [ ] 3. Web: five-file component folder + add paths to generate-web-theme.mjs + regenerate CSS
- [ ] 4. Mobile: five-file component folder, reading the token file directly
- [ ] 5. Barrels: atoms/index.ts (or the right level) in both @dsm/web and @dsm/mobile
- [ ] 6. Storybook: Platform<Name>.tsx wrapper + <Name>.stories.tsx
- [ ] 7. Verify: pnpm typecheck && pnpm lint && pnpm build-storybook
```

`TextField` (`packages/{web,mobile}/src/components/atoms/TextField/`) is the reference
implementation for all of this — copy its shape for the next component, not `Button`'s
(`Button` predates the `theme/` token pipeline and still uses frozen legacy tokens).

## Tokens — read from `theme/`, never hand-roll

- Source of truth is `packages/shared/src/theme/{base,dark}/*.json` (Supernova's own export,
  already resolved). **`theme/` holds only that JSON** — the sync pipeline replaces the whole folder
  on every run, so nothing hand-written lives inside it. Read it with `readThemeToken` /
  `readThemeDimension` / `readThemeTypography` from `packages/shared/src/themeSource/tokenPath.ts`
  (a sibling folder, safe from the sync) — never copy a literal color/px value into a `.tokens.ts`
  file or a component.
- Dimension and typography have no theme variance today — read those from `themeSources.light`
  only. Color is the only axis that differs between `light` and `dark`.
- Web-only: `packages/shared/scripts/generate-web-theme.mjs` turns the same JSON into CSS custom
  properties. Add the new component's paths to its `*_PATHS` maps, then run
  `pnpm --filter @dsm/shared build:theme-css`. Never write a color/px value directly into a
  component's `.css` file — every value must come from a `var(--dsm-*)`.

## Known gotchas (each of these was a real bug once — don't reintroduce them)

- **Wire native constraints, not just derived text.** If a prop like `maxLength` drives a counter
  (`"n / max"`), it must ALSO be passed to the real `<input maxLength>` / RN `<TextInput
  maxLength>` — otherwise the counter can go negative/over while the token contract implies a hard
  limit.
- **Mulish is loaded on both platforms — via completely different mechanisms.** Web: `@dsm/web`
  self-hosts it with `@fontsource/mulish` (per-weight CSS imports in `packages/web/src/index.ts`) —
  use the plain package, NOT `@fontsource-variable/mulish`, whose `@font-face` registers as
  `"Mulish Variable"` and silently won't match the `"Mulish"` family every token specifies. Mobile:
  bare RN needs a linked native font file per weight (`packages/mobile/assets/fonts/Mulish-*.ttf`) —
  resolve the right one with `resolveMulishFontFamily(fontWeight)` from `@dsm/mobile`'s `theme/font.ts`,
  and do NOT also set a numeric `fontWeight` alongside it (Android's font resolver will hunt for a
  nonexistent suffixed file like `Mulish-SemiBold_bold.ttf` and silently fall back to the system font).
  A new weight needs a new instanced `.ttf` — see README "Theming & tokens" for how the existing ones
  were generated with `fonttools varLib.instancer`.
- **Accessibility parity with `Button`:** on mobile, set `accessibilityState={{ disabled: ... }}`
  and `accessibilityLabel` on the interactive element (RN has no DOM `label[for]`, so proximity to
  a `<Text>` label does not create a programmatic association). On web, error/alert text gets
  `role="alert"` (not plain helper text — that shouldn't interrupt the screen reader); on mobile,
  the equivalent is `accessibilityLiveRegion="assertive"`.
- **Turbo caching is off on purpose** (see README "Monorepo notes") — a green `pnpm typecheck` /
  `pnpm lint` is a real run, not a replayed cache hit. Don't re-enable caching to "speed things up".

## Conventions (quick reference — full list in README)

- `I` prefix for interfaces, `T` prefix for type aliases, `is` prefix for boolean props.
- CSS classes: `dsm-` prefix, BEM modifiers (`dsm-textfield--invalid`).
- Web and mobile share **types and token values only** — never share styles or presentation logic;
  each platform is expected to diverge where the platform calls for it.
