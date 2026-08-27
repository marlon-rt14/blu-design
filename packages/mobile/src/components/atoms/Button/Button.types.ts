import type { IButtonBaseProps } from '@dsm/shared';

/**
 * Props of the React Native Button.
 *
 * Extends the shared {@link IButtonBaseProps} contract with the mobile-specific
 * handler. Everything else is identical to the web Button on purpose.
 *
 * Press and focus are deliberately not props — the component tracks them itself
 * and feeds them to `useButton`, the same way `TextArea` does.
 */
export interface IButtonProps extends IButtonBaseProps {
  /**
   * Called when the button is pressed. Not called while `isDisabled` is `true`,
   * because the underlying `Pressable` receives `disabled`.
   */
  onPress?: () => void;
}
