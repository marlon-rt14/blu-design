import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { TabIcon } from './TabIcon';
import { tabItemStyles } from './TabItem.styles';
import type { ITabItemProps } from './TabItem.types';
import { useTabItem } from './useTabItem';

/**
 * React Native TabItem — one option in a Tabs bar.
 *
 * The `Pressable` is the whole tab. `accessibilityRole="tab"` plus
 * `accessibilityState.selected` is what VoiceOver and TalkBack announce —
 * there is no native tab element to inherit that from. No hover. Pressed
 * still paints the overlay. ExtraBold at every state; colour carries
 * inactive vs active.
 *
 * `showLeadingIcon` and `showBadge` are independent booleans. Glyph default
 * is `user`. Badge is painted locally (Badge is not shipped).
 *
 * @example
 * ```tsx
 * <TabItem isSelected={tab === 'one'} label="Tab 1" onPress={() => setTab('one')} />
 * ```
 */
export const TabItem = (props: ITabItemProps): ReactElement => {
  const {
    label = 'Label',
    isSelected = false,
    showLeadingIcon = false,
    leadingIcon = 'user',
    showBadge = false,
    badge = '9',
    onPress,
    testID,
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const {
    rootStyle,
    overlayStyle,
    labelRowStyle,
    badgeStyle,
    labelStyle,
    badgeLabelStyle,
    indicatorStyle,
    iconColor,
    hitSlop,
    isDisabled,
  } = useTabItem({ ...props, isPressed, measuredWidth });

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={hitSlop}
      onLayout={(event) => setMeasuredWidth(event.nativeEvent.layout.width)}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[tabItemStyles.root, rootStyle]}
      testID={testID}
    >
      {overlayStyle ? <View style={[tabItemStyles.overlay, overlayStyle]} /> : null}
      <View style={tabItemStyles.content}>
        <View style={[tabItemStyles.labelRow, labelRowStyle]}>
          {showLeadingIcon ? (
            <View style={tabItemStyles.icon}>
              <TabIcon name={leadingIcon} size="sm" tintColor={iconColor} />
            </View>
          ) : null}
          <Text style={labelStyle}>{label}</Text>
          {showBadge ? (
            <View style={[tabItemStyles.badge, badgeStyle]}>
              <Text style={badgeLabelStyle}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {indicatorStyle ? <View style={[tabItemStyles.indicator, indicatorStyle]} /> : null}
      </View>
    </Pressable>
  );
};
