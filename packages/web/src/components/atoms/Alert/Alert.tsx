import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import { ALERT_TONE_ICON, type TAlertTone } from '@dsm/shared';

import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheckCircle,
  IconInfo,
  IconX,
} from '../../../icons';
import type { TIconProps } from '../Icon';
import { LinkButton } from '../LinkButton';
import type { IAlertProps } from './Alert.types';
import { useAlert } from './useAlert';

const toneIcon = (tone: TAlertTone): ((props: TIconProps) => ReactElement) => {
  const name = ALERT_TONE_ICON[tone];
  switch (name) {
    case 'alert-circle':
      return IconAlertCircle;
    case 'alert-triangle':
      return IconAlertTriangle;
    case 'check-circle':
      return IconCheckCircle;
    case 'info':
      return IconInfo;
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
};

export const Alert = (props: IAlertProps): ReactElement => {
  const {
    tone = 'danger',
    showTitle = true,
    title = 'Título del aviso',
    body = 'Descripción breve de la condición y de lo que se puede hacer.',
    showIcon = true,
    showAction = false,
    actionLabel = 'Ver detalle',
    showDismiss = false,
    dismissAccessibilityLabel = 'Cerrar aviso',
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
    iconBoxStyle,
    chipStyle,
    contentStyle,
    titleStyle,
    bodyStyle,
    actionsStyle,
    dismissHitStyle,
    dismissVisualStyle,
    liveRole,
  } = useAlert({
    ...props,
    isDismissHovered,
    isDismissPressed,
    isDismissFocusVisible,
  });

  const ToneIcon = toneIcon(tone);

  const handleDismissFocus = (event: FocusEvent<HTMLButtonElement>): void => {
    setIsDismissFocusVisible(event.currentTarget.matches(':focus-visible'));
    onFocus?.(event);
  };
  const handleDismissBlur = (event: FocusEvent<HTMLButtonElement>): void => {
    setIsDismissFocusVisible(false);
    onBlur?.(event);
  };

  return (
    <div data-testid={testID} role={liveRole} style={rootStyle}>
      {showIcon ? (
        <span aria-hidden style={iconBoxStyle}>
          <span style={chipStyle}>
            <ToneIcon color="inverse" size="sm" />
          </span>
        </span>
      ) : null}
      <div style={contentStyle}>
        {showTitle ? <p style={titleStyle}>{title}</p> : null}
        <p style={bodyStyle}>{body}</p>
        {showAction ? (
          <div style={actionsStyle}>
            <LinkButton appearance="on-muted" label={actionLabel} onClick={onAction} size="sm" />
          </div>
        ) : null}
      </div>
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
            <IconX color="primary" size="sm" />
          </span>
        </button>
      ) : null}
    </div>
  );
};
