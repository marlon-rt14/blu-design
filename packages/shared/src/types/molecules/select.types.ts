import type { TIconName } from '../atoms/icon.types';

/**
 * Physical size of the field. Shares its height steps with TextField's own:
 * `sm` -> `size/control/height/sm` (32), `md` -> `size/field/height/md` (44),
 * `lg` -> `size/field/height/lg` (56). Figma's own axis reads largest to
 * smallest; the code order here is the one the contract fixes.
 */
export type TSelectSize = 'sm' | 'md' | 'lg';

/**
 * One entry in the field's catalog.
 *
 * In Figma this is four hand-drawn MenuItems — a demo, not the data model.
 * In code it is the real list: however many `options` the caller passes is
 * however many rows the menu renders.
 */
export interface ISelectOption {
  value: string;
  label: string;
  icon?: TIconName;
}

/**
 * Platform-agnostic contract for the Select — a field whose value comes from
 * a fixed catalog through a menu, not from typing.
 *
 * This mirrors the dev contract's exact code signature. A few things it
 * deliberately does **not** expose as props, because they are derived or
 * internal rather than configuration:
 * - **`isOpen` is not a prop.** It is internal state — the same case as
 *   `showMenu` on PhoneField. Figma needs it as a variant axis to be able to
 *   draw the open menu; code does not.
 * - **`isSelected` on a row is not chosen.** It comes from whichever
 *   `options[].value` equals `value` — marking two rows in Figma describes
 *   something this component cannot do.
 * - **`isFilled` is not a prop.** It is `value` matching an option.
 * - The menu carries no header, and its rows carry no trailing amount or
 *   description — those exist in the Figma file as an example of another use
 *   case, and are frozen off here.
 * - **If real text filtering of the *value* is needed, this is not the
 *   component** — that is Combobox. `isSearchable` only filters which rows
 *   the already-fixed catalog shows inside the menu; it never lets the
 *   caller commit arbitrary text.
 */
export interface ISelectBaseProps {
  /** The field's floating label. Required even as a placeholder while `value` is unset. */
  label: string;
  /** The catalog. However many are passed is however many rows the menu renders. */
  options: ISelectOption[];
  /** The **value** of the chosen option, not its label. Controlled. */
  value?: string;
  /** @defaultValue `'md'` */
  size?: TSelectSize;
  /** Shown as the field's placeholder text while `value` is unset. */
  placeholder?: string;
  /** Glyph before the value. Its presence turns the leading icon slot on — no separate boolean. */
  leadingIcon?: TIconName;
  /** Shown below the field. Ignored while `error` is set. */
  helperText?: string;
  /** Shown below the field instead of `helperText`, and puts the field in its error state. Its presence is what turns error on — no separate boolean. */
  error?: string;
  /** Shows the chosen value but blocks opening the menu. */
  readOnly?: boolean;
  /** Blocks all interaction and applies the disabled styling. */
  disabled?: boolean;
  /**
   * Adds a search box inside the open menu that filters `options` by label
   * as the user types. The field itself stays a button, never an editable
   * input — only the menu's own rows are filtered.
   * @defaultValue `false`
   */
  isSearchable?: boolean;
  testID?: string;
}
