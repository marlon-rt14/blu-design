---
name: developing-design-system-components
description: >-
  Build or extend a design-system component (web + React Native) in this
  monorepo: spec it against the Figma MCP ("BDS3 - Core components") and
  Supernova's property/variant data, consume tokens via fromThemeSources /
  TThemeSourceKey (brand × mode × layout), and ship Storybook stories for both
  platforms. Copy the component's `«Name» · Dev` firma whole — it is the contract, which means
  presence-based slots instead of `show*` booleans — render every glyph through our own `Icon`
  imported from its section (`@dsm/web/icons/general`, never a barrel), and type any icon that
  arrives through a prop as `ReactNode`. Use when adding a component under packages/web or
  packages/mobile, adding a size/variant/state, or wiring tokens after a theme sync.
---

# Developing design system components

Read `README.md` first — "Theming & tokens", "Adding a component" and
"Storybook" sections are the source of truth for structure and commands.
This skill is the checklist and the gotchas that aren't obvious from reading
the code once.

## Workflow

Copy this checklist and work through it in order:

```
- [ ] -1. MCP gate (HARD STOP): verify BOTH design MCPs before any spec or code.
       Figma: call `whoami` (or `get_metadata` / `get_screenshot` on the target
       fileKey). Supernova: call `sn_get_me`. Both must succeed in THIS session.
       If either namespace is missing, `needsAuth`, errors, or returns empty /
       auth failures — **stop**. Do not implement from memory, cached screenshots,
       or Supernova alone. Tell the user which MCP failed and how to reconnect
       (Figma plugin auth / Supernova MCP). Only continue once both pass again.
- [ ] 0. Spec: Figma MCP directly on "BDS3 - Core components" (search_design_system, then
       get_design_context / get_metadata / get_screenshot) — the primary design reference.
       **Always locate and read the sibling `«Component» · Dev` / `«Component» · contrato de
       desarrollo` frame on the same page** (firma de código + props públicas + divergencias).
       Cross-check component properties/variants against Supernova
       (sn_get_figma_component_detail / sn_get_component_property_list) — see "Design reference"
       below.
- [ ] 1. Contract: src/types/atoms/<name>.types.ts in @dsm/shared (I<Name>BaseProps).
       **The Dev firma IS the contract — copy it whole, names and shape.** It is the section
       the frame itself calls "lo que desarrollo copia". Check the component's OWN variant axes;
       don't copy another component's size/state shape.
       Three rules that fall out of it, and that the older components in this repo predate:
         · **No `show*` booleans.** The contracts are unanimous — *"la presencia del nombre
           sustituye al booleano"*. A slot renders because its content was passed. The only
           boolean that survives is one with no content to infer from (ListItem's `divider`:
           a row cannot know it is the last of its group).
         · **`disabled` / `readOnly`, not `isDisabled` / `isReadOnly`**, where the firma says so.
         · **Icon slots are `ReactNode`** — see "Icons" below. Never a name, never a union of names.
       Handlers live here when the firma names them (`onChangeText`, `onToggle`, `onRemove`), and
       keep each platform's own name only where the platform owns it (`onClick` web / `onPress`
       mobile). Components not yet migrated still carry `show*` and `is*`: leave them until their
       own contract is read — the retirement is component by component, never a blanket rename.
- [ ] 2. Tokens: src/tokens/<name>.tokens.ts in @dsm/shared — `fromThemeSources(read)` →
       `Record<TThemeSourceKey, I<Name>Tokens>`. Reader takes `key: TThemeSourceKey`, reads
       `themeSources[key]` via `readThemeToken` / `readThemeDimension` / `readThemeTypography`.
       Never hand-roll `{ light: …, dark: … }` — keys are composed (`light@compact`, …).
- [ ] 3. Web: four-file component folder, use<Name>.ts returns CSSProperties from
       tokens[useThemeMode()] + local hover/focus state. `useThemeMode()` returns
       `TThemeSourceKey` (not a bare mode). No CSS generator — see "Tokens" below.
- [ ] 4. Mobile: four-file component folder, use<Name>.ts returns StyleSheet-compatible objects from
       tokens[useThemeMode()] + local focus state (no hover on touch).
- [ ] 5. Barrels: atoms/index.ts (or the right level) in both @dsm/web and @dsm/mobile
- [ ] 6. Storybook: Platform<Name>.tsx wrapper + <Name>.stories.tsx covering every Figma state and
       every independently-toggleable prop combination. Toolbar axes are **brand / mode / layout**
       (not a single `theme` global). Surface colours in stories: `themeFromGlobals(globals).key`
       → `themeSources[key]` — see `Button.stories.tsx` / `themeGlobals.ts`.
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

Everything else — pixel-perfect fidelity to the live Figma node, the Dev firma copied whole
(which means presence-based slots, not `show*` booleans), zero
hardcoded values, no invented placeholder icons, both platforms, stories per state, and the
`pnpm typecheck && pnpm lint && pnpm build-storybook` gate — is this skill's job, not the prompt's.
If Figma and Supernova disagree, Figma wins (see "Design reference" below) — surface the
discrepancy before writing code instead of silently picking one. Add any new non-obvious gotcha to
"Known gotchas" below once the component ships.

## Design reference — Figma MCP first, Supernova for properties

**Before any of the below:** run the MCP gate in Workflow step `-1`. No Figma
namespace / failed `whoami` / failed `sn_get_me` → stop. Supernova alone is not
enough to ship a component (Figma wins on live nodes; without it you cannot
read Dev frames, screenshots, or pixel context).

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
- **Always read `«Name» · Dev` / `«Name» · contrato de desarrollo`.** Every Core page that has a
  docs frame also has (or is getting) a sibling Dev frame with the code firma, public props table,
  nested-instance notes, platform diffs, tokens/a11y, and open divergences. Find it via
  `get_metadata` on the page (`name` ends with `· Dev`) — e.g. Image `1020:118882`, Alert
  `1012:77661`, Checkbox `1018:101870`. Treat that frame as **the** contract, not a second
  opinion: its section `01 · Firma de código` is what the frame itself calls *"lo que desarrollo
  copia"*.

  **This reversed on 2026-09-28.** We used to ship *partial* — keeping Figma's `show*` and
  independent axes — and treat the Dev firma as a suggestion. Six components were then aligned
  firma-first (TextField, ListItem, Tag, Chip, Tabs, PasswordField, commit `17f5cf1`) and the
  reason the contracts give is the same in all six: a Figma master needs a boolean to be able to
  *draw* an empty slot; code does not, because a slot with nothing in it simply is not rendered.
  Two whole variant axes retire with those booleans — `isFilled`, always derivable from `value`,
  and `validation`, which becomes the presence of an `error` message.

  So: when Dev and the live component set disagree, **the firma wins on the API** and the live
  node wins on pixels and on which axes exist. Surface the gap either way; never invent a prop
  name that contradicts the firma. Read section `07 · Divergencias y decisiones abiertas` too and
  add anything still open to `docs/pendientes-diseno.md` — that file is for what code cannot close
  on its own, and **nothing implemented goes in it**.
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

## Tokens — three axes, composed keys, never hand-roll

bDS themes are **three Figma variable collections**, not a single light/dark switch:

| Axis | Type | Default | What it moves |
| --- | --- | --- | --- |
| **Brand** (`2. Brand`) | `TThemeBrand` | `blu` | ~180 colours (`brand/*`, `role/brand`, brand-tinted components) |
| **Mode** (`3. Semantic`) | `TThemeMode` | `light` | ~1042 colours (+ a few mode dimension/elevation leaves) |
| **Layout** (`4. Layout`) | `TThemeLayout` | `compact` | 34 dimension tokens (`space/*`, `font/size/*`, `radius/*`, …) — **0 colour** |

- Source JSON lives under `packages/shared/src/theme/<folder>/*.json` (Supernova export). Folders
  include modes (`light`, `dark`, `mc-*`, `hc-*`), brands (`titanium`, `discover`, …), and layouts
  (`compact`, `regular`, `expanded`). **`theme/` holds only that JSON** — the sync pipeline replaces
  the whole folder; readers live in `themeSource/` (safe from the sync).
- **`themeSources` is keyed by `TThemeSourceKey` = `` `${colorSource}@${layout}` ``**
  (e.g. `light@compact`, `dark@regular`, `discover@expanded`) — **30 entries**, not `'light' | 'dark'`.
  Layout composes with colour sources because their dimension edits are disjoint
  (`composeDimension` in `themes.ts`). Brand × non-default mode is the one impossible combo —
  `resolveTheme` keeps the **mode** (contrast) and drops the brand; `isExact` is `false`.
- **Component tokens always use `fromThemeSources`:**

  ```ts
  const readFooTokens = (key: TThemeSourceKey): IFooTokens => {
    const { color, dimension } = themeSources[key];
    // readThemeToken / readThemeDimension / readThemeTypography — never literals
    …
  };
  export const fooTokens = fromThemeSources(readFooTokens);
  ```

  That yields `Record<TThemeSourceKey, IFooTokens>`. Nest size/state axes *inside* each entry.
  Reference: `divider.tokens.ts`, `alert.tokens.ts`, `spinner.tokens.ts`.
- **Never** write `{ light: read('light'), dark: read('dark') }` or index `themeSources['light']`.
  Those keys do not exist. Doing so throws at **module init** when the barrel loads and kills
  **every** Storybook story (blank canvas / stuck spinner) — hit once after the multi-axis merge.
- **`useThemeMode()` returns `TThemeSourceKey`** (kept name for call-site stability). Index with
  `<name>Tokens[useThemeMode()]`. Need the axes / `isExact`? → `useResolvedTheme()`.
  For a single theme's shape in types: `TTokensOf<typeof fooTokens>`, not `typeof fooTokens['light']`.
- **Invariant-ish files:** `typography.json` and `string.json` are identical across exports (imported
  once). Dimension is **not** invariant — layout moves spacing/type scale; modes move elevation /
  border / focus leaves. Never assume `light@compact` equals another key for a field you haven't
  checked.
- Theme-invariant constants (font family, Snackbar dwell, Spinner rotation ms): read from
  `themeSources[DEFAULT_THEME_SOURCE_KEY]` or a documented constant — don't invent a key literal.
- **No build step.** `use<Name>.ts` → tokens[key] → `CSSProperties` / RN styles. Placeholder seam
  only: shared `dsm-input` class + `--dsm-input-placeholder-color` in `pseudo.css`.
- **`BluProvider`** takes optional `brand` / `mode` / `layout` (`IThemeRequest`). Storybook passes
  all three from the toolbar via `ThemedStory` + `themeFromGlobals` — not a single `theme` global.

## Known gotchas (each of these was a real bug once — don't reintroduce them)

- **`fromThemeSources` is mandatory after the multi-axis theme.** Hand-written
  `Record<TThemeMode, …>` with only `light`/`dark` and `themeSources[mode]` where `mode` is
  `'light'` crashes on import (`Cannot destructure … of undefined`). Symptoms: Storybook manager
  loads, canvas stuck preparing, *all* stories broken — not just the new component. Fix before
  shipping any component that touches `@dsm/shared` tokens.
- **Storybook toolbar is brand × mode × layout.** Old stories that read `globals.theme` or paint
  with `themeSources[globals.theme as TThemeMode]` are wrong. Use `themeFromGlobals(globals)` from
  `apps/web-demo/src/stories/themeGlobals.ts` and index `themeSources[key]`. Stale localStorage
  globals after the migration can confuse the toolbar — hard-refresh / clear site data for
  `localhost:6006` if axes look wrong.
- **Brand in a non-default mode falls back.** Toolbar can ask for `discover` + `dark`; export
  cannot. `resolveTheme` keeps dark, drops brand, `isExact: false`. `ThemedStory` shows
  `FallbackNotice` — don't invent a fake combined palette.
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
- **The footer is presence-based, and this flipped twice — read the note.** `TextField` first
  shipped inferring visibility from content, then was changed to Figma's independent `showHelper` /
  `showCounter` booleans, and the Dev contract has now settled it back: `helperText`, `error` and
  `counter` render because they were passed. `error`'s presence is also the error state — there is
  no `isInvalid`, because *"el error lo comunica el mensaje, no el color"* and a red field with
  nothing to read is exactly what that forbids. `counter` is `{ current, max }`, two numbers the
  component formats, **not** Figma's free-text string and **not** derived from `maxLength` — the
  contract asks for that divergence to be signed *"o el exporter va a intentar mapear una cadena"*.
  `maxLength` stays a platform prop, because blocking input and counting are different jobs.
  **`TextArea` has not been migrated** and still carries `showHelper` / `showCounter`; leave it
  until its own contract is read.
- **Icons: always through our `Icon`, always imported from a section, always a `ReactNode` in a
  prop.** Three separate rules, and all three are easy to get wrong.

  1. **`Icon` is the wrapper and it is not optional.** It owns the box (`size/icon/*`, the `2xs…xl`
     ramp: 8 · 12 · 16 · 24 · 32 · 40, default `sm`) and the colour (`color/icon/*` via
     `TIconColor`), and it fixes the `viewBox` at `0 0 24 24`, the grid bDS draws on. A published
     glyph *is* an `Icon` with its paths already inside — that is the whole shape of them:

     ```tsx
     export const IconTrash01 = (props: TIconProps) => (
       <Icon {...props}>
         <path d="…" />   // <Path/> from react-native-svg on mobile
       </Icon>
     );
     ```

     So: never hand-roll an `<svg>`/`<Svg>` in a component, and never resize a glyph with
     `width`/`height` — there is no escape hatch on purpose, because in Figma resizing an instance
     breaks the variable binding and the icon stops following its token. Reach for `Icon` directly
     only for artwork the library does not ship. `react-native-svg` is a peer of `@dsm/mobile`.

  2. **The entry point is the section, and there is no barrel.** 1170 glyphs across 19 sections,
     generated from `bDS - Icons` (`WlAjbUHE4M3YeoDwvnRwix`):

     ```tsx
     import { IconTrash01 } from '@dsm/web/icons/general';
     import { IconWallet02 } from '@dsm/mobile/icons/finance-ecommerce';
     ```

     Sections: `alerts-feedback` · `arrows` · `charts` · `communication` · `development` ·
     `editor` · `education` · `files` · `finance-ecommerce` · `general` · `images` · `layout` ·
     `maps-travel` · `media-devices` · `security` · `shapes` · `time` · `users` · `weather`.
     `@dsm/{web,mobile}/icons` **does not exist** — don't add a barrel over the 19 and don't
     re-export them from a component. Measured reason: Rolldown shakes per glyph, **Metro shakes
     per section**, so a barrel is one import away from putting 2.3 MB of path data in a mobile
     bundle. Names are `Icon` + PascalCase of the bDS name, numeric suffix included
     (`align-bottom-01` → `IconAlignBottom01`). Browse them in Storybook: `Atoms/Icon` → *Gallery*,
     grouped by section, with the import line per group. Regenerate with
     `node scripts/fetch-figma-icons.mjs && node scripts/generate-icons.mjs` (needs
     `FIGMA_API_KEY`); the modules are generated — never edit them by hand.

  3. **An icon that arrives through a prop is a `ReactNode`. Always.** `TIconName` existed and was
     deleted: a name needs a name→component registry, a registry references all 1170 glyphs, and
     that defeats the per-section split. So the caller imports the glyph and passes the element:

     ```ts
     leadingIcon?: ReactNode;   // in I<Name>BaseProps, in @dsm/shared
     ```
     ```tsx
     <TextField label="Buscar" leadingIcon={<IconSearchMd size="sm" />} />
     ```

     `@dsm/shared` importing `import type { ReactNode } from 'react'` is fine and already the norm.
     Three consequences to plan for:
     · **No default glyph is possible.** Figma's instance-swap defaults (`icon/user`,
       `icon/search`) do not survive; document that the slot is empty without a node.
     · **The caller sizes it**, so put the component's own mapping in the prop's JSDoc — e.g.
       TextField: `sm`/`md` → `size/icon/sm` (16), `lg` → `size/icon/md` (24).
       **Never `lg` (32) inside a control** — bDS: *"Si lo estás usando dentro de un control, el
       tamaño está mal."*
     · **Colour: web gets it free, mobile does not.** Put the resolved colour on the wrapper and a
       system glyph inherits it through `currentColor`; React Native has no such thing, so use
       `tintNode(node, iconColor)` from `@dsm/mobile/src/components/atoms/Icon` — it clones in
       `tintColor` only when the caller did not set one. Without it a tab's glyph stays grey when
       the tab is selected.

     **A glyph the component owns is not a slot** and stays ours: the check of a Checkbox, the ×
     of a Chip or Tag, the status glyph of Alert and Snackbar, the chevron of a Select. Import it
     directly and do not expose a prop for it — nobody should be able to replace it by mistake.
     Those are the only places a *name* still appears in a shared contract (`ALERT_STATUS_ICON`,
     `SNACKBAR_STATUS_ICON`), because the platform resolves it and the caller never can.

  4. **Watch out: a `string` is a valid `ReactNode`.** `icon="user"` compiles and renders the word
     *"user"* on screen, with typecheck, lint and build all green. After widening any slot to
     `ReactNode`, check the render — count `<svg>` per story — instead of trusting the compiler.
- **Switch has no label of its own. SwitchItem is the list row.** Figma: "Switch suelto no existe
  como pieza de pantalla." Apple HIG iOS: use switch style only in a list row; the row content is the
  accessible name; outside a list, use a toggle *button*, not a labelled switch. Do not add a `label`
  prop to Switch. `showStateLabel` (default `false`) is the overline ON/OFF word inside the track —
  visual only, not the accessible name. Immediate: `onChange` / `onValueChange` fires on press, no
  pending state. **Do not use RN `Switch` / `UISwitch`** (Apple green, 51×31, wrong tokens) — custom
  `Pressable` track+thumb painted from `color.component.switch.*`. On-fill is Figma `track.bg-on`
  (`#2760aa`), not system green. Web: visually hidden `input type="checkbox" role="switch"`. Mobile:
  `accessibilityRole="switch"`. **Property default is `sm`.** Standalone row
  floor is live-node, not the 48pt HIG copy: sm `control.height.sm` (32) ×
  track width 40; md `target.min` (48) × 56. Do not expand sm to 48×48.
  Focus ring is live `inset-[-2px]` + `spread` 3px → **2px outside**, no
  gap (unlike Checkbox's offset). Pressed-off has no overlay; pressed-on
  uses `track.bg-on-pressed`. `isContained` is the composition seam:
  SwitchItem owns the row hit target and the row focus ring. State must not
  be color-only — thumb position + a11y `checked`, optional `showStateLabel`.
- **SwitchItem is the first molecule and the iOS-canonical Switch usage.** Entire row is the control
  (web: `<label>` wrapping the Switch input; mobile: `Pressable` row, inner Switch `isContained` so
  the a11y tree has one switch). Sizes sm 48 / md 56. **Property default is
  `sm`.** `showDivider` Figma property still defaults true (01-sep prose says
  false — property wins until the boolean flips). Description
  default color is `color.color.text.secondary` — the component group only ships
  `description.text-disabled`, no `text-default` co-token; don't invent one.
- **There is no CheckboxList.** Figma page `3:42` is only Checkbox. Closest list
  row is ChoiceItem (`control=checkbox`) — don't invent a group component. Stack
  `Checkbox` or wait for ChoiceItem. `isIndeterminate` is `isChecked={false}` +
  the input's DOM `indeterminate` property, not a third enum. Live size map
  (node, not the description's blanket "minHeight 48"): `sm` 16 box / 12 mark /
  32 row (`size.control.height.sm`); `md` 24 / 16 / 48 (`size.target.min`). **Property
  default is `md`** (Figma/Supernova + Dev frame) — not `sm`. **Shipped before the
  firma-first rule and not migrated yet**: its API is still the Figma axes,
  `isChecked` + `isIndeterminate` + `showLabel`, rather than Dev's
  `checked: boolean | 'indeterminate'` and presence-based `label`. Leave it there
  until someone reads its contract on purpose; don't half-migrate it in passing. Dev docs say checked+indeterminate is "impossible"; live set description
  says the four combos are valid and indeterminate wins the paint — Figma wins.
  Marks
  are `IconCheck` / `IconMinus` with `color="fixed.white"` (Figma: not on-brand —
  selected fill is the same azure in all 4 modes) or `disabled`. **Never `lg`
  inside the box.** Focus is an **offset** ring (`focus/ring/offset` 1px gap +
  `spread` 3px blue, live `inset-[-4px]` — Checkbox's blue layer is
  `offset + spread`; TextField/TextArea use `spread` as the outer edge).
  Never drop the ring on a checked box (fill and ring are the same azure;
  shape is what distinguishes them). Don't
  read `typography.component.checkbox.labeled` (`400 16px/20px`); live type is
  `text/body/{sm,md}/default`, composed from `font.size.body.*`.
- **Image is a ratio frame, not a raw `<img>`.** Width from the host; height from
  `ratio` (`1:1` | `4:3` | `3:2` | `16:9`, default **`1:1`**). `radius`
  (`md` | `sm` | `none`, default **`md`**) — use `none` when the host already
  clips. Dev firma (`Image · Dev` `1020:118882`) adds `src`, required `alt`
  (empty only if decorative),   and `fit` (`cover` | `contain` | `fill`, default cover — contain for logos,
  fill stretches). Dev firma listed only cover|contain; `fill` added for
  CSS/RN parity (web `object-fit: fill`, RN `resizeMode: stretch`). `status` is a Figma VARIANT but **not for callers** —
  derive from load (`empty` / `loading` / `error` / `default`); optional
  override only for stories. Empty = dashed border + `IconImage01` `lg`
  `tertiary`; error = solid border + `IconAlertTriangle` `lg` `secondary`;
  loading = skeleton sheen (`component/skeleton/{bg,highlight}`, 26% band,
  respect reduce-motion). Default has **no** border. On **error**, paint
  `IconAlertTriangle` only (Figma); `alt` is the accessible name, not painted.
  Tokens: `color.component.image.surface.{bg,border}` + icon co-tokens. Mobile
  export is named `Image` — import RN's as `Image as RNImage` inside the file.
  **Sizing trap:** root is `width: 100%` + `aspect-ratio`; the bitmap is
  absolute so it adds **zero** intrinsic size. A host with only `maxWidth`
  (or a flex hug parent) collapses the frame to ~0 / icon — Storybook must
  wrap with an explicit `width` (e.g. `320`).
- **Alert is in-flow, not a toast.** Occupies space; does not auto-dismiss
  (that's Snackbar). Axes: **`status`** (danger/warning/success/info/neutral,
  default **danger**) × `placement` (page/section/inline, default **page**).
  Set description may still say `tone` in prose; property + Supernova + Dev
  frame use `status`. **Shipped before the firma-first rule and not migrated
  yet**: still `showTitle` / `showAction` / `showDismiss` + `actionLabel` /
  `onAction` / `onDismiss`, where Dev wants presence-based `title` / `action` /
  `onDismiss`-only. Leave it until someone reads its contract on purpose. Properties (8,
  Figma + Supernova): those two axes plus `showTitle` (true), `title`, `body`,
  `showIcon` (true), `showAction` (false), `showDismiss` (false). The last
  two are independent booleans even though the 15 published variants
  have them off. Action is a nested **LinkButton `on-muted` `sm`
  `underline=false`** (label edited on the instance; default variant
  copy is `"Resolver ahora"`). Dismiss is IconButton `veil` `xs` (24
  visual, glyph 16 `primary`, pill) painted locally from
  `color.component.iconbutton.veil.*` — IconButton is not shipped. A11y
  name `"Cerrar aviso"`; hitSlop to `size.target.min` (48). Usage copy:
  `showDismiss` on for info/neutral/success; off for danger/warning unless
  the same info is reachable another way — that is guidance, not a
  variant lock. `inline` has **no title layer** (`showTitle` is a no-op
  there). No border. Read `color.component.alert.surface.bg-{status}` /
  `chip.bg-{status}` / `content.{title,body}`. Neutral chip is
  `chip.bg-neutral`. Title and body share `text/primary`; ExtraBold vs
  Regular is the hierarchy. Do **not** read `typography.component.alert`
  (`700 14/17`). Gap title→body is **0**. Chip is always 24 with glyph
  `sm` 16. `iconBox` is **chip-sized (24)** on every placement. Glyphs
  locked per status (`ALERT_STATUS_ICON`); no icon slot. Live region is **not
  a prop**: danger/warning → `role=alert`, rest → `status`.
- **Snackbar is a toast, not an Alert.** Inverse bar
  (`color.component.snackbar.surface.bg`), no chip, no `placement`, no
  `neutral`. Axis is **`status`** (default **info**) — set description may
  still say `tone` in prose; property + Supernova + Dev frame use `status`.
  Glyph + `on-inverse.{status}` colour; fill never changes. Live node action
  is **LinkButton `on-inverse` `sm`** `"Deshacer"` (21px) — the set
  description still says Button; the nested instance is a link (Figma wins).
  Dismiss is IconButton `on-inverse` `sm` (32 visual, 16 glyph, pill)
  painted locally from `color.component.iconbutton.on-inverse.*`. Dev firma
  `1010:76982` (updated): `action?: { label, onPress }` draws the LinkButton
  (no `showAction`); `onDismiss?: () => void` draws the × (no `showDismiss`,
  label hardcoded `"Cerrar"`). They share one trailing slot — published
  instances never show both (`102:12292` action, close hidden; `102:12356`
  close, action hidden). `action` wins if a host passes both; swipe and the
  timer still call `onDismiss`. `showIcon` stays — the glyph has no content
  to infer from. `message` is required. Type is `text/body/md` (live
  `97:13653`). Max width **448** is Figma copy, not a theme token.
  Autoclose: `motion/dwell/default` (6s) without `action`, `motion/dwell/long`
  (10s) with one (decision 3, 29-sep — the firma comment's 4s is stale);
  optional `duration` overrides (`resolveSnackbarDurationMs`). Timer starts
  on mount and does not restart. No `onDismiss` → the bar hides itself when
  the dwell elapses (no ×). With `onDismiss` → ×, swipe and the timer all
  call it and the host unmounts. Live region is **not a prop**: `role=status`,
  `aria-live=assertive` only on danger. Stories mount the bar from a button,
  not on first paint. Don't copy Alert's muted fill, chip, or LinkButton
  `on-muted`. SnackbarStack is the molecule (`1706:3753`): max 3, collapsed
  peeks at `component/snackbar/stack/behind-1|2`, expanded pauses dwell.
- **Coachmark is a system-triggered tourtip, not a Tooltip.** Elevated /
  floating surface (light card with controls) — **not** inverse. Axes:
  **`media`** (none|image) × **`placement`** (13 Floating UI values) ×
  **`sequence`** (single|multi) → 52 variants. `media` is an axis because
  dismiss flips IconButton `veil` → `on-media` over the photo; a boolean
  cannot change appearance. **Shipped before the firma-first rule and not
  migrated yet**: still `showTitle` / `showAction` / `showDismiss` / `showBack`
  + handlers. `showTitle` only applies with
  `media=image` (without image the title is mandatory for `aria-labelledby`).
  `showBack` is a no-op on `single`.   Host-controlled **`isOpen`** — never
  hover. Esc closes always; outside press closes `single`, not `multi`.
  **`placement` is computed by the positioning engine** (Dev frame: *"Los 13
  placement son el resultado, no la entrada"* / `placement?: Placement // lo
  calcula el motor`). Floating UI `flip`/`shift` may move it when there is no
  room; the Storybook control stays on the preference. Set copy also: on scroll
  **follow the anchor**; if it leaves the viewport, `single` closes and `multi`
  docks under the nav. Native: no `offsetParent` with `measureInWindow` (corrupts
  Y — tip on the wrong edge); web Storybook uses `position: fixed` overlay
  instead of RN-web `Modal`. Width **320** fixed (Figma copy, not a theme leaf). Tip is `.TipPointer`
  `tone=floating` as the **live SVG vector** (rounded tip cornerRadius 2,
  open stroke with 2 px mitre stubs, 2 px faldón) — **not** a CSS border
  triangle (that closed the mouth and left a seam on the card edge). Same
  16×10 / inset 2 geometry as Tooltip; floating stroke uses
  `border/width/default`. Stacking is **`z.popover_1`** (1200) — the set prose says
  "z/overlay (1200)" but the leaf that names Coachmark is popover. Title↔body
  gap **0**. Body type is **`text/body/sm/default`** (live node wins over
  set prose that said md). Nested Image `16:9` `radius=none` inside a media
  wrap that clips with `radius/surface/md`. Live node `137:20132`: media is
  **inset** by container `space/inset/lg` (same padding as text/footer) — not
  full-bleed. Footer Buttons `sm` (action fill, back **ghost**). Default CTA:
  `resolveCoachmarkActionLabel` → `"Entendido"` on `single`, `"Siguiente"`
  on `multi`. Single footer: CTA **start** (no spacer); multi: step start
  + actions end. No backdrop scrim. Focus moves into the non-modal dialog
  on open (web `FloatingFocusManager`). Do **not** dump Figma screenshots
  into `.cursor/` — designs drift; re-fetch via Figma MCP when checking.
- **Tabs / TabItem is a bar + items, not a TabPanel.** Ship `TabItem`
  (atom) + `Tabs` (molecule) — same split as Radio / RadioGroup. Live set
  is named **Tab item** (`97:14033`); search still lists `Tab`. Public
  name is `TabItem`. Live selected axis is **`isSelected`** (Supernova's
  import still says `selected` — Figma wins). **`size` default is `lg`**
  (Figma / Supernova / Dev frame) — not `md`.
  **The bar takes its tabs as data, which is the Dev shape**: `tabs: ITabDef[]`
  + `value` + `onChange(key)` + `divider`, shipped in `17f5cf1`. It used to
  take `children` with `isSelected` per item; it does not any more, and
  **`TabItem` is no longer exported** — three of its props (`isSelected`,
  `layout`, `size`) are ones only the bar can fill in. The selection is not
  marked tab by tab: *"no se marca pestaña por pestaña: sale del valor"*, so
  `isSelected` is derived from `tab.key === value` and two active tabs is not a
  state the API can express. `ITabDef` is
  `{ key, label, leadingIcon?: ReactNode, badge?: number, disabled? }` —
  `badge` is a **number**, because it is a count. There is no
  `showLeadingIcon` / `showBadge` and no default glyph. The badge is still
  painted locally from `color.component.badge.*`; **`Badge` shipped in
  `f9e534f`**, so that is now worth revisiting rather than a stated gap — and
  the JSDoc still claims it is not shipped. ExtraBold at **every** state — live nodes use
  `text/label/{md,lg}/strong` even unselected; colour carries inactive vs
  active (`component.tabs.label.text-{active,inactive,disabled}`).
  Indicator hugs the **content** column, not the full tab — fitted tabs
  are `flex: 1` but the underline still hugs the label. Leading icon is
  **16 at both sizes**. Hover/pressed overlay is absolute inset 0,
  `radius/control/sm`, behind content. Focus is Switch's flush ring
  (`spread` − `offset`, no gap), not TextField's offset two-tone.
  Figma's `showItem3`–`showItem6` are 6-slot master toggles — **do not
  ship as API**; *"en código es un arreglo"* (2 to 6 entries). `divider`
  stays a real boolean, default true: there is no content to infer it from.
  Canvas 375 is "a sangre", not a
  max-width. No TabPanel. Arrow keys move between enabled tabs; Tab
  leaves the bar. One shared token file `tabs.tokens.ts` (both
  components use `color.component.tabs`).
- **Every component's own variant axes are its own — don't generalize.** `TextField` has a `size`
  axis (`sm`/`md`/`lg`) and an `icon` color group;
  `TextArea` has neither — a single `state` axis, no size, no icon slot. Confirm the axes with
  `get_design_context` on the live node before writing the shared types file, every time — see
  "Design reference" above for why Supernova's own record isn't always enough on its own.
- **Chip is touched, Tag is read — they are not the same component with different props.** Chip
  toggles (`selected` + `onToggle`, `aria-pressed`, always a `<button>`); Tag has no interaction
  axis at all (bDS removed it entirely — see Tag's own gotcha). Built without live Figma/Supernova
  MCP access in this workspace (neither was reachable this session) — sourced entirely from the
  `Chip · contrato de desarrollo` PDF plus the real `color.component.chip.*` / `dimension.*` JSON
  leaves; flagged to the user rather than silently skipping the MCP gate above. `leadingIcon`'s
  presence alone turns its slot on, and **Tag now works the same way**: Chip's firma called this a
  divergence from Tag, and the 2026-09-28 alignment closed the gap by retiring Tag's
  `showLeadingIcon` too. Same for the remove control on both: its existence is decided by whether
  `onRemove` is set, never a `showRemove` boolean — *"una equis que no quita nada es una trampa"*. **The × is an
  icon inside the chip, not a nested IconButton** — Dev's own open-decisions section (§07) says so
  explicitly: no focus stop, no dedicated hit target, own by design (an anatomy change for design
  to make, not something to invent a fix for in code). Implemented as a plain `<span onClick>` with
  `stopPropagation()` inside the toggle `<button>` — nesting a real `<button>` there would be invalid
  HTML and Dev explicitly rejects it. Color tokens have MORE states than Dev's own tokens table lists
  (`bg-selected-pressed`, `border-selected-pressed`, `overlay-hover`, `overlay-selected-hover`,
  `border-selected-disabled` all exist in the JSON despite not being enumerated in Dev's "26 tokens"
  count) — the JSON's actual leaf set won, consistent with "trust the value/JSON over stale prose"
  elsewhere in this file. `border-selected-disabled`'s own token description explains a deliberate
  a11y trick: it's set to the SAME color as `bg-disabled`, so a disabled+selected chip reads as a
  solid filled block with no visible border, while a disabled+unselected chip keeps `border-disabled`
  (a different, visible gray) so the two disabled states stay distinguishable by silhouette alone
  (filled vs outlined) even though both share one background color. Focus ring is **flush**, not
  offset like TextField/Select — Dev's own token list has `focus/ring/spread` and no `offset` token
  at all for Chip, so it's a single `box-shadow: 0 0 0 <spread>px <border-focus>`, no inner gap layer
  (same family as Switch/Tabs' flush ring, not TextField's two-tone one). Shape is `radius/pill`
  (fully rounded), not Tag's `radius/control/sm` (squared) — don't copy Tag's border radius token.
  Web-only in this pass (`packages/web/src/components/atoms/Chip`) — mobile wasn't requested and
  wasn't built; if it's added later, there is no hover row for it in Dev's platform table (hover is
  a web-only state per §05), so `useChip` shouldn't take an `isHovered` param on that platform.
- **Screenshotting a just-clicked element in this workspace's browser tool can show a stale,
  one-frame-behind image — always cross-check with `read_page`'s accessibility tree, and don't
  assume a screenshot showing wrong colors/state is a real rendering bug before reloading and
  re-screenshotting.** Hit this on both Select's dropdown and Chip's selected-label color; both
  times a fresh reload + re-screenshot showed the correct render, and the accessibility snapshot had
  already reflected the true DOM state during the "wrong-looking" screenshot.
- **`lineHeight: fontSize * ratio` in a web `CSSProperties` object MUST be a `` `${value}px` `` string,
  never a bare number.** React's inline-style engine does not append `px` to `lineHeight` (it's in
  React's unitless-property list, same family as `opacity`/`zIndex`/`flex`), so a bare computed
  number like `24` renders as CSS `line-height: 24` — a **unitless multiplier**, i.e. 24× the
  element's own font-size (16px × 24 = 384px), not 24 pixels. This shipped silently in `Tag`,
  `Chip` and `TagGroup` (`sizeTokens.fontSize * X_LINE_HEIGHT_RATIO` with no `px`) and went
  unnoticed because those rows use a **fixed** `height` — the oversized line box just overflows
  invisibly with nothing depending on the text's own natural size. It became blatantly visible
  building Menu, whose rows use `minHeight` (not fixed `height`): every row inflated to ~600px tall.
  Contrast with the CORRECT unitless pattern already used everywhere else (`TextField`, `ListItem`,
  `ChoiceItem`, `Tooltip`, `RadioGroup`, …): those pass the bare **ratio** itself (e.g. `1.5`) as
  `lineHeight`, which IS valid/idiomatic unitless CSS (150% of font-size) — the bug is specifically
  in *pre-multiplying* `fontSize * ratio` into a pixel-scale number and then leaving it unitless.
  Fixed all four call sites to `` `${fontSize * ratio}px` ``. When adding a new component, either
  pass the naked ratio (like `ListItem`) or an explicit `px` string (like `Select`/`TextField`) —
  never a pre-multiplied bare number.
- **`page.keyboard.press()` in this workspace's browser tool can silently fail to reach a focused
  element inside the Storybook iframe** (observed while testing Menu's arrow-key navigation —
  identical key presses worked maybe 1 time in 5, with no console error). Don't conclude a
  keyboard handler is broken from `type_in_page`/`page.keyboard.press` alone: confirm first by
  dispatching a real `KeyboardEvent` directly on the focused element via `run_playwright_code`
  (`el.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true }))`)
  — if that reliably reproduces the expected state change and the tool-driven press doesn't, the
  component is fine and the input tool is the flaky part.
- **Hover and focus are React state now, not CSS pseudo-classes, on web.** `useTextField` /
  `useTextArea` take `isHovered` / `isFocused` as params; the component owns the state
  (`onMouseEnter`/`onMouseLeave` on the bordered box, `onFocus`/`onBlur` on the input) and feeds it in.
  Precedence for the container's **border color**: `disabled > readOnly > error > hover > default` —
  focus is deliberately absent from this list; see the focus-ring gotcha above for why. Mobile has no
  hover — only `isFocused`, and it drives the separate ring, not the border, same as web.
- **`usePrefersReducedMotion()` replaces a `@media` query.** With inline `transition` strings built in
  JS, there's no `@media (prefers-reduced-motion: reduce)` rule to hide behind — call this hook (from
  `@dsm/web`'s `theme/`) and set `transition: 'none'` when it's `true`.
- **The typeface is per platform, and on mobile you must NOT set a font family at all.**
  bDS asks for the brand face on the web and each platform's own in its app: **web Mulish, iOS SF
  Pro, and on Android the device's own system font, which on stock is Roboto.** SF Pro *is* the iOS
  system font and Roboto *is* stock Android's, so **leaving `fontFamily` unset is what selects
  them** — `@dsm/mobile` ships no font files, links nothing, and licenses nothing.

  Say it that way rather than "Android Roboto": `/system/etc/fonts.xml` maps the `sans-serif`
  family and ships with the OS image, so a Samsung can point it at One UI Sans and some skins let
  the user change it. Verified on a Pixel emulator that stock maps it to Roboto's variable file,
  which is also what makes 100–900 interpolate. A phone looking like its own phone is the point of
  using the system face, so this is the intended behaviour, not a gap. iOS has no such variance.

  ```ts
  // mobile — the family is the system's, so only the weight is set
  labelStyle = {
    fontWeight: resolveFontWeight(tokens.typography.label.fontWeight),
    fontSize: tokens.typography.label.fontSize,
  };
  ```

  **Never write `fontFamily` in a `@dsm/mobile` style.** Not a literal, not a token, not
  `baseFontFamily` — that one is web's Mulish and would override the system face on a device with
  a family the phone does not have. There is nothing to import: `resolveFontWeight` from
  `@dsm/mobile`'s `theme/` is the whole API, and it only passes the token weight through with the
  right type.

  **The weight is load-bearing now, and this inverted on 2026-09-29.** While mobile bundled Mulish,
  each `.ttf` was its own family (`Mulish-SemiBold`), the weight travelled inside the family name,
  and setting a numeric `fontWeight` was forbidden — Android would hunt for
  `Mulish-SemiBold_bold.ttf` and silently fall back. With the system font it is the opposite: one
  family, and the weight is the only thing that selects a cut, so it **has** to be set and has to
  be the real number from `dimension.font.weight.*`. If you find an old comment saying not to set
  `fontWeight`, it predates this and is wrong.

  Web is unchanged and still Mulish: `@dsm/web`'s `theme/font.ts` self-hosts it with
  `@fontsource/mulish` (per-weight CSS imports, pulled in by importing `BluProvider`) — use the
  plain package, NOT `@fontsource-variable/mulish`, whose `@font-face` registers as
  `"Mulish Variable"` and silently won't match the `"Mulish"` family. Importing `@dsm/web` alone,
  without rendering `<BluProvider>`, loads no font.

  **Do not read the family from `string.platform.font.family`.** It is not "the design system's
  typeface" — it is the typeface of *whichever platform the export was generated for*, and it
  changes: a Supernova sync flipped it from `"Mulish"` to `"SF Pro"` and broke all 32 web
  components in one go, each asking the browser for a family it does not have. `baseFontFamily`
  reads `string.font.family.mulish`, which names the family instead of the platform.

  **Both failures here are invisible**, which is why they are worth this much text: on iOS the
  system font *is* SF Pro and on Android it *is* Roboto, so a style that names a family which does
  not resolve looks almost right — every weight just collapses to regular. Check the render, not
  the types. `apps/react-native-demo/__tests__/fontWeight.test.tsx` asserts the pair that catches
  it: no `fontFamily`, and more than one `fontWeight`.
- **Accessibility parity with `Button`:** on mobile, set `accessibilityState={{ disabled: ... }}`
  and `accessibilityLabel` on the interactive element (RN has no DOM `label[for]`, so proximity to
  a `<Text>` label does not create a programmatic association). On web, error/alert text gets
  `role="alert"` (not plain helper text — that shouldn't interrupt the screen reader); on mobile,
  the equivalent is `accessibilityLiveRegion="assertive"`. A counter tied to a required limit should
  be announced too (`aria-live="polite"` / `accessibilityLiveRegion="polite"`), not just visible.
- **Turbo caching is off on purpose** (see README "Monorepo notes") — a green `pnpm typecheck` /
  `pnpm lint` is a real run, not a replayed cache hit. Don't re-enable caching to "speed things up".
- **`ButtonGroup` is layout-only — Figma's Cancelar/Continuar are docs, not defaults.** Slot
  `actions` → `children`. The group owns `orientation`, `distribution`, and gap
  (`space/inline/md` row, `space/stack/md` column). It does **not** configure Button
  appearance/variant/size and ships no nested defaults (ButtonGroup · Dev). Dev's
  "18 tokens" mostly belong to the documentation Button instances — do not put Button colours in
  `buttonGroup.tokens.ts`. `distribution="fill"` = equal parts (web: grid `1fr` tracks; RN: clone
  `flex: 1` onto children). That needs a layout `style` merge on Button — without it RN children
  stay intrinsic-width inside a flex slot. No a11y role on the group. Order = children order
  (platform primary placement is an open Dev decision). Do not invent wrap: if they don't fit,
  host switches to `orientation="vertical"`.
- **`Spinner` rotation is native-thread only; reduced motion freezes the arc.** Geometry is the
  live SVG paths on a 24×24 grid (`SPINNER_*_PATH`), sized with `size/icon/{sm,md,lg}`. Colours
  from `component/spinner/indicator|track/*` by `appearance` (`brand` / `primary` / `on-brand`).
  Web: CSS `@keyframes` (Image sheen pattern). Mobile native: `Animated.loop` + `useNativeDriver`.
  Mobile on `Platform.OS === 'web'` (Storybook / RN-web): StyleSheet `animationKeyframes` — RN-web
  Animated transform does not reliably rotate `react-native-svg` children. Never `setInterval`.
  **Dev wins over the set description on reduced motion**: stop the spin and leave the arc
  visible — do **not** swap to an opacity pulse. `label` defaults to `"Cargando"` (missing in
  Figma; from Dev). Default size is Dev `md`, not Supernova's Figma default `lg`. No cycle-length
  leaf in theme — `SPINNER_ROTATION_DURATION_MS` (1000) is documented like Coachmark width.
  `radius/pill` is listed in Dev tokens but unused by the filled-path drawing.
- **`Skeleton` is a footprint placeholder, not a Spinner.** Axes: `shape` (text|block|circle) ×
  `size` (sm|md|lg). **Dev default size `md`** (Figma/Supernova property default is `lg`). Size
  meaning depends on shape: text → line height of caption/md · body/sm · body/md; circle →
  `component/avatar/size/*`; block → only `radius/surface/*` (host owns height — fill parent).
  Code-only props: `lines` (text stack, default 1), `width` (default `100%`, ignored on circle),
  and `height` (block only — without a definite px/`%` of a sized host, `%` collapses to 0).
  Colours: `component/skeleton/{bg,highlight}` — **same pair as Image loading**. Sheen band 26%;
  web CSS keyframes / native `Animated` translateX; RN-web uses StyleSheet `animationKeyframes`
  (Spinner pattern). Reduced motion: freeze sheen, keep bone — never blink. A11y: shapes
  `aria-hidden` / `accessibilityElementsHidden`; wrapper `role="status"` + one `"Cargando"`
  announcement. Do not invent a max-duration prop (open Dev decision).
- **`ProgressStepper` is data-driven `steps[]` — not Figma's 3–7 VARIANT.** Dev firma
  (`1020:123665`) wins: pass `IProgressStepDef[]` (`label`, optional `secondaryLabel`,
  `status`). Lengths 3–7 are guidance in JSDoc; do **not** throw/clamp. Ship `Step` +
  `StepConnector` atoms + `ProgressStepper` molecule (Tabs/RadioGroup split). Connectors
  derive from the **left** step only (`deriveStepConnectorStatus`: `done`/`warning` →
  `done` rail; else `inactive`) — looking at the next step painted the segment before an
  error badly. Vertical **never** has a leading line (previous trailing forms the rail).
  Horizontal label align: first start / middle center / last end. `purpose`: `status`
  (empty/dot/glyphs) vs `wizard` (numbered pending/active). `warning` vs `error` is
  visual only (AlertTriangle vs X). One token file `progressStepper.tokens.ts`. A11y:
  `role="list"` / listitem + `aria-current="step"` on active. Non-interactive.
- **`SearchField` size default is `md`** (`lg`|`md`|`sm`), not TextField's
  `small`|`medium`|`large`, and not Figma's variant default `lg`. `placeholder`
  is required and is the accessible name (`aria-label` / `accessibilityLabel`)
  because it vanishes once there is text. `isFilled` and `state` are not props.
  `trailingAccessory` shows only while empty; text replaces it with the clear
  control ("Borrar búsqueda"). Web clear is `IconButton` veil + `IconX` (32 on
  lg/md, 24 on sm). Native clear is `IconXCircle` + `hitSlop` to `size/target/min`
  — one mobile package, iOS glyph, native `clearButtonMode` stays off. Search
  glyph is **16** (`component/searchfield/icon/size/sm`) at every size; the
  sibling `icon/size/md` (24) is not what the live `lg` node binds. Web: white
  + border + `radius/field/md` (12) + TextField focus ring. Native: `color/fill/neutral/subtle`,
  no border, `component/searchfield/radius` (pill), focus is an accent border on the
  bar. RN-web's `<input>` outline must be forced off or focus draws a rectangle
  inside the pill. `trailingAccessory` is a host node — the field ships no
  trailing glyph (no dots/mic/camera of its own).
  No `overlay-hover` leaf — web hover is `border-hover` only. Hide WebKit's
  `type="search"` cancel button in `pseudo.css`.

## Conventions (quick reference — full list in README)

- `I` prefix for interfaces, `T` prefix for type aliases, `is` prefix for boolean props — **except
  where the Dev firma names them otherwise**, which it usually does: `disabled`, `readOnly`,
  `selected`, `divider`. The firma wins on public prop names. Internal flags keep the `is` prefix
  (`isInteractive`, `isFocusVisible`, and the `isDisabled` a hook aliases on the way in).
- **No `show*` visibility booleans in a new component.** The content's presence is the switch. The
  only exception is a boolean with nothing to infer from — ListItem's `divider`, ProgressBar's
  `showHeader`. Components built before their contract was read still have them; they are retired
  one component at a time, never in a blanket rename.
- **Icon props are `ReactNode`.** See "Icons" in the gotchas — this is the rule with the most ways
  to get it subtly wrong.
- CSS classes: `dsm-` prefix (`dsm-input`, used only for the `::placeholder` seam — see "Tokens"
  above; `Button`'s legacy CSS still uses BEM modifiers like `dsm-button--primary`).
- Web and mobile share **types and token values only** — never share styles or presentation logic;
  each platform is expected to diverge where the platform calls for it.
