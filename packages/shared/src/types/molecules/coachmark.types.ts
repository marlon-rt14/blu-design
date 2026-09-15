import type { TTooltipPlacement } from './tooltip.types';

/**
 * Whether the Coachmark carries a full-width Image above the copy.
 *
 * **An axis, not a boolean.** With `image` the dismiss floats over the photo
 * corner as IconButton `on-media`; with `none` it sits on the title row as
 * `veil`. One appearance cannot flip from a prop, so media is a variant.
 *
 * @defaultValue `'none'`
 */
export type TCoachmarkMedia = 'none' | 'image';

/**
 * One-shot tip vs a stepped guide.
 *
 * `showBack` only exists on `multi`. Outside press closes `single` and leaves
 * `multi` alone — a stray tap must not abort a tour.
 *
 * @defaultValue `'single'`
 */
export type TCoachmarkSequence = 'single' | 'multi';

/**
 * Same thirteen placements as {@link TTooltipPlacement} — Floating UI vocabulary.
 *
 * **Preference, not a pin** — same divergence as Tooltip. Coachmark · Dev:
 * *"Lo calcula el motor de posicionamiento, igual que en el Tooltip"* and
 * *"Los 13 placement son el resultado, no la entrada."* The thirteen exist so
 * every position can be drawn; the engine still flips when there is no room.
 * `none` draws no pointer (the card points at a zone, not a spot).
 */
export type TCoachmarkPlacement = TTooltipPlacement;

/**
 * Platform-agnostic contract for the Coachmark.
 *
 * A system-triggered contextual guide anchored to an element — tourtip, not
 * Tooltip (user-asked, inverse) and not Snackbar (confirms what just happened).
 * **It wraps its anchor** (`children`), same divergence from Figma as Tooltip.
 *
 * ### Axes (Figma + Supernova)
 *
 * `media` × `placement` × `sequence` → 52 variants.
 *
 * ### Properties (partial / Figma `show*`)
 *
 * `showTitle`, `title`, `body`, `stepIndex`, `showAction`, `showDismiss`,
 * `showBack`. Keep independent booleans — do not collapse to Dev presence-based
 * `title` / `action` unless asked. `showTitle` only applies with `media="image"`;
 * with `media="none"` the title is always painted (it owns `aria-labelledby`).
 * `showBack` is a no-op on `sequence="single"`.
 *
 * ### Open state
 *
 * Host-controlled via `isOpen`. Never opens on hover — appears on screen entry,
 * after an event, or when a feature unlocks. No timed autoclose (WCAG 2.2.1).
 *
 * @example
 * ```tsx
 * <Coachmark
 *   body="Explicación breve del beneficio, en una o dos líneas."
 *   isOpen={open}
 *   onAction={next}
 *   onDismiss={close}
 *   title="Título de la función"
 * >
 *   <Button label="Ancla" />
 * </Coachmark>
 * ```
 */
export interface ICoachmarkBaseProps {
  /**
   * @defaultValue `'none'`
   */
  media?: TCoachmarkMedia;
  /**
   * @defaultValue `'single'`
   */
  sequence?: TCoachmarkSequence;
  /**
   * Preferred side and alignment. Omit and the engine chooses; `none` draws no
   * pointer. Even when set, the engine may flip — Coachmark · Dev: *"Lo calcula
   * el motor de posicionamiento, igual que en el Tooltip"* /
   * *"Los 13 placement son el resultado, no la entrada."*
   *
   * @defaultValue `'top-start'`
   */
  placement?: TCoachmarkPlacement;
  /**
   * Whether the panel is mounted. Controlled — the host opens the guide.
   *
   * @defaultValue `false`
   */
  isOpen?: boolean;
  /**
   * Only meaningful with `media="image"`. With `media="none"` the title always
   * renders.
   *
   * @defaultValue `true`
   */
  showTitle?: boolean;
  /**
   * @defaultValue `'Título de la función'`
   */
  title?: string;
  /**
   * @defaultValue `'Explicación breve del beneficio, en una o dos líneas.'`
   */
  body?: string;
  /**
   * Step label painted in the footer on `sequence="multi"`. Visible form is
   * `"2 de 4"`; announce as `"Paso 2 de 4"`.
   *
   * @defaultValue `'2 de 4'`
   */
  stepIndex?: string;
  /**
   * Bitmap for the nested Image when `media="image"`. Code-only — Figma swaps
   * an Image instance. Empty / missing paints Image's empty state.
   */
  mediaSrc?: string;
  /**
   * Accessible name of the media Image. Required when `media="image"` and a
   * real bitmap is shown; empty string only if decorative.
   *
   * @defaultValue `''`
   */
  mediaAlt?: string;
  /**
   * @defaultValue `true`
   */
  showAction?: boolean;
  /**
   * Label of the primary footer Button. Omit and the default follows
   * `sequence`: `"Entendido"` on `single`, `"Siguiente"` on `multi` (last
   * step of a tour still overrides to `"Entendido"`).
   */
  actionLabel?: string;
  /**
   * Only meaningful with `sequence="multi"`.
   *
   * @defaultValue `true`
   */
  showBack?: boolean;
  /**
   * @defaultValue `'Atrás'`
   */
  backLabel?: string;
  /**
   * @defaultValue `true`
   */
  showDismiss?: boolean;
  /**
   * Accessible name of the dismiss IconButton.
   *
   * @defaultValue `'Cerrar la guía'`
   */
  dismissAccessibilityLabel?: string;
  /**
   * Stable identifier for tests. Panel gets `${testID}-panel`.
   */
  testID?: string;
}

/** Accessible name fallback when the host does not pass {@link ICoachmarkBaseProps.dismissAccessibilityLabel}. */
export const COACHMARK_DISMISS_LABEL = 'Cerrar la guía';

/**
 * Default primary CTA label from the live Figma set: single-shot cards say
 * `"Entendido"`; mid-tour steps say `"Siguiente"`. An explicit
 * {@link ICoachmarkBaseProps.actionLabel} always wins.
 */
export const resolveCoachmarkActionLabel = (
  sequence: TCoachmarkSequence = 'single',
  actionLabel?: string,
): string => {
  if (actionLabel !== undefined) {
    return actionLabel;
  }
  return sequence === 'multi' ? 'Siguiente' : 'Entendido';
};
