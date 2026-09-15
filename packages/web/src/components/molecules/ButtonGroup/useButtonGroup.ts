import { buttonGroupTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { IButtonGroupProps } from './ButtonGroup.types';

interface IUseButtonGroupResult {
  rootStyle: CSSProperties;
}

/**
 * Resolves the flex/grid shell for ButtonGroup.
 *
 * `distribution="fill"` uses CSS grid with equal `1fr` tracks so each Button
 * stretches to the same width without cloning children or teaching Button a
 * `style` prop (Dev: *"flex: 1 en cada hijo"* / equal parts).
 */
export const useButtonGroup = ({
  orientation = 'horizontal',
  distribution = 'hug',
}: IButtonGroupProps): IUseButtonGroupResult => {
  const mode = useThemeMode();
  const tokens = buttonGroupTokens[mode];
  const isHorizontal = orientation === 'horizontal';
  const isFill = distribution === 'fill';

  const rootStyle: CSSProperties = isHorizontal
    ? {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: isFill ? '1fr' : 'max-content',
        // Stretch so fill children share one row height (Button's fixed height).
        alignItems: 'stretch',
        justifyContent: 'start',
        gap: tokens.dimension.gapInline,
        width: isFill ? '100%' : 'max-content',
        // Never wrap mid-label — host should switch to vertical (Dev).
        gridTemplateRows: 'auto',
      }
    : {
        display: 'grid',
        gridAutoFlow: 'row',
        gridAutoRows: 'auto',
        justifyItems: 'stretch',
        gap: tokens.dimension.gapStack,
        width: isFill ? '100%' : 'max-content',
      };

  return { rootStyle };
};
