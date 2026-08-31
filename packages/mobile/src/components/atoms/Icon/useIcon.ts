import { ICON_VIEW_BOX, iconTokens } from '@dsm/shared';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IIconProps } from './Icon.types';

/** Styles and derived values the Icon needs to render. */
interface IUseIconResult {
  /** The box: a fixed square that never flexes. */
  boxStyle: StyleProp<ViewStyle>;
  /** Edge length in pixels, from `size/icon/*`. Both width and height. */
  edge: number;
  /** Resolved colour. Never `'currentColor'` — see {@link useIcon}. */
  color: string;
  /** The grid every bDS glyph is drawn on. Never varies. */
  viewBox: string;
}

/**
 * Resolves the Icon's box and colour from the active theme and its props.
 *
 * Simpler than the other hooks in this package: an Icon has no interaction state
 * at all, and none in Figma either — whatever host it sits in owns hover, press
 * and disabled, and communicates them through the colour it lends.
 *
 * The one real difference from web is the colour fallback. Web resolves an unset
 * `color` to `currentColor` and lets the container tint the drawing; React Native
 * has no such keyword and no cascade, so there is nothing to inherit *from*.
 * The chain here is `tintColor` → `color` → `color/icon/primary`, and that last
 * step is not an invention: it is the value all six Figma variants render.
 *
 * @param props - The Icon props.
 * @returns The box style, the edge length, the resolved colour and the viewBox.
 */
export const useIcon = ({ size = 'sm', color, tintColor }: IIconProps): IUseIconResult => {
  const mode = useThemeMode();
  const tokens = iconTokens[mode];
  const edge = tokens.dimension.size[size];

  const resolvedColor =
    tintColor ?? (color === undefined ? tokens.colors.primary : tokens.colors[color]);

  // `flexShrink: 0` is React Native's default already, but stating it keeps the
  // guarantee visible next to the dimensions it protects: an icon squeezed by a
  // tight flex row would silently stop matching its token, which is the code
  // equivalent of resizing the instance in Figma.
  const boxStyle: StyleProp<ViewStyle> = {
    width: edge,
    height: edge,
    flexShrink: 0,
    flexGrow: 0,
  };

  return { boxStyle, edge, color: resolvedColor, viewBox: ICON_VIEW_BOX };
};
