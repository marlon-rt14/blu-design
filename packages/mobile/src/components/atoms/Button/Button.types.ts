import type { IButtonBaseProps } from '@dsm/shared';
import type { ComponentType } from 'react';

import type { TIconProps } from '../Icon';

/**
 * An icon a Button can carry: any component from `@dsm/mobile/icons`, or one
 * built the same way on `Icon`.
 *
 * The Button supplies both the size — `xs`/`sm` get 16 and `md`/`lg` get 24,
 * which is not the control's own scale — and the colour, through `tintColor`.
 * Web gets the colour for free through `currentColor`; React Native has no
 * cascade, so here the Button has to hand it over.
 */
export type TButtonIcon = ComponentType<TIconProps>;

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
  /**
   * Called when the press is held.
   *
   * **Mobile only, and it exists so a Tooltip can wrap this button.** React
   * Native hands a touch to a single view, so a `Pressable` around this one
   * never sees the long press — the inner one claims it first. The Tooltip
   * therefore injects its handler here instead, and `Pressable` runs both
   * gestures without conflict: a tap still calls `onPress`.
   *
   * Web has no equivalent because it has no long press: there a tooltip opens
   * on hover or focus, and nothing has to be threaded through.
   */
  onLongPress?: () => void;
  /**
   * Icon shown before the label.
   *
   * ```tsx
   * <Button label="Agregar" leadingIcon={IconPlus} />
   * ```
   *
   * There is no separate `showLeadingIcon`: passing the component is what shows
   * it. Figma has that boolean because a variant cannot express "absent".
   */
  leadingIcon?: TButtonIcon;
  /**
   * Icon shown after the label — a chevron, or `IconArrowUpRight` for an action
   * that leaves the screen.
   */
  trailingIcon?: TButtonIcon;
}
