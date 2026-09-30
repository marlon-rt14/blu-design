import { cloneElement, isValidElement, useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, Text, View } from 'react-native';
import type { TextStyle } from 'react-native';

import { IconChevronDown } from '../../../icons';
import type { TIconProps } from '../Icon';
import type { IAccordionItemProps } from './AccordionItem.types';
import { useAccordionItem } from './useAccordionItem';

/** Same `tintColor` escape hatch `Callout`'s mobile icon already uses — no `currentColor` in RN. */
const tintedIcon = (icon: ReactNode, tintColor: string): ReactNode =>
  isValidElement<TIconProps>(icon) ? cloneElement(icon, { tintColor }) : icon;

/** RN can't render a bare string inside a `View` — only a real string gets the panel's default text style. */
const renderContent = (children: ReactNode, contentStyle: TextStyle): ReactNode =>
  typeof children === 'string' ? <Text style={contentStyle}>{children}</Text> : children;

/**
 * React Native AccordionItem — one section's header (title, optional icon,
 * chevron) plus its content panel.
 *
 * **`isExpanded`/`onToggle` are not props an app sets directly** when this
 * lives inside an `Accordion` — the parent injects them. Rendered on its
 * own, it manages nothing and just reflects whatever `isExpanded` was
 * passed.
 *
 * The panel mounts/unmounts with `isExpanded` rather than animating a
 * measured height — `Accordion`'s own `useAccordion` calls
 * `LayoutAnimation.configureNext` right before the state flip that causes
 * this, which is what animates the resulting height change.
 */
export const AccordionItem = (props: IAccordionItemProps): ReactElement => {
  const { title, icon, disabled = false, isExpanded = false, onToggle, showDivider = false, testID, children } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [rotation] = useState(() => new Animated.Value(isExpanded ? 1 : 0));

  const {
    rootStyle,
    headerStyle,
    iconWrapperStyle,
    iconColor,
    titleStyle,
    chevronColor,
    panelStyle,
    contentStyle,
  } = useAccordionItem({ ...props, isPressed, showDivider });

  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) setPrefersReducedMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setPrefersReducedMotion);
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const toValue = isExpanded ? 1 : 0;
    if (prefersReducedMotion) {
      rotation.setValue(toValue);
      return;
    }
    const animation = Animated.timing(rotation, { duration: 200, toValue, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [isExpanded, prefersReducedMotion, rotation]);

  const chevronRotation = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={rootStyle} testID={testID}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: isExpanded }}
        disabled={disabled}
        onPress={onToggle}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={headerStyle}
      >
        {icon ? <View style={iconWrapperStyle}>{tintedIcon(icon, iconColor)}</View> : null}
        <Text style={titleStyle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <IconChevronDown size="md" tintColor={chevronColor} />
        </Animated.View>
      </Pressable>
      {isExpanded ? <View style={panelStyle}>{renderContent(children, contentStyle as TextStyle)}</View> : null}
    </View>
  );
};
