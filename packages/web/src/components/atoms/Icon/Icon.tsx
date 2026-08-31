import type { ReactElement } from 'react';

import type { IIconProps } from './Icon.types';
import { useIcon } from './useIcon';

/**
 * Temporary Icon atom. Ships a single `name="icon"` glyph — Figma's
 * `icon/placeholder` even-odd path — until the real Icon set lands.
 *
 * Size follows `dimension.size.icon.*`. Color defaults to
 * `color.color.icon.primary`; pass `color` to override (TextField does,
 * with `color.component.textfield.icon.*`).
 *
 * @example
 * ```tsx
 * <Icon />
 * <Icon name="icon" size="sm" />
 * <Icon color={tokens.colors.icon.default} />
 * ```
 */
export const Icon = ({ name = 'icon', size = 'md', color, testID }: IIconProps): ReactElement => {
  const { sizePx, fill, path, wrapperStyle } = useIcon({ name, size, color });

  return (
    <span aria-hidden data-testid={testID} style={wrapperStyle}>
      <svg fill="none" height={sizePx} viewBox="0 0 24 24" width={sizePx} xmlns="http://www.w3.org/2000/svg">
        <path d={path} fill={fill} fillRule="evenodd" />
      </svg>
    </span>
  );
};
