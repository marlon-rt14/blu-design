import { ICON_VIEW_BOX, iconTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { IIconProps } from './Icon.types';

/** Styles and derived values the Icon needs to render. */
interface IUseIconResult {
  /** Style of the `<svg>`, which is itself the box. */
  svgStyle: CSSProperties;
  /** Edge length in pixels, from `size/icon/*`. Both width and height. */
  edge: number;
  /** Resolved colour — `'currentColor'` unless a role was given. */
  color: string;
  /** The grid every bDS glyph is drawn on. Never varies. */
  viewBox: string;
}

/**
 * Resolves the Icon's box and colour from the active theme (`useThemeMode()`)
 * and its props.
 *
 * Simpler than the other hooks in this package: an Icon has no interaction state
 * at all. It has no states in Figma either — whatever host it sits in owns hover,
 * press and disabled, and communicates them by changing the colour it lends.
 *
 * @param props - The Icon props.
 * @returns The style, the edge length, the resolved colour and the viewBox.
 */
export const useIcon = ({ size = 'sm', color }: IIconProps): IUseIconResult => {
  const mode = useThemeMode();
  const tokens = iconTokens[mode];
  const edge = tokens.dimension.size[size];

  // `currentColor` rather than a resolved default: with no role, the glyph is
  // meant to take the colour of whatever contains it. This is the entire reason
  // an icon inside a Button needs no colour prop to match the label.
  const resolvedColor = color === undefined ? 'currentColor' : tokens.colors[color];

  const svgStyle: CSSProperties = {
    // The `<svg>` is the box, so it carries the box's rules. `inline-block` plus
    // `verticalAlign` puts it on the text row next to a label; a bare `<svg>` is
    // `inline` and would drag the line box down by the font's descender.
    display: 'inline-block',
    verticalAlign: 'middle',

    // Barred from flexing: an icon squeezed by a tight flex parent would
    // silently stop matching its token, which is the code equivalent of
    // resizing the instance in Figma.
    flexShrink: 0,
    flexGrow: 0,

    // Set alongside the `fill` attribute so a child that writes
    // `fill="currentColor"` or `stroke="currentColor"` in its own markup
    // resolves too, not only one that inherits.
    color: resolvedColor,

    // The glyph is artwork; it should never intercept a click meant for the
    // control around it.
    pointerEvents: 'none',
  };

  return { svgStyle, edge, color: resolvedColor, viewBox: ICON_VIEW_BOX };
};
