/**
 * Which kind of choice the row offers.
 *
 * Only the control on the left changes; the row is identical either way. The
 * distinction is semantic, and it is the row's job to pass it on:
 * - `radio`: one option, and there is always one chosen.
 * - `checkbox`: several, or none.
 */
export type TChoiceItemControl = 'radio' | 'checkbox';

/**
 * Physical size of the row.
 *
 * - `sm` (48 tall, `size/target/min`): the compact row.
 * - `md` (56 tall, `size/control/height/lg`): roomier, with a bigger control.
 *
 * The lateral inset follows it — 8 at `sm`, 12 at `md` — which is what makes a
 * `RadioGroup`'s legend line up with the control. Keep the group and the rows on
 * the same size.
 */
export type TChoiceItemSize = 'sm' | 'md';

/**
 * Interaction state the row resolves its colours for.
 *
 * Mirrors the `state` axis of the bDS Figma component. It is **internal**: each
 * platform derives it from real interaction and from `isDisabled`.
 *
 * Measured against Figma's own render of all 40 variants: `hover` and `pressed`
 * composite `surface/overlay-hover` (6%) and `surface/overlay-pressed` (10%)
 * over the resting surface, `focus` leaves the surface alone and draws a ring,
 * and **`disabled` does not tint the row at all** — only the text and the
 * control go quiet. The written documentation mentions a `color/bg/disabled`
 * background that the file does not apply.
 */
export type TChoiceItemState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

/**
 * Platform-agnostic contract for the ChoiceItem.
 *
 * **A selectable option as a whole row.** Unlike a bare `Radio` or `Checkbox`,
 * the touch target is the entire row and the control on the left only says what
 * kind of choice it is. Focus draws on the row, not just on the control.
 *
 * bDS classifies its four row components by how many targets they have, not by
 * how they look: `ChoiceItem` and `SwitchItem` have **one target that is the
 * control**, `ListItem` has one that navigates with inert content beside it, and
 * `MenuItem` has one inside a popover. Putting an interactive control in a
 * ListItem's trailing slot creates a second target and a second focus order —
 * that is a pattern to document, not a flag to add.
 *
 * **A selected row is never tinted.** The control says what is chosen by
 * changing shape, so WCAG 1.4.1 is satisfied without colouring the row. bDS
 * removed the tint and the 3px indicator bar on 2025-09-01: at full width they
 * read as a *highlighted* row rather than a chosen option, and the bar anchors
 * to a card edge that a form has no reason to have.
 */
export interface IChoiceItemBaseProps {
  /** The option's text. The row's primary line. */
  label: string;
  /** Which control the row carries. @defaultValue `'radio'` */
  control?: TChoiceItemControl;
  /** Whether this option is chosen. Controlled — the row never flips it. */
  isChecked?: boolean;
  /** Physical size. @defaultValue `'sm'` */
  size?: TChoiceItemSize;
  /** Second line under the label. @defaultValue `false` */
  showDescription?: boolean;
  /** The second line's text. Rendered only when `showDescription`. */
  description?: string;
  /** Trailing text at the end of the row — an amount, a currency, a shortcut. @defaultValue `false` */
  showTrailingText?: boolean;
  /** The trailing text. Rendered only when `showTrailingText`. */
  trailingText?: string;
  /**
   * Hairline under the row, starting where the **text** starts rather than at
   * the row's edge.
   *
   * **Starts off, and that is deliberate.** Core serves web and app, and a
   * divider between rows is an iOS grouped-list pattern rather than a property
   * of the row. bDS turned it off on 2025-09-01 so that all four row components
   * agree; before, `ChoiceItem` and `SwitchItem` defaulted to on while
   * `ListItem` defaulted to off.
   *
   * Turn it on per row and off on the last one — no container can do it for you,
   * because what goes into a slot belongs to whoever assembled it.
   *
   * @defaultValue `false`
   */
  showDivider?: boolean;
  /**
   * Blocks interaction. Quietens the text and the control; the row's own
   * surface is untouched.
   *
   * @defaultValue `false`
   */
  isDisabled?: boolean;
  /** Stable identifier for tests. */
  testID?: string;
}
