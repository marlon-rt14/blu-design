import type { TIconName } from './icon.types';

/**
 * Physical size, largest first — shares its names with Tag's own `sm`/`xs`
 * axis and with Icon's step names, so the leading/remove glyphs need no
 * size mapping.
 * @defaultValue `'sm'`
 */
export type TChipSize = 'sm' | 'xs';

/**
 * Platform-agnostic contract for the Chip — a filter that is **touched**,
 * not a label that is **read** (that is Tag). A Chip toggles: it has no
 * press event of its own, only a state and the handler that flips it.
 *
 * - **`selected` is required, not optional.** A toggle with no state to
 *   render isn't a toggle — same case as Checkbox's `isChecked`.
 * - **`onToggle` lives on the platform prop, not here.** This contract
 *   stays free of event handlers, same convention as every other component.
 * - **`leadingIcon`'s presence turns the slot on** — no separate boolean.
 * - **The remove control (the ×) has no boolean of its own.** Whether it
 *   exists is decided entirely by the platform prop `onRemove` being set —
 *   a chip that cannot actually remove anything has no × to promise it
 *   can. This is a deliberate divergence from Tag's own `showRemove`,
 *   which is independent of its `onRemove` handler.
 * - **The × is an icon inside the chip, not a nested IconButton.** It has
 *   no focus stop or hit target of its own yet — a real, documented gap in
 *   the live component (dev contract §07), not something to invent a fix
 *   for here.
 */
export interface IChipBaseProps {
  /** The filter's own text. Two words, tops — if it needs more, it is probably not a chip. */
  label: string;
  /** Whether the filter is active. Controlled — there is no internal state. */
  selected: boolean;
  /** Glyph before the label. Its presence turns the leading icon slot on — no separate boolean. */
  leadingIcon?: TIconName;
  /** @defaultValue `'sm'` */
  size?: TChipSize;
  /** @defaultValue `false` */
  disabled?: boolean;
  testID?: string;
}
