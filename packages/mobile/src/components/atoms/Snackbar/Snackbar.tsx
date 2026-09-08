import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';

import {
  SNACKBAR_DURATION_MS,
  SNACKBAR_TONE_ICON,
  type TIconColor,
  type TSnackbarTone,
  type TSnackbarToneIcon,
} from '@dsm/shared';

import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheckCircle,
  IconInfo,
  IconX,
} from '../../../icons';
import type { TIconProps } from '../Icon';
import { LinkButton } from '../LinkButton';
import type { ISnackbarProps } from './Snackbar.types';
import { useSnackbar } from './useSnackbar';

const TONE_ICON_COMPONENT: Record<TSnackbarToneIcon, (props: TIconProps) => ReactElement> = {
  'alert-circle': IconAlertCircle,
  'alert-triangle': IconAlertTriangle,
  'check-circle': IconCheckCircle,
  info: IconInfo,
};

const iconColorOf = (tone: TSnackbarTone): TIconColor => {
  switch (tone) {
    case 'danger':
      return 'on-inverse.danger';
    case 'warning':
      return 'on-inverse.warning';
    case 'success':
      return 'on-inverse.success';
    case 'info':
      return 'on-inverse.info';
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
};

const ToneGlyph = ({ tone }: { tone: TSnackbarTone }): ReactElement => {
  const Glyph = TONE_ICON_COMPONENT[SNACKBAR_TONE_ICON[tone]];
  return <Glyph color={iconColorOf(tone)} size="md" />;
};

export const Snackbar = (props: ISnackbarProps): ReactElement => {
  const {
    tone = 'info',
    message = 'Se guardó el cambio en tu tarjeta',
    showIcon = true,
    showAction = true,
    actionLabel = 'Deshacer',
    showClose = false,
    closeAccessibilityLabel = 'Cerrar',
    onAction,
    onDismiss,
    testID,
  } = props;
  const [isClosePressed, setIsClosePressed] = useState(false);
  const [isCloseFocused, setIsCloseFocused] = useState(false);
  const {
    rootStyle,
    contentStyle,
    iconBoxStyle,
    messageStyle,
    actionsStyle,
    closeHitStyle,
    closeVisualStyle,
    closeHitSlop,
    liveRegion,
    swipeThreshold,
    swipeCapture,
  } = useSnackbar({ ...props, isClosePressed, isCloseFocused });

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  useEffect(() => {
    const id = setTimeout(() => onDismissRef.current?.(), SNACKBAR_DURATION_MS);
    return () => clearTimeout(id);
  }, []);

  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          gesture.dy > swipeCapture && gesture.dy > Math.abs(gesture.dx),
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dy >= swipeThreshold) {
            onDismiss?.();
          }
        },
      }).panHandlers,
    [onDismiss, swipeCapture, swipeThreshold],
  );

  const showActions = showAction || showClose;

  return (
    <View
      accessibilityLiveRegion={liveRegion}
      accessibilityRole="none"
      style={rootStyle}
      testID={testID}
      {...panHandlers}
    >
      <View style={contentStyle}>
        {showIcon ? (
          <View importantForAccessibility="no-hide-descendants" style={iconBoxStyle}>
            <ToneGlyph tone={tone} />
          </View>
        ) : null}
        <Text numberOfLines={2} style={messageStyle}>
          {message}
        </Text>
      </View>
      {showActions ? (
        <View style={actionsStyle}>
          {showAction ? (
            <LinkButton
              appearance="on-inverse"
              label={actionLabel}
              onPress={onAction}
              size="sm"
            />
          ) : null}
          {showClose ? (
            <Pressable
              accessibilityLabel={closeAccessibilityLabel}
              accessibilityRole="button"
              hitSlop={closeHitSlop}
              onBlur={() => setIsCloseFocused(false)}
              onFocus={() => setIsCloseFocused(true)}
              onPress={onDismiss}
              onPressIn={() => setIsClosePressed(true)}
              onPressOut={() => setIsClosePressed(false)}
              style={closeHitStyle}
            >
              <View style={closeVisualStyle}>
                <IconX color="inverse" size="sm" />
              </View>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
