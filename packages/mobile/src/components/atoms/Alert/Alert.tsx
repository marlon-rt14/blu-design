import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ALERT_STATUS_ICON, type TAlertStatus } from '@dsm/shared';

import { IconAlertCircle, IconAlertTriangle, IconCheckCircle, IconInfo, IconX } from '../../../icons';
import type { TIconProps } from '../Icon';
import { LinkButton } from '../LinkButton';
import type { IAlertProps } from './Alert.types';
import { useAlert } from './useAlert';

const statusIcon = (status: TAlertStatus): ((props: TIconProps) => ReactElement) => {
  const name = ALERT_STATUS_ICON[status];
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
    status = 'danger',
    placement = 'page',
    showTitle = true,
    title = 'Título del aviso',
    body = 'Descripción breve de la condición y de lo que se puede hacer.',
    showIcon = true,
    showAction = false,
    actionLabel = 'Resolver ahora',
    showDismiss = false,
    dismissAccessibilityLabel = 'Cerrar aviso',
    onAction,
    onDismiss,
    testID,
  } = props;
  const [isDismissPressed, setIsDismissPressed] = useState(false);
  const [isDismissFocused, setIsDismissFocused] = useState(false);
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
    dismissHitSlop,
    liveRole,
    liveRegion,
  } = useAlert({ ...props, isDismissPressed, isDismissFocused });

  const StatusIcon = statusIcon(status);
  const renderTitle = placement !== 'inline' && showTitle;

  return (
    <View
      accessibilityLiveRegion={liveRegion}
      accessibilityRole={liveRole}
      style={rootStyle}
      testID={testID}
    >
      {showIcon ? (
        <View importantForAccessibility="no-hide-descendants" style={iconBoxStyle}>
          <View style={chipStyle}>
            <StatusIcon color="inverse" size="sm" />
          </View>
        </View>
      ) : null}
      <View style={contentStyle}>
        {renderTitle ? <Text style={titleStyle}>{title}</Text> : null}
        <Text style={bodyStyle}>{body}</Text>
        {showAction ? (
          <View style={actionsStyle}>
            <LinkButton appearance="on-muted" label={actionLabel} onPress={onAction} size="sm" />
          </View>
        ) : null}
      </View>
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
            <IconX color="primary" size="sm" />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
};
