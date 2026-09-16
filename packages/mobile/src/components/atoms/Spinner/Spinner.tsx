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
import Svg, { Path } from 'react-native-svg';

import {
  SPINNER_INDICATOR_PATH,
  SPINNER_TRACK_PATH,
  SPINNER_VIEWBOX,
} from '@dsm/shared';

import type { ISpinnerProps } from './Spinner.types';
import { useSpinner } from './useSpinner';

const IS_WEB = Platform.OS === 'web';

/**
 * RN-web StyleSheet extension — injects `@keyframes` and sets `animation-name`.
 * Ignored on native (we never apply this style there).
 */
const webSpinBase = StyleSheet.create({
  spin: {
    animationKeyframes: {
      to: { transform: 'rotate(360deg)' },
    },
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  } as ViewStyle,
});

/**
 * Mobile Spinner — indeterminate loading arc.
 *
 * Same SVG paths as web / Figma. On native: `Animated` + `useNativeDriver`.
 * On web (Storybook via react-native-web): StyleSheet `animationKeyframes` —
 * RN-web's `Animated` transform does not reliably rotate `react-native-svg`
 * children.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner appearance="on-brand" size="lg" label="Enviando" />
 * ```
 */
export const Spinner = (props: ISpinnerProps): ReactElement => {
  const { testID } = props;
  const { rootStyle, trackFill, indicatorFill, edge, label, rotationDurationMs } =
    useSpinner(props);
  const rotation = useRef(new Animated.Value(0)).current;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
    if (IS_WEB || prefersReducedMotion) {
      rotation.stopAnimation();
      rotation.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: rotationDurationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [prefersReducedMotion, rotation, rotationDurationMs]);

  const mark = (
    <Svg fill="none" height={edge} viewBox={SPINNER_VIEWBOX} width={edge}>
      <Path d={SPINNER_TRACK_PATH} fill={trackFill} />
      <Path d={SPINNER_INDICATOR_PATH} fill={indicatorFill} />
    </Svg>
  );

  const webSpinStyle: ViewStyle[] | undefined =
    IS_WEB && !prefersReducedMotion
      ? [
          webSpinBase.spin,
          {
            width: edge,
            height: edge,
            // RN-web accepts this long-form next to animationKeyframes.
            animationDuration: `${rotationDurationMs}ms`,
          } as ViewStyle,
        ]
      : undefined;

  const nativeSpinStyle = {
    width: edge,
    height: edge,
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      style={rootStyle}
      testID={testID}
    >
      {IS_WEB ? (
        <View style={webSpinStyle ?? { width: edge, height: edge }}>{mark}</View>
      ) : (
        <Animated.View style={nativeSpinStyle}>{mark}</Animated.View>
      )}
    </View>
  );
};
