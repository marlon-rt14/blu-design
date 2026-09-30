import { cloneElement, isValidElement } from 'react';
import type { ReactNode } from 'react';

/**
 * Paints an icon slot with the colour its host resolved, unless the caller
 * already chose one.
 *
 * **Only React Native needs this.** Every icon slot in the system is a
 * `ReactNode` the caller imports and sizes itself, and on web the host simply
 * sets `color` on the wrapper: a system glyph fills with `currentColor` and
 * inherits it, artwork that carries its own fills ignores it. React Native has
 * no `currentColor`, so without this a tab's glyph would stay grey when the tab
 * is selected, and a disabled row's glyph would stay black — state the caller
 * cannot see from outside and should not have to mirror.
 *
 * `tintColor` set by the caller always wins, same precedence the rest of the
 * library uses for styles. A node that is not an element, or artwork that takes
 * no `tintColor` — a country flag, a card-brand mark — passes through: the prop
 * is simply ignored by a component that does not read it, which is exactly the
 * behaviour third-party artwork wants.
 *
 * @example
 * ```tsx
 * <View style={iconStyle}>{tintNode(leadingIcon, iconColor)}</View>
 * ```
 */
export const tintNode = (node: ReactNode, tintColor: string): ReactNode =>
  isValidElement<{ tintColor?: string }>(node) && node.props.tintColor === undefined
    ? cloneElement(node, { tintColor })
    : node;
