import type { ReactNode } from 'react';

/**
 * Fill palette. Matches Figma's `palette` variant axis. Only changes the
 * background — title, body and icon each read their own
 * `component.callout.{palette}.{title,body,icon}` leaf, which today resolve
 * to the same value in both palettes for title/body, and to a genuinely
 * different one for icon (see `ICalloutColorTokens`'s own docs).
 *
 * - `brand`: more visible. A new function, a benefit, an opportunity worth
 *   not missing. Avoid on a screen already busy with colour — it competes.
 * - `neutral`: more discreet. Colour-heavy screens, supporting information,
 *   or a screen that also has an Alert nearby (grey doesn't fight for
 *   attention).
 */
export type TCalloutPalette = 'brand' | 'neutral';

/**
 * The single action a Callout can carry — a `LinkButton`, `on-muted`, `sm`,
 * always underlined (a divergence from `LinkButton`'s own web default of
 * `true`/mobile default of `false`: here it is `true` on every platform,
 * because the link sits inside a paragraph and colour alone would not
 * distinguish it, WCAG 1.4.1). Two to four words, verb plus noun, no full
 * stop: `"Activar cashback"`, not `"Aprende más sobre el cashback"`.
 */
export interface ICalloutAction {
  label: string;
  onPress: () => void;
}

/**
 * Platform-agnostic contract for Callout — a proactive, optional message
 * about information, a feature, or an opportunity in the context of the
 * current task. **It never says something happened** — that is `Alert`, which
 * also carries severity and always outranks a Callout sharing the same
 * space (an Alert renders above any Callout). A Callout that points at a
 * specific control and floats over it is a `Coachmark`, not this.
 *
 * Every optional slot is presence-based — there is no `showTitle`,
 * `showIcon`, `showAction` or `showDismiss`. The dev contract is explicit
 * about this one, unlike `Alert`/`Snackbar`/`Tabs`, which keep a `show*` API
 * despite their own dev contracts asking for presence: *"showTitle, showIcon,
 * showAction y showDismiss no son props. El interruptor en código es la
 * presencia de title, icon, action y onDismiss."*
 *
 * @example
 * ```tsx
 * <Callout
 *   body="Recibe el 2% de tus compras en supermercados, directo en tu estado de cuenta."
 *   icon={<IconCreditCard />}
 *   title="Tu tarjeta ahora tiene cashback"
 * />
 * ```
 */
export interface ICalloutBaseProps {
  /**
   * Up to 120 characters, with a full stop. What the person gains, not how
   * it works internally. Required — a Callout always has a body.
   */
  body: string;
  /**
   * Up to 55 characters, sentence case, no full stop. Names the benefit —
   * does not repeat `body`. Its presence draws the title.
   */
  title?: string;
  /**
   * @defaultValue `'brand'`
   */
  palette?: TCalloutPalette;
  /**
   * The glyph. A system icon element (e.g. `<IconCreditCard />`), already sized by
   * the caller — Callout fixes its own box to `component.callout.icon.size`
   * (24) and colours it from `component.callout.{palette}.icon`, but cannot
   * force a size onto an opaque node. Decorative by default (`aria-hidden`);
   * there is no colour chip behind it. Its presence draws the icon.
   */
  icon?: ReactNode;
  /** A single action below the body. Its presence draws it. */
  action?: ICalloutAction;
  /**
   * Called when the dismiss control (the ×) is pressed. **Its presence is
   * what draws it** — for content seen once; whether the dismissal persists
   * across sessions is a product decision this contract doesn't model.
   */
  onDismiss?: () => void;
  /**
   * Accessible name of the dismiss control.
   *
   * @defaultValue `'Cerrar'`
   */
  dismissAccessibilityLabel?: string;
  testID?: string;
}
