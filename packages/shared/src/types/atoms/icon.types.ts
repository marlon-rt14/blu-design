/**
 * Edge length of the Icon, from `size/icon/*`.
 *
 * The one variant axis the bDS component has. Each step is a bound variable, not
 * a free number: `2xs` 8 · `xs` 12 · `sm` 16 · `md` 24 · `lg` 32 · `xl` 40.
 *
 * bDS is unusually prescriptive about which step to reach for, so it is worth
 * repeating here — *"el paso no se elige por gusto: lo decide el contexto en el
 * que vive el icono"*:
 *
 * - `2xs` (8): only the dot of a `Radio` at `size=sm`. *"No es un icono: es una
 *   marca."* Not for glyphs with a drawing — at 8px they become a smudge.
 * - `xs` (12): next to small text — the check of a Checkbox or ChoiceBox, the
 *   indicators of a MenuItem. Beside a 12 or 13px body.
 * - `sm` (16): **the system default and by far the most used.** Icons inside
 *   controls: Button, LinkButton, TextField, Select, Tag, Tab.
 * - `md` (24): icons that read on their own, with no text pinned beside them —
 *   the chevron of a `lg` Select, the Snackbar icon, the trailing of a ListItem.
 * - `lg` (32): status icons filling the centre of an empty block — the
 *   alert-triangle of an Image in error, the glyph of an empty state.
 * - `xl` (40): illustrative, not functional. The header of a modal or a result
 *   screen. *"Si lo estás usando dentro de un control, el tamaño está mal."*
 *
 * The sizes are the same in both themes — `dimension.size.icon.*` is one of the
 * few groups that does not vary by mode.
 */
export type TIconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * A semantic icon colour role, mirroring `color/icon/*` one-to-one.
 *
 * All 33 roles of the group, with the dots of the token path preserved so the
 * prop value and the token name never drift: `'on-inverse.danger'` is
 * `color/icon/on-inverse/danger`.
 *
 * **This is not a design axis of the component.** The bDS Icon has exactly one
 * variant axis (`size`) and one property (`icon`) — colour appears nowhere in
 * its Figma API or its written documentation, even though all six variants
 * render `color/icon/primary`. The role is therefore *optional*: left unset, the
 * glyph takes its colour from whatever contains it, which is what makes an icon
 * inside a Button match the label with no configuration.
 *
 * Grouped by what they are for:
 * - Text-matched: `primary` `secondary` `tertiary` `disabled`.
 * - Status: `danger` `success` `info` `warning`.
 * - Brand: `brand` `on-brand` `on-selected` `partner-deuna`.
 * - Inverted surfaces: `inverse`, and the `on-inverse.*` status set for a glyph
 *   on `bg/inverse` (a Snackbar), where the normal status colours do not read.
 * - Uncontrolled surfaces: `on-scene.*` for a photo or a saturated brand
 *   background, `on-media.disabled` over media, `fixed.white` for the one case
 *   that must stay white in both themes.
 * - Decorative: `complementary.aqua` `complementary.indigo`
 *   `complementary.tangerine`.
 * - Interactive: the `action.*` set, for a glyph inside a control that already
 *   has an appearance of its own.
 */
export type TIconColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'brand'
  | 'danger'
  | 'success'
  | 'info'
  | 'warning'
  | 'inverse'
  | 'on-brand'
  | 'on-selected'
  | 'partner-deuna'
  | 'fixed.white'
  | 'on-inverse.danger'
  | 'on-inverse.disabled'
  | 'on-inverse.info'
  | 'on-inverse.success'
  | 'on-inverse.warning'
  | 'on-scene.default'
  | 'on-scene.secondary'
  | 'on-media.disabled'
  | 'complementary.aqua'
  | 'complementary.indigo'
  | 'complementary.tangerine'
  | 'action.primary.default'
  | 'action.primary.quiet.default'
  | 'action.primary.soft.default'
  | 'action.danger.default'
  | 'action.danger.quiet.default'
  | 'action.danger.soft.default'
  | 'action.neutral.default'
  | 'action.on-scene.default';

