import { useEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent, ReactElement } from 'react';

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
    onFocus,
    onBlur,
    testID,
  } = props;
  const [isDismissHovered, setIsDismissHovered] = useState(false);
  const [isDismissPressed, setIsDismissPressed] = useState(false);
  const [isDismissFocusVisible, setIsDismissFocusVisible] = useState(false);
  const {
    rootStyle,
    contentStyle,
    iconBoxStyle,
    messageStyle,
    actionsStyle,
    dismissHitStyle,
    dismissVisualStyle,
    live,
    swipeThreshold,
  } = useSnackbar({
    ...props,
    isDismissHovered,
    isDismissPressed,
    isDismissFocusVisible,
  });

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  // Timer starts on mount and does not restart (Figma: dwell from mount).
  useEffect(() => {
    const ms = resolveSnackbarDurationMs(duration, showAction);
    const id = window.setTimeout(() => onDismissRef.current?.(), ms);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only dwell
  }, []);

  const swipeStartY = useRef<number | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    swipeStartY.current = event.clientY;
  };
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>): void => {
    const startY = swipeStartY.current;
    swipeStartY.current = null;
    if (startY === null) {
      return;
    }
    if (event.clientY - startY >= swipeThreshold) {
      onDismiss?.();
    }
  };

  const handleDismissFocus = (event: FocusEvent<HTMLButtonElement>): void => {
    setIsDismissFocusVisible(event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  };
  const handleDismissBlur = (event: FocusEvent<HTMLButtonElement>): void => {
    setIsDismissFocusVisible(false);
    onBlur?.(event);
  };

  const showActions = showAction || showDismiss;

  return (
    <div
      aria-live={live}
      aria-atomic="true"
      data-testid={testID}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      role="status"
      style={rootStyle}
    >
      <div style={contentStyle}>
        {showIcon ? (
          <span aria-hidden style={iconBoxStyle}>
            <StatusGlyph status={status} />
          </span>
        ) : null}
        <p style={messageStyle}>{message}</p>
      </div>
      {showActions ? (
        <div style={actionsStyle}>
          {showAction ? (
            <LinkButton
              appearance="on-inverse"
              label={actionLabel}
              onClick={onAction}
              size="sm"
              underline={false}
            />
          ) : null}
          {showDismiss ? (
            <button
              aria-label={dismissAccessibilityLabel}
              onBlur={handleDismissBlur}
              onClick={onDismiss}
              onFocus={handleDismissFocus}
              onMouseEnter={() => setIsDismissHovered(true)}
              onMouseLeave={() => {
                setIsDismissHovered(false);
                setIsDismissPressed(false);
              }}
              onPointerDown={() => setIsDismissPressed(true)}
              onPointerUp={() => setIsDismissPressed(false)}
              style={dismissHitStyle}
              type="button"
            >
              <span style={dismissVisualStyle}>
                <IconX color="inverse" size="sm" />
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
