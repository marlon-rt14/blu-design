import { tabsTokens } from '@dsm/shared';
import type { TTabsLayout } from '@dsm/shared';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { ITabsProps } from './Tabs.types';

interface IUseTabsResult {
  rootStyle: StyleProp<ViewStyle>;
  listStyle: StyleProp<ViewStyle>;
  scrollViewStyle: StyleProp<ViewStyle>;
  scrollContentStyle: StyleProp<ViewStyle>;
  dividerStyle: StyleProp<ViewStyle>;
  isScrollable: boolean;
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
 * Resolves the native Tabs bar styles. No interaction state — that belongs
 * to each TabItem. The divider sits behind the items.
 */
export const useTabs = ({ layout = 'scrollable' }: ITabsProps): IUseTabsResult => {
  const mode = useThemeMode();
  const tokens = tabsTokens[mode];
  const resolvedLayout = layoutOf(layout);

  const rootStyle: ViewStyle = {
    position: 'relative',
    width: '100%',
  };

  const listStyle: ViewStyle = {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: tokens.dimension.itemGap,
    paddingHorizontal: tokens.dimension.barPaddingX,
    width: '100%',
  };

  const scrollViewStyle: ViewStyle = {
    zIndex: 1,
    width: '100%',
  };

  const scrollContentStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: tokens.dimension.itemGap,
    paddingHorizontal: tokens.dimension.barPaddingX,
  };

  const dividerStyle: ViewStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: tokens.dimension.dividerWidth,
    backgroundColor: tokens.colors.surface.divider,
    zIndex: 0,
  };

  return {
    rootStyle,
    listStyle,
    scrollViewStyle,
    scrollContentStyle,
    dividerStyle,
    isScrollable: resolvedLayout === 'scrollable',
  };
};
