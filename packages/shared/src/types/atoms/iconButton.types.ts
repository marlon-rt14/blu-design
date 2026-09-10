/**
 * Where the IconButton lives, and with how much body it presents itself.
 *
 * Seven values, ordered from most body to least, with the surface-bound ones
 * last. The first four describe a *shape*; the last three describe the
 * *surface underneath*, and are not interchangeable with the others or with
 * each other.
 *
 * - `brand`: brand fill. The default.
 * - `neutral`: tonal. **Do not use it on a Card in dark.**
 *   `color/fill/action/neutral/default` and `color/canvas/surface/primary` both
 *   resolve to `dark/neutral/800`, so it disappears; against the page
 *   background (`dark/neutral/950`) it separates fine. Tracked by design as a
 *   Foundations fix, not a component one.
 * - `ghost`: no fill at rest.
 * - `veil`: a translucent neutral veil. *"No compra contraste: compra
 *   SILUETA."* It is what `ghost` lacked — with no fill at rest, ghost fell
 *   outside the disabled-with-border pass. This is the close affordance of the
 *   Alert.
 * - `on-scene`: over the brand colour. Its glyph is **fixed white**, because
 *   the brand scene is dark in all six modes.
 * - `on-media`: over a photo. A fixed black veil, no mode at all — a photo does
 *   not change with the theme.
 * - `on-inverse`: over `color/bg/inverse`. Unlike `on-scene`, this one **does**
 *   flip with the mode.
 */
export type TIconButtonAppearance =
  | 'brand'
  | 'neutral'
  | 'ghost'
  | 'veil'
  | 'on-scene'
  | 'on-media'
  | 'on-inverse';

/**
 * Edge of the control: `xs` 24 · `sm` 32 · `md` 44 · `lg` 56, the same ramp as
 * Button, and always square.
 *
 * **The glyph does not scale with it.** Measured on all four variants: `xs` and
 * `sm` both take 16, `md` takes 24 and `lg` takes 32 — so `xs` reads
 * `size/icon/sm` and skips its own `size/icon/xs` (12), which would be a smudge
 * inside a control.
 *
 * `xs` and `sm` fall below `size/target/min` (48). bDS is explicit that the
 * touch area comes from the container's outer padding and not from the visual
 * box, so on mobile this component ships `hitSlop` — which grows the target
 * without moving the layout — and on web it is the host's job. `xs` is for
 * dense actions inside a row or a table, never for the primary action.
 */
export type TIconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Platform-agnostic contract for the IconButton.
 *
 * The same action as a Button, without the label. Use it only when the icon is
 * unambiguous on its own, or when there is no room for text: *"si hay duda
 * sobre qué hace, lleva etiqueta y entonces es Button"*.
 *
 * ### The states are not props, except one
 *
 * `default`, `hover`, `pressed`, `focus` and `disabled` all exist in the design,
 * and only `disabled` is a prop — the other four are produced by interaction.
 * `hover` exists on web alone; a touch screen has no pointer.
 *
 * ### What the component decides, and what it does not
 *
 * The caller brings the glyph. **Its size and colour are not negotiable**: the
 * IconButton sets both from `size` and from the appearance's state, because an
 * icon carrying its own colour inside *"rompe los 6 modos"*. That is the same
 * split the Button already uses for its leading and trailing icons.
 *
 * @example
 * ```tsx
 * <IconButton icon={IconTrash} label="Eliminar" onPress={remove} />
 * <IconButton appearance="veil" icon={IconX} label="Cerrar aviso" onPress={close} size="sm" />
 * ```
 */
export interface IIconButtonBaseProps {
  /**
   * The accessible name, and the only name this control will ever have.
   *
   * **Required, on every platform.** There is no visible text, so without it the
   * button is mute to a screen reader — bDS calls it *"la prop más importante y
   * la única que Figma no puede pedir"*. It maps to `aria-label` on web and to
   * `accessibilityLabel` on mobile.
   *
   * Say the **action, not the drawing**: `"Cerrar aviso"`, never `"equis"`.
   */
  label: string;
  /**
   * Called when the button is activated.
   *
   * Named the same on both platforms, which is what the development
   * documentation specifies — it is not `onClick` on web.
   */
  onPress: () => void;
  /**
   * Where the button lives and how much body it has.
   *
   * @defaultValue `'brand'`
   */
  appearance?: TIconButtonAppearance;
  /**
   * Edge of the control.
   *
   * @defaultValue `'md'`
   *
   * Figma's own panel reports `lg`, but only because its variant axis runs from
   * largest to smallest and the panel shows the first value. The development
   * documentation fixes the real default at `md`.
   */
  size?: TIconButtonSize;
  /**
   * Whether the button is unavailable.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}
