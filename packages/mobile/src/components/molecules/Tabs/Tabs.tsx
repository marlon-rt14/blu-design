import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { ScrollView, View } from 'react-native';

import type { ITabItemProps } from '../../atoms/TabItem';
import type { ITabsProps } from './Tabs.types';
import { useTabs } from './useTabs';

/**
 * React Native Tabs — the tab bar: 2–6 TabItems plus the bottom divider
 * the selected indicator sits on.
 *
 * `accessibilityRole="tablist"`. `showItem3`–`showItem6` are not an API —
 * pass children. `showDivider` is an independent boolean, default `true`.
 * Scrollable uses a horizontal `ScrollView`; fitted splits the width.
 * Canvas width 375 is Figma's frame, not a code max-width. No TabPanel.
 *
 * @example
 * ```tsx
 * <Tabs>
 *   <TabItem isSelected={tab === 'one'} label="Tab 1" onPress={() => setTab('one')} />
 *   <TabItem label="Tab 2" onPress={() => setTab('two')} />
 *   <TabItem label="Tab 3" onPress={() => setTab('three')} />
 * </Tabs>
 * ```
 */
export const Tabs = (props: ITabsProps): ReactElement => {
  const { children, layout = 'scrollable', size = 'lg', showDivider = true, testID } = props;
  const { rootStyle, listStyle, scrollViewStyle, scrollContentStyle, dividerStyle, isScrollable } =
    useTabs(props);

  const items = Children.map(children, (child) => {
    if (!isValidElement<ITabItemProps>(child)) return child;
    return cloneElement(child, {
      layout: child.props.layout ?? layout,
      size: child.props.size ?? size,
    });
  });

  return (
    <View accessibilityRole="tablist" style={rootStyle} testID={testID}>
      {showDivider ? <View style={dividerStyle} /> : null}
      {isScrollable ? (
        <ScrollView
          contentContainerStyle={scrollContentStyle}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={scrollViewStyle}
        >
          {items}
        </ScrollView>
      ) : (
        <View style={listStyle}>{items}</View>
      )}
    </View>
  );
};
