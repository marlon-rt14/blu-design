/**
 * Semantic status of the Snackbar. Matches Figma's `status` variant axis.
 *
 * Status changes the glyph and its `on-inverse.{status}` colour — never
 * the bar fill. The bar is always inverse. Glyphs are locked; there is no
 * icon slot.
 */
export type TSnackbarStatus = 'info' | 'success' | 'warning' | 'danger';

/**
 * Glyphs Snackbar is allowed to paint, by their bDS name.
 *
 * A name rather than a node: the glyph is locked per status and is never a
 * slot the caller can reach.
 *
 * **`success` is a bare `check` here and a `check-circle` in Alert.** The
 * Snackbar is *"check para success"*; the Alert is *"check-circle para
 * success"*. The bar is already a shape, so the glyph does not need a
 * second one around it.
 */
export type TSnackbarStatusIcon = 'alert-circle' | 'alert-triangle' | 'check' | 'info-circle';

/** Glyph locked to each status — the host picks it, consumers cannot swap. */
export const SNACKBAR_STATUS_ICON: Record<TSnackbarStatus, TSnackbarStatusIcon> = {
  info: 'info-circle',
  success: 'check',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

/**
 * The undo (or other) action. Its presence draws the LinkButton — Figma's
 * `showAction` boolean is not a prop.
 */
export interface ISnackbarAction {
  /** Max two words, infinitive. Live default copy is `"Deshacer"`. */
  label: string;
  /** Called when the action is activated. `onClick` on web, `onPress` on mobile. */
  onPress: () => void;
}

/**
 * Shared Snackbar contract. Dev firma `1010:76982` — ephemeral toast the
 * host mounts when something just happened, and unmounts when it leaves.
 *
 * `showIcon` stays a boolean: the glyph has no content to infer from.
 * `action` and `onDismiss` are presence-based, and they share one trailing
 * slot — every published instance hides one of the two. `action` wins: the
 * LinkButton renders and the × does not. `onDismiss` still runs on swipe
 * and when the dwell elapses. The × renders only when `onDismiss` is set
 * and there is no `action`. A host that only wants autoclose (no ×, no
 * action) omits both — the bar hides itself when the dwell elapses.
 *
 * Autoclose: `motion/dwell/default` (6 s) without `action`,
 * `motion/dwell/long` (10 s) with one (decision 3, 29-sep). Explicit
 * `duration` wins. Timer starts on mount and does not restart.
 */
export interface ISnackbarBaseProps {
  /** Past tense, no trailing period, max two lines. Required. */
  message: string;
  /**
   * @defaultValue `'info'`
   */
  status?: TSnackbarStatus;
  /**
   * Whether the locked status glyph renders. Off does not drop `status`
   * from the live region.
   *
   * @defaultValue `true`
   */
  showIcon?: boolean;
  /** Draws the action LinkButton (`on-inverse`, `sm`) when set. */
  action?: ISnackbarAction;
  /**
   * Draws the close control when set. Also invoked on swipe-down and when
   * the dwell elapses. The host unmounts; the bar does not remove itself
   * from the tree when this is provided.
   */
  onDismiss?: () => void;
  /**
   * Called when the bar leaves — dwell, swipe, or the × — without drawing
   * a control. SnackbarStack uses it so a bar can expire without a ×.
   */
  onExpire?: () => void;
  /**
   * Autoclose dwell in milliseconds. Overrides
   * `motion/dwell/{default|long}`.
   */
  duration?: number;
  /**
   * Pauses the dwell without resetting what is left. SnackbarStack sets this
   * while the pile is expanded. Not a property of the single bar.
   */
  paused?: boolean;
  /** Stable identifier for tests. `data-testid` on web, `testID` on mobile. */
  testID?: string;
}
