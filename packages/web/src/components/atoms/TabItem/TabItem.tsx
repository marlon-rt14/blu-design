import { useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import type { ITabItemProps } from './TabItem.types';
import { useTabItem } from './useTabItem';

/**
 * Web TabItem — one option in a Tabs bar.
 *
 * Renders a `<button role="tab">`. Hover / pressed overlay and the flush
 * focus ring come from `useTabItem`. The selected indicator hugs the
 * content column, not the full tab width. ExtraBold at every state; colour
 * carries inactive vs active.
 *
 * `showLeadingIcon` and `showBadge` are independent booleans — never inferred
 * from content. The glyph has no default: `leadingIcon` is a node the caller
 * imports from its section. Badge is painted locally (Badge is not shipped).
 *
 * @example
 * ```tsx
 * <TabItem isSelected={tab === 'one'} label="Tab 1" onChange={() => setTab('one')} />
 * <TabItem label="Pendientes" onChange={() => setTab('two')} showBadge />
 * ```
 */
export const TabItem = (props: ITabItemProps): ReactElement => {
  const {
    label = 'Label',
    isSelected = false,
    showLeadingIcon = false,
    leadingIcon,
    showBadge = false,
    badge = '9',
    onChange,
    tabIndex,
    testID,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const {
    rootStyle,
    overlayStyle,
    contentStyle,
    labelRowStyle,
    iconStyle,
    labelStyle,
    badgeStyle,
    badgeLabelStyle,
    indicatorStyle,
    isDisabled: disabled,
  } = useTabItem({ ...props, isHovered, isPressed, isFocusVisible });

  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleFocus = (event: FocusEvent<HTMLButtonElement>): void =>
    setIsFocusVisible(event.currentTarget.matches(':focus-visible'));

  return (
    <button
      aria-disabled={disabled || undefined}
      aria-selected={isSelected}
      data-testid={testID}
      disabled={disabled}
      onBlur={() => setIsFocusVisible(false)}
      onClick={onChange}
      onFocus={handleFocus}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      role="tab"
      style={rootStyle}
      tabIndex={tabIndex}
      type="button"
    >
      {overlayStyle ? <span style={overlayStyle} /> : null}
      <span style={contentStyle}>
        <span style={labelRowStyle}>
          {showLeadingIcon ? (
            // `iconStyle` carries the tab's icon colour, which a system
            // glyph picks up through `currentColor`.
            <span style={iconStyle}>{leadingIcon}</span>
          ) : null}
          <span style={labelStyle}>{label}</span>
          {showBadge ? (
            <span style={badgeStyle}>
              <span style={badgeLabelStyle}>{badge}</span>
            </span>
          ) : null}
        </span>
        {indicatorStyle ? <span style={indicatorStyle} /> : null}
      </span>
    </button>
  );
};
