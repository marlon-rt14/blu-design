import { cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { IconX } from '../../../icons';
import { IconButton } from '../IconButton';
import type { TIconProps } from '../Icon';
import { LinkButton } from '../LinkButton';
import type { ICalloutProps } from './Callout.types';
import { useCallout } from './useCallout';

/**
 * Tints `icon` to the palette's colour via `tintColor` — the mobile-only
 * escape hatch `TIconProps` documents for exactly this: "a parent that has
 * already resolved a colour... has no way to lend it implicitly the way it
 * does on web." There is no `currentColor` in React Native, so wrapping the
 * node in a coloured `View` (web's trick — see the web `Callout`) would tint
 * nothing.
 */
const tintedIcon = (icon: ReactNode, tintColor: string): ReactNode =>
  isValidElement<TIconProps>(icon) ? cloneElement(icon, { tintColor }) : icon;

/**
 * React Native Callout — a proactive, optional message about information, a
 * feature, or an opportunity in the context of the current task. **It never
 * says something happened** — that is `Alert`, which also carries severity
 * and always renders above a Callout sharing the same space. A message that
 * floats over a specific control is a `Coachmark`, not this.
 *
 * No live region: it's screen content, not a notification, and is never
 * announced just because it appeared.
 *
 * @example
 * ```tsx
 * <Callout
 *   action={{ label: 'Activar cashback', onPress: activate }}
 *   body="Recibe el 2% de tus compras en supermercados, directo en tu estado de cuenta."
 *   icon={<IconCreditCard />}
 *   title="Tu tarjeta ahora tiene cashback"
 * />
 * ```
 */
export const Callout = (props: ICalloutProps): ReactElement => {
  const { body, title, icon, action, onDismiss, dismissAccessibilityLabel = 'Cerrar', testID } = props;
  const { rootStyle, iconBoxStyle, iconColor, contentStyle, titleStyle, bodyStyle, actionWrapStyle, dismissWrapStyle } =
    useCallout(props);

  return (
    <View style={rootStyle} testID={testID}>
      {icon ? (
        // Decorative: the icon aliases the message's benefit, which the
        // title and body already say in words.
        <View importantForAccessibility="no-hide-descendants" style={iconBoxStyle}>
          {tintedIcon(icon, iconColor)}
        </View>
      ) : null}
      <View style={contentStyle}>
        {title ? <Text style={titleStyle}>{title}</Text> : null}
        <Text style={bodyStyle}>{body}</Text>
        {action ? (
          <View style={actionWrapStyle}>
            <LinkButton appearance="on-muted" label={action.label} onPress={action.onPress} size="sm" underline />
          </View>
        ) : null}
      </View>
      {onDismiss ? (
        <View style={dismissWrapStyle}>
          <IconButton
            appearance="veil"
            icon={IconX}
            label={dismissAccessibilityLabel}
            onPress={onDismiss}
            size="xs"
          />
        </View>
      ) : null}
    </View>
  );
};
