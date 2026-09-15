import { cardTokens } from '@dsm/shared';
import type { TTokensOf } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { ICardProps } from './Card.types';

/** Styles the Card needs to render. */
interface IUseCardResult {
  surfaceStyle: CSSProperties;
}

/**
 * Builds the two-layer `raised` shadow.
 *
 * Far first, near second, because CSS paints the first shadow on top — the same
 * order the Snackbar uses for the `overlay` ramp. Neither layer has an x offset
 * or a spread: there are no tokens for either, and none is drawn.
 */
const raisedShadow = (tokens: TTokensOf<typeof cardTokens>): string => {
  const { colors, dimension } = tokens;
  return [
    `0 ${dimension.raisedShadowFarY}px ${dimension.raisedShadowFarBlur}px ${colors.raisedShadowFar}`,
    `0 ${dimension.raisedShadowNearY}px ${dimension.raisedShadowNearBlur}px ${colors.raisedShadowNear}`,
  ].join(', ');
};

/**
 * Resolves the Card's surface style from the active theme and its two axes.
 *
 * There is no interaction state to track — the Card is not interactive — so
 * unlike the rest of the library this hook takes the props alone.
 *
 * @param params - The Card props.
 * @returns The resolved surface style.
 */
export const useCard = ({
  elevation = 'flat',
  padding = 'none',
}: ICardProps): IUseCardResult => {
  const mode = useThemeMode();
  const tokens = cardTokens[mode];
  const { colors, dimension } = tokens;
  const isRaised = elevation === 'raised';

  return {
    surfaceStyle: {
      boxSizing: 'border-box',
      backgroundColor: colors.surface,
      borderRadius: dimension.borderRadius,
      padding: dimension.padding[padding],
      // Figma's `clipsContent` is on: the radius clips whatever enters, whether
      // or not it brings a radius of its own. bDS's warning goes with it — if
      // the content already clips, do not stack two radii.
      //
      // Safe to combine with the shadow here: a CSS box-shadow is painted
      // outside the border box and is never clipped by the element's own
      // overflow. React Native is not so forgiving, hence the note there.
      overflow: 'hidden',
      // Bound on `raised` only, and invisible in both exported themes — see
      // `ICardColorTokens.raisedBorder`. It still occupies its width, which is
      // why a raised card is 2px wider than a flat one with the same content.
      border: isRaised
        ? `${dimension.raisedBorderWidth}px solid ${colors.raisedBorder}`
        : undefined,
      boxShadow: isRaised ? raisedShadow(tokens) : undefined,
    },
  };
};
