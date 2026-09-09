/**
 * How the Card separates itself from what is behind it.
 *
 * - `flat`: the surface and the radius, nothing else. The default, and the right
 *   choice when the card already sits on a page background it contrasts with.
 * - `raised`: adds the `elevation/raised` ramp. Figma binds **a border and a
 *   shadow**, not a shadow alone, and the reason is contrast modes: bDS is
 *   explicit that *"en mc-light, hc-light y hc-dark la separacion contra el
 *   fondo la hace el borde: una sombra sola no sobrevive a un modo de alto
 *   contraste"*.
 *
 * Worth knowing what that means in the two themes we actually export:
 * `color/elevation/raised/border` resolves to `#00000000` in both, so the border
 * is there and invisible, and the separation is done by the shadow. It starts
 * showing by itself, with no code change, the day a contrast theme ships.
 *
 * In `dark` the far shadow collapses too — `far-blur` and `far-y` are both `0`
 * and its colour is transparent — so a dark raised card separates on the near
 * shadow alone. That is the ramp, not a bug; bDS tracks it as a Foundations
 * item, not a component one.
 */
export type TCardElevation = 'flat' | 'raised';

/**
 * Inner padding of the surface.
 *
 * `none` is the default, and `md` is `space/inset/md` (12) on all four sides.
 *
 * There is no other step, and the axis exists at all because of what separates a
 * Card from a ListGroup: *"el padding lateral es una decision de la tarjeta, a
 * diferencia de ListGroup, donde el margen es de la pantalla y las filas llegan
 * a los bordes"*. A card with rows in it wants `none`; a card with prose in it
 * wants `md`.
 */
export type TCardPadding = 'none' | 'md';

/**
 * Platform-agnostic contract for the Card.
 *
 * A surface that holds content: it sets the background, the radius and the
 * clipping, and *"lo que va adentro lo decide quien la usa"*. It has no opinion
 * about its children and makes no promise about them — the slot is free, with no
 * preferred contents and no minimum.
 *
 * ### It is the same surface as ListGroup
 *
 * Both read `component/card/surface/bg`. The token was renamed from
 * `component/listgroup/surface/bg` on 2026-09-01 keeping its ID, so there is
 * exactly one source of truth for the colour. What separates them is the slot
 * contract, not the paint: a ListGroup restricts its rows to `ListItem` and
 * `ChoiceItem`, demands at least one, and resolves the dividers between them.
 * **If what goes inside is list rows, the component is a ListGroup, not a
 * Card.** They were deliberately not merged, because a slot's definition lives
 * in the component that declares it.
 *
 * ### It is not interactive
 *
 * The Card carries no role, no focus and no press state, and that is a rule
 * rather than an omission: *"si la tarjeta entera es un destino, el rol y el
 * foco los pone un enlace o un boton que la envuelve, no la superficie"*. Wrap
 * it, do not ask it to become a button.
 *
 * ### No width, and no style escape hatch
 *
 * There is no size axis and no way to override the styles, matching every other
 * component here. The Card takes the width its parent gives it, which is how
 * Figma lays it out too — a card is sized by the screen, not by itself. Put it
 * in a container and size that.
 *
 * @example
 * ```tsx
 * <Card>{rows}</Card>
 * <Card elevation="raised" padding="md">
 *   <p>Anything at all.</p>
 * </Card>
 * ```
 */
export interface ICardBaseProps {
  /**
   * How the card separates from the background.
   *
   * @defaultValue `'flat'`
   */
  elevation?: TCardElevation;
  /**
   * Inner padding on all four sides.
   *
   * @defaultValue `'none'`
   */
  padding?: TCardPadding;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}
