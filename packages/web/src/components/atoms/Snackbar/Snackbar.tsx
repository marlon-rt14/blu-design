import { useEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent, ReactElement } from 'react';

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
    onFocus,
    onBlur,
    testID,
  } = props;
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isClosePressed, setIsClosePressed] = useState(false);
  const [isCloseFocusVisible, setIsCloseFocusVisible] = useState(false);
  const {
    rootStyle,
    contentStyle,
    iconBoxStyle,
    messageStyle,
    actionsStyle,
    closeHitStyle,
    closeVisualStyle,
    live,
    swipeThreshold,
  } = useSnackbar({
    ...props,
    isCloseHovered,
    isClosePressed,
    isCloseFocusVisible,
  });

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  useEffect(() => {
    const id = window.setTimeout(() => onDismissRef.current?.(), SNACKBAR_DURATION_MS);
    return () => window.clearTimeout(id);
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

  const handleCloseFocus = (event: FocusEvent<HTMLButtonElement>): void => {
    setIsCloseFocusVisible(event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  };
  const handleCloseBlur = (event: FocusEvent<HTMLButtonElement>): void => {
    setIsCloseFocusVisible(false);
    onBlur?.(event);
  };

  const showActions = showAction || showClose;

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
            <ToneGlyph tone={tone} />
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
          {showClose ? (
            <button
              aria-label={closeAccessibilityLabel}
              onBlur={handleCloseBlur}
              onClick={onDismiss}
              onFocus={handleCloseFocus}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => {
                setIsCloseHovered(false);
                setIsClosePressed(false);
              }}
              onPointerDown={() => setIsClosePressed(true)}
              onPointerUp={() => setIsClosePressed(false)}
              style={closeHitStyle}
              type="button"
            >
              <span style={closeVisualStyle}>
                <IconX color="inverse" size="sm" />
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
