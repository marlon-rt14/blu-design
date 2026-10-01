import type { ISnackbarBaseProps } from '../atoms/snackbar.types';

/** How many bars a pile keeps. A fourth arrival drops the oldest. */
export const SNACKBAR_STACK_MAX = 3;

/**
 * One bar in the pile. Same contract as a Snackbar, plus the id the stack
 * uses to keep its timer when the pile reflows.
 */
export interface ISnackbarStackItem extends Omit<ISnackbarBaseProps, 'paused' | 'testID' | 'onDismiss' | 'onExpire'> {
  id: string;
}

/**
 * Shared SnackbarStack contract. Component description on `1706:3753` —
 * there is no separate Dev firma. Two axes in Figma (`count`, `expanded`);
 * in code `count` is how many `items` there are (capped at
 * {@link SNACKBAR_STACK_MAX}) and `expanded` is whether the pile is open.
 *
 * Collapsed: the newest bar is in front and the only one you can use. Older
 * bars peek `space/stack/sm`, narrow `space/inline/sm` per level, and fade
 * to `component/snackbar/stack/behind-1` (72%) and `behind-2` (48%).
 * Expanded: a list, newest at the bottom, gap `space/stack/sm`, every bar
 * interactive, timers paused. One bar is just a Snackbar — the pile does
 * not open.
 */
export interface ISnackbarStackBaseProps {
  /**
   * Arrival order, oldest first. The component keeps the newest
   * {@link SNACKBAR_STACK_MAX}.
   */
  items: ISnackbarStackItem[];
  /**
   * Controlled open state. Leave it unset and the pile opens on hover or
   * focus (web) and on press (native), and closes on outside press, scroll,
   * or when a single bar remains.
   */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** A bar left — timer, swipe, or its own dismiss. */
  onDismiss?: (id: string) => void;
  testID?: string;
}
