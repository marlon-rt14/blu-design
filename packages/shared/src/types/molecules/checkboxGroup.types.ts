/**
 * Physical size of the group.
 *
 * **It has to match the `size` of the rows inside it.** The lateral indent of
 * the legend and the helper follows the row's own — 8 at `sm`, 12 at `md` —
 * so that the legend's first letter starts in the same column as the row's
 * control. Mismatch them and the group looks misaligned even though every
 * piece is correct on its own.
 */
export type TCheckboxGroupSize = 'sm' | 'md';

/**
 * Platform-agnostic contract for the CheckboxGroup.
 *
 * **It is the `<fieldset>` with its `<legend>`.** It asks the question, groups
 * the rows and shows the helper or the error. It does *not* draw the rows:
 * those arrive through a slot, which is `children` here — Figma's `rows`
 * slot takes ChoiceItem with `control="checkbox"` (or ListGroup).
 *
 * Use this and not a radio group when **several options or none** may be
 * chosen — that is a semantic difference, not a visual one, which is why
 * bDS ships them as separate components. Do not put `role="radiogroup"`
 * on this.
 *
 * Three things the group deliberately does *not* do:
 * - **No lateral padding of its own.** That is screen margin, and it belongs
 *   to the screen.
 * - **No disabled state.** A whole group switched off is built by disabling
 *   each row: a slot cannot promise anything about what is inside it.
 * - **No tinting of the chosen row.** The control says what is selected by
 *   changing *shape*, so the row never needs to change colour.
 */
export interface ICheckboxGroupBaseProps {
  /**
   * The group's question. **Required even when hidden** — it is the
   * fieldset's accessible name, so `showLegend={false}` hides the text and
   * nothing else.
   */
  legend: string;
  /**
   * Whether the legend renders.
   *
   * @defaultValue `true`
   */
  showLegend?: boolean;
  /** The helper line; in the invalid state, the validation message. */
  helperText?: string;
  /**
   * Whether the helper line renders.
   *
   * @defaultValue `true`
   */
  showHelper?: boolean;
  /**
   * Paints the helper text with `color/text/danger`.
   *
   * **That is all it does.** It does not tint the rows, and it cannot: what
   * comes in through the slot belongs to whoever assembled it. Mirrors the
   * `state=error` axis of the Figma component.
   *
   * @defaultValue `false`
   */
  isInvalid?: boolean;
  /**
   * Physical size. Must match the size of the rows — see {@link TCheckboxGroupSize}.
   *
   * @defaultValue `'sm'`
   */
  size?: TCheckboxGroupSize;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web and to the
   * native `testID` on mobile.
   */
  testID?: string;
}
