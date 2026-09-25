import { Tabs as NativeTabs } from '@dsm/mobile';
import type { ITabDef, ITabsBaseProps } from '@dsm/shared';
import { Tabs as WebTabs } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/**
 * One tab as a story writes it: the glyph by export name, not as a node.
 *
 * The only difference from the real {@link ITabDef} — a Storybook control
 * cannot hand over an element.
 */
export interface IPlatformTab extends Omit<ITabDef, 'leadingIcon'> {
  leadingIcon?: TIconExportName;
}

/** Props of {@link PlatformTabs}: the shared contract with story-shaped tabs. */
export interface IPlatformTabsProps extends Omit<ITabsBaseProps, 'tabs'> {
  tabs: IPlatformTab[];
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

/**
 * Renders either the web or the React Native Tabs bar from the same props.
 *
 * Almost nothing to bridge since the bar took the contract's shape: both
 * platforms speak `tabs`, `value` and `onChange`. What is left is the glyph,
 * which has to come from the matching package — tabs draw theirs at
 * `size/icon/sm` (16) at both steps.
 */
export const PlatformTabs = ({ tabs, platform = 'web', ...props }: IPlatformTabsProps): ReactElement => {
  const resolved: ITabDef[] = tabs.map((tab) => ({
    ...tab,
    leadingIcon: iconNode(tab.leadingIcon, platform, 'sm'),
  }));
  return platform === 'native' ? (
    <NativeTabs {...props} tabs={resolved} />
  ) : (
    <WebTabs {...props} tabs={resolved} />
  );
};
