import type { TIconName, TTabSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { fn } from 'storybook/test';

import { PlatformTabItem } from './PlatformTabItem';
import type { IPlatformTabItemProps, TPlatform } from './PlatformTabItem';

const SIZES: TTabSize[] = ['md', 'lg'];

const Group = ({ title, children }: { title: string; children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 12, opacity: 0.6 }}>{title}</span>
    {children}
  </div>
);

const ICONS: TIconName[] = ['user', 'search', 'star', 'flag'];

const meta = {
  title: 'Atoms/TabItem',
  component: PlatformTabItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One option in a Tabs bar. Live Figma set is **Tab item** (`isSelected`, not ' +
          '`selected`). ExtraBold at every state — colour carries inactive vs active. ' +
          'The selected indicator hugs the content, not the full tab width. Leading icon ' +
          'is always `size/icon/sm` (16). Badge is painted locally (Badge is not shipped). ' +
          '`showLeadingIcon` / `showBadge` are independent booleans.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content', defaultValue: { summary: 'Label' } } },
    isSelected: {
      control: 'boolean',
      description: 'Figma axis `isSelected`. Controlled — the TabItem never flips it.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'md 44 / `text/label/md` 14. lg 56 / `text/label/lg` 16.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    showLeadingIcon: {
      control: 'boolean',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    leadingIcon: {
      control: 'select',
      options: ICONS,
      description: 'Instance-swap. Only visible when `showLeadingIcon` is on. Default `user`.',
      table: { category: 'Content', defaultValue: { summary: 'user' } },
    },
    showBadge: {
      control: 'boolean',
      table: { category: 'Content', defaultValue: { summary: 'false' } },
    },
    badge: {
      control: 'text',
      description: 'Count on the nested Badge. Only visible when `showBadge` is on.',
      table: { category: 'Content', defaultValue: { summary: '9' } },
    },
    isDisabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    testID: { control: 'text', table: { category: 'Other' } },
    platform: { table: { disable: true } },
  },
  args: { label: 'Label', onAction: fn() },
  render: (args, { globals }) => (
    <PlatformTabItem {...args} platform={globals.platform as TPlatform} />
  ),
} satisfies Meta<IPlatformTabItemProps>;

export default meta;
type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {
  args: { isSelected: true },
};

/** Both sizes, selected and not. ExtraBold at every state. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {SIZES.map((size) => (
        <Group key={size} title={`${size} · ${size === 'md' ? 44 : 56}`}>
          <div style={{ display: 'flex', gap: 16 }}>
            <PlatformTabItem {...args} platform={globals.platform as TPlatform} size={size} />
            <PlatformTabItem {...args} isSelected platform={globals.platform as TPlatform} size={size} />
          </div>
        </Group>
      ))}
    </div>
  ),
};

/**
 * The states that are props. Hover, press and focus come from real interaction —
 * hover/press overlay `radius/control/sm` behind the content, and focus draws
 * Switch's flush 2px ring.
 */
export const States: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <Group title="unselected">
          <PlatformTabItem {...args} platform={platform} />
        </Group>
        <Group title="selected">
          <PlatformTabItem {...args} isSelected platform={platform} />
        </Group>
        <Group title="disabled">
          <PlatformTabItem {...args} isDisabled platform={platform} />
        </Group>
        <Group title="disabled + selected — indicator uses indicator.bg-disabled">
          <PlatformTabItem {...args} isDisabled isSelected platform={platform} />
        </Group>
        <Group title="hover / pressed / focus — interact to see them">
          <PlatformTabItem {...args} platform={platform} />
        </Group>
      </div>
    );
  },
};

/** Leading icon is always 16, at both sizes. Default glyph is `user`. */
export const WithLeadingIcon: TStory = {
  args: { showLeadingIcon: true, isSelected: true },
};

/** Nested Badge `neutral` `count`. Independent of the icon. */
export const WithBadge: TStory = {
  args: { showBadge: true },
};

/** Both slots on, matching the "Bandeja / Pendientes" example. */
export const WithIconAndBadge: TStory = {
  args: { showLeadingIcon: true, showBadge: true, isSelected: true, label: 'Bandeja' },
};
