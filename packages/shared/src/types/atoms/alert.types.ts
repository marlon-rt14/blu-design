import type { TIconName } from './icon.types';

/**
 * Semantic tone of the Alert. Matches Figma's `tone` axis.
 *
 * The chip fill + glyph shape carry the meaning together (WCAG 1.4.1) —
 * colour alone is not enough. Glyphs are locked per tone; there is no
 * icon slot.
 */
export type TAlertTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

/** Glyphs Alert is allowed to paint — a closed subset of {@link TIconName}. */
export type TAlertToneIcon = Extract<TIconName, 'alert-circle' | 'alert-triangle' | 'check-circle' | 'info'>;

/**
 * Where the Alert sits. Matches Figma's `placement` axis.
 *
 * - `page`: 16 padding, 16 radius, `text/body/md`.
 * - `section`: same padding/radius as page, `text/body/sm`.
 * - `inline`: 12 padding, 12 radius, `text/body/sm`.
 */
export type TAlertPlacement = 'page' | 'section' | 'inline';

/** Glyph locked to each tone — host picks it, consumers cannot swap. */
export const ALERT_TONE_ICON: Record<TAlertTone, TAlertToneIcon> = {
  danger: 'alert-circle',
  warning: 'alert-triangle',
  success: 'check-circle',
  info: 'info',
  neutral: 'info',
};

/**
 * Shared Alert contract. Non-modal, in-flow notice — it occupies space
 * and does not auto-dismiss (that is Snackbar). Event handlers live on
 * each platform.
 *
 * `showTitle` / `showIcon` / `showAction` / `showDismiss` are independent
 * booleans, never inferred from content. Figma usage says dismiss is for
 * info/neutral/success, not danger/warning — that is a guideline, not a
 * code lock.
 */
export interface IAlertBaseProps {
  /**
   * @defaultValue `'danger'`
   */
  tone?: TAlertTone;
  /**
   * @defaultValue `'page'`
   */
  placement?: TAlertPlacement;
  /**
   * @defaultValue `true`
   */
  showTitle?: boolean;
  /**
   * @defaultValue `'Título del aviso'`
   */
  title?: string;
  /**
   * @defaultValue `'Descripción breve de la condición y de lo que se puede hacer.'`
   */
  body?: string;
  /**
   * @defaultValue `true`
   */
  showIcon?: boolean;
  /**
   * @defaultValue `false`
   */
  showAction?: boolean;
  /**
   * Label of the nested LinkButton. Only visible when `showAction` is on.
   *
   * @defaultValue `'Ver detalle'`
   */
  actionLabel?: string;
  /**
   * @defaultValue `false`
   */
  showDismiss?: boolean;
  /**
   * Accessible name of the dismiss control.
   *
   * @defaultValue `'Cerrar aviso'`
   */
  dismissAccessibilityLabel?: string;
  /**
   * Whether the Alert announces on mount. Off for a page-load notice that
   * already sits before `<h1>` (Figma: no live region on load). On for
   * Alerts that appear later: danger/warning → `alert`, rest → `status`.
   *
   * @defaultValue `true`
   */
  announce?: boolean;
  testID?: string;
}
