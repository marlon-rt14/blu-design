import type { ReactElement } from 'react';
import { ScrollView, View } from 'react-native';

import { TabItem } from '../../atoms/TabItem';
import type { ITabsProps } from './Tabs.types';
import { useTabs } from './useTabs';

/**
 * React Native Tabs — the tab bar: 2–6 TabItems plus the bottom divider
 * the selected indicator sits on.
 *
 * `accessibilityRole="tablist"`. Scrollable uses a horizontal `ScrollView`;
 * fitted splits the width.
 *
 * **The selection is not marked tab by tab**: there is one `value` and each
 * tab compares its `key` against it. `TabItem` is rendered from here and is
 * not meant to be used on its own.
 *
 * Canvas width 375 is Figma's frame, not a code max-width. No TabPanel.
 *
 * @example
 * ```tsx
 * <Tabs
 *   onChange={setTab}
 *   tabs={[
 *     { key: 'movimientos', label: 'Movimientos' },
 *     { key: 'pendientes', label: 'Pendientes', badge: 9 },
 *   ]}
 *   value={tab}
 * />
 * ```
 */
export const Tabs = (props: ITabsProps): ReactElement => {
  const { tabs, value, onChange, layout = 'scrollable', size = 'lg', divider = true, testID } = props;
  const { rootStyle, listStyle, scrollViewStyle, scrollContentStyle, dividerStyle, isScrollable } =
    useTabs(props);

  const items = tabs.map((tab) => (
    <TabItem
      badge={tab.badge}
      disabled={tab.disabled}
      isSelected={tab.key === value}
      key={tab.key}
      label={tab.label}
      layout={layout}
      leadingIcon={tab.leadingIcon}
      onPress={() => onChange(tab.key)}
      size={size}
    />
  ));

  return (
    <View accessibilityRole="tablist" style={rootStyle} testID={testID}>
      {divider ? <View style={dividerStyle} /> : null}
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
