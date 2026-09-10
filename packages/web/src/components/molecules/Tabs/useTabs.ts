import { tabsTokens } from '@dsm/shared';
import type { TTabsLayout } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { ITabsProps } from './Tabs.types';

interface IUseTabsResult {
  rootStyle: CSSProperties;
  listStyle: CSSProperties;
  dividerStyle: CSSProperties;
}

const layoutOf = (layout: TTabsLayout): TTabsLayout => {
  switch (layout) {
    case 'scrollable':
    case 'fitted':
      return layout;
    default: {
      const _exhaustive: never = layout;
      return _exhaustive;
    }
  }
};

/**
 * Resolves the Tabs bar styles. No interaction state — that belongs to each
 * TabItem. The divider sits behind the items; scrollable overflows on X
 * only (do not set `overflow: hidden` — it would clip the focus ring).
 */
export const useTabs = ({
  layout = 'scrollable',
}: ITabsProps): IUseTabsResult => {
  const mode = useThemeMode();
  const tokens = tabsTokens[mode];
  const resolvedLayout = layoutOf(layout);

  const rootStyle: CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
  };

  const listStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: tokens.dimension.itemGap,
    paddingInline: tokens.dimension.barPaddingX,
    width: '100%',
    boxSizing: 'border-box',
    overflowX: resolvedLayout === 'scrollable' ? 'auto' : 'visible',
    overflowY: 'visible',
  };

  const dividerStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: tokens.dimension.dividerWidth,
    backgroundColor: tokens.colors.surface.divider,
    pointerEvents: 'none',
    zIndex: 0,
  };

  return { rootStyle, listStyle, dividerStyle };
};
