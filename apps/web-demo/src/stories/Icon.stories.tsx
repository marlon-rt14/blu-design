import type { TIconName, TIconSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { PlatformIcon } from './PlatformIcon';
import type { IPlatformIconProps, TPlatform } from './PlatformIcon';

const NAMES: TIconName[] = ['icon'];
const SIZES: TIconSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];

/** Lays several icons out in a wrapping row. */
const Row = ({ children }: { children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>{children}</div>
);

/** A labelled row, stacked under its caption. */
const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    <Row>{children}</Row>
  </div>
);

const meta = {
  title: 'Atoms/Icon',
  component: PlatformIcon,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Temporary Icon stub. Ships a single `name="icon"` glyph (Figma `icon/placeholder`) ' +
          'until the real Icon set lands. The `name` + `size` contract is stable — expanding ' +
          '`TIconName` later does not change TextField\'s affix API. Size axis matches Figma: ' +
          '`2xs` 8 / `xs` 12 / `sm` 16 / `md` 24 / `lg` 32 / `xl` 40. Color defaults to ' +
          '`color/icon/primary`; TextField overrides with `textfield.icon.*`.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: NAMES,
      description: 'Which glyph to render. The stub only has `icon`.',
      table: { category: 'Content', defaultValue: { summary: 'icon' } },
    },
    size: {
      control: 'select',
      options: SIZES,
      description: 'Physical size. Maps 1:1 onto `dimension.size.icon.*`.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    color: {
      control: 'color',
      description: 'Fill override. Leave empty to use `color.color.icon.primary`.',
      table: { category: 'Appearance' },
    },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    name: 'icon',
    size: 'md',
  },
} satisfies Meta<IPlatformIconProps>;

export default meta;

type TStory = StoryObj<IPlatformIconProps>;

export const Default: TStory = {
  render: (args, { globals }) => <PlatformIcon {...args} platform={globals['platform'] as TPlatform} />,
};

/** Every size on the live Figma axis, same glyph. */
export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Group title="2xs → xl">
        {SIZES.map((size) => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PlatformIcon name="icon" platform={platform} size={size} />
            <span style={{ fontSize: 11, opacity: 0.65 }}>{size}</span>
          </div>
        ))}
      </Group>
    );
  },
};
