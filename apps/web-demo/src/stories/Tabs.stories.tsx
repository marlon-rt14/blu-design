import type { TTabSize, TTabsLayout } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PlatformTabs } from './PlatformTabs';
import type { IPlatformTab, IPlatformTabsProps } from './PlatformTabs';
import { implementationFor } from './themeGlobals';

const SIZES: TTabSize[] = ['md', 'lg'];
const LAYOUTS: TTabsLayout[] = ['scrollable', 'fitted'];

const THREE: IPlatformTab[] = [
  { key: 'one', label: 'Tab 1' },
  { key: 'two', label: 'Tab 2' },
  { key: 'three', label: 'Tab 3' },
];

const FIVE: IPlatformTab[] = [
  ...THREE,
  { key: 'four', label: 'Tab 4' },
  { key: 'five', label: 'Tab 5' },
];

const BANDEJA: IPlatformTab[] = [
  { key: 'bandeja', label: 'Bandeja', leadingIcon: 'IconInbox01' },
  { key: 'pendientes', label: 'Pendientes', badge: 9 },
  { key: 'enviados', label: 'Enviados' },
];

const meta = {
  title: 'Molecules/Tabs',
  component: PlatformTabs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The tab **bar**, and the page\'s only public component: the tabs are data in ' +
          '`tabs`, not children, and `TabItem` is internal. The selection is not marked ' +
          'tab by tab either — there is one `value` holding the active `key`, which is why ' +
          'two active tabs is not a state this API can express. `layout` is scrollable ' +
          '(default, each tab hugs its label) or fitted (equal split; the indicator still ' +
          'hugs the content). `divider` is independent, default true. Canvas 375 is Figma\'s ' +
          'frame, not a code max-width. No TabPanel. Arrow keys move between tabs; Tab ' +
          'leaves the bar.',
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
      description: 'Propagates to every tab.',
      table: { category: 'Appearance', defaultValue: { summary: 'lg' } },
    },
    divider: {
      control: 'boolean',
      description: 'The line under the bar — also the one the indicator sits on.',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    tabs: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: { tabs: THREE, value: 'one', onChange: () => undefined },
  render: function Render(args, { globals }) {
    const [value, setValue] = useState('one');
    return (
      <PlatformTabs
        {...args}
        onChange={setValue}
        platform={implementationFor(globals)}
        value={value}
      />
    );
  },
} satisfies Meta<IPlatformTabsProps>;

export default meta;
type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. First tab selected. */
export const Playground: TStory = {};

/** Fitted splits the width equally. The indicator still hugs each label. */
export const Fitted: TStory = {
  args: { layout: 'fitted' },
};

/** Both sizes. Height follows `size/control/height/{md,lg}`. */
export const Sizes: TStory = {
  render: function Render(args, { globals }) {
    const [value, setValue] = useState('one');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {SIZES.map((size) => (
          <PlatformTabs
            {...args}
            key={size}
            onChange={setValue}
            platform={implementationFor(globals)}
            size={size}
            value={value}
          />
        ))}
      </div>
    );
  },
};

/** `divider` is independent. Off leaves only the selected indicator. */
export const WithoutDivider: TStory = {
  args: { divider: false },
};

/** Five tabs. Figma caps the master at six; the array has no such limit. */
export const FiveTabs: TStory = {
  args: { tabs: FIVE },
};

/**
 * Live example `97:18871`: Bandeja with a glyph, Pendientes with a badge of 9,
 * Enviados plain. The badge is a **number** — it is a count, and the component
 * formats it.
 */
export const WithIconAndBadge: TStory = {
  args: { tabs: BANDEJA, value: 'bandeja' },
  render: function Render(args, { globals }) {
    const [value, setValue] = useState('bandeja');
    return (
      <PlatformTabs
        {...args}
        onChange={setValue}
        platform={implementationFor(globals)}
        value={value}
      />
    );
  },
};

/** A disabled tab stays in the reading order and is skipped by the arrow keys. */
export const WithDisabled: TStory = {
  args: {
    tabs: [THREE[0]!, { key: 'two', label: 'Tab 2', disabled: true }, THREE[2]!],
  },
};
