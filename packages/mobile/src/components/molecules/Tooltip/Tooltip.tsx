import { TOOLTIP_DISMISS_LABEL } from '@dsm/shared';
import { cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { IconX } from '../../../icons';
import { IconButton } from '../../atoms/IconButton';
import { LinkButton } from '../../atoms/LinkButton';
import type { ITooltipProps } from './Tooltip.types';
import { useTooltip } from './useTooltip';

/**
 * React Native Tooltip — a short explanation anchored to the element that
 * triggers it.
 *
 * **A long press opens it, never a plain press.** The trigger is usually a
 * control with an action of its own, and the tap belongs to that control. bDS
 * is clear about the cost of hiding something behind a long press: *"si la
 * información hace falta, va visible"* — so never put the only copy of
 * something important in one, and prefer `type="info"` on this platform.
 *
 * The panel renders inside a `Modal`, because React Native has no portal and
 * nothing else escapes an ancestor's clipping. The backdrop is transparent and
 * closes on press, which is how a tooltip is dismissed here.
 *
 * @example
 * ```tsx
 * <Tooltip body="Se envía a tu correo">
 *   <IconButton icon={IconInfo} label="Más información" onPress={noop} />
 * </Tooltip>
 * ```
 */
export const Tooltip = (props: ITooltipProps): ReactElement => {
  const { body, children, link, onDismiss, title, testID } = props;
  const {
    open,
    show,
    hide,
    setReference,
    setFloating,
    pointerRef,
    floatingStyles,
    panelStyle,
    contentStyle,
    titleStyle,
    bodyStyle,
    linkSlotStyle,
    pointerStyle,
    showDismiss,
    showTitle,
  } = useTooltip(props);

  const handleDismiss = (): void => {
    hide();
    onDismiss?.();
  };

  // React Native hands a touch to a single view, so a `Pressable` *around* an
  // interactive trigger never sees the long press: the inner one claims it
  // first. The handler therefore goes onto the trigger itself, where the same
  // `Pressable` runs both gestures and the tap still belongs to the child.
  //
  // The wrapper below stays for the other case — a trigger that claims nothing,
  // like a `Text` or a plain `View`. Between the two, both shapes work.
  //
  // Worth knowing why this was not caught earlier: through react-native-web the
  // wrapper *does* fire, because there these are DOM elements and events
  // bubble. The bug only exists on a device.
  const trigger = isValidElement<{ onLongPress?: () => void }>(children)
    ? cloneElement(children, {
        onLongPress: () => {
          children.props.onLongPress?.();
          show();
        },
      })
    : children;

  return (
    <>
      {/* `collapsable={false}` keeps this view in the native hierarchy so the
          engine can measure it — without it React Native is free to flatten a
          wrapper that only holds another view. Its own `onLongPress` is the
          fallback for a non-interactive trigger; see `trigger` above. */}
      <Pressable collapsable={false} onLongPress={show} ref={setReference} testID={testID}>
        {trigger}
      </Pressable>
      <Modal animationType="none" onRequestClose={hide} transparent visible={open}>
        <Pressable onPress={hide} style={{ flex: 1 }}>
          <View
            ref={setFloating}
            style={[floatingStyles, panelStyle]}
            testID={testID ? `${testID}-panel` : undefined}
          >
            <View style={contentStyle}>
              {showTitle ? <Text style={titleStyle}>{title}</Text> : null}
              <Text style={bodyStyle}>{body}</Text>
              {link ? (
                <View style={linkSlotStyle}>
                  {/* `on-inverse` and `sm` are fixed: the panel is the inverse
                      surface, and nothing about the link is the caller's to
                      choose except its words and what it does. */}
                  <LinkButton
                    appearance="on-inverse"
                    label={link.label}
                    onPress={link.onPress}
                    size="sm"
                  />
                </View>
              ) : null}
            </View>
            {showDismiss ? (
              <IconButton
                appearance="on-inverse"
                icon={IconX}
                label={TOOLTIP_DISMISS_LABEL}
                onPress={handleDismiss}
                size="xs"
              />
            ) : null}
            {pointerStyle ? <View ref={pointerRef} style={pointerStyle} /> : null}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
