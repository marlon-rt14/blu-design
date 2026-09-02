import type { IButtonBaseProps } from '@dsm/shared';
import type { ComponentType, MouseEvent } from 'react';

import type { TIconProps } from '../Icon';

/**
 * An icon a Button can carry: any component from `@dsm/web/icons`, or one built
 * the same way on `Icon`.
 *
 * The Button supplies the size — `xs`/`sm` get 16 and `md`/`lg` get 24, which is
 * not the control's own scale — and the colour comes for free: the `<button>`
 * sets `color` for its label, and an `Icon` with no `color` role resolves to
 * `currentColor`. There is nothing to wire up.
 */
export type TButtonIcon = ComponentType<TIconProps>;

/**
 * Props of the web Button.
 *
 * Extends the shared {@link IButtonBaseProps} contract with the web-specific
 * bits: a mouse event handler and the native `type` attribute.
 *
 * Hover, press and focus are deliberately not props — the component tracks them
 * itself and feeds them to `useButton`, the same way `TextArea` does. See
 * `TButtonState` in `@dsm/shared` for why `isDisabled` is the exception.
 */
export interface IButtonProps extends IButtonBaseProps {
  /**
   * Called when the button is clicked. Not called while `isDisabled` is `true`,
   * because the underlying element carries the `disabled` attribute.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Maps to the `type` attribute of the underlying `<button>`. Defaults to
   * `'button'` so the component never submits a surrounding form by accident.
   *
   * @defaultValue `'button'`
   */
  type?: 'button' | 'submit' | 'reset';
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
   * that leaves the page.
   */
  trailingIcon?: TButtonIcon;
}
