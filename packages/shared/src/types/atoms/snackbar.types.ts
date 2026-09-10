import type { TIconName } from './icon.types';

/**
 * Semantic status of the Snackbar. Matches Figma's `status` variant axis
 * (Supernova + live set). The set description may still say `tone` in
 * prose — the property name wins.
 *
 * Status changes the glyph and its `on-inverse.{status}` colour — never
 * the bar fill. The bar is always inverse. Glyphs are locked; there is no
 * icon slot.
 */
export type TSnackbarStatus = 'info' | 'success' | 'warning' | 'danger';

/** Glyphs Snackbar is allowed to paint — a closed subset of {@link TIconName}. */
export type TSnackbarStatusIcon = Extract<TIconName, 'alert-circle' | 'alert-triangle' | 'check-circle' | 'info'>;

/** Glyph locked to each status — host picks it, consumers cannot swap. */
export const SNACKBAR_STATUS_ICON: Record<TSnackbarStatus, TSnackbarStatusIcon> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

/**
 * Shared Snackbar contract. Ephemeral overlay toast — confirms something
 * just happened and leaves on its own. Event handlers live on each
 * platform.
 *
 * Figma + Supernova properties (5): `status`, `message`, `showIcon`,
 * `showAction`, `showDismiss`. The last three are independent booleans,
 * never inferred from content. Code pairs `showAction` → `onAction` and
 * `showDismiss` → `onDismiss` (same pattern as Alert). `duration` is a
 * declared code-only divergence — Figma does not model timing.
 *
 * Autoclose dwell: `motion/dwell/default` (6 s) without action,
 * `motion/dwell/long` (10 s) when `showAction` is on. Explicit `duration`
 * wins. Timer starts on mount and does not restart.
 *
 * The nested action on the live node is a **LinkButton** `on-inverse`
 * `sm` (21px, default label `"Deshacer"`). The component-set description
 * still says Button — the instance wins.
 */
export interface ISnackbarBaseProps {
  /**
   * Past tense, no trailing period, max two lines.
   *
   * @defaultValue `'Se guardó el cambio en tu tarjeta'`
   */
  message?: string;
  /**
   * @defaultValue `'info'`
   */
  status?: TSnackbarStatus;
  /**
   * @defaultValue `true`
   */
  showIcon?: boolean;
  /**
   * @defaultValue `true`
   */
  showAction?: boolean;
  /**
   * Label of the nested LinkButton. Only visible when `showAction` is on.
   *
   * @defaultValue `'Deshacer'`
   */
  actionLabel?: string;
  /**
   * @defaultValue `false`
   */
  showDismiss?: boolean;
  /**
   * Accessible name of the dismiss control.
   *
   * @defaultValue `'Cerrar'`
   */
  dismissAccessibilityLabel?: string;
  /**
   * Autoclose dwell in milliseconds. Overrides the default
   * `motion/dwell/{default|long}` resolution.
   */
  duration?: number;
  testID?: string;
}
