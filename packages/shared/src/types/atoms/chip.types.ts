import type { ReactNode } from 'react';

/**
 * Physical size. In Figma the axis reads largest to smallest; the code order
 * here is the contract's.
 *
 * Shares its names with Tag's own axis and with Icon's step names, so the
 * leading and remove glyphs need no size mapping.
 *
 * @defaultValue `'sm'`
 */
export type TChipSize = 'xs' | 'sm';

/**
 * Platform-agnostic contract for the Chip — a filter that is **touched**, not
 * a label that is **read** (that is Tag). A Chip toggles: it has no press
 * event of its own, only a state and the handler that flips it.
 *
 * - **`selected` and `onToggle` are both required.** A toggle with no state to
 *   render, or no way to flip it, is not a toggle. The contract names the
 *   handler `onToggle` rather than `onPress` for exactly that reason —
 *   *"es toggle, no press: el chip guarda estado"*.
 * - **`leadingIcon`'s presence turns the slot on** — no separate boolean, the
 *   rule every field in the file follows.
 * - **`onRemove`'s presence draws the ×**, and nothing else does. There is no
 *   `showRemove`: *"una equis que no quita nada es una trampa"*.
 * - **The × is an icon inside the chip, not a nested IconButton.** It has no
 *   focus stop or hit target of its own yet — a real, documented gap in the
 *   live component (dev contract §07), not something to invent a fix for here.
 *
 * @example
 * ```tsx
 * <Chip
 *   label="Aprobado"
 *   leadingIcon={<IconCheck size="sm" />}
 *   onToggle={setActive}
 *   selected={active}
 * />
 * ```
 */
export interface IChipBaseProps {
  /** The filter's own text. Two words, tops — if it needs more, it is probably not a chip. */
  label: string;
  /** Whether the filter is active. Controlled — there is no internal state. */
  selected: boolean;
  /** Called with the next `selected` value when the chip is activated. */
  onToggle: (selected: boolean) => void;
  /**
   * Glyph before the label. Its presence turns the leading icon slot on.
   *
   * **A node, not a name.** The library publishes 1170 glyphs across 19
   * sections and no name-to-component registry, so the caller imports the one
   * it wants. Chip's `xs`/`sm` steps share their names with Icon's, so the
   * glyph's `size` is the chip's.
   */
  leadingIcon?: ReactNode;
  /**
   * Called when the remove control is activated. **Its presence draws the ×**
   * — without a handler there is no ×.
   */
  onRemove?: () => void;
  /** @defaultValue `'sm'` */
  size?: TChipSize;
  /** @defaultValue `false` */
  disabled?: boolean;
  /** Stable identifier for tests. Maps to `data-testid` on web. */
  testID?: string;
}
