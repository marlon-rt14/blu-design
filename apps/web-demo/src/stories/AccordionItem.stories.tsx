import type { TAccordionAppearance, TAccordionSize } from '@dsm/shared';
import { IconCreditCard01 } from '@dsm/web/icons/finance-ecommerce';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PlatformAccordionItem } from './PlatformAccordionItem';
import type { IPlatformAccordionItemProps, TPlatform } from './PlatformAccordionItem';

const APPEARANCES: TAccordionAppearance[] = ['default', 'on-scene', 'on-inverse'];
const SIZES: TAccordionSize[] = ['sm', 'lg'];

const APPEARANCE_BG: Record<TAccordionAppearance, string> = {
  default: 'transparent',
  'on-scene': '#364481',
  'on-inverse': '#232b3d',
};

const meta = {
  title: 'Atoms/AccordionItem',
  component: PlatformAccordionItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "One section's header (title, optional icon, chevron) plus its content panel. " +
          "**`isExpanded`/`onToggle` are not props an app sets directly** once this lives " +
          "inside an `Accordion` — the parent injects them, the same way `Tabs` injects " +
          '`layout`/`tabIndex` into every `TabItem`. Standalone (as in this story), it ' +
          "manages nothing and just reflects whatever `isExpanded` is passed.\n\n" +
          '`appearance`/`size` are meant to be set once on the parent `Accordion`, not per ' +
          'item — this story exposes them only because the atom has to render sensibly on ' +
          'its own.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    icon: { table: { disable: true } },
    isExpanded: {
      control: 'boolean',
      description: 'Whether the panel is open. Injected by Accordion — set directly here only for the story.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    appearance: {
      control: 'inline-radio',
      options: APPEARANCES,
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    showDivider: { control: 'boolean', table: { category: 'Appearance', defaultValue: { summary: 'false' } } },
    id: { table: { disable: true } },
    children: { table: { disable: true } },
    onToggle: { table: { disable: true } },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    id: 'shipping',
    title: 'Envío',
    icon: <IconCreditCard01 />,
    children: 'El envío estándar tarda de 3 a 5 días hábiles.',
    isExpanded: true,
    onToggle: fn(),
    testID: 'accordion-item',
  },
  render: (args, { globals }) => (
    <div style={{ padding: 24, maxWidth: 480, backgroundColor: APPEARANCE_BG[args.appearance ?? 'default'] }}>
      <PlatformAccordionItem {...args} platform={globals.platform as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformAccordionItemProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** No `icon` — the leading slot is presence-based, same convention as Callout. */
export const NoIcon: TStory = {
  args: { icon: undefined },
};

/** A `disabled` header can't be pressed, doesn't take focus, and never shows hover. */
export const Disabled: TStory = {
  args: { disabled: true },
};

/** The three surfaces this can sit on. */
export const Appearances: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, maxWidth: 480 }}>
        {APPEARANCES.map((appearance) => (
          <div key={appearance} style={{ padding: 16, backgroundColor: APPEARANCE_BG[appearance] }}>
            <PlatformAccordionItem {...args} appearance={appearance} platform={platform} />
          </div>
        ))}
      </div>
    );
  },
};
