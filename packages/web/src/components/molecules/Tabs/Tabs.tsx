import { Children, cloneElement, isValidElement } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';

import type { ITabItemProps } from '../../atoms/TabItem';
import type { ITabsProps } from './Tabs.types';
import { useTabs } from './useTabs';

/**
 * Web Tabs — the tab bar: 2–6 TabItems plus the bottom divider the
 * selected indicator sits on.
 *
 * `role="tablist"`. Arrow keys move between enabled tabs (and activate
 * them); Tab leaves the bar. `showItem3`–`showItem6` are not an API —
 * pass children. `showDivider` is an independent boolean, default `true`.
 *
 * Canvas width 375 is Figma's "a sangre" frame, not a code max-width.
 * The bar fills its parent. No TabPanel — Figma does not ship one.
 *
 * @example
 * ```tsx
 * <Tabs>
 *   <TabItem isSelected={tab === 'one'} label="Tab 1" onChange={() => setTab('one')} />
 *   <TabItem label="Tab 2" onChange={() => setTab('two')} />
 *   <TabItem label="Tab 3" onChange={() => setTab('three')} />
 * </Tabs>
 * ```
 */
export const Tabs = (props: ITabsProps): ReactElement => {
  const { children, layout = 'scrollable', size = 'md', showDivider = true, testID } = props;
  const { rootStyle, listStyle, dividerStyle } = useTabs(props);

  const items = Children.map(children, (child) => {
    if (!isValidElement<ITabItemProps>(child)) return child;
    return cloneElement(child, {
      layout: child.props.layout ?? layout,
      size: child.props.size ?? size,
      tabIndex: child.props.isSelected ? 0 : -1,
    });
  });

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
      {showDivider ? <div aria-hidden style={dividerStyle} /> : null}
      <div onKeyDown={handleKeyDown} role="tablist" style={listStyle}>
        {items}
      </div>
    </div>
  );
};
