import type { ReactNode } from 'react';

import type { TTooltipPlacement } from './tooltip.types';

/**
 * Same twelve side-plus-alignment placements as {@link TTooltipPlacement} —
 * Floating UI's vocabulary, minus `'none'`. That value means "no pointer" for
 * Tooltip and Coachmark, both of which draw a `.TipPointer`; Popover has no
 * pointer at all (dev contract §07: *"El Popover no tiene punta"*), so the
 * value would be meaningless here.
 *
 * Same "preference, not instruction" rule as the other two: leave it unset
 * and the positioning engine picks; set it and the engine still flips away
 * when there is no room.
 */
export type TPopoverPlacement = Exclude<TTooltipPlacement, 'none'>;

/**
 * Width the panel presents itself at — `md` (default) or `sm`. Changes the
 * header height and internal padding only. The panel's actual width comes
 * from its trigger or its content, never from `size`.
 * @defaultValue `'md'`
 */
export type TPopoverSize = 'sm' | 'md';

/**
 * Platform-agnostic contract for Popover — a free-content floating surface
 * anchored to a trigger. If the content is a list of options, this is the
 * wrong component: that is {@link IMenuBaseProps}, whose slot only accepts
 * the MenuItem family and which has no trigger or open state of its own.
 *
 * **It wraps `trigger`**, the element that opens it — a divergence from
 * Figma, where the panel floats free with nothing anchoring it. Same
 * divergence Tooltip and Coachmark already document for their own anchor.
 *
 * **No `isOpen`/`onOpenChange`.** Popover owns its open state internally,
 * toggled by `trigger`, the same way Select owns its own menu — there is
 * nothing to control from outside except closing it (Esc, an outside click,
 * or the optional dismiss button).
 *
 * ### Focus, unlike Tooltip and Coachmark
 *
 * This one traps it: opening moves focus inside and keeps it there, Esc or
 * an outside click always closes it, and closing returns focus to `trigger`.
 *
 * ### Web only, for now
 *
 * On native this surface is replaced entirely by a different component — an
 * action sheet on iOS, a Material bottom sheet on Android — not a smaller
 * version of this one. See the dev contract's own platform table.
 *
 * @example
 * ```tsx
 * <Popover header="Cupo disponible" trigger={<Button label="Ver cupo" />}>
 *   <p>Tu cupo se renueva el 5 de cada mes.</p>
 * </Popover>
 * ```
 */
export interface IPopoverBaseProps {
  /** The element that opens it. */
  trigger: ReactNode;
  /** The content. Free-form — any node, text, or frame; no minimum, no preferred shape. */
  children: ReactNode;
  /** Shown above the content. Its presence turns the header on — no separate `showHeader`. */
  header?: string;
  /**
   * Called when the dismiss control (the ×) is pressed.
   *
   * **Its presence is what draws it** — no separate `showDismiss`, same
   * convention as the × on Chip's `onRemove`.
   */
  onDismiss?: () => void;
  /** @defaultValue `'md'` */
  size?: TPopoverSize;
  /**
   * Preferred side and alignment. Omit it and the engine chooses freely; see
   * {@link TPopoverPlacement}.
   */
  placement?: TPopoverPlacement;
  /**
   * Stable identifier for tests. Maps to `data-testid` on web. The panel
   * gets `${testID}-panel`.
   */
  testID?: string;
}

/**
 * Accessible name of the dismiss control — not configurable, same reasoning
 * as `TOOLTIP_DISMISS_LABEL`.
 */
export const POPOVER_DISMISS_LABEL = 'Cerrar';
