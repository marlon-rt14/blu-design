import type { TIconName } from './icon.types';

/**
 * Semantic tone of the Alert.
 *
 * Figma's live variant axis is named `status`; the set description and
 * Supernova's import still call it `tone`. Public API stays `tone` (same
 * word as Snackbar, same five values).
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
 * - `inline`: 12 padding, 12 radius, `text/body/sm`. No title layer.
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
 * and does not auto-dismiss (that is Snackbar).
 *
 * Figma + Supernova properties (8): `tone` × `placement`, `showTitle`,
 * `title`, `body`, `showIcon`, `showAction`, `showDismiss`. The last two
 * default **false** — the 15 published variants have them off, but they
 * are real independent booleans, never inferred from content.
 *
 * Nested action is a **LinkButton** `on-muted` `sm` `underline=false`.
 * Nested dismiss is IconButton `veil` `xs` (24), painted locally because
 * IconButton is not shipped. Live region is not a prop: danger/warning
 * → `alert`, rest → `status`.
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
   *
   * On `inline` this is a no-op: that placement has no title layer.
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
   * Edited on the nested instance in Figma — default matches the published
   * default variant (`placement=page`, `status=danger`).
   *
   * @defaultValue `'Resolver ahora'`
   */
  actionLabel?: string;
  /**
   * @defaultValue `false`
   *
   * Usage copy: on for info / neutral / success. Off for danger / warning
   * unless the same information is reachable another way.
   */
  showDismiss?: boolean;
  /**
   * Accessible name of the dismiss control. Figma: *"La X necesita
   * nombre propio (\"Cerrar aviso\")"*.
   *
   * @defaultValue `'Cerrar aviso'`
   */
  dismissAccessibilityLabel?: string;
  testID?: string;
}
