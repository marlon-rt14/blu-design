import type { TListItemLeadingContent, TListItemSize } from '@dsm/shared';
import { IconChevronRight } from '@dsm/web/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';

import { PlatformListItem } from './PlatformListItem';
import type { IPlatformListItemProps, TPlatform } from './PlatformListItem';

const LEADING_CONTENTS: TListItemLeadingContent[] = ['none', 'icon', 'avatar'];
const SIZES: TListItemSize[] = ['sm', 'md'];

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', width: 320 }}>{children}</div>
);

const meta = {
  title: 'Molecules/ListItem',
  component: PlatformListItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The row of a list — a transaction, a contact, a product. Not every row navigates: pass `onAction` " +
          'to make it a real target with its own hover/pressed/focus painting; leave it out for a row that is ' +
          'plain content.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    leadingContent: {
      control: 'inline-radio',
      options: LEADING_CONTENTS,
      table: { category: 'Appearance', defaultValue: { summary: 'none' } },
    },
    icon: { control: 'select', options: ['user', 'store', 'image'], table: { category: 'Content' } },
    avatarInitials: { control: 'text', table: { category: 'Content' } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    showDescription: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    description: { control: 'text', table: { category: 'Content' } },
    showTrailingText: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    trailingText: { control: 'text', table: { category: 'Content' } },
    showTrailing: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    showDivider: { control: 'boolean', table: { category: 'Content', defaultValue: { summary: 'false' } } },
    isDisabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    testID: { table: { disable: true } },
    trailing: { table: { disable: true } },
    onAction: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Título del elemento',
    leadingContent: 'none',
    icon: 'user',
    avatarInitials: 'JG',
    size: 'md',
    showDescription: false,
    description: 'Descripción secundaria',
    showTrailingText: false,
    trailingText: '$1.250,00',
    showTrailing: false,
    showDivider: false,
    isDisabled: false,
  },
  render: (args, { globals }) => (
    <Column>
      <PlatformListItem {...args} platform={globals['platform'] as TPlatform} />
    </Column>
  ),
} satisfies Meta<IPlatformListItemProps>;

export default meta;

type TStory = StoryObj<IPlatformListItemProps>;

export const Playground: TStory = {};

export const LeadingContent: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {LEADING_CONTENTS.map((leadingContent) => (
          <PlatformListItem
            avatarInitials="JG"
            icon="user"
            key={leadingContent}
            label="Título del elemento"
            leadingContent={leadingContent}
            platform={platform}
          />
        ))}
      </Column>
    );
  },
};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {SIZES.map((size) => (
          <PlatformListItem avatarInitials="JG" key={size} label="Título del elemento" leadingContent="avatar" platform={platform} size={size} />
        ))}
      </Column>
    );
  },
};

export const WithDescriptionAndTrailingText: TStory = {
  args: {
    leadingContent: 'avatar',
    showDescription: true,
    showTrailingText: true,
  },
};

export const WithTrailingIcon: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        <PlatformListItem
          label="Ver todos los contactos"
          leadingContent="icon"
          onAction={() => undefined}
          platform={platform}
          showTrailing
          trailing={<IconChevronRight color="secondary" size="sm" />}
        />
      </Column>
    );
  },
};

export const WithDivider: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        <PlatformListItem label="Envío a Juan García" leadingContent="avatar" avatarInitials="JG" platform={platform} showDivider />
        <PlatformListItem label="Pago de servicios" leadingContent="avatar" avatarInitials="MP" platform={platform} />
      </Column>
    );
  },
};

export const Interactive: TStory = {
  args: { leadingContent: 'avatar' },
  render: (args, { globals }) => (
    <Column>
      <PlatformListItem {...args} onAction={() => undefined} platform={globals['platform'] as TPlatform} />
    </Column>
  ),
};

export const Disabled: TStory = {
  args: { leadingContent: 'avatar', isDisabled: true },
  render: (args, { globals }) => (
    <Column>
      <PlatformListItem {...args} onAction={() => undefined} platform={globals['platform'] as TPlatform} />
    </Column>
  ),
};
