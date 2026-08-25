---
name: developing-design-system-components
description: >-
  Build or extend a design-system component (web + React Native) in this
  monorepo: spec it against the Figma MCP ("BDS3 - Core components") and
  Supernova's property/variant data, consume tokens from the Supernova theme
  export, and ship Storybook stories for both platforms. Use when adding a
  new component under packages/web or packages/mobile, adding a
  size/variant/state to an existing one, or wiring a component to new
  tokens.
---

# Developing design system components

Read `README.md` first — "Theming & tokens", "Adding a component" and
"Storybook" sections are the source of truth for structure and commands.
This skill is the checklist and the gotchas that aren't obvious from reading
the code once.

## Workflow

Copy this checklist and work through it in order:

```
- [ ] 0. Spec: Figma MCP directly on "BDS3 - Core components" (search_design_system, then
       get_design_context / get_metadata / get_screenshot) — the primary design reference. Cross-check
       component properties/variants against Supernova (sn_get_figma_component_detail /
       sn_get_component_property_list) — see "Design reference" below.
- [ ] 1. Contract: src/types/atoms/<name>.types.ts in @dsm/shared (I<Name>BaseProps, no event handlers).
       Check the component's OWN variant axes — don't copy another component's size/state shape.
- [ ] 2. Tokens: src/tokens/<name>.tokens.ts in @dsm/shared — one Record<TThemeMode, I<Name>Tokens>,
       reading color/dimension/typography from theme/{base,dark} via themeSource, ALL per mode.
- [ ] 3. Web: four-file component folder, use<Name>.ts returns CSSProperties from tokens[mode] + local
       hover/focus state. No CSS generator, no build step — see "Tokens" below.
- [ ] 4. Mobile: four-file component folder, use<Name>.ts returns StyleSheet-compatible objects from
       tokens[mode] + local focus state (no hover on touch).
- [ ] 5. Barrels: atoms/index.ts (or the right level) in both @dsm/web and @dsm/mobile
- [ ] 6. Storybook: Platform<Name>.tsx wrapper + <Name>.stories.tsx covering every Figma state and
       every independently-toggleable prop combination
- [ ] 7. Verify: pnpm typecheck && pnpm lint && pnpm build-storybook
```

`TextField` and `TextArea` (`packages/{web,mobile}/src/components/atoms/{TextField,TextArea}/`) are
the reference implementations for all of this — copy their shape for the next component, not
`Button`'s (`Button` predates the `theme/` token pipeline and still uses frozen legacy tokens and a
per-component CSS file). Between the two, notice how little they actually share: `TextField` has a
`size` axis and an icon color group, `TextArea` has neither but grows with content and floats its
label instead of showing a persistent one — always verify the new component's own spec instead of
assuming either one generalizes.

## Design reference — Figma MCP first, Supernova for properties

Two different MCP servers cover design, and they now have distinct jobs — don't reach for the wrong
one:

- **Figma MCP is the primary design reference.** It's connected directly to the design team's file,
  not a cached copy: `"BDS3 - Core components"`, fileKey `DOUsaQf0fK7hybeS0n74gb`, library key
  `lk-04e68665c14a66d389bd82004a911b7202d7b89752ca873d7d1766333156266fea731ff7a6e691d92f58774d72a0dbe58054975053fd1f4ad9be4e7fdf9cf182`
  (rediscover with `sn_get_design_source_list` in Supernova if it ever rotates — that's where these
  came from). Workflow: `search_design_system` with `includeLibraryKeys: [<that key>]` and the
  component name to get its `componentKey`/node, then `get_design_context` (load the
  `/figma-design-to-code` skill first — mandatory) or `get_metadata` / `get_screenshot` to inspect the
  real node. Build the component against the theme JSON tokens already in `@dsm/shared` (see
  "Tokens" below) — this is simpler than round-tripping the component's shape through Supernova, and
  it's the live file, not an import snapshot.
