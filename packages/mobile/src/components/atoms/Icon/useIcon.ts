import { iconTokens, ICON_PLACEHOLDER_PATH } from '@dsm/shared';
import type { TIconName } from '@dsm/shared';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IIconProps } from './Icon.types';

/** Styles and derived values the Icon needs to render. */
interface IUseIconResult {
  sizePx: number;
  fill: string;
  path: string;
  wrapperStyle: StyleProp<ViewStyle>;
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
 * stub has no hover/focus/disabled of its own.
 */
export const useIcon = ({ name = 'icon', size = 'md', color }: IIconProps): IUseIconResult => {
  const mode = useThemeMode();
  const tokens = iconTokens[mode];
  const sizePx = tokens.size[size];
  const fill = color ?? tokens.colors.primary;

  return {
    sizePx,
    fill,
    path: pathForName(name),
    wrapperStyle: {
      width: sizePx,
      height: sizePx,
      flexShrink: 0,
    },
  };
};
