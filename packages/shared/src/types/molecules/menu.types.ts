import type { TIconName } from '../atoms/icon.types';

/**
 * Physical size, largest first. `md` (44 tall, `size/field/height/md`) is
 * the default; `sm` (32, `size/control/height/sm`) is for a menu opened from
 * a compact trigger — the row itself never shrinks under its size's floor,
 * a longer `description` is free to grow it.
 * @defaultValue `'md'`
 */
export type TMenuSize = 'sm' | 'md';

/**
 * One row's data. In Figma these are four hand-drawn MenuItem instances — a
 * demo, not the catalog: in code the real list is however many `options` the
 * caller passes.
 *
 * `leading` is typed `IconName` here, matching the dev contract's own firma
 * — Figma's instance-swap slot is looser (it also accepts Flag/Avatar/
 * MerchantAvatar, which is how PhoneField puts country flags in its own
 * rows), but that flexibility isn't part of this component's public code
 * contract.
 */
export interface IMenuOption {
  value: string;
  label: string;
  /** Second line under the label. Its presence turns the slot on — no separate boolean. */
  description?: string;
  /** Glyph before the label. Its presence turns the leading slot on — no separate boolean. */
  leading?: TIconName;
  /** Trailing amount or shortcut, e.g. `"$1.250,00"`. Its presence turns the slot on — no separate boolean. */
  trailingText?: string;
  /**
   * Blocks activation but keeps the row in the reading and arrow-key order,
   * announced as disabled — it is never removed from the DOM or silently
   * skipped.
   * @defaultValue `false`
   */
  disabled?: boolean;
}

/**
 * Platform-agnostic contract for Menu — the floating list itself, one
 * component covering all three of Figma's: MenuItem is a row, MenuEmpty is
 * what renders in the row's own place when `options` is empty, not a
 * component instanced on its own.
 *
 * - **`onSelect` lives on the platform prop, not here** — this contract
 *   stays free of event handlers, same convention as every other component.
 * - **A row's `isSelected` is never chosen** — it comes from whichever
 *   `options[].value` is present in `value` (a single value or, for a
 *   multi-select caller, an array). Marking a row directly is not possible.
 * - **`header`'s presence turns the header on** — no separate `showHeader`.
 * - **Mounting, positioning and dismissing the menu is the caller's job.**
 *   There is no `isOpen`, no anchor and no `onClose` here — Menu is pure
 *   content, the same shape whether a popover (web) or a bottom sheet
 *   (mobile) puts it on screen. See the dev contract's own platform table.
 */
export interface IMenuBaseProps {
  /** However many are passed is however many rows render. */
  options: IMenuOption[];
  /** The chosen value(s). A row is selected when its `value` is a member of this. */
  value?: string | string[];
  /** Shown above the rows. Its presence turns the header on — no separate boolean. */
  header?: string;
  /** @defaultValue `'md'` */
  size?: TMenuSize;
  /** Replaces the rows when `options` is empty. @defaultValue `'Sin resultados'` */
  emptyMessage?: string;
  testID?: string;
}
