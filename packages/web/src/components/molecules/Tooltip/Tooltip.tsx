import { TOOLTIP_DISMISS_LABEL } from '@dsm/shared';
import { FloatingPortal } from '@floating-ui/react';
import type { ReactElement } from 'react';

import { IconX } from '../../../icons';
import { IconButton } from '../../atoms/IconButton';
import { LinkButton } from '../../atoms/LinkButton';
import type { ITooltipProps } from './Tooltip.types';
import { useTooltip } from './useTooltip';

/**
 * Web Tooltip — a short explanation anchored to the element that triggers it.
 *
 * **It wraps its trigger.** `children` is the thing being explained, and the
 * panel positions itself against it. That is a divergence from Figma, where the
 * panel floats with nothing anchoring it.
 *
 * Pointing or focusing opens it. `descriptive` leaves on its own; `info` stays
 * until the person closes it, which is why the title and the dismiss only
 * appear there.
 *
 * Three behaviours come straight from WCAG 1.4.13 and are not configurable:
 * `Esc` closes it, moving the pointer **into** the panel does not (otherwise a
 * link inside would be unreachable), and it never times out.
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
    setReference,
    setFloating,
    pointerRef,
    getReferenceProps,
    getFloatingProps,
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

  return (
    <>
      {/* A wrapper rather than cloning the child: `children` is any node, and
          not every node forwards a ref. `inline-flex` keeps the wrapper the
          size of what it holds, so the anchor is the trigger and not a band
          across the line. */}
      <span
        data-testid={testID}
        ref={setReference}
        style={{ display: 'inline-flex' }}
        {...getReferenceProps()}
      >
        {children}
      </span>
      {open ? (
        // Portalled so no ancestor's `overflow` can clip the panel — the same
        // reason the focus ring is never clipped.
        <FloatingPortal>
          <div
            data-testid={testID ? `${testID}-panel` : undefined}
            ref={setFloating}
            style={{ ...floatingStyles, ...panelStyle }}
            {...getFloatingProps()}
          >
            <div style={contentStyle}>
              {showTitle ? <p style={titleStyle}>{title}</p> : null}
              <p style={bodyStyle}>{body}</p>
              {link ? (
                <div style={linkSlotStyle}>
                  {/* `on-inverse` and `sm` are fixed: the panel is the inverse
                      surface, and nothing about the link is the caller's to
                      choose except its words and what it does. */}
                  <LinkButton
                    appearance="on-inverse"
                    label={link.label}
                    onClick={link.onPress}
                    size="sm"
                  />
                </div>
              ) : null}
            </div>
            {showDismiss ? (
              <IconButton
                appearance="on-inverse"
                icon={IconX}
                label={TOOLTIP_DISMISS_LABEL}
                onPress={onDismiss ?? (() => {})}
                size="xs"
              />
            ) : null}
            {pointerStyle ? <div ref={pointerRef} style={pointerStyle} /> : null}
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
};
