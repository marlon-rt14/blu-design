import type { ILinkButtonBaseProps } from '@dsm/shared';
import type { MouseEvent } from 'react';

/**
 * Props of the web LinkButton.
 *
 * Extends the shared {@link ILinkButtonBaseProps} contract with the web-specific
 * bits: a mouse event handler, the native `type` attribute, and the two props
 * that only mean something in a browser — `underline` and `isVisited`.
 */
export interface ILinkButtonProps extends ILinkButtonBaseProps {
  /**
   * Called when the link is clicked. Not called while `isDisabled` is `true`,
   * because the underlying element carries the `disabled` attribute.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Whether the label is underlined.
   *
   * **Defaults to `true` on web and `false` on mobile**, which is what the bDS
   * component means by this property: *"apagada es el enlace de app, que en iOS
   * y Android no se subraya; encendida es el enlace de web"*. Figma's own default
   * is `false` because a single component set can only have one; the platform
   * split is the intent behind it.
   *
   * **Do not set this to `false` for a link inside a paragraph.** There, colour
   * alone does not distinguish the link from its surrounding text (WCAG 1.4.1).
   *
   * @defaultValue `true`
   */
  underline?: boolean;
  /**
   * Renders the visited colour.
   *
   * The app has to say so: a LinkButton is an *action*, not a navigation, so it
   * renders a `<button>` and the browser's `:visited` pseudo-class never
   * applies. This prop is web-only — bDS does not implement `visited` in apps.
   *
   * @defaultValue `false`
   */
  isVisited?: boolean;
  /**
   * Maps to the `type` attribute of the underlying `<button>`. Defaults to
   * `'button'` so the component never submits a surrounding form by accident.
   *
   * @defaultValue `'button'`
   */
  type?: 'button' | 'submit' | 'reset';
}
