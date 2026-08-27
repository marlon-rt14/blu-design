import type { ILinkButtonBaseProps } from '@dsm/shared';

/**
 * Props of the React Native LinkButton.
 *
 * Extends the shared {@link ILinkButtonBaseProps} contract with the
 * mobile-specific handler and `underline`.
 *
 * Two things the web LinkButton has are deliberately absent:
 * - `isVisited`. bDS does not implement `visited` in apps — *"visited existe
 *   solo en web"*.
 * - a `hover` state, which a touch screen does not have.
 */
export interface ILinkButtonProps extends ILinkButtonBaseProps {
  /**
   * Called when the link is pressed. Not called while `isDisabled` is `true`,
   * because the underlying `Pressable` receives `disabled`.
   */
  onPress?: () => void;
  /**
   * Whether the label is underlined.
   *
   * **Defaults to `false` here and `true` on web**, which is what the bDS
   * component means by this property: *"apagada es el enlace de app, que en iOS
   * y Android no se subraya; encendida es el enlace de web"*.
   *
   * Turn it on for a link that lives inside a paragraph: there, colour alone
   * does not distinguish it from the surrounding text (WCAG 1.4.1).
   *
   * @defaultValue `false`
   */
  underline?: boolean;
}
