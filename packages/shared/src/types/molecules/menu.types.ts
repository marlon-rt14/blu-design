import type { ReactNode } from 'react';


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
 * `leadingContent` is a `ReactNode`, as loose as Figma's instance-swap slot —
 * which also accepts Flag/Avatar/MerchantAvatar, and is how PhoneField puts a
 * country flag in each of its rows. The dev contract's own firma says
 * `IconName`; that was narrower than both the design and the use, so the slot
 * was widened here.
 */
export interface IMenuOption {
  value: string;
  label: string;
  /** Second line under the label. Its presence turns the slot on — no separate boolean. */
  description?: string;
  /**
   * Whatever goes before the label. Its presence turns the leading slot on — no
   * separate boolean.
   *
   * **A node, not an icon name.** It started as a `TIconName`, which limited the
   * slot to the 31 system glyphs and left no way to put artwork in a row — a
   * country flag, a card-brand logo, an avatar. Widened for the PhoneField's
   * country selector, where each row carries its country's flag and those are
   * third-party artwork that must not be tinted by the theme, so they can never
   * be system glyphs.
   *
   * A glyph is still the common case and costs one element:
   * `leadingContent: <IconFlag size="sm" />`.
   *
   * **Not to be confused with `ListItem`'s `leadingContent`**, which is an enum
   * — `'none' | 'icon' | 'avatar'` — naming *what kind* of thing the slot holds.
   * This one is the thing itself.
   */
  leadingContent?: ReactNode;
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
