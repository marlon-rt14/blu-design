import { COACHMARK_DISMISS_LABEL, resolveCoachmarkActionLabel } from '@dsm/shared';
import type { ReactElement } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import { IconX } from '../../../icons';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { Image } from '../../atoms/Image';
import type { ICoachmarkProps } from './Coachmark.types';
import { TipPointer } from './TipPointer';
import { useCoachmark } from './useCoachmark';

/**
 * Full-viewport host for the floating panel.
 *
 * Native: lives inside a transparent `Modal` (escapes ancestor clipping).
 * Web / Storybook (react-native-web): `position: 'fixed'` — RN-web `Modal` +
 * `measureInWindow` disagree on origin and the tip ends up on the wrong side
 * of the card (classic "panel below, tip still pointing down" bug).
 *
 * `'fixed'` is a react-native-web extension; RN's `ViewStyle` omits it.
 */
const overlayStyle: ViewStyle =
  Platform.OS === 'web'
    ? ({
        // react-native-web viewport root — not in RN's ViewStyle union.
        position: 'fixed' as unknown as 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      } satisfies ViewStyle)
    : {
        flex: 1,
      };

/**
 * React Native Coachmark — a system-triggered contextual guide anchored to an
 * element.
 *
 * The panel is portaled (Modal on iOS/Android, fixed overlay on web). Backdrop
 * press closes `sequence="single"` only. No scrim.
 *
 * @example
 * ```tsx
 * <Coachmark
 *   body="Explicación breve del beneficio, en una o dos líneas."
 *   isOpen={open}
 *   onAction={() => setOpen(false)}
 *   onDismiss={() => setOpen(false)}
 *   onOpenChange={setOpen}
 *   title="Título de la función"
 * >
 *   <Button label="Ancla" />
 * </Coachmark>
 * ```
 */
export const Coachmark = (props: ICoachmarkProps): ReactElement => {
  const {
    media = 'none',
    sequence = 'single',
    title = 'Título de la función',
    body = 'Explicación breve del beneficio, en una o dos líneas.',
    stepIndex = '2 de 4',
    mediaSrc,
    mediaAlt = '',
    showAction = true,
    actionLabel,
    backLabel = 'Atrás',
    dismissAccessibilityLabel = COACHMARK_DISMISS_LABEL,
    onAction,
    onBack,
    onDismiss,
    onOpenChange,
    testID,
    children,
  } = props;
  const resolvedActionLabel = resolveCoachmarkActionLabel(sequence, actionLabel);

  const {
    open,
    setReference,
    setFloating,
    pointerRef,
    update,
    floatingStyles,
    shellStyle,
    cardStyle,
    mediaWrapStyle,
    mediaDismissStyle,
    contentStyle,
    textBlockStyle,
    headStyle,
    titleStyle,
    bodyStyle,
    footerStyle,
    stepStyle,
    actionsStyle,
    pointerStyle,
    pointerDirection,
    pointerFill,
    pointerStroke,
    pointerStrokeWidth,
    stepAnnouncement,
    renderTitle,
    renderBack,
    renderFooter,
    renderStep,
    dismissAppearance,
    dismissOnMedia,
    showDismiss,
    closeOnBackdrop,
  } = useCoachmark(props);

  const close = (): void => {
    onOpenChange?.(false);
  };

  const handleDismiss = (): void => {
    onDismiss?.();
    close();
  };

  const handleAction = (): void => {
    onAction?.();
    close();
  };

  const dismissButton =
    showDismiss && !dismissOnMedia ? (
      <IconButton
        appearance={dismissAppearance}
        icon={IconX}
        label={dismissAccessibilityLabel}
        onPress={handleDismiss}
        size="xs"
      />
    ) : null;

  const panel = (
    <View collapsable={false} pointerEvents="box-none" style={overlayStyle}>
      {/* Backdrop sibling — not a wrapper — so absolute coords stay viewport-rooted. */}
      <Pressable
        accessibilityRole="button"
        onPress={closeOnBackdrop ? close : undefined}
        style={StyleSheet.absoluteFill}
      />
      <View
        accessibilityLabel={title}
        accessibilityRole="summary"
        accessibilityViewIsModal
        accessible
        collapsable={false}
        onLayout={update}
        ref={setFloating}
        style={[shellStyle, floatingStyles]}
        testID={testID ? `${testID}-panel` : undefined}
      >
        <View style={cardStyle}>
          {media === 'image' ? (
            <View style={mediaWrapStyle}>
              <Image alt={mediaAlt} radius="none" ratio="16:9" src={mediaSrc} />
              {dismissOnMedia ? (
                <View style={mediaDismissStyle}>
                  <IconButton
                    appearance="on-media"
                    icon={IconX}
                    label={dismissAccessibilityLabel}
                    onPress={handleDismiss}
                    size="xs"
                  />
                </View>
              ) : null}
            </View>
          ) : null}
          <View style={contentStyle}>
            <View style={textBlockStyle}>
              {renderTitle || dismissButton ? (
                <View style={headStyle}>
                  {renderTitle ? <Text style={titleStyle}>{title}</Text> : <View style={{ flex: 1 }} />}
                  {dismissButton}
                </View>
              ) : null}
              <Text style={bodyStyle}>{body}</Text>
            </View>
            {renderFooter ? (
              <View style={footerStyle}>
                {renderStep ? (
                  <Text accessibilityLabel={stepAnnouncement} style={stepStyle}>
                    {stepIndex}
                  </Text>
                ) : null}
                <View style={actionsStyle}>
                  {renderBack ? (
                    <Button appearance="ghost" label={backLabel} onPress={onBack} size="sm" />
                  ) : null}
                  {showAction ? (
                    <Button label={resolvedActionLabel} onPress={handleAction} size="sm" />
                  ) : null}
                </View>
              </View>
            ) : null}
          </View>
        </View>
        {pointerStyle && pointerDirection ? (
          <View importantForAccessibility="no" ref={pointerRef} style={pointerStyle}>
            <TipPointer
              direction={pointerDirection}
              fill={pointerFill}
              stroke={pointerStroke}
              strokeWidth={pointerStrokeWidth}
            />
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <>
      <View collapsable={false} ref={setReference} testID={testID}>
        {children}
      </View>
      {open ? (
        Platform.OS === 'web' ? (
          panel
        ) : (
          <Modal animationType="none" onRequestClose={handleDismiss} transparent visible>
            {panel}
          </Modal>
        )
      ) : null}
    </>
  );
};
