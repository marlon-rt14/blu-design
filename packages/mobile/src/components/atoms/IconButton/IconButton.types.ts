import type { IIconButtonBaseProps } from '@dsm/shared';
import type { ComponentType } from 'react';

import type { TIconProps } from '../Icon';

/**
 * The glyph an IconButton carries: any component from `@dsm/mobile/icons`, or
 * one built the same way on `Icon`.
 *
 * **A component, not a name**, which is where this diverges from the
 * development documentation's `icon: IconName`. The library publishes one
 * exported component per glyph so a bundler can drop the ones nobody imported;
 * a name would need a registry referencing all 31. Design has been asked to
 * change the signature.
 *
 * The IconButton supplies both the size — `xs` and `sm` get 16, `md` 24 and
 * `lg` 32 — and the colour, through `tintColor`. Web gets the colour for free
 * through `currentColor`; React Native has no cascade, so here the button has
 * to hand it over.
 */
export type TIconButtonIcon = ComponentType<TIconProps>;

/**
 * Props of the React Native IconButton.
 *
 * Extends the shared {@link IIconButtonBaseProps} contract with the glyph.
 * Everything else is identical to the web IconButton on purpose — including the
 * handler's name, `onPress`, which the development documentation fixes for both
 * platforms.
 *
 * There is no hover: a touch screen has no pointer, and the design has no such
 * state for native either.
 */
export interface IIconButtonProps extends IIconButtonBaseProps {
  /** The glyph. Required: an IconButton with nothing in it is not anything. */
  icon: TIconButtonIcon;
}
