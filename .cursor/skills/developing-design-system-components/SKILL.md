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

## Kickoff prompt — fill in the blanks, the rest is this skill

When asked to build a new component, expect a request shaped like this (or ask for these specifics
if they're missing before starting):

```
Implementa <NOMBRE_COMPONENTE> para @dsm/shared, @dsm/web y @dsm/mobile.
Figma: <URL(s) — una por estado/variante si el nodo default no las cubre todas>
Notas: <opcional — ej. "usa el mismo patrón de focus ring que TextField">
```

Everything else — pixel-perfect fidelity to the live Figma node, full 1:1 property/variant parity
with Figma+Supernova (including independent `show*` booleans, never inferred from content), zero
hardcoded values, no invented placeholder icons, both platforms, stories per state, and the
`pnpm typecheck && pnpm lint && pnpm build-storybook` gate — is this skill's job, not the prompt's.
If Figma and Supernova disagree, Figma wins (see "Design reference" below) — surface the
discrepancy before writing code instead of silently picking one. Add any new non-obvious gotcha to
"Known gotchas" below once the component ships.

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
  is an imported snapshot and can lag or omit things the live Figma component actually does. Real
  example: `TextField`'s own Supernova record didn't surface that Figma has a third `sm` size at all —
  that only turned up from calling `get_design_context` directly on the live `TextField`/`TextArea`
  nodes (fileKey `DOUsaQf0fK7hybeS0n74gb`, node-id `3-1169` / `19-3421`) and reading the returned
  Tailwind fallback values (`var(--token/path,<literal>)`) and the component's own description text —
  not from Supernova alone. Don't build off Supernova's description without cross-checking the live
  node when a metric or a variant axis actually matters.
- **A component's Figma node can exist without being on a top-level canvas page.** `TextArea`'s real
  component set (`19:3454`) isn't reachable from the file's top-level page list (`get_metadata` with no
  `nodeId` only lists pages like `TextField`, `Select`, etc.) — it's still fetchable directly by
  `nodeId`, it's just nested somewhere `get_metadata`'s page listing doesn't surface. Don't conclude a
  component isn't specced in Figma just because it's missing from the page list; try the node-id from
  the design URL directly first.

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

- **`label` doubles as the placeholder — there is no separate `placeholder` prop, on either
  `TextField` or `TextArea`.** Figma's own node has one text element whose bound property switches
  between `label` (while empty — it renders in place of a value) and `value` (once there is one);
  there's no second text layer to keep in sync. A `placeholder` prop that's independent from `label`
  is a divergence from the real component — this shipped once on `TextField` and had to be removed.
  Model new text-entry components the same way: one `label` prop, no `placeholder`.
- **The floating label lives INSIDE the same bordered box as the value — never as a caption above
  it.** On both `TextField` and `TextArea`, Figma's `container` frame is the one node with the
  border/background/radius/padding, and the label + value are both plain text children inside it,
  stacked in a column. A version that renders `<label>` as a sibling *before* a separately-bordered
  input (gap between them, label outside the box) is visually wrong even if every color and size
  token is correct — this shipped once on both components and had to be restructured. Structure:
  outer wrapper (no border, no gap) → bordered `field` box (border/bg/radius/padding, `flex-col`) →
  optional floating `<label>` + the actual `<input>`/`<textarea>` (no border/bg/padding of its own) →
  sibling footer.
- **The floating label only shows once there's a value, and never at `TextField`'s `size='small'`.**
  Figma's rule, verbatim from the component description: "la etiqueta sube solo cuando hay un valor"
  — a focused, *empty* field is `focus`, not `filled`, and does not float (this changed in the design
  file on 20-ago; don't wire the float to `isFocused` by analogy with a typical Material text field).
  `size='small'` (32px) never floats even when filled — confirmed by `dimension.json`'s own
  `size.control.height.sm` description: "El campo compacto NO tiene etiqueta flotante: la etiqueta
  vive como placeholder dentro del valor. A partir de md (44) el campo si la lleva." `medium` (44px)
  DOES float once filled, despite `dimension.json`'s older, unrevised `size.field.height.md`
  description implying otherwise — when two token descriptions in the same file disagree, trust the
  live component node (`get_design_context`) over either doc, and prefer the more recently-dated one
  if you can't check the node.
- **Border radius and horizontal padding are the same at every `TextField` size — they don't scale
  with `sm`/`md`/`lg`.** All three sizes share one `radius/field/md` and one `space/inset/md` (12px)
  horizontal padding on the container; only height and *vertical* padding vary per size (`sm`/`md`: 0,
  `lg`: `space/inset/xs` = 4px). `TextArea` uses the same uniform `radius/field/md`, `space/inset/md`
  (12px) horizontal, but a flat `space/inset/sm` (8px) vertical, at its one size. Don't assume
  Supernova's independently-scaled `radius.field.sm`/`.md` tokens pair 1:1 with a component's own
  `sm`/`md`/`lg` size axis — the two scales are named independently and Figma's actual applied value
  (visible in `get_design_context`'s `var(--token,<literal>)` fallback) is the one that matters, not
  which same-named step looks like it should match.
- **Trust a token's `.value`, never its `.description`, when the two disagree.** `dimension.radius.field.md`'s
  `.value` is `"12px"`, but its own `.description` opens with "RADIO DE CAMPO BASE: 24 sobre 56 de
  alto" — a leftover from before the scale was redefined. `get_design_context` on six different live
  `TextField`/`TextArea` nodes all rendered `rounded-[var(--radius/field/md,12px)]`, confirming the
  `.value` (what the code actually reads) is the one Figma ships, not the stale prose. Not a one-off:
  `size.field.height.md`'s description also implied `medium` never floats its label (wrong — see the
  floating-label gotcha above), and `focus.ring.offset`/`.spread`'s descriptions document an *intended*
  1px gap in the focus ring that the live component was never rebuilt to match (see the focus-ring
  gotcha below — the node's actual layer wins there too). When a description and a live node disagree,
  the node wins; treat the description as a hint to verify, not a spec.
- **Focus on TextField / TextArea is an offset two-tone ring, not a flush
  blue band and never a recolor of the container border.** Figma's `focus`
  variant keeps `border-default` on the field and paints a separate ring:
  1px `focus/ring/offset` gap in `canvas/surface/primary`, then blue out to
  `focus/ring/spread` (3 = offset + `border/width/focus`). Visible blue is
  spread − offset (2px). Web: two `box-shadow`s
  (`0 0 0 <offset>px <surface>, 0 0 0 <spread>px <border-focus>`). Mobile:
  nested Views — outer `borderWidth: spread - offset` (blue), inner
  `borderWidth: offset` (surface), both reserved transparent when unfocused
  so focus doesn't shift layout. An older flush `0 0 0 <spread>px` shadow
  shipped when the live node still hugged the border; Figma rebuilt the
  gap — don't revert to flush. Don't copy Switch's flush ring here.
- **Hover is a translucent wash layered over the background, in addition to the border color
  change.** Figma's `hover` variant both recolors the border to `border-hover` AND paints an
  `overlay-hover` (a low-alpha navy, e.g. `rgba(0,30,96,0.06)`) on top of the existing background — two
  effects, not one. On web, reproduce the wash with a second `backgroundImage: 'linear-gradient(<overlay-hover>, <overlay-hover>)'`
  layered over `backgroundColor`, rather than skipping it because "the border already changes." There
  is no hover state on mobile (no pointer) — don't invent one.
- **Auto-grow on web: writing the measured height to the DOM node directly is not optional, even
  though the style prop also carries it.** `TextArea`'s `useLayoutEffect` collapses `style.height` to
  `'auto'`, reads `scrollHeight`, then must write that number straight back to `node.style.height`
  in the SAME effect — not just hand it to React via `setState` and trust the next render's
  `style={{ height: measuredHeight }}` to apply it. React diffs the new style object against its OWN
  last-rendered one, not the live DOM; when `scrollHeight` comes back unchanged from the previous
  measurement (most keystrokes don't cross a line-wrap boundary), React sees no numeric change and
  skips the DOM write, leaving `style.height` stuck at the `'auto'` this same effect just set — and a
  plain `<textarea>`'s `auto` does NOT size to content (unlike a block element), it falls back to the
  `rows`-based intrinsic height. Symptom: the field visibly compresses back down and grows an
  internal scrollbar on some keystrokes but not others. This shipped once without the direct write
  and looked fine in the story that happened to trigger a height change every keystroke.
- **`TextArea`'s starting height (`rows` / `numberOfLines`) defaults to 1 line, not the 3 a typical
  textarea might use.** Confirmed with `get_metadata` on the `TextArea` component set: `default`/
  `hover`/`focus` (label-as-placeholder, no value) are 44.01px tall — exactly `minHeight`
  (`size/field/height/md`), one line, no extra room reserved up front. Only `filled`/`error`/
  `disabled`/`readonly` (bound to the component's own multi-line default `value`) are 106.01px. Ship
  the compact default and let callers opt into a pre-expanded box via `rows`/`numberOfLines` when they
  know the content will be long.
- **`TextField`/`TextArea` label, value/affix, and helper/counter typography are NOT
  `typography.component.inputs.input-text.typography.*` — that composite group resolves to unrelated
  values.** It gives the label 400-weight/13px, content 14px, helper 13px, counter 11px; `get_design_context`
  on six live nodes across both components shows the label is actually `Mulish:ExtraBold`/12px/`leading-[1.35]`
  (Figma's own `text/label/sm/strong` style), and value/affix/helper/counter are all `Mulish:Regular`,
  value/affix at `font/size/body/md` (16px)/`leading-[1.5]` (`text/body/md/default`), helper/counter at
  `font/size/caption/md` (12px)/`leading-[1.5]` (`text/caption/md/default`). None of these three Figma
  text styles ever landed as a `type: "typography"` composite in the Style Dictionary export — only the
  primitives they're built from did (`dimension.font.size.*`, `.weight.*`, `.line-height.*`). Compose
  them by hand instead of reading a shorthand: see `composedTypographyAt` in `textField.tokens.ts` /
  `textArea.tokens.ts`. One trap inside the primitives themselves: `font.line-height.*` values
  (`tight`/`snug`/`normal`/`relaxed`) are literal percentages mis-typed as `px` upstream — `"135px"`
  means 135%, i.e. multiply `fontSize` by `1.35`, not add 135 pixels of line height.
- **Not every default behavior needs its own Storybook story.** `TextArea`'s auto-grow is real
  (confirmed in Supernova's own component description — see the token comment on
  `ITextAreaDimensionTokens.minHeight`), but it isn't gated by a prop — it's just what typing into
  ANY story already does. A dedicated "GrowsWithContent" story shipped once and got removed: it
  didn't demonstrate anything the `Playground` story (or any other, if you type into it) doesn't
  already show. Reserve dedicated stories for prop-driven states/combinations, not for passive
  behavior visible everywhere.
- **Wire native constraints, not just derived text.** If a prop like `maxLength` drives a counter,
  it must ALSO be passed to the real `<input maxLength>` / `<textarea maxLength>` / RN `<TextInput
  maxLength>` — otherwise the counter can go negative/over while the token contract implies a hard
  limit.
- **Counter string formats differ per component — don't unify them without checking Figma.**
  `TextField` renders `"n / max"` (spaces around the slash); `TextArea` renders `"n/max"` (no
  spaces). Copy the exact format from the component's own Figma spec, not from a sibling component.
- **`showHelper` / `showCounter` are real, independent boolean props — not derived from whether
  `helperText`/`errorMessage`/`maxLength` happen to be set.** Both `TextField` and `TextArea` shipped
  once inferring footer visibility from content presence alone (`helperText ? show : hide`); Figma's
  own component (confirmed via `get_design_context` — `showHelper`, `showCounter` show up as their own
  boolean props, both defaulting to `false` even when `helperText`/`counter` have non-empty default
  text) toggles each independently of content, so a consumer can hold `helperText` ready and flip
  visibility without clearing it. Neither is switched on automatically by `errorMessage`/`isInvalid`/
  `maxLength` either — pairing `errorMessage` with `showHelper: true` for WCAG 1.4.1 is on the
  consumer, exactly like Figma itself; see the `ErrorState` stories on both components.
- **`TextField`'s prefix/suffix affixes are two independent pairs of slots, each with its own
  `show*` flag.** Figma's props: `prefix`/`suffix` (plain text) gated by `showPrefixText`/
  `showSuffixText`, and separate `prefixIcon`/`suffixIcon` slots gated by `showPrefixIcon`/
  `showSuffixIcon` — text and icon on the same side can be on, off, or mixed independently. The affix
  text color is its own token group (`color.component.textfield.affix.*`), distinct from `value`'s.
  Icon slots are a Figma InstanceSwap, not opaque `ReactNode`: `prefixIcon` / `suffixIcon` live on
  `ITextFieldBaseProps` as `TIconName` (default `'search'` — Figma's own default prefix), and each
  platform renders the published glyph (`IconSearch`, `IconImage`, …) from `@dsm/{web,mobile}/icons`
  via a local map in `FieldIcon.tsx`. Do **not** put that registry in the icons entry point — it
  exists to stay tree-shakeable; TextField has to reference the set because it is the swap host.
  Size: `small`/`medium` → Icon `sm` (16); `large` → Icon `md` (24). **Never `lg` (32) inside a
  field** — bDS: *"Si lo estás usando dentro de un control, el tamaño está mal."* Colour role
  `secondary` (aliases `textfield.icon.icon-default`) / `disabled`. Anatomy (live `3:1124` lg filled,
  `3:1058` md filled): the bordered `container` holds a `content` *column* — floating `label`
  full-width on top, then `inputRow` underneath as a horizontal flex of
  `[prefixIcon, prefix, value, suffix, suffixIcon]`. Affixes are NOT siblings of the label; they sit
  on the value line. Empty/placeholder (no float) is just `inputRow`. Don't put icons beside the
  floating label. **`TextArea` has no icon slots — don't add them there.**
- **Icon glyphs are `IconTrash` / `IconImage` / `IconSearch`, not `<Icon name="…">`.** `Icon` is the
  wrapper (box + colour); the drawing is a child. Import from `@dsm/web/icons` or `@dsm/mobile/icons`.
  Default size is `sm`. `react-native-svg` is a peer of `@dsm/mobile`.
- **Switch has no label of its own. SwitchItem is the list row.** Figma: "Switch suelto no existe
  como pieza de pantalla." Apple HIG iOS: use switch style only in a list row; the row content is the
  accessible name; outside a list, use a toggle *button*, not a labelled switch. Do not add a `label`
  prop to Switch. `showStateLabel` (default `false`) is the overline ON/OFF word inside the track —
  visual only, not the accessible name. Immediate: `onChange` / `onValueChange` fires on press, no
  pending state. **Do not use RN `Switch` / `UISwitch`** (Apple green, 51×31, wrong tokens) — custom
  `Pressable` track+thumb painted from `color.component.switch.*`. On-fill is Figma `track.bg-on`
  (`#2760aa`), not system green. Web: visually hidden `input type="checkbox" role="switch"`. Mobile:
  `accessibilityRole="switch"`. Standalone tap area expands to `dimension.size.target.min` (48)
  without changing the painted track (`2 × size.icon.{sm|md} + 2 × space.inset.xs`). `isContained`
  is the composition seam: SwitchItem owns the row hit target and the row focus ring (Figma: ring on
  the row, not the thumb). State must not be color-only — thumb position + a11y `checked`, optional
  `showStateLabel`.
- **SwitchItem is the first molecule and the iOS-canonical Switch usage.** Entire row is the control
  (web: `<label>` wrapping the Switch input; mobile: `Pressable` row, inner Switch `isContained` so
  the a11y tree has one switch). Sizes sm 48 / md 56. `showDivider` defaults true. Description
  default color is `color.color.text.secondary` — the component group only ships
  `description.text-disabled`, no `text-default` co-token; don't invent one.
- **There is no CheckboxList.** Figma page `3:42` is only Checkbox. Closest list
  row is ChoiceItem (`control=checkbox`) — don't invent a group component. Stack
  `Checkbox` or wait for ChoiceItem. `isIndeterminate` is `isChecked={false}` +
  the input's DOM `indeterminate` property, not a third enum. Live size map
  (node, not the description's blanket "minHeight 48"): `sm` 16 box / 12 mark /
  32 row (`size.control.height.sm`); `md` 24 / 16 / 48 (`size.target.min`). **Property
  default is `sm`** (Figma/Supernova properties table) — not `md`. Marks
  are `IconCheck` / `IconMinus` with `color="fixed.white"` (Figma: not on-brand —
  selected fill is the same azure in all 4 modes) or `disabled`. **Never `lg`
  inside the box.** Focus is an **offset** ring (`focus/ring/offset` 1px gap +
  `spread` 3px blue, live `inset-[-4px]` — Checkbox's blue layer is
  `offset + spread`; TextField/TextArea use `spread` as the outer edge).
  Never drop the ring on a checked box (fill and ring are the same azure;
  shape is what distinguishes them). Don't
  read `typography.component.checkbox.labeled` (`400 16px/20px`); live type is
  `text/body/{sm,md}/default`, composed from `font.size.body.*`.
- **Every component's own variant axes are its own — don't generalize.** `TextField` has a `size`
  axis (`small`/`medium`/`large`, matching Figma's `sm`/`md`/`lg`) and an `icon` color group;
  `TextArea` has neither — a single `state` axis, no size, no icon slot. Confirm the axes with
  `get_design_context` on the live node before writing the shared types file, every time — see
  "Design reference" above for why Supernova's own record isn't always enough on its own.
- **Hover and focus are React state now, not CSS pseudo-classes, on web.** `useTextField` /
  `useTextArea` take `isHovered` / `isFocused` as params; the component owns the state
  (`onMouseEnter`/`onMouseLeave` on the bordered box, `onFocus`/`onBlur` on the input) and feeds it in.
  Precedence for the container's **border color**: `disabled > readOnly > error > hover > default` —
  focus is deliberately absent from this list; see the focus-ring gotcha above for why. Mobile has no
  hover — only `isFocused`, and it drives the separate ring, not the border, same as web.
- **`usePrefersReducedMotion()` replaces a `@media` query.** With inline `transition` strings built in
  JS, there's no `@media (prefers-reduced-motion: reduce)` rule to hide behind — call this hook (from
  `@dsm/web`'s `theme/`) and set `transition: 'none'` when it's `true`.
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
