import type { ReactNode } from 'react';

/**
 * Where the empty state appears. The only variant axis — what kind of
 * empty it is (first use, cleared, no results) is never a prop, just the
 * text.
 *
 * - `page`: a whole screen has no content. Centred, anchored to the top —
 *   not the vertical middle, which reads as a gap waiting to load.
 * - `inline`: a block inside a screen that otherwise has content (an empty
 *   favourites section, a list with no scheduled payments). Text only,
 *   left-aligned.
 *
 * @defaultValue `'page'`
 */
export type TEmptyStateLayout = 'page' | 'inline';

/**
 * The one action an EmptyState can carry — a `Button`, `primary`, always.
 * Verb plus noun, 2–4 words, no full stop: `"Agregar tarjeta"`, not
 * `"Aprende cómo agregar una tarjeta"`.
 */
export interface IEmptyStateAction {
  label: string;
  onPress: () => void;
}

/**
 * Platform-agnostic contract for EmptyState — what renders when a screen or
 * a block has no content, saying why it's empty and what to do next.
 *
 * **It is never an error.** If something failed — didn't load, the
 * connection dropped, the service doesn't respond — that's `Alert`, not
 * this. EmptyState is for when there's genuinely nothing and that's fine.
 *
 * **Load first.** While content is still arriving, show a `Skeleton`, not
 * this — showing the empty state before knowing whether there's data makes
 * it look like there isn't any.
 *
 * Every optional slot is presence-based — there is no `showGraphic`,
 * `showAction` or `showSecondaryAction`. `secondaryAction` only makes sense
 * paired with `action`: there is never a lone secondary, and never a third.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   action={{ label: 'Ver mis tarjetas', onPress: goToCards }}
 *   body="Cuando uses tu tarjeta, tus compras y pagos van a aparecer acá"
 *   graphic={<IconCreditCard01 />}
 *   title="Aún no tienes movimientos"
 * />
 * ```
 */
export interface IEmptyStateBaseProps {
  /**
   * 40–60 characters, no full stop. Says *why* it's empty — never
   * `"Sin datos"`.
   */
  title: string;
  /**
   * One sentence, up to 180 characters, no full stop. Says what comes next
   * or what can be done. Doesn't repeat `title`.
   */
  body: string;
  /**
   * @defaultValue `'page'`
   */
  layout?: TEmptyStateLayout;
  /**
   * The icon or illustration. Its presence draws it — no separate
   * `showGraphic`. Already sized by the caller; EmptyState fixes its own
   * box to `component.emptystate.icon.size` (40) and colours it, but can't
   * force a size onto an opaque node. Decorative by default (`aria-hidden`)
   * unless it carries meaning of its own.
   */
  graphic?: ReactNode;
  /** The primary action. Its presence draws it — no separate `showAction`. */
  action?: IEmptyStateAction;
  /**
   * A second, lighter action next to/under the primary — a `LinkButton`.
   * **Only meaningful with `action` present**; without it, this is ignored.
   * Never a third action.
   */
  secondaryAction?: IEmptyStateAction;
  testID?: string;
}
