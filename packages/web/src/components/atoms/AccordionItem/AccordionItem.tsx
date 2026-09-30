import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import { IconChevronDown } from '../../../icons/arrows';
import type { IAccordionItemProps } from './AccordionItem.types';
import { useAccordionItem } from './useAccordionItem';

/**
 * Web AccordionItem — one section's header (title, optional icon, chevron)
 * plus its content panel. The header is a real `<button>`, so keyboard
 * activation and focus come from the platform instead of being
 * reimplemented — same reasoning `Button` and `IconButton` already follow.
 *
 * **`isExpanded`/`onToggle` are not props an app sets directly** when this
 * lives inside an `Accordion` — the parent injects them, the same way
 * `Tabs` injects `layout`/`tabIndex` into every `TabItem`. Rendered on its
 * own (outside an `Accordion`), it manages nothing and just reflects
 * whatever `isExpanded` was passed.
 *
 * WAI-ARIA APG Accordion pattern: the header carries `aria-expanded` and
 * `aria-controls`; the panel is `role="region"` with `aria-labelledby`
 * pointing back at the header, and goes `inert` while closed so a collapsed
 * panel's own focusable content can't still be tabbed into.
 */
export const AccordionItem = (props: IAccordionItemProps): ReactElement => {
  const { title, icon, disabled = false, isExpanded = false, onToggle, showDivider = false, testID, children } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    rootStyle,
    headerStyle,
    iconWrapperStyle,
    titleStyle,
    chevronWrapperStyle,
    panelWrapperStyle,
    contentStyle,
  } = useAccordionItem({ ...props, isHovered, isPressed, isFocusVisible, showDivider });

  const headerId = useId();
  const panelId = useId();

  // Same technique TextArea's auto-grow already uses: measure `scrollHeight`
  // and write the pixel value straight to the node in the same effect,
  // rather than only handing it to React — React diffs against its own last
  // rendered style object, not the live DOM, so a measurement that comes
  // back unchanged from the previous one would otherwise leave the node
  // stuck mid-transition.
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    if (isExpanded) {
      node.style.height = `${node.scrollHeight}px`;
    } else {
      node.style.height = '0px';
    }
  }, [isExpanded, children]);

  const handleMouseEnter = (): void => setIsHovered(true);
  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleFocus = (event: FocusEvent<HTMLButtonElement>): void =>
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));
  const handleBlur = (): void => setIsFocusVisible(false);

  return (
    <div data-testid={testID} style={rootStyle}>
      <button
        aria-controls={panelId}
        aria-expanded={isExpanded}
        disabled={disabled}
        id={headerId}
        onBlur={handleBlur}
        onClick={onToggle}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        style={headerStyle}
        type="button"
      >
        {icon ? <span style={iconWrapperStyle}>{icon}</span> : null}
        <span style={titleStyle}>{title}</span>
        <span aria-hidden style={chevronWrapperStyle}>
          <IconChevronDown size="md" />
        </span>
      </button>
      <div
        aria-labelledby={headerId}
        id={panelId}
        inert={!isExpanded}
        ref={contentRef}
        role="region"
        style={panelWrapperStyle}
      >
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};
