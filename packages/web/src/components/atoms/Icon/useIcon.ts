import { iconTokens, ICON_PLACEHOLDER_PATH } from '@dsm/shared';
import type { TIconName } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { IIconProps } from './Icon.types';

/** Styles and derived values the Icon needs to render. */
interface IUseIconResult {
  /** Pixel box of the SVG. */
  sizePx: number;
  /** Fill color — `color` prop, or `color.color.icon.primary`. */
  fill: string;
  /** Even-odd path for the current `name`. */
  path: string;
  wrapperStyle: CSSProperties;
}

/**
 * Resolves the stub glyph path. Exhaustive so a future `TIconName` member
 * fails the build until a path is added.
 */
const pathForName = (name: TIconName): string => {
  switch (name) {
    case 'icon':
      return ICON_PLACEHOLDER_PATH;
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
};

/**
 * Resolves size and fill from the active theme. Tiny on purpose — the
 * stub has no hover/focus/disabled of its own (disabled color is a
 * consumer concern, e.g. TextField passing `icon-disabled`).
 */
export const useIcon = ({
  name = 'icon',
  size = 'md',
  color,
}: IIconProps): IUseIconResult => {
  const mode = useThemeMode();
  const tokens = iconTokens[mode];
  const sizePx = tokens.size[size];
  const fill = color ?? tokens.colors.primary;

  return {
    sizePx,
    fill,
    path: pathForName(name),
    wrapperStyle: {
      display: 'inline-flex',
      flexShrink: 0,
      width: sizePx,
      height: sizePx,
      lineHeight: 0,
    },
  };
};
