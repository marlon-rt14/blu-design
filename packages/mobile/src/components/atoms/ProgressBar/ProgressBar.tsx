import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { AccessibilityInfo, Animated, Text, View } from 'react-native';

import type { IProgressBarProps } from './ProgressBar.types';
import { useProgressBar } from './useProgressBar';

/**
 * Native ProgressBar — how far along something with a beginning and an end is.
 *
 * **It informs; it is not a control.** No disabled, no pressed, no state axis:
 * *"la barra informa, no se toca"*.
 *
 * The role is real here too — `accessibilityRole="progressbar"` with
 * `accessibilityValue`, not a `View` with a width. And **nothing announces
 * every change**: a bar that speaks at each percent *"es inusable con
 * lector"*, so the value is exposed and never broadcast.
 *
 * ### The width is animated, and not with the native driver
 *
 * `useNativeDriver` cannot animate `width` — it only runs transforms and
 * opacity off the JS thread. A `scaleX` transform would run natively but
 * squash the pill's rounded end as it grows, so the width it is. With Reduce
 * Motion on, the fill jumps instead: *"con Reduce Motion el relleno salta en
 * vez de deslizarse"*.
 *
 * @example
 * ```tsx
 * <ProgressBar label="Subiendo el documento" value={upload} />
 * <ProgressBar label="Cupo usado" status="warning" value={82} />
 * ```
 */
export const ProgressBar = (props: IProgressBarProps): ReactElement => {
  const { label, showValue = true, testID } = props;
  const {
    trackStyle,
    fillStyle,
    headerStyle,
    labelStyle,
    valueStyle,
    clamped,
    percentage,
    hasHeader,
    labelVisible,
    durationMs,
  } = useProgressBar(props);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // `useState` with an initialiser rather than `useRef(...).current`: both
  // create the value once, but reading `.current` during render is what the
  // `react(refs)` rule flags — and the Spinner's four warnings are exactly
  // that. Same behaviour, no new noise.
  const [progress] = useState(() => new Animated.Value(clamped));

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
    if (prefersReducedMotion) {
      progress.setValue(clamped);
      return;
    }
    const animation = Animated.timing(progress, {
      duration: durationMs,
      toValue: clamped,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [clamped, durationMs, prefersReducedMotion, progress]);

  return (
    <View testID={testID}>
      {hasHeader ? (
        <View style={headerStyle}>
          {labelVisible ? (
            <Text numberOfLines={1} style={labelStyle}>
              {label}
            </Text>
          ) : null}
          {showValue ? <Text style={valueStyle}>{percentage}</Text> : null}
        </View>
      ) : null}
      <View
        // The name does not depend on the text being visible: hiding the
        // label hides pixels, not the bar's subject.
        accessibilityLabel={label}
        accessibilityRole="progressbar"
        accessibilityValue={{ max: 100, min: 0, now: Math.round(clamped) }}
        style={trackStyle}
      >
        <Animated.View
          style={[
            fillStyle,
            {
              width: progress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};
