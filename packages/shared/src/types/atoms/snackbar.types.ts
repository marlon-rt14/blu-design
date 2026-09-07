import type { TIconName } from './icon.types';

/**
 * Semantic tone of the Snackbar. Matches Figma's `tone` axis.
 *
 * Tone changes the glyph and its `on-inverse.{tone}` colour — never the
 * bar fill. The bar is always inverse. Glyphs are locked; there is no
 * icon slot.
 */
export type TSnackbarTone = 'info' | 'success' | 'warning' | 'danger';

/** Glyphs Snackbar is allowed to paint — a closed subset of {@link TIconName}. */
export type TSnackbarToneIcon = Extract<TIconName, 'alert-circle' | 'alert-triangle' | 'check-circle' | 'info'>;

/** Glyph locked to each tone — host picks it, consumers cannot swap. */
export const SNACKBAR_TONE_ICON: Record<TSnackbarTone, TSnackbarToneIcon> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

/**
 * Dwell before auto-dismiss, in milliseconds.
 *
 * Figma: *"Dura 6 s desde que entra; el contador arranca al montar y no
 * se reinicia."* Not a theme token — `motion.duration.*` tops out at 400ms.
 */
export const SNACKBAR_DURATION_MS = 6000;

/**
 * Shared Snackbar contract. Ephemeral overlay toast — confirms something
 * just happened and leaves on its own. Event handlers live on each
 * platform.
 *
 * `showIcon` / `showAction` / `showClose` are independent booleans, never
 * inferred from content. The live-region polarity is not a prop: danger
 * is `assertive`, everything else `polite`.
 *
 * The nested action on the live node is a **LinkButton** `on-inverse`
 * `sm` (21px, default label `"Deshacer"`). The component-set description
 * still says Button — the instance wins.
 */
export interface ISnackbarBaseProps {
  /**
   * @defaultValue `'info'`
   */
  tone?: TSnackbarTone;
  /**
   * Past tense, no trailing period, max two lines.
   *
   * @defaultValue `'Se guardó el cambio en tu tarjeta'`
   */
  message?: string;
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
  showClose?: boolean;
  /**
   * Accessible name of the close control.
   *
   * @defaultValue `'Cerrar'`
   */
  closeAccessibilityLabel?: string;
  testID?: string;
}
