import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';

import {
  resolveSnackbarDurationMs,
  SNACKBAR_STATUS_ICON,
  type TIconColor,
  type TSnackbarStatus,
  type TSnackbarStatusIcon,
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

const STATUS_ICON_COMPONENT: Record<TSnackbarStatusIcon, (props: TIconProps) => ReactElement> = {
  'alert-circle': IconAlertCircle,
  'alert-triangle': IconAlertTriangle,
  'check-circle': IconCheckCircle,
  info: IconInfo,
};

const iconColorOf = (status: TSnackbarStatus): TIconColor => {
  switch (status) {
    case 'danger':
      return 'on-inverse.danger';
    case 'warning':
      return 'on-inverse.warning';
    case 'success':
      return 'on-inverse.success';
    case 'info':
      return 'on-inverse.info';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
};

const StatusGlyph = ({ status }: { status: TSnackbarStatus }): ReactElement => {
  const Glyph = STATUS_ICON_COMPONENT[SNACKBAR_STATUS_ICON[status]];
  return <Glyph color={iconColorOf(status)} size="md" />;
};

export const Snackbar = (props: ISnackbarProps): ReactElement => {
  const {
    status = 'info',
    message = 'Se guardó el cambio en tu tarjeta',
    showIcon = true,
    showAction = true,
    actionLabel = 'Deshacer',
    showDismiss = false,
    dismissAccessibilityLabel = 'Cerrar',
    duration,
    onAction,
    onDismiss,
    testID,
  } = props;
  const [isDismissPressed, setIsDismissPressed] = useState(false);
  const [isDismissFocused, setIsDismissFocused] = useState(false);
  const {
    rootStyle,
    contentStyle,
    iconBoxStyle,
    messageStyle,
    actionsStyle,
    dismissHitStyle,
    dismissVisualStyle,
    dismissHitSlop,
    liveRegion,
    swipeThreshold,
    swipeCapture,
  } = useSnackbar({ ...props, isDismissPressed, isDismissFocused });

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  // Timer starts on mount and does not restart (Figma: dwell from mount).
  useEffect(() => {
    const ms = resolveSnackbarDurationMs(duration, showAction);
    const id = setTimeout(() => onDismissRef.current?.(), ms);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only dwell
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

  const showActions = showAction || showDismiss;

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
            <StatusGlyph status={status} />
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
          {showDismiss ? (
            <Pressable
              accessibilityLabel={dismissAccessibilityLabel}
              accessibilityRole="button"
              hitSlop={dismissHitSlop}
              onBlur={() => setIsDismissFocused(false)}
              onFocus={() => setIsDismissFocused(true)}
              onPress={onDismiss}
              onPressIn={() => setIsDismissPressed(true)}
              onPressOut={() => setIsDismissPressed(false)}
              style={dismissHitStyle}
            >
              <View style={dismissVisualStyle}>
                <IconX color="inverse" size="sm" />
              </View>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