- **Supernova MCP is now scoped to component properties/configuration, not the design reference.**
  Use `sn_get_figma_component_detail` (variants + Figma component property definitions as JSON) and
  `sn_get_component_property_list` (property IDs, code names, option sets) to get the structured list
  of variants/props/states a component exposes — that enumeration is what Supernova is good at, and
  it's tedious to derive by eye from a Figma canvas.
- **Always compare the two when they disagree — Figma wins.** Supernova's canonical component record
  is an imported snapshot and can lag or omit things the live Figma component actually does (real
  example: `TextField`'s own Supernova record didn't surface that Figma has a third `sm` size, or that
  the floating label only applies at `lg` — see the `TextField` gaps called out elsewhere in this
  skill). Don't build off Supernova's description alone without checking the Figma component's own
  description text and variant list.

## Tokens — read from `theme/`, never hand-roll

- Source of truth is `packages/shared/src/theme/{base,dark}/*.json` (Supernova's own export,
  already resolved). **`theme/` holds only that JSON** — the sync pipeline replaces the whole folder
  on every run, so nothing hand-written lives inside it. Read it with `readThemeToken` /
  `readThemeDimension` / `readThemeTypography`, barrel-exported from `@dsm/shared`'s
  `themeSource/index.ts` (a sibling folder, safe from the sync) — never copy a literal color/px value
  into a `.tokens.ts` file or a component.
- **`dimension.json` is NOT fully theme-invariant — read every field per mode.** Only
  `typography.json` and `string.json` are byte-identical between `base` and `dark`.
  `dimension.elevation.{raised,overlay}.shadow.*` (7 tokens) actually differs. A component's
  `.tokens.ts` should collapse into a single `Record<TThemeMode, I<Name>Tokens>` reading `color`,
  `dimension` and `typography` all from `themeSources[mode]` — never assume `light` is a safe
  stand-in for `dark` for a field you haven't diffed, even if today's two numbers happen to match.
- **No build step, on either platform — this replaced a CSS generator.** A component's `use<Name>.ts`
  hook calls `useThemeMode()`, indexes into `<name>Tokens[mode]`, and returns plain style objects
  directly — `CSSProperties` on web, `StyleSheet`-compatible objects on mobile. There is no
  `generate-web-theme.mjs` anymore and no per-component path list to keep in sync; adding a component
  never touches a shared generator file. The one thing that must stay in real CSS is `::placeholder`
  (a pseudo-element — no inline-style equivalent): apply the shared `dsm-input` class from
  `packages/web/src/styles/pseudo.css` and set `--dsm-input-placeholder-color` inline from the token.
  Don't create a new CSS file for a new component's placeholder — extend `pseudo.css`.

## Known gotchas (each of these was a real bug once — don't reintroduce them)

- **`TextField`'s own Figma spec has more than the code implements — known, not yet fixed.** Figma
  has three sizes (`sm` 32 / `md` 44 / `lg` 56 — only `medium`/`large` are built, mapping to Figma's
  `md`/`lg`; `sm` is missing), and Figma's floating label only actually applies at `lg` (`sm`/`md` use
  the label purely as a placeholder, no persistent caption once filled) — the shipped component
  instead renders one static `<label>` regardless of size. This came from comparing the code against
  `sn_get_figma_component_detail` directly, not from reading the code alone — a reminder that
  Supernova's/the code's own idea of a component can silently diverge from Figma's. Don't copy
  `TextField`'s label structure into a new component assuming it's correct — check the new
  component's own spec (see "Design reference" above).
- **Wire native constraints, not just derived text.** If a prop like `maxLength` drives a counter,
  it must ALSO be passed to the real `<input maxLength>` / `<textarea maxLength>` / RN `<TextInput
  maxLength>` — otherwise the counter can go negative/over while the token contract implies a hard
  limit.
- **Counter string formats differ per component — don't unify them without checking Figma.**
  `TextField` renders `"n / max"` (spaces around the slash); `TextArea` renders `"n/max"` (no
  spaces). Copy the exact format from the component's own Figma spec, not from a sibling component.
