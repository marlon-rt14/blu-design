import { COACHMARK_DISMISS_LABEL, resolveCoachmarkActionLabel } from '@dsm/shared';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import type { ReactElement } from 'react';

import { IconX } from '../../../icons';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { Image } from '../../atoms/Image';
import type { ICoachmarkProps } from './Coachmark.types';
import { TipPointer } from './TipPointer';
import { useCoachmark } from './useCoachmark';

/**
 * Web Coachmark — a system-triggered contextual guide anchored to an element.
 *
 * **It wraps its anchor.** `children` is the thing being explained; the panel
 * positions itself against it. That is a divergence from Figma, where the card
 * floats with nothing anchoring it (same pattern as Tooltip).
 *
 * Opens only when the host sets `isOpen` — never on hover. Esc closes always;
 * outside press closes `sequence="single"` and leaves `multi` alone. Focus
 * moves into the non-modal dialog on open and returns to the anchor on close.
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
    getFloatingProps,
    floatingStyles,
    floatingContext,
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
    titleId,
    bodyId,
    stepAnnouncement,
    renderTitle,
    renderBack,
    renderFooter,
    renderStep,
    dismissAppearance,
    dismissOnMedia,
    showDismiss,
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

  return (
    <>
      <span
        data-testid={testID}
        ref={setReference}
        style={{ display: 'inline-flex' }}
      >
        {children}
      </span>
      {open ? (
        <FloatingPortal>
          <FloatingFocusManager context={floatingContext} initialFocus={0} modal={false} returnFocus>
            <div
              aria-describedby={bodyId}
              aria-labelledby={renderTitle ? titleId : undefined}
              data-testid={testID ? `${testID}-panel` : undefined}
              ref={setFloating}
              style={{ ...shellStyle, ...floatingStyles }}
              {...getFloatingProps()}
            >
              <div style={cardStyle}>
                {media === 'image' ? (
                  <div style={mediaWrapStyle}>
                    <Image alt={mediaAlt} radius="none" ratio="16:9" src={mediaSrc} />
                    {dismissOnMedia ? (
                      <div style={mediaDismissStyle}>
                        <IconButton
                          appearance="on-media"
                          icon={IconX}
                          label={dismissAccessibilityLabel}
                          onPress={handleDismiss}
                          size="xs"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div style={contentStyle}>
                  <div style={textBlockStyle}>
                    {renderTitle || dismissButton ? (
                      <div style={headStyle}>
                        {renderTitle ? (
                          <p id={titleId} style={titleStyle}>
                            {title}
                          </p>
                        ) : (
                          <span style={{ flex: 1 }} />
                        )}
                        {dismissButton}
                      </div>
                    ) : null}
                    <p id={bodyId} style={bodyStyle}>
                      {body}
                    </p>
                  </div>
                  {renderFooter ? (
                    <div style={footerStyle}>
                      {renderStep ? (
                        <p aria-label={stepAnnouncement} style={stepStyle}>
                          {stepIndex}
                        </p>
                      ) : null}
                      <div style={actionsStyle}>
                        {renderBack ? (
                          <Button
                            appearance="ghost"
                            label={backLabel}
                            onClick={onBack}
                            size="sm"
                          />
                        ) : null}
                        {showAction ? (
                          <Button
                            label={resolvedActionLabel}
                            onClick={handleAction}
                            size="sm"
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {pointerStyle && pointerDirection ? (
                <div aria-hidden ref={pointerRef} style={pointerStyle}>
                  <TipPointer
                    direction={pointerDirection}
                    fill={pointerFill}
                    stroke={pointerStroke}
                    strokeWidth={pointerStrokeWidth}
                  />
                </div>
              ) : null}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
};
