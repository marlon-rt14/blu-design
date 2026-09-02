/**
 * Physical size of the Radio.
 *
 * Both axes scale together and the dot is always exactly half the box:
 * - `sm`: box 16, dot 8, label 14, row 32 tall.
 * - `md`: box 24, dot 12, label 16, row 48 tall — `size/target/min`.
 *
 * Figma's default is `sm`, which is kept here: unlike the Button and the Icon,
 * where the reported default was an artefact of variant order, `sm` is the only
 * other option and nothing in the documentation argues for `md`.
 */
export type TRadioSize = 'sm' | 'md';

/**
 * Interaction state the Radio resolves its colours for.
 *
 * Mirrors the `state` axis of the bDS Figma component one-to-one. It is
 * **internal**: each platform derives it from real interaction and from
 * `isDisabled`, because you do not *tell* a radio it is hovered.
 *
 * `hover` is not a token swap. It composites `box/overlay-hover` — navy at 6% —
 * over whatever the resting colours are, so it tints the border and the fill
 * together. Verified against Figma's render: over `#7c8396` it lands on
 * `#757d93` and over `#ffffff` on `#f0f2f6`, neither of which exists as a token.
 */
export type TRadioState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

/**
 * Platform-agnostic contract for the Radio.
 *
 * **An exclusive choice inside a group.** bDS is explicit that it never stands
 * alone — *"si hay una sola opción, es un Checkbox"* — and that a group cannot
 * be cleared once chosen: if the user must be able to return to "none", the
 * group is missing an explicit option for it.
 *
 * Selection and focus deliberately share the same blue: *"lo que distingue
 * seleccionado de enfocado es la forma, no el color"*. The dot says selected,
 * the ring says focused.
 *
 * The handler is left to each platform (`onChange` on web, `onPress` on
 * mobile), as is the grouping: the web Radio renders a real
 * `<input type="radio">`, so a shared `name` gives arrow-key navigation, roving
 * tab order and form semantics from the browser rather than from us.
 */
export interface IRadioBaseProps {
  /**
   * The option's text. **Required even when hidden** — see `showLabel`.
   */
  label: string;
  /**
   * Whether this option is the chosen one.
   *
   * Controlled: the Radio never flips it on its own. A radio that cannot be
   * unselected is the point of the component, so there is no uncontrolled mode
   * to fall back on — an uncontrolled radio could only ever turn itself *on*,
   * since the one that has to turn it off is a sibling it cannot reach. The
   * coordination belongs to whatever owns the group.
   *
   * **Named for the platform, not for Figma.** The design axis is called
   * `selected`, but every runtime this maps onto says *checked* —
   * `input.checked`, `aria-checked`, `accessibilityState.checked` — and the
   * Checkbox in this library already exposes `isChecked`. The token groups keep
   * the Figma name, so `radioTokens.colors.selected` is what this prop selects.
   */
  isChecked?: boolean;
  /**
   * Physical size.
   *
   * @defaultValue `'sm'`
   */
  size?: TRadioSize;
  /**
   * Whether the label is rendered next to the box.
   *
   * **Unlike the Button's icon slots, this one survives into code.** There the
   * boolean was redundant with the icon itself; here the label is still needed
   * when hidden, because it becomes the control's accessible name. Turning it
   * off hides the text visually and nothing else — a radio with no name at all
   * is not an option this component offers.
   *
   * @defaultValue `true`
   */
  showLabel?: boolean;
  /**
   * Blocks interaction and applies the disabled styling.
   *
   * **A disabled radio that is selected shows no dot.** `dot/bg-disabled`
   * resolves to the same value as `box/bg-disabled`, so the mark disappears and
   * the option becomes indistinguishable from an unselected one. That is what
   * Figma renders and it is reproduced here on purpose; reported as a defect in
   * the token set.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the native
   * `testID` on mobile.
   */
  testID?: string;
}
