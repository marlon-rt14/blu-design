import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

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
    testID,
  } = props;
  const [isDismissPressed, setIsDismissPressed] = useState(false);
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
  } = useAlert({ ...props, isDismissPressed });

  const ToneIcon = toneIcon(tone);

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
            <ToneIcon color="inverse" size="sm" />
          </View>
        </View>
      ) : null}
      <View style={contentStyle}>
        {showTitle ? <Text style={titleStyle}>{title}</Text> : null}
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
