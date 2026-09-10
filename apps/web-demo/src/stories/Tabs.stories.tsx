import type { TTabSize, TTabsLayout } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PlatformTabs } from './PlatformTabs';
import type { IPlatformTab, IPlatformTabsProps, TPlatform } from './PlatformTabs';

const SIZES: TTabSize[] = ['md', 'lg'];
const LAYOUTS: TTabsLayout[] = ['scrollable', 'fitted'];

const DEFAULT_ITEMS: IPlatformTab[] = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }];

const FIVE: IPlatformTab[] = [
  { label: 'Tab 1' },
  { label: 'Tab 2' },
  { label: 'Tab 3' },
  { label: 'Tab 4' },
  { label: 'Tab 5' },
];

const BANDEJA: IPlatformTab[] = [
  { label: 'Bandeja', showLeadingIcon: true },
  { label: 'Pendientes', showBadge: true, badge: '9' },
  { label: 'Enviados' },
];

const meta = {
  title: 'Molecules/Tabs',
  component: PlatformTabs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The tab **bar**: 2–6 TabItems plus the bottom divider the selected indicator ' +
          'sits on. `layout` is scrollable (default, each tab hugs its label) or fitted ' +
          '(equal split; indicator still hugs content). Figma\'s `showItem3`–`showItem6` ' +
          'are not an API — pass children. `showDivider` is independent, default true. ' +
          'Canvas 375 is Figma\'s frame, not a code max-width. No TabPanel. Arrow keys move ' +
          'between tabs; Tab leaves the bar.',
      },
    },
  },
  argTypes: {
    layout: {
      control: 'inline-radio',
      options: LAYOUTS,
      table: { category: 'Appearance', defaultValue: { summary: 'scrollable' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Must match the TabItems inside.',
      table: { category: 'Appearance', defaultValue: { summary: 'lg' } },
    },
    showDivider: {
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    items: { table: { disable: true } },
    selected: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {},
  render: function Render(args, { globals }) {
    const [selected, setSelected] = useState(DEFAULT_ITEMS[0]?.label);
    return (
      <PlatformTabs
        {...args}
        items={DEFAULT_ITEMS}
        onSelect={setSelected}
        platform={globals.platform as TPlatform}
        selected={selected}
      />
    );
  },
} satisfies Meta<IPlatformTabsProps>;

export default meta;
type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. First tab selected. */
export const Playground: TStory = {};

/** Fitted splits the width equally. Indicator still hugs each label. */
export const Fitted: TStory = {
  args: { layout: 'fitted' },
};

/** Both sizes. Height follows `size/control/height/{md,lg}`. */
export const Sizes: TStory = {
  render: function Render(args, { globals }) {
    const [selected, setSelected] = useState('Tab 1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {SIZES.map((size) => (
          <PlatformTabs
            {...args}
            key={size}
            items={DEFAULT_ITEMS}
            onSelect={setSelected}
            platform={globals.platform as TPlatform}
            selected={selected}
            size={size}
          />
        ))}
      </div>
    );
  },
};

/** `showDivider` is independent. Off leaves only the selected indicator. */
export const WithoutDivider: TStory = {
  args: { showDivider: false },
};

/** Five items. Figma caps the master at 6; code uses children. */
export const FiveItems: TStory = {
  render: function Render(args, { globals }) {
    const [selected, setSelected] = useState(FIVE[0]?.label);
    return (
      <PlatformTabs
        {...args}
        items={FIVE}
        onSelect={setSelected}
        platform={globals.platform as TPlatform}
        selected={selected}
      />
    );
  },
};

/** Live example `97:18871`: Bandeja (icon + selected), Pendientes + badge 9, Enviados. */
export const WithIconAndBadge: TStory = {
  render: function Render(args, { globals }) {
    const [selected, setSelected] = useState(BANDEJA[0]?.label);
    return (
      <PlatformTabs
        {...args}
        items={BANDEJA}
        onSelect={setSelected}
        platform={globals.platform as TPlatform}
        selected={selected}
      />
    );
  },
};

/** A disabled tab is skipped by the arrow keys. */
export const WithDisabled: TStory = {
  render: function Render(args, { globals }) {
    const items: IPlatformTab[] = [
      { label: 'Tab 1' },
      { label: 'Tab 2', isDisabled: true },
      { label: 'Tab 3' },
    ];
    const [selected, setSelected] = useState(items[0]?.label);
    return (
      <PlatformTabs
        {...args}
        items={items}
        onSelect={setSelected}
        platform={globals.platform as TPlatform}
        selected={selected}
      />
    );
  },
};
