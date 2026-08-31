import type { ReactElement } from 'react';

import type { IIconProps } from './Icon.types';
import { useIcon } from './useIcon';

/**
 * Web Icon — the wrapper every icon in the system passes through.
 *
 * **It is not the drawing.** It fixes the box from `size/icon/*`, resolves the
 * colour from the active theme, and renders the `<svg>` that holds whatever
 * paths it is given. Using it is the same as writing a plain `<svg>`, minus
 * every decision it makes for you:
 *
 * ```tsx
 * export const IconTrash = (props: TIconProps) => (
 *   <Icon {...props}>
 *     <path d="M3 6H5H21" />
 *   </Icon>
 * );
 * ```
 *
 * That is exactly how the 31 published glyphs in `@dsm/web/icons` are built, so
 * most screens never touch this component directly — they use `IconTrash` and
 * friends. Reach for it to add artwork the library does not ship.
 *
 * The `viewBox` is fixed at `0 0 24 24`, the grid bDS authors on, and the size
 * is only ever chosen through `size`: no width or height escape hatch, mirroring
 * the rule the design file can only ask for — resizing the instance by hand
 * breaks the variable binding and the icon stops following the token.
 *
 * With no `color`, the glyph inherits from its container through `currentColor`,
 * and bDS intends exactly that: the Figma component has no colour axis. Pass a
 * role only for an icon that carries a meaning of its own.
 *
 * Decorative by default — without `accessibilityLabel` the icon is hidden from
 * assistive technology, because an icon beside a label that already says what it
 * means is noise when announced twice.
 */
export const Icon = (props: IIconProps): ReactElement => {
  const { children, accessibilityLabel, testID } = props;
  const { svgStyle, edge, color, viewBox } = useIcon(props);
  const isDecorative = accessibilityLabel === undefined;

  return (
    <svg
      aria-hidden={isDecorative || undefined}
      aria-label={accessibilityLabel}
      data-testid={testID}
      fill={color}
      // IE-era browsers made SVG focusable; some assistive tech still honours
      // it, which would put a decorative graphic in the tab order.
      focusable="false"
      height={edge}
      role={isDecorative ? undefined : 'img'}
      style={svgStyle}
      viewBox={viewBox}
      width={edge}
    >
      {children}
    </svg>
  );
};