/**
 * Every glyph name in the library, exactly as bDS names it in Figma
 * (`icon/alert-triangle` -> `'alert-triangle'`).
 *
 * 31 of them, one component each in `@dsm/web/icons` and `@dsm/mobile/icons`
 * (`IconAlertTriangle`). The written documentation says 28 — it predates
 * `caps-lock`, `circle` and `star`, all added later.
 *
 * Exported for the case the components cannot cover: a name arriving at runtime,
 * from an API or a CMS. Map it to a component yourself — the library ships no
 * name-to-component registry, because one would reference all 31 and defeat
 * tree-shaking.
 */
export type TIconName =
  | 'alert-circle'
  | 'alert-triangle'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'caps-lock'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevrons-right'
  | 'circle'
  | 'credit-card'
  | 'dots'
  | 'eye'
  | 'eye-off'
  | 'flag'
  | 'image'
  | 'info'
  | 'lock'
  | 'minus'
  | 'placeholder'
  | 'plus'
  | 'search'
  | 'star'
  | 'store'
  | 'trash'
  | 'user'
  | 'x'
  | 'x-circle';

/**
 * Platform-agnostic contract shared by the `Icon` container and by every icon
 * component built on it.
 *
 * **The Icon is the wrapper every icon in the system passes through** — it is
 * not the drawing. It fixes the box (`size`, bound to `size/icon/*`) and resolves
 * the colour; the drawing enters as its children. bDS is explicit that this is
 * *"NO ES ICON CONTAINER NI AVATAR"*: the name is `Icon`, and the avatar's glyph
 * is out of scope because it scales with `component/avatar/size/glyph/*`.
 *
 * The 31 published glyphs come pre-built, one component each, from
 * `@dsm/web/icons` and `@dsm/mobile/icons`:
 *
 * ```tsx
 * <IconTrash size="lg" color="danger" />
 * ```
 *
 * Each of those *is* an `Icon` with its paths already inside, so it takes this
 * same set of props. Reach for `Icon` directly only to add artwork the library
 * does not ship — which is the same thing the library does internally:
 *
 * ```tsx
 * const IconTrash = (props: TIconProps) => (
 *   <Icon {...props}>
 *     <path d="M3 6H5H21" />
 *   </Icon>
 * );
 * ```
 *
 * Two rules the component enforces that the design file can only ask for:
 * - **The size is never touched by hand.** There is no `width`/`height` escape
 *   hatch, because in Figma resizing the instance breaks the variable binding
 *   and the icon stops responding to the token.
 * - **The glyph is chosen from the inside.** Where an icon has fixed meaning —
 *   the check of a Checkbox, the alert-triangle of an Image in error, the glyphs
 *   of Step, Alert and Snackbar — the host component picks it and does not
 *   expose the slot, so nobody can replace it by mistake.
 *
 * The children are the one thing this interface cannot describe, and they are
 * declared per platform: web takes `<path>` (DOM), mobile takes `<Path>` from
 * react-native-svg. Neither needs a `fill` — the container sets it and SVG
 * inheritance carries it down, identically on both platforms.
 */
export interface IIconBaseProps {
  /**
   * Edge length of the box.
   *
   * @defaultValue `'sm'`
   *
   * `'sm'` (16) because bDS calls it *"el tamaño por defecto del sistema"*. Note
   * this **deviates from the Figma properties table**, which reports `2xs` as
   * the default value — an artefact of variant creation order, and a size the
   * same documentation disqualifies for general use (*"no es un icono: es una
   * marca"*). Reviewed with design on 2026-08-31: the prose wins.
   */
  size?: TIconSize;
  /**
   * Semantic colour role for the glyph.
   *
   * Leave it unset — the default — and the glyph inherits its colour from
   * whatever contains it, which is what the Figma component does (it has no
   * colour axis at all). Set it only for a standalone icon that has to state a
   * meaning of its own, such as a `danger` glyph outside a control.
   *
   * How "inherit" is achieved differs by platform; see each package's
   * `IIconProps`.
   */
  color?: TIconColor;
  /**
   * Describes the icon to assistive technology.
   *
   * **Leave it out for a decorative icon.** Most icons in the system sit beside
   * a label that already says what they mean, and announcing them again is
   * noise — so without this prop the Icon hides itself from the accessibility
   * tree entirely. Provide it only when the icon is the *only* carrier of the
   * information, which then marks it up as an image rather than as decoration.
   */
  accessibilityLabel?: string;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile, so the same selector works in both suites.
   */
  testID?: string;
}
