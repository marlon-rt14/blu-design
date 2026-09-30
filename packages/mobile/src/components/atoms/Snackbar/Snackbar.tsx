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

import { IconAlertCircle, IconAlertTriangle } from '../../../icons/alerts-feedback';
import { IconCheck, IconInfoCircle, IconXClose } from '../../../icons/general';
import type { TIconProps } from '../Icon';
import { LinkButton } from '../LinkButton';
import type { ISnackbarProps } from './Snackbar.types';
import { useSnackbar } from './useSnackbar';

const STATUS_ICON_COMPONENT: Record<TSnackbarStatusIcon, (props: TIconProps) => ReactElement> = {
  'alert-circle': IconAlertCircle,
  'alert-triangle': IconAlertTriangle,
  check: IconCheck,
  'info-circle': IconInfoCircle,
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

/** Accessible name of the close control. Not a prop — the firma has no label slot. */
const DISMISS_LABEL = 'Cerrar';

export const Snackbar = (props: ISnackbarProps): ReactElement | null => {
  const {
    status = 'info',
    message,
    showIcon = true,
    action,
    duration,
    paused = false,
    onDismiss,
    onExpire,
    testID,
  } = props;
  const [isClosed, setIsClosed] = useState(false);
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
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onDismissRef.current = onDismiss;
    onExpireRef.current = onExpire;
  });
  const close = (): void => {
    setIsClosed(true);
    onExpireRef.current?.();
    onDismissRef.current?.();
  };

  const remainingRef = useRef<number | null>(null);

  // Dwell starts on mount and does not restart when props change. `paused`
  // freezes whatever is left (SnackbarStack, while expanded).
  useEffect(() => {
    if (paused) {
      return;
    }
    const ms = remainingRef.current ?? resolveSnackbarDurationMs(duration, action != null);
    const started = Date.now();
    const id = setTimeout(close, ms);
    return () => {
      clearTimeout(id);
      remainingRef.current = Math.max(0, ms - (Date.now() - started));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dwell is mount-scoped; only pause toggles it
  }, [paused]);

  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          gesture.dy > swipeCapture && gesture.dy > Math.abs(gesture.dx),
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dy >= swipeThreshold) {
            close();
          }
        },
      }).panHandlers,
    [swipeCapture, swipeThreshold],
  );

  if (isClosed) {
    return null;
  }

  // One trailing slot. Action and the × never render together — Figma hides
  // whichever isn't the case (`102:12292` vs `102:12356`).
  const showDismiss = onDismiss != null && action == null;
  const showActions = action != null || showDismiss;

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
          {action ? (
            <LinkButton
              appearance="on-inverse"
              label={action.label}
              onPress={action.onPress}
              size="sm"
            />
          ) : null}
          {showDismiss ? (
            <Pressable
              accessibilityLabel={DISMISS_LABEL}
              accessibilityRole="button"
              hitSlop={dismissHitSlop}
              onBlur={() => setIsDismissFocused(false)}
              onFocus={() => setIsDismissFocused(true)}
              onPress={close}
              onPressIn={() => setIsDismissPressed(true)}
              onPressOut={() => setIsDismissPressed(false)}
              style={dismissHitStyle}
            >
              <View style={dismissVisualStyle}>
                <IconXClose color="inverse" size="sm" />
              </View>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
