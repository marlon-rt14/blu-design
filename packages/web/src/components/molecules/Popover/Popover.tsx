import { POPOVER_DISMISS_LABEL } from '@dsm/shared';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import type { ReactElement } from 'react';

import { IconX } from '../../../icons';
import { IconButton } from '../../atoms/IconButton';
import type { IPopoverProps } from './Popover.types';
import { usePopover } from './usePopover';

/**
 * Web Popover — a free-content floating surface anchored to a trigger. If the
 * content is a list of options, this is the wrong component — that is
 * `Menu`, whose slot only accepts the `MenuItem` family and which has no
 * trigger or open state of its own.
 *
 * **It wraps `trigger`.** `children` is the content, `trigger` is what opens
 * it — a divergence from Figma, where the panel floats free with nothing
 * anchoring it, same divergence Tooltip and Coachmark already document.
 *
 * Uncontrolled: a click on `trigger` opens it, Esc or an outside click
 * always closes it, and — unlike Tooltip and Coachmark — focus is trapped
 * inside while it's open and returns to `trigger` on close.
 *
 * @example
 * ```tsx
 * <Popover header="Cupo disponible" trigger={<Button label="Ver cupo" />}>
 *   <p>Tu cupo se renueva el 5 de cada mes.</p>
 * </Popover>
 * ```
 */
export const Popover = (props: IPopoverProps): ReactElement => {
  const { trigger, children, header, onDismiss, testID } = props;
  const {
    open,
    setReference,
    setFloating,
    getReferenceProps,
    getFloatingProps,
    floatingStyles,
    floatingContext,
    shellStyle,
    headerRowStyle,
    headerTextStyle,
    contentStyle,
    panelId,
    headerId,
    renderHeaderRow,
    showHeader,
    showDismiss,
    close,
  } = usePopover(props);

  const handleDismiss = (): void => {
    onDismiss?.();
    close();
  };

  return (
    <>
      {/* A wrapper rather than cloning `trigger`: not every node forwards a
          ref or spreads unknown props (this library's own Button/IconButton
          do neither), so `aria-expanded`/`aria-controls` and the click that
          opens the panel live here instead — same reasoning Tooltip's and
          Coachmark's own trigger wrapper already follows. `inline-flex` keeps
          the wrapper the size of what it holds. */}
      <span
        aria-controls={open ? panelId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        data-testid={testID}
        ref={setReference}
        style={{ display: 'inline-flex' }}
        {...getReferenceProps()}
      >
        {trigger}
      </span>
      {open ? (
        <FloatingPortal>
          <FloatingFocusManager context={floatingContext} modal returnFocus>
            <div
              aria-labelledby={showHeader ? headerId : undefined}
              aria-modal="true"
              data-testid={testID ? `${testID}-panel` : undefined}
              id={panelId}
              ref={setFloating}
              style={{ ...shellStyle, ...floatingStyles }}
              {...getFloatingProps()}
            >
              {renderHeaderRow ? (
                <div style={headerRowStyle}>
                  {showHeader ? (
                    <p id={headerId} style={headerTextStyle}>
                      {header}
                    </p>
                  ) : (
                    <span style={{ flex: 1 }} />
                  )}
                  {showDismiss ? (
                    <IconButton
                      appearance="ghost"
                      icon={IconX}
                      label={POPOVER_DISMISS_LABEL}
                      onPress={handleDismiss}
                      size="xs"
                    />
                  ) : null}
                </div>
              ) : null}
              <div style={contentStyle}>{children}</div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
};
