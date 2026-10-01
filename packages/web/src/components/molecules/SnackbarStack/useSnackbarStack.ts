import { snackbarTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';

/** Layout of one bar in the pile. `distance` is how many bars sit in front of it. */
export interface ISnackbarStackSlot {
  /** Collapsed peek. The front bar and every bar while open are `false`. */
  isPeek: boolean;
  style: CSSProperties;
}

interface IUseSnackbarStackResult {
  rootStyle: CSSProperties;
  /** `space/stack/sm` — peek height when collapsed, gap when open. */
  gap: number;
  slot: (distance: number, open: boolean) => ISnackbarStackSlot;
}

/**
 * Collapsed peeks clip a real Snackbar to `space/stack/sm` and step the
 * inset and the behind opacity by how far back the bar sits.
 */
export const useSnackbarStack = (): IUseSnackbarStackResult => {
  const { stackPeek, stackInset, stackBehind1, stackBehind2, maxWidth } =
    snackbarTokens[useThemeMode()].dimension;

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    maxWidth,
    alignSelf: 'center',
  };

  const slot = (distance: number, open: boolean): ISnackbarStackSlot => {
    const isPeek = !open && distance > 0;
    const opacity = distance >= 2 ? stackBehind2 : stackBehind1;

    const style: CSSProperties = isPeek
      ? {
          height: stackPeek,
          overflow: 'hidden',
          paddingLeft: distance * stackInset,
          paddingRight: distance * stackInset,
          opacity,
          pointerEvents: 'none',
        }
      : {};

    return { isPeek, style };
  };

  return { rootStyle, gap: stackPeek, slot };
};
