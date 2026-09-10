/**
 * Where the tooltip sits relative to its trigger: side plus alignment.
 *
 * Floating UI's vocabulary, which is bDS's too — the same thirteen values the
 * Tooltip, the Coachmark and the Menu all speak. The side is where the panel
 * lands (`top` = above the trigger, with the pointer underneath) and the
 * alignment is where the pointer stands along that side. `none` is the odd one
 * out: it means **no pointer at all**, for when the tooltip refers to an area
 * rather than to a point.
 *
 * **This is a preference, not an instruction**, and it is the divergence bDS
 * flags hardest: *"placement no es una entrada: lo calcula el motor de
 * posicionamiento según el espacio. Los 13 valores del eje son el resultado."*
 * The thirteen exist so every position can be drawn, not so a caller can pin
 * one. Leave it unset and the engine picks; set it and the engine still flips
 * away when there is no room, because *"un tooltip que insiste en ir arriba
 * cuando no hay lugar arriba es un tooltip cortado"*.
 */
export type TTooltipPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'none';

/**
 * What kind of tooltip this is, which is really a question about how it leaves.
 *
 * - `descriptive`: appears on point and **goes away on its own**. No title, no
 *   dismiss. The default.
 * - `info`: **stays until the person closes it**. It is a message, not help in
 *   passing — which is why the title and the dismiss only make sense here.
 */
export type TTooltipType = 'descriptive' | 'info';

/**
 * The optional link inside a tooltip.
 *
 * Renders as a `LinkButton` with `appearance="on-inverse"` and `size="sm"`,
 * both fixed: the tooltip's surface is the inverse one, and nothing about the
 * link is the caller's to choose except its words and what it does.
 *
 * Whether it is underlined is neither — bDS puts it on the platform: underlined
 * on web, not on the app.
 */
export interface ITooltipLink {
  label: string;
  onPress: () => void;
}

/**
 * Platform-agnostic contract for the Tooltip.
 *
 * A short explanation anchored to the element that triggers it. **It wraps its
 * trigger**: `children` is the thing being explained, not the tooltip's own
 * content. That is a divergence from Figma, where the panel floats free with
 * nothing anchoring it — *"children no existe en Figma y es la prop que define
 * el componente"*.
 *
 * ### It has no states
 *
 * *"El Tooltip no tiene eje state: está o no está."* Whatever states exist live
 * in the link and in the dismiss, and belong to those components.
 *
 * ### What opens it, per platform
 *
 * Pointing or focusing on web; **a long press** on mobile. Not a tap: the
 * trigger is usually a control with an action of its own, and a tap belongs to
 * it. bDS is blunt about what that costs — on touch a `descriptive` tooltip can
 * barely be opened, so *"si la información hace falta, va visible. Esconderla
 * detrás de un gesto largo es esconderla."* Never put the only copy of
 * something important in one.
 *
 * ### WCAG 1.4.13, which shapes three behaviours
 *
 * A tooltip that appears on hover has to be dismissible without moving the
 * pointer (`Esc` closes it), hoverable (moving the pointer *into* the tooltip
 * must not close it, so a link inside stays reachable), and persistent (it
 * waits for the person rather than timing out).
 *
 * @example
 * ```tsx
 * <Tooltip body="Se envía a tu correo">
 *   <IconButton icon={IconInfo} label="Más información" onPress={noop} />
 * </Tooltip>
 *
 * <Tooltip
 *   body="Tu sesión se cierra a los 15 minutos sin actividad."
 *   link={{ label: 'Cambiar', onPress: openSettings }}
 *   onDismiss={close}
 *   title="Sesión"
 *   type="info"
 * >
 *   <Badge />
 * </Tooltip>
 * ```
 */
export interface ITooltipBaseProps {
  /**
   * The explanation. Required — *"un tooltip sin cuerpo no tiene razón de
   * existir"*.
   */
  body: string;
  /**
   * Whether it leaves on its own or waits to be closed.
   *
   * @defaultValue `'descriptive'`
   */
  type?: TTooltipType;
  /**
   * A heading above the body.
   *
   * **Only meaningful with `type="info"`.** Figma turns it on by default even
   * for `descriptive`, which bDS flags as a default that pushes toward the
   * wrong use; here its presence is the switch, and on a `descriptive` tooltip
   * it is ignored.
   */
  title?: string;
  /**
   * Preferred side and alignment. Omit it and the engine chooses freely.
   *
   * See {@link TTooltipPlacement}: even when set, the engine flips away from a
   * side with no room. `'none'` draws no pointer.
   */
  placement?: TTooltipPlacement;
  /**
   * An action inside the tooltip. Its presence is what renders it — there is no
   * `showLink`.
   */
  link?: ITooltipLink;
  /**
   * Called when the person closes the tooltip.
   *
   * **Its presence is what draws the dismiss.** Only meaningful with
   * `type="info"`: *"un tooltip que se va solo no necesita cierre"*.
   */
  onDismiss?: () => void;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile. The panel gets `${testID}-panel`.
   */
  testID?: string;
}

/**
 * Accessible name of the dismiss control.
 *
 * The X inside an `info` tooltip is an IconButton, and an icon-only button
 * needs a name of its own. Not configurable, for the same reason the
 * PasswordField's action label is not: an inverted or vague name breaks the
 * one thing the control has.
 */
export const TOOLTIP_DISMISS_LABEL = 'Cerrar';
