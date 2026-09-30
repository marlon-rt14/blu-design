import { useEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent, ReactElement } from 'react';

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
    onFocus,
    onBlur,
    testID,
  } = props;
  const [isClosed, setIsClosed] = useState(false);
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
    const id = window.setTimeout(close, ms);
    return () => {
      window.clearTimeout(id);
      remainingRef.current = Math.max(0, ms - (Date.now() - started));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dwell is mount-scoped; only pause toggles it
  }, [paused]);

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
      close();
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

  if (isClosed) {
    return null;
  }

  // One trailing slot. Action and the × never render together — Figma hides
  // whichever isn't the case (`102:12292` vs `102:12356`).
  const showDismiss = onDismiss != null && action == null;
  const showActions = action != null || showDismiss;

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
          {action ? (
            <LinkButton
              appearance="on-inverse"
              label={action.label}
              onClick={action.onPress}
              size="sm"
              underline={false}
            />
          ) : null}
          {showDismiss ? (
            <button
              aria-label={DISMISS_LABEL}
              onBlur={handleDismissBlur}
              onClick={close}
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
                <IconXClose color="inverse" size="sm" />
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
