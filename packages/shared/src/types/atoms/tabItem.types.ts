import type { ReactNode } from 'react';

/**
 * Physical size of a Tab item. Matches Figma's `size` axis.
 *
 * - `md`: 44 tall, `text/label/md` (14).
 * - `lg`: 56 tall, `text/label/lg` (16).
 *
 * @defaultValue `'lg'`
 */
export type TTabSize = 'md' | 'lg';

/**
 * Contract for one tab — **internal**.
 *
 * The dev contract gives the page two components and one public signature:
 * `Tabs`, which takes its tabs as data (`ITabDef[]`). This interface is what
 * the bar hands the thing that draws a tab, and three of its props —
 * `isSelected`, `layout` and `size` — only the bar knows how to fill in.
 * `isSelected` in particular is derived, never passed from outside: *"no se
 * marca pestaña por pestaña: sale del valor"*.
 *
 * Live Figma set is named **Tab item** (`97:14033`); search still lists it as
 * `Tab`. The live selected axis is `isSelected` (Supernova's import still says
 * `selected` — Figma wins).
 *
 * Hover / pressed / focus are not props: each platform derives them from real
 * interaction.
 */
export interface ITabItemBaseProps {
  /** The tab's text. */
  label: string;
  /**
   * Whether this is the active tab. **Derived by `Tabs`** from `key === value`.
   *
   * @defaultValue `false`
   */
  isSelected?: boolean;
  /**
   * Physical size. Handed down by `Tabs`.
   *
   * @defaultValue `'lg'`
   */
  size?: TTabSize;
  /**
   * Glyph before the label. Its presence turns the slot on — a node, sized to
   * the bar at `size/icon/sm` (16).
   */
  leadingIcon?: ReactNode;
  /** Count on the nested Badge. Its presence turns the badge on. */
  badge?: number;
  /**
   * Blocks the tab while keeping it in the reading order, announced as
   * disabled.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /** Stable identifier for tests. */
  testID?: string;
}
