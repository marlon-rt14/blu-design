import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import { PlatformChoiceBox } from './PlatformChoiceBox';
import type { IPlatformChoiceBoxProps, TPlatform } from './PlatformChoiceBox';

const Row = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>{children}</div>
);

const IsolatedPlatformChoiceBox = (props: IPlatformChoiceBoxProps): ReactElement => {
  const [isSelected, setIsSelected] = useState(props.isSelected ?? false);
  return <PlatformChoiceBox {...props} isSelected={isSelected} onValueChange={setIsSelected} />;
};

const meta = {
  title: 'Atoms/ChoiceBox',
  component: PlatformChoiceBox,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Selectable surface tile with a title and optional description. It is controlled: ' +
          'the parent owns `isSelected` and receives the next value through the platform event handler.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    icon: { control: 'select', options: ['image', 'check-circle', 'star', 'user'], table: { category: 'Content' } },
    variant: {
      control: 'inline-radio',
      options: ['row', 'tile', 'compact'],
      table: { category: 'Appearance', defaultValue: { summary: 'row' } },
    },
    description: { control: 'text', table: { category: 'Content' } },
    showDescription: {
      control: 'boolean',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showMedia: {
      control: 'boolean',
      description: "Whether the icon slot renders. Forced off when `variant='compact'`.",
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showControl: {
      control: 'boolean',
      description: "Whether the mirrored Checkbox renders. Forced off when `variant='compact'`.",
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the choice is selected. Controlled.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    isDisabled: {
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    testID: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    variant: 'row',
    icon: 'image',
    title: 'Plan mensual',
    description: 'Cambia o cancela cuando quieras.',
    showDescription: true,
    showMedia: true,
    showControl: true,
    isSelected: false,
    isDisabled: false,
  },
  render: (args, { globals }) => {
    const [, updateArgs] = useArgs();
    return (
      <PlatformChoiceBox
        {...args}
        platform={globals['platform'] as TPlatform}
        onValueChange={(isSelected) => updateArgs({ isSelected })}
      />
    );
  },
} satisfies Meta<IPlatformChoiceBoxProps>;

export default meta;

type TStory = StoryObj<IPlatformChoiceBoxProps>;

export const Playground: TStory = {};

export const Selected: TStory = {
  args: { isSelected: true },
};

export const WithoutDescription: TStory = {
  args: { showDescription: false },
};

export const Tile: TStory = {
  args: { variant: 'tile' },
  render: (args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 200px)', gap: 16 }}>
        <IsolatedPlatformChoiceBox {...args} platform={platform} title="Mensaje de texto" description="Al ****6760" />
        <IsolatedPlatformChoiceBox {...args} isSelected platform={platform} title="Correo" description="A j****@mail.com" />
        <IsolatedPlatformChoiceBox {...args} platform={platform} title="Llamada" description="Al ****6760" />
        <IsolatedPlatformChoiceBox {...args} platform={platform} title="App blu" description="Notificacion push" />
      </div>
    );
  },
};

export const Compact: TStory = {
  args: { variant: 'compact' },
  render: (args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <IsolatedPlatformChoiceBox {...args} platform={platform} title="3 cuotas" description="Sin interes" />
        <IsolatedPlatformChoiceBox {...args} isSelected platform={platform} title="6 cuotas" description="Con interes" />
        <IsolatedPlatformChoiceBox {...args} platform={platform} title="12 cuotas" description="Con interes" />
      </Row>
    );
  },
};

export const Disabled: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <PlatformChoiceBox isDisabled isSelected platform={platform} title="Seleccionada" />
        <PlatformChoiceBox isDisabled platform={platform} title="No disponible" />
      </Row>
    );
  },
};

export const States: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <IsolatedPlatformChoiceBox
          description="Estado inicial"
          platform={platform}
          showDescription
          title="Sin seleccionar"
        />
        <IsolatedPlatformChoiceBox
          description="Estado activo"
          isSelected
          platform={platform}
          showDescription
          title="Seleccionada"
        />
        <PlatformChoiceBox
          description="Estado bloqueado"
          isDisabled
          platform={platform}
          showDescription
          title="Deshabilitada"
        />
      </Row>
    );
  },
};