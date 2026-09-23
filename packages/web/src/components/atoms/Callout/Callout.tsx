import type { ReactElement } from 'react';

import { IconX } from '../../../icons';
import { IconButton } from '../IconButton';
import { LinkButton } from '../LinkButton';
import type { ICalloutProps } from './Callout.types';
import { useCallout } from './useCallout';

/**
 * Web Callout — a proactive, optional message about information, a feature,
 * or an opportunity in the context of the current task. **It never says
 * something happened** — that is `Alert`, which also carries severity and
 * always renders above a Callout sharing the same space. A message that
 * floats over a specific control is a `Coachmark`, not this.
 *
 * No live region: it's page content, not a notification, and is never
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
    <div data-testid={testID} style={rootStyle}>
      {icon ? (
        // Decorative: the icon aliases the message's benefit, which the
        // title and body already say in words. See the dev contract's own
        // §07 for the one case this isn't true (an approved program badge),
        // not yet implemented — bDS's own catalog for it doesn't exist yet.
        <span aria-hidden style={{ ...iconBoxStyle, color: iconColor }}>
          {icon}
        </span>
      ) : null}
      <div style={contentStyle}>
        {title ? <p style={titleStyle}>{title}</p> : null}
        <p style={bodyStyle}>{body}</p>
        {action ? (
          <div style={actionWrapStyle}>
            <LinkButton appearance="on-muted" label={action.label} onClick={action.onPress} size="sm" underline />
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <div style={dismissWrapStyle}>
          <IconButton
            appearance="veil"
            icon={IconX}
            label={dismissAccessibilityLabel}
            onPress={onDismiss}
            size="xs"
          />
        </div>
      ) : null}
    </div>
  );
};
