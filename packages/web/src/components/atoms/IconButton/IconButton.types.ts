import type { IIconButtonBaseProps } from '@dsm/shared';
import type { ComponentType } from 'react';

import type { TIconProps } from '../Icon';

/**
 * The glyph an IconButton carries: any component from `@dsm/web/icons`, or one
 * built the same way on `Icon`.
 *
 * **A component, not a name**, which is where this diverges from the
 * development documentation's `icon: IconName`. The library publishes one
 * exported component per glyph precisely so a bundler can drop the 30 nobody
 * imported; a name would need a registry that references all 31 and costs
 * 16.7 kB measured. Design has been asked to change the signature. Everything
 * else about the slot is the same: the caller brings the drawing and nothing
 * else.
 *
 * The IconButton supplies the size — `xs` and `sm` get 16, `md` 24 and `lg` 32,
 * which is not the control's own scale — and the colour comes for free: the
 * `<button>` sets `color`, and an `Icon` with no `color` role resolves to
 * `currentColor`.
 */
export type TIconButtonIcon = ComponentType<TIconProps>;

/**
 * Props of the web IconButton.
 *
 * Extends the shared {@link IIconButtonBaseProps} contract with the glyph and
 * the native `type` attribute. Note the handler is `onPress`, not `onClick`:
 * the development documentation names it the same on both platforms.
 *
 * Hover, press and focus are deliberately not props — the component tracks them
 * itself and feeds them to `useIconButton`, the same way `Button` does.
 */
export interface IIconButtonProps extends IIconButtonBaseProps {
  /** The glyph. Required: an IconButton with nothing in it is not anything. */
  icon: TIconButtonIcon;
  /**
   * Maps to the native `type` attribute.
   *
   * @defaultValue `'button'`
   */
  type?: 'button' | 'submit' | 'reset';
}
