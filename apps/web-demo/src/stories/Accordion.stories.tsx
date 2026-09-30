import type { TAccordionAppearance } from '@dsm/shared';
import { IconCreditCard } from '@dsm/web/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { PlatformAccordion } from './PlatformAccordion';
import type { IPlatformAccordionProps, TPlatform } from './PlatformAccordion';
import { PlatformAccordionItem } from './PlatformAccordionItem';

const APPEARANCE_BG: Record<TAccordionAppearance, string> = {
  default: 'transparent',
  'on-scene': '#364481',
  'on-inverse': '#232b3d',
};

const SECTIONS = [
  { id: 'shipping', title: 'Envío', body: 'El envío estándar tarda de 3 a 5 días hábiles.' },
  { id: 'returns', title: 'Devoluciones', body: 'Podés devolver un producto hasta 30 días después de la compra.' },
  { id: 'payment', title: 'Métodos de pago', body: 'Aceptamos todas las tarjetas Diners Club y transferencia.' },
];

const meta = {
  title: 'Molecules/Accordion',
  component: PlatformAccordion,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The group that owns which sections are open. Unlike `RadioGroup`/`CheckboxGroup`/' +
          '`Tabs`, which all push selection state out to whoever renders their children, this ' +
          'one keeps it — `allowMultiple={false}` has to close every other section the instant ' +
          'one opens, which needs one owner of the whole open/closed set.\n\n' +
          '**Controlled/uncontrolled, the same shape as a native `<input>`**: `expanded` + ' +
          '`onExpandedChange` for a caller that owns the array itself, `defaultExpanded` for ' +
          "one that doesn't.\n\n" +
          '**`appearance`/`size` set here apply to every section** — an `AccordionItem` never ' +
          'picks its own.',
      },
    },
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['default', 'on-scene', 'on-inverse'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
    allowMultiple: {
      control: 'boolean',
      description: 'Whether more than one section can stay open at once.',
      table: { category: 'Behavior', defaultValue: { summary: 'true' } },
    },
    expanded: { table: { disable: true } },
    defaultExpanded: { table: { disable: true } },
    onExpandedChange: { table: { disable: true } },
    children: { table: { disable: true } },
    testID: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    allowMultiple: true,
    // Required by the contract, so the meta has to supply one. Every `render`
    // below replaces it with real `AccordionItem` sections built from `SECTIONS`.
    children: null,
    testID: 'accordion',
  },
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ padding: 24, maxWidth: 480, backgroundColor: APPEARANCE_BG[args.appearance ?? 'default'] }}>
        <PlatformAccordion {...args} defaultExpanded={['shipping']} platform={platform}>
          {SECTIONS.map((section) => (
            <PlatformAccordionItem
              icon={<IconCreditCard />}
              id={section.id}
              key={section.id}
              platform={platform}
              title={section.title}
            >
              {section.body}
            </PlatformAccordionItem>
          ))}
        </PlatformAccordion>
      </div>
    );
  },
} satisfies Meta<IPlatformAccordionProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** `allowMultiple={false}` closes whichever section was open the instant another one opens. */
export const SingleOpen: TStory = {
  args: { allowMultiple: false },
};

/** A controlled Accordion — the app owns `expanded` and reacts to `onExpandedChange` itself. */
const ControlledDemo = (props: IPlatformAccordionProps): ReactElement => {
  const [expanded, setExpanded] = useState<string[]>(['shipping']);
  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <p style={{ fontSize: 12, opacity: 0.65 }}>open: {expanded.join(', ') || '(none)'}</p>
      <PlatformAccordion {...props} expanded={expanded} onExpandedChange={setExpanded}>
        {SECTIONS.map((section) => (
          <PlatformAccordionItem
            icon={<IconCreditCard />}
            id={section.id}
            key={section.id}
            platform={props.platform}
            title={section.title}
          >
            {section.body}
          </PlatformAccordionItem>
        ))}
      </PlatformAccordion>
    </div>
  );
};

export const Controlled: TStory = {
  render: (args, { globals }) => <ControlledDemo {...args} platform={globals.platform as TPlatform} />,
};

/** One section disabled — its header can't be pressed and never shows hover. */
export const WithDisabledItem: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ padding: 24, maxWidth: 480 }}>
        <PlatformAccordion {...args} defaultExpanded={['shipping']} platform={platform}>
          {SECTIONS.map((section) => (
            <PlatformAccordionItem
              disabled={section.id === 'payment'}
              icon={<IconCreditCard />}
              id={section.id}
              key={section.id}
              platform={platform}
              title={section.title}
            >
              {section.body}
            </PlatformAccordionItem>
          ))}
        </PlatformAccordion>
      </div>
    );
  },
};
