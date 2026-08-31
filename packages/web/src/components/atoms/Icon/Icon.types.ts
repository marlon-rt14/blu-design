import type { IIconBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of every icon component in `@dsm/web/icons` — the shared contract with
 * no children, since each of those already has its own drawing inside.
 *
 * ```tsx
 * <IconTrash size="lg" color="danger" />
 * ```
 *
 * Also the right type for an icon you add yourself: take `TIconProps`, spread
 * them onto an `Icon`, and put the paths in between.
 */
export type TIconProps = IIconBaseProps;

/**
 * Props of the web Icon container.
 *
 * The shared contract plus the drawing, which arrives as children rather than
 * through a prop. That is the whole difference from the platform split
 * elsewhere in the library: a web icon's children are DOM (`<path>`, `<circle>`,
 * `<g>`) and a native one's are `react-native-svg` elements, so the *type* of
 * the children differs even though the surrounding API does not.
 */
export interface IIconProps extends IIconBaseProps {
  /**
   * The drawing: SVG child elements on a `0 0 24 24` grid, in paint order.
   *
   * **Do not give them a `fill`.** The container sets it on the `<svg>` and SVG
   * inheritance carries it to every child, which is what lets one `color` prop
   * — or the inherited `currentColor` — recolour the whole glyph. A hardcoded
   * fill freezes the icon to one theme, and that is exactly the trap in Figma's
   * own exports, which arrive with `fill="#323949"` baked into every path.
   */
  children: ReactNode;
}
