import { TabItem as NativeTabItem, Tabs as NativeTabs } from '@dsm/mobile';
import type { ITabsBaseProps, TIconName } from '@dsm/shared';
import { TabItem as WebTabItem, Tabs as WebTabs } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** One item the wrapper will build — not a Figma `showItemN` toggle. */
export interface IPlatformTab {
  label: string;
  showLeadingIcon?: boolean;
  leadingIcon?: TIconName;
  showBadge?: boolean;
  badge?: string;
  isDisabled?: boolean;
}

/** Props of {@link PlatformTabs}: the shared contract plus the story's own knobs. */
export interface IPlatformTabsProps extends ITabsBaseProps {
  items?: IPlatformTab[];
  selected?: string;
  onSelect?: (label: string) => void;
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

const DEFAULT_ITEMS: IPlatformTab[] = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }];

/**
 * Renders either the web or the React Native Tabs bar with matching items.
 *
 * They have to come from the same platform as the bar, which is why this
 * builds them rather than taking children: a web TabItem inside the native
 * bar would not render at all.
 *
 * Figma's `showItem3`–`showItem6` are instance-visibility toggles on a
 * 6-slot master. Code uses `items` (min 2, max 6).
 */
export const PlatformTabs = ({
  items = DEFAULT_ITEMS,
  selected,
  onSelect,
  platform = 'web',
  size = 'lg',
  ...props
}: IPlatformTabsProps): ReactElement => {
  const chosen = selected ?? items[0]?.label;

  if (platform === 'native') {
    return (
      <NativeTabs {...props} size={size}>
        {items.map((item) => (
          <NativeTabItem
            badge={item.badge}
            isDisabled={item.isDisabled}
            isSelected={chosen === item.label}
            key={item.label}
            label={item.label}
            leadingIcon={item.leadingIcon}
            onPress={() => onSelect?.(item.label)}
            showBadge={item.showBadge}
            showLeadingIcon={item.showLeadingIcon}
            size={size}
          />
        ))}
      </NativeTabs>
    );
  }

  return (
    <WebTabs {...props} size={size}>
      {items.map((item) => (
        <WebTabItem
          badge={item.badge}
          isDisabled={item.isDisabled}
          isSelected={chosen === item.label}
          key={item.label}
          label={item.label}
          leadingIcon={item.leadingIcon}
          onChange={() => onSelect?.(item.label)}
          showBadge={item.showBadge}
          showLeadingIcon={item.showLeadingIcon}
          size={size}
        />
      ))}
    </WebTabs>
  );
};
