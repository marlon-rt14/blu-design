/**
 * `count` carries a number and says how many; `dot` carries nothing and
 * only says something is new. If the number wouldn't help the person
 * decide anything, it's `dot`.
 *
 * @defaultValue `'count'`
 */
export type TBadgeType = 'count' | 'dot';

/**
 * Severity, ordered danger → neutral. `neutral` says nothing and is the one
 * to reach for when the badge is only counting — the other five tint, and
 * should only be used when the severity itself is information, never as
 * its only carrier (colour alone never informs — see `resolveBadgeAccessibleLabel`).
 *
 * @defaultValue `'neutral'`
 */
export type TBadgeStatus = 'danger' | 'warning' | 'success' | 'info' | 'brand' | 'neutral';

/**
 * Platform-agnostic contract for Badge — the counter or the notice dot. No
 * nested instances, no interaction states: it is a pill with a number, or a
 * point. If the content needs a label that can be read or removed, that's
 * `Tag`; if it also needs to be pressed to toggle, `Chip`.
 *
 * **Badge does not position itself.** Anchoring it to the corner of an icon
 * or an avatar is the caller's job — same reasoning `Popover`'s trigger and
 * `Menu`'s mounting already follow.
 *
 * @example
 * ```tsx
 * <Badge count={3} label="mensajes sin leer" status="danger" />
 * <Badge label="hay actividad nueva" type="dot" />
 * ```
 */
export interface IBadgeBaseProps {
  /**
   * @defaultValue `'count'`
   */
  type?: TBadgeType;
  /**
   * The number. Required in practice with `type="count"` — without it (or
   * at `0`) the badge renders nothing, see {@link resolveBadgeCountText}.
   * Ignored with `type="dot"`.
   */
  count?: number;
  /**
   * Ceiling before the count truncates to `"{max}+"`.
   *
   * @defaultValue `9`
   */
  max?: number;
  /**
   * @defaultValue `'neutral'`
   */
  status?: TBadgeStatus;
  /**
   * What the number(s) are, for someone who can't see where the badge sits:
   * *"'3' no le dice nada a quien no ve la pantalla."* Not in Figma — the
   * dev contract calls this the contract's central divergence, and it needs
   * sign-off, but the platforms ship it as optional because Figma has no
   * way to require it. **In practice it is not optional**: without it, a
   * `dot` badge is entirely invisible to a screen reader (no number to fall
   * back to), and a `count` badge is a number with no referent.
   */
  label?: string;
  testID?: string;
}

/**
 * Turns `count` and `max` into the text a `type="count"` Badge shows —
 * `"9"`, or `"{max}+"` once `count` exceeds it. The one thing Figma writes
 * by hand in its own file and code has to derive instead, so the two can't
 * silently drift apart (dev contract §07).
 *
 * Returns `undefined` for `count <= 0` — *"un badge con cero es peor que no
 * tener badge"* (dev contract §07/§08, closed): a zero (or missing) count
 * renders nothing, not a `"0"` pill.
 */
export const resolveBadgeCountText = (count: number | undefined, max = 9): string | undefined => {
  if (count === undefined || count <= 0) return undefined;
  return count > max ? `${max}+` : String(count);
};

/**
 * The accessible name a Badge announces.
 *
 * `dot` has no number to read, so it's `label` alone — genuinely invisible
 * to a screen reader without one (dev contract §06/§08). `count` combines
 * the resolved text with `label` (`"3 mensajes sin leer"`, not `"3"`) so the
 * number has a referent; the visible digits render `aria-hidden` alongside
 * it to avoid announcing the number twice.
 */
export const resolveBadgeAccessibleLabel = (
  type: TBadgeType,
  countText: string | undefined,
  label: string | undefined,
): string | undefined => {
  if (type === 'dot') return label;
  if (countText === undefined) return undefined;
  return label ? `${countText} ${label}` : countText;
};
