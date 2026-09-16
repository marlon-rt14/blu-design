import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import type { ViewStyle } from 'react-native';

import type { ISkeletonProps } from './Skeleton.types';
import { useSkeleton } from './useSkeleton';

const IS_WEB = Platform.OS === 'web';

/**
 * RN-web StyleSheet extension — injects `@keyframes` for the sheen sweep.
 * Ignored on native (Animated path).
 */
const webSheenBase = StyleSheet.create({
  sheen: {
    animationKeyframes: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(400%)' },
    },
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  } as ViewStyle,
});

/**
 * Mobile Skeleton — loading placeholder that reserves content footprint.
 *
 * Native: `Animated` translateX loop on the sheen band. Web (Storybook /
 * RN-web): StyleSheet `animationKeyframes` — same pattern as Spinner.
 * Reduced motion freezes the band. Shapes are hidden from a11y; the wrapper
 * announces once.
 *
 * @example
 * ```tsx
 * <Skeleton />
 * <Skeleton shape="circle" size="lg" />
 * ```
 */
export const Skeleton = (props: ISkeletonProps): ReactElement => {
  const { testID } = props;
  const {
    bones,
    stackStyle,
    label,
    sheenWidthRatio,
    sheenDurationMs,
    highlight,
  } = useSkeleton(props);

  const progress = useRef(new Animated.Value(0)).current;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [boneWidth, setBoneWidth] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) {
        setPrefersReducedMotion(enabled);
      }
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setPrefersReducedMotion,
    );
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (IS_WEB || prefersReducedMotion || boneWidth <= 0) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: sheenDurationMs,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    progress.setValue(0);
    loop.start();
    return () => {
      loop.stop();
    };
  }, [prefersReducedMotion, progress, sheenDurationMs, sheenWidthRatio, boneWidth]);

  const nativeSheenStyle = {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    width: `${sheenWidthRatio * 100}%` as `${number}%`,
    backgroundColor: highlight,
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-boneWidth * sheenWidthRatio, boneWidth],
        }),
      },
    ],
  };

  const webSheenStyle = [
    webSheenBase.sheen,
    {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      left: 0,
      width: `${sheenWidthRatio * 100}%`,
      backgroundColor: highlight,
      ...(prefersReducedMotion
        ? { opacity: 0 }
        : { animationDuration: `${sheenDurationMs}ms` }),
    },
  ];

  return (
    <View
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      accessible
      style={stackStyle}
      testID={testID}
    >
      {bones.map((bone, index) => (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          key={index}
          onLayout={(event) => {
            const next = event.nativeEvent.layout.width;
            if (next > 0 && next !== boneWidth) {
              setBoneWidth(next);
            }
          }}
          style={bone.root}
        >
          {IS_WEB ? (
            <View style={webSheenStyle as ViewStyle[]} />
          ) : prefersReducedMotion ? null : (
            <Animated.View style={nativeSheenStyle} />
          )}
        </View>
      ))}
    </View>
  );
};
