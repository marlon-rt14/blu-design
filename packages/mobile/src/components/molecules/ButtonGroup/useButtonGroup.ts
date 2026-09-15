import { buttonGroupTokens } from '@dsm/shared';
import type { ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IButtonGroupProps } from './ButtonGroup.types';

interface IUseButtonGroupResult {
  rootStyle: ViewStyle;
  /** Applied onto each child when `distribution="fill"`. */
  itemStyle: ViewStyle | undefined;
}

/**
 * Resolves the RN flex shell for ButtonGroup.
 *
 * `distribution="fill"` puts `flex: 1` on each child (Dev §05). Vertical
 * stretches via `alignItems: 'stretch'` so hug still equalises to the widest.
 */
export const useButtonGroup = ({
  orientation = 'horizontal',
  distribution = 'hug',
}: IButtonGroupProps): IUseButtonGroupResult => {
  const mode = useThemeMode();
  const tokens = buttonGroupTokens[mode];
  const isHorizontal = orientation === 'horizontal';
  const isFill = distribution === 'fill';

  const rootStyle: ViewStyle = {
    flexDirection: isHorizontal ? 'row' : 'column',
    alignItems: isHorizontal ? 'center' : 'stretch',
    gap: isHorizontal ? tokens.dimension.gapInline : tokens.dimension.gapStack,
    alignSelf: isFill ? 'stretch' : 'flex-start',
    width: isFill ? '100%' : undefined,
    flexWrap: 'nowrap',
  };

  const itemStyle: ViewStyle | undefined = isFill
    ? {
        flex: 1,
        minWidth: 0,
        // Vertical fill: stretch across the group width (same as Figma `w-full`).
        alignSelf: 'stretch',
        ...(isHorizontal ? {} : { width: '100%' as const }),
      }
    : undefined;

  return { rootStyle, itemStyle };
};