- **Every component's own variant axes are its own — don't generalize.** `TextField` has a `size`
  axis (`medium`/`large`, plus an unbuilt Figma `sm`) and an `icon` color group; `TextArea` has
  neither — a single `state` axis, no size, no icon slot. Confirm the axes with
  `sn_get_figma_component_detail` before writing the shared types file, every time.
- **Hover and focus are React state now, not CSS pseudo-classes, on web.** `useTextField` /
  `useTextArea` take `isHovered` / `isFocused` as params; the component owns the state
  (`onMouseEnter`/`onMouseLeave`, `onFocus`/`onBlur`) and feeds it in. Precedence for border/background
  color across states: `disabled > readOnly > error > focus > hover > default`. Mobile has no hover —
  only `isFocused`, same precedence minus that one step.
- **`usePrefersReducedMotion()` replaces a `@media` query.** With inline `transition` strings built in
  JS, there's no `@media (prefers-reduced-motion: reduce)` rule to hide behind — call this hook (from
  `@dsm/web`'s `theme/`) and set `transition: 'none'` when it's `true`.
- **`TextArea`'s floating label follows `value`, not `focus`.** A focused, empty `TextArea` is Figma's
  `focus` state, not `filled` — the label stays as the placeholder. It only floats once there is a
  value. Don't wire it to `isFocused` by analogy with a typical Material-style floating label.
- **Mulish is loaded on both platforms — via completely different mechanisms, both behind
  `BluProvider`.** Web: `@dsm/web`'s `theme/font.ts` self-hosts it with `@fontsource/mulish`
  (per-weight CSS imports, pulled in by importing `BluProvider`) — use the plain package, NOT
  `@fontsource-variable/mulish`, whose `@font-face` registers as `"Mulish Variable"` and silently
  won't match the `"Mulish"` family every token specifies. Importing `@dsm/web` alone, without
  rendering `<BluProvider>`, no longer loads any font. Mobile: bare RN needs a linked native font file
  per weight (`packages/mobile/assets/fonts/Mulish-*.ttf`) — resolve the right one with
  `resolveMulishFontFamily(fontWeight)` (aliased as `useFontFamily` in `@dsm/mobile`'s `theme/index.ts`
  for symmetry with web's hook of the same name), and do NOT also set a numeric `fontWeight` alongside
  it (Android's font resolver will hunt for a nonexistent suffixed file like
  `Mulish-SemiBold_bold.ttf` and silently fall back to the system font). A new weight needs a new
  instanced `.ttf` — see README "Theming & tokens" for how the existing ones were generated with
  `fonttools varLib.instancer`.
- **Accessibility parity with `Button`:** on mobile, set `accessibilityState={{ disabled: ... }}`
  and `accessibilityLabel` on the interactive element (RN has no DOM `label[for]`, so proximity to
  a `<Text>` label does not create a programmatic association). On web, error/alert text gets
  `role="alert"` (not plain helper text — that shouldn't interrupt the screen reader); on mobile,
  the equivalent is `accessibilityLiveRegion="assertive"`. A counter tied to a required limit should
  be announced too (`aria-live="polite"` / `accessibilityLiveRegion="polite"`), not just visible.
- **Turbo caching is off on purpose** (see README "Monorepo notes") — a green `pnpm typecheck` /
  `pnpm lint` is a real run, not a replayed cache hit. Don't re-enable caching to "speed things up".

## Conventions (quick reference — full list in README)

- `I` prefix for interfaces, `T` prefix for type aliases, `is` prefix for boolean props.
- CSS classes: `dsm-` prefix (`dsm-input`, used only for the `::placeholder` seam — see "Tokens"
  above; `Button`'s legacy CSS still uses BEM modifiers like `dsm-button--primary`).
- Web and mobile share **types and token values only** — never share styles or presentation logic;
  each platform is expected to diverge where the platform calls for it.
