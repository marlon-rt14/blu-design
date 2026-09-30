import type { ReactNode } from 'react';

/**
 * Visual weight, heaviest to lightest — same order as Button's.
 *
 * `fill` is full color: reach for it when the tone itself is the information
 * and has to read from a distance. `soft` is a tinted fill with body, the one
 * that fits most cases. `outline` adds no color mass — for long lists where
 * many tags together would otherwise clutter the screen. The hierarchy is set
 * by `appearance`, never by `palette`.
 */
export type TTagAppearance = 'fill' | 'soft' | 'outline';

/**
 * Which color the tag paints with.
 *
 * Named `palette`, not `status`: in a Tag the **label carries the meaning**,
 * not the color — the color is a choice, not a signal. Four of the nine have
 * a semantic name and may be used when severity matters, but never as the
 * only carrier of it (WCAG 1.4.1). `neutral` says nothing on its own and is
 * the one to reach for when the label already explains itself.
 */
export type TTagPalette =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'tangerine'
  | 'aqua'
  | 'indigo';

/**
 * Physical size. Shares its names with Icon's own `sm`/`xs` steps for the
 * leading glyph — no mapping needed, same idea as ListItem's.
 *
 * `sm` (32 tall) is the tag loose on a screen. `xs` (24 tall) fits where
 * there is no room left: inside a field, in a table row, on a dense card.
 * Changing size swaps the typography and the padding too — `label/md` +
 * `inset/sm` against `label/sm` + `inset/xs` — not just the height.
 */
export type TTagSize = 'xs' | 'sm';

/**
 * Platform-agnostic contract for the Tag.
 *
 * **A label that is read.** It says what type something is or what state it
 * is in: approved, pending, rejected, a transaction's category, a product's
 * name. **It is not touched to change it** — that is what Chip is for. bDS
 * removed Tag's `state` axis entirely: `hover`/`pressed`/`focus`/`selected`
 * described an interaction this component does not offer, and eight of those
 * variants were identical copies of `default`.
 *
 * The Combobox's own input chip is still a Tag — `onRemove`, `appearance='outline'`,
 * `palette='neutral'` — removable but never selectable.
 */
export interface ITagBaseProps {
  /**
   * The tag's text, in the user's voice: `"Aprobado"`, not `"STATUS_OK"`. If
   * it needs more than two words, it is probably not a tag.
   */
  label: string;
  /** @defaultValue `'soft'` */
  appearance?: TTagAppearance;
  /** @defaultValue `'neutral'` */
  palette?: TTagPalette;
  /** @defaultValue `'sm'` */
  size?: TTagSize;
  /**
   * Glyph before the label — 16 at `sm`, 12 at `xs`. Its presence turns the
   * slot on; there is no `showLeadingIcon`.
   *
   * **A node, not a name.** The library publishes 1170 glyphs across 19
   * sections and no name-to-component registry, so the caller imports the one
   * it wants. Tag's steps share their names with Icon's, so the glyph's `size`
   * is the tag's. It is painted with the same token as the label, so it
   * follows `palette` and the theme on its own.
   */
  leadingIcon?: ReactNode;
  /**
   * Called when the remove control is activated. **Its presence draws the ×**
   * — there is no `showRemove`, because a × that removes nothing is a trap.
   *
   * This is the rule Chip already followed; the two now agree.
   */
  onRemove?: () => void;
  /** Stable identifier for tests. */
  testID?: string;
}
