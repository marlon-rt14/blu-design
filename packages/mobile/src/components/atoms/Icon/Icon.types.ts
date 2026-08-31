import type { IIconBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of every icon component in `@dsm/mobile/icons` — the shared contract
 * plus `tintColor`, with no children, since each of those already has its own
 * drawing inside.
 *
 * ```tsx
 * <IconTrash size="lg" color="danger" />
 * ```
 *
 * Also the right type for an icon you add yourself: take `TIconProps`, spread
 * them onto an `Icon`, and put the paths in between.
 */
export interface TIconProps extends IIconBaseProps {
  /**
   * A literal colour value for the drawing, taking precedence over `color`.
   *
   * **Mobile only, and the reason is React Native, not design.** There is no
   * `currentColor` here and no cascade to inherit through, so a parent that has
   * already resolved a colour — a Button tinting its icon to match its label —
   * has no way to lend it implicitly the way it does on web. This prop is that
   * channel.
   *
   * Prefer `color` whenever the icon's meaning comes from bDS rather than from
   * its host: a role stays correct when the theme changes, a literal does not.
   *
   * @defaultValue the value of `color`, or `color/icon/primary` when neither is set
   */
  tintColor?: string;
}

/**
 * Props of the React Native Icon container.
 *
 * `TIconProps` plus the drawing, which arrives as children rather than through
 * a prop. That is the whole difference from the platform split elsewhere in the
 * library: a native icon's children are `react-native-svg` elements (`<Path>`,
 * `<Circle>`, `<G>`) and a web one's are DOM, so the *type* of the children
 * differs even though the surrounding API does not.
 */
export interface IIconProps extends TIconProps {
  /**
   * The drawing: `react-native-svg` elements on a `0 0 24 24` grid, in paint
   * order.
   *
   * **Do not give them a `fill`.** The container sets it on the `Svg`, which
   * wraps its children in a `G` carrying that fill, so react-native-svg's own
   * inheritance takes it from there — the same semantics as web, and the reason
   * a glyph's markup is identical on both platforms apart from the tag casing.
   * A hardcoded fill freezes the icon to one theme, and that is exactly the trap
   * in Figma's own exports, which arrive with `fill="#323949"` baked into every
   * path.
   */
  children: ReactNode;
}
