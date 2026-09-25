import type { KeyboardEvent, ReactElement } from 'react';

import { TabItem } from '../../atoms/TabItem';
import type { ITabsProps } from './Tabs.types';
import { useTabs } from './useTabs';

/**
 * Web Tabs — the tab bar: 2–6 TabItems plus the bottom divider the
 * selected indicator sits on.
 *
 * `role="tablist"`. Arrow keys move between enabled tabs (and activate them);
 * Tab leaves the bar.
 *
 * **The selection is not marked tab by tab**: there is one `value` and each
 * tab compares its `key` against it, so two active tabs is not a state this
 * API can express. `TabItem` is rendered from here and is not meant to be
 * used on its own — the bar is what fills in `isSelected`, `layout`, `size`
 * and the roving `tabIndex`.
 *
 * Canvas width 375 is Figma's "a sangre" frame, not a code max-width. The bar
 * fills its parent. No TabPanel — Figma does not ship one.
 *
 * @example
 * ```tsx
 * <Tabs
 *   onChange={setTab}
 *   tabs={[
 *     { key: 'movimientos', label: 'Movimientos' },
 *     { key: 'pendientes', label: 'Pendientes', badge: 9 },
 *   ]}
 *   value={tab}
 * />
 * ```
 */
export const Tabs = (props: ITabsProps): ReactElement => {
  const { tabs, value, onChange, layout = 'scrollable', size = 'lg', divider = true, testID } = props;
  const { rootStyle, listStyle, dividerStyle } = useTabs(props);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const { key } = event;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') {
      return;
    }

    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const enabled = tabs.filter((tab) => !tab.disabled);
    if (enabled.length === 0) return;

    const currentIndex = enabled.findIndex((tab) => tab === document.activeElement);
    let nextIndex: number;
    switch (key) {
      case 'ArrowRight':
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % enabled.length;
        break;
      case 'ArrowLeft':
        nextIndex =
          currentIndex < 0 ? enabled.length - 1 : (currentIndex - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = enabled.length - 1;
        break;
      default: {
        const _exhaustive: never = key;
        return _exhaustive;
      }
    }

    event.preventDefault();
    const next = enabled[nextIndex];
    next?.focus();
    next?.click();
  };

  return (
    <div data-testid={testID} style={rootStyle}>
      {divider ? <div aria-hidden style={dividerStyle} /> : null}
      <div onKeyDown={handleKeyDown} role="tablist" style={listStyle}>
        {tabs.map((tab) => (
          <TabItem
            badge={tab.badge}
            disabled={tab.disabled}
            isSelected={tab.key === value}
            key={tab.key}
            label={tab.label}
            layout={layout}
            leadingIcon={tab.leadingIcon}
            onChange={() => onChange(tab.key)}
            size={size}
            // Roving tabindex: only the active tab is reachable with Tab, and
            // the arrow keys move between the rest.
            tabIndex={tab.key === value ? 0 : -1}
          />
        ))}
      </div>
    </div>
  );
};
