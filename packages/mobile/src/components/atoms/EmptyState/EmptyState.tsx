import { cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Button } from '../Button';
import type { TIconProps } from '../Icon';
import { LinkButton } from '../LinkButton';
import type { IEmptyStateProps } from './EmptyState.types';
import { useEmptyState } from './useEmptyState';

/** Same `tintColor` escape hatch `Callout`'s mobile icon already uses — no `currentColor` in RN. */
const tintedGraphic = (graphic: ReactNode, tintColor: string): ReactNode =>
  isValidElement<TIconProps>(graphic) ? cloneElement(graphic, { tintColor }) : graphic;

/**
 * React Native EmptyState — what renders when a screen or a block has no
 * content, saying why it's empty and what to do next.
 *
 * **It is never an error.** If something failed, that's `Alert`. **Load
 * first** — while content is still arriving, show a `Skeleton`, not this.
 *
 * `accessibilityLiveRegion="polite"` is unconditional on the container,
 * same reasoning as web's unconditional `role="status"` — it only actually
 * announces when mounting this is a live *change*, which matches the dev
 * contract's filter-result case without needing a second prop for the
 * already-empty-on-load case.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   action={{ label: 'Ver mis tarjetas', onPress: goToCards }}
 *   body="Cuando uses tu tarjeta, tus compras y pagos van a aparecer acá"
 *   graphic={<IconCreditCard01 />}
 *   title="Aún no tienes movimientos"
 * />
 * ```
 */
export const EmptyState = (props: IEmptyStateProps): ReactElement => {
  const { title, body, graphic, action, secondaryAction, testID } = props;
  const {
    rootStyle,
    graphicWrapStyle,
    graphicColor,
    textBlockStyle,
    titleStyle,
    bodyStyle,
    actionsWrapStyle,
    buttonAppearance,
    buttonSize,
    buttonMinWidth,
  } = useEmptyState(props);

  const showSecondaryAction = action !== undefined && secondaryAction !== undefined;

  return (
    <View accessibilityLiveRegion="polite" style={rootStyle} testID={testID}>
      {graphic ? (
        <View importantForAccessibility="no-hide-descendants" style={graphicWrapStyle}>
          {tintedGraphic(graphic, graphicColor)}
        </View>
      ) : null}
      <View style={textBlockStyle}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={bodyStyle}>{body}</Text>
      </View>
      {action ? (
        <View style={actionsWrapStyle}>
          <Button
            appearance={buttonAppearance}
            label={action.label}
            onPress={action.onPress}
            size={buttonSize}
            style={buttonMinWidth === undefined ? undefined : { minWidth: buttonMinWidth }}
            variant="primary"
          />
          {showSecondaryAction ? (
            <LinkButton label={secondaryAction.label} onPress={secondaryAction.onPress} size="sm" />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
