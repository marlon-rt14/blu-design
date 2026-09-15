import { cardTokens } from '@dsm/shared';
import type { TTokensOf } from '@dsm/shared';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { ICardProps } from './Card.types';

/** Styles the Card needs to render. */
interface IUseCardResult {
  /**
   * The outer view: background, radius, border and shadow. It does **not**
   * clip — see {@link IUseCardResult.clipStyle}.
   */
  surfaceStyle: StyleProp<ViewStyle>;
  /**
   * The inner view: the radius again, the padding, and the clipping.
   *
   * The split exists because of React Native, not design. A single view that
   * both casts a shadow and sets `overflow: 'hidden'` is the classic way to lose
   * the shadow on iOS, where clipping to the bounds takes the shadow with it.
   * CSS has no such conflict, which is why the web Card is one element.
   */
  clipStyle: StyleProp<ViewStyle>;
}

/**
 * Builds the two-layer `raised` shadow.
 *
 * Far first, near second, because the first layer paints on top — the same order
 * and the same string syntax the Snackbar uses for the `overlay` ramp. React
 * Native takes CSS `boxShadow` from 0.76 on the New Architecture. Neither layer
 * has an x offset or a spread: there are no tokens for either.
 */
const raisedShadow = (tokens: TTokensOf<typeof cardTokens>): string => {
  const { colors, dimension } = tokens;
  return [
    `0 ${dimension.raisedShadowFarY}px ${dimension.raisedShadowFarBlur}px ${colors.raisedShadowFar}`,
    `0 ${dimension.raisedShadowNearY}px ${dimension.raisedShadowNearBlur}px ${colors.raisedShadowNear}`,
  ].join(', ');
};

/**
 * Resolves the Card's styles from the active theme and its two axes.
 *
 * There is no interaction state to track — the Card is not interactive — so
 * unlike the rest of the library this hook takes the props alone.
 *
 * @param params - The Card props.
 * @returns The outer surface style and the inner clipping style.
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
      backgroundColor: colors.surface,
      borderRadius: dimension.borderRadius,
      // Bound on `raised` only, and invisible in both exported themes — see
      // `ICardColorTokens.raisedBorder`. It still occupies its width, which is
      // why a raised card is 2px wider than a flat one with the same content.
      ...(isRaised
        ? {
            borderWidth: dimension.raisedBorderWidth,
            borderColor: colors.raisedBorder,
            boxShadow: raisedShadow(tokens),
          }
        : null),
    },
    clipStyle: {
      // The radius is repeated here because this is the view that clips, and it
      // sits inside the outer one's border.
      borderRadius: dimension.borderRadius,
      padding: dimension.padding[padding],
      overflow: 'hidden',
    },
  };
};
