import type { TCheckboxSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import { PlatformCheckbox } from './PlatformCheckbox';
import type { IPlatformCheckboxProps, TPlatform } from './PlatformCheckbox';

const SIZES: TCheckboxSize[] = ['sm', 'md'];

const Row = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>{children}</div>
);

const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
);

/**
 * Multi-instance stories cannot share the panel's single args object.
 */
const IsolatedPlatformCheckbox = (props: IPlatformCheckboxProps): ReactElement => {
  const [isChecked, setIsChecked] = useState(props.isChecked ?? false);
  const [isIndeterminate, setIsIndeterminate] = useState(props.isIndeterminate ?? false);
  return (
    <PlatformCheckbox
      {...props}
      isChecked={isChecked}
      isIndeterminate={isIndeterminate}
      onValueChange={(next) => {
        setIsIndeterminate(false);
        setIsChecked(next);
      }}
    />
  );
};

const meta = {
  title: 'Atoms/Checkbox',
  component: PlatformCheckbox,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Tick box with an optional label. No CheckboxList in Figma — stack `Checkbox`, ' +
          'or use ChoiceItem (`control=checkbox`) for a list row. `isIndeterminate` is ' +
          '`checked=false` + the DOM `indeterminate` property. Focus is an offset ring, ' +
          'kept on a checked box.',
      },
    },
  },
  argTypes: {
    isChecked: {
      control: 'boolean',
      description: 'Whether the box is checked. Ignored while `isIndeterminate` is true.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    isIndeterminate: {
      control: 'boolean',
      description:
        'Partial selection: selected fill + minus mark. Pair with `isChecked={false}`. Clicking follows native (→ checked).',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'sm: 16 box / 12 mark / 32 row. md: 24 box / 16 mark / 48 row.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and paints the disabled tokens.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    label: {
      control: 'text',
      description: 'Visible label to the right of the box. Shown only when `showLabel` is true.',
      table: { category: 'Content' },
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether the label renders. Independent of `label` being set.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name when `showLabel` is false.',
      table: { category: 'Content' },
    },
    testID: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    isChecked: false,
    isIndeterminate: false,
    isDisabled: false,
    size: 'md',
    label: 'Etiqueta de la opcion',
    showLabel: true,
  },
  render: (args, { globals }) => {
    // Must run here — Storybook preview hooks are illegal in child components.
    const [, updateArgs] = useArgs();
    return (
      <PlatformCheckbox
        {...args}
        platform={globals['platform'] as TPlatform}
        onValueChange={(isChecked) => {
          updateArgs({ isChecked, isIndeterminate: false });
        }}
      />
    );
  },
} satisfies Meta<IPlatformCheckboxProps>;

export default meta;

type TStory = StoryObj<IPlatformCheckboxProps>;

export const Playground: TStory = {};

export const Sizes: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        {SIZES.map((size) => (
          <IsolatedPlatformCheckbox
            key={`${size}-off`}
            label={`size=${size}`}
            platform={platform}
            size={size}
          />
        ))}
        {SIZES.map((size) => (
          <IsolatedPlatformCheckbox
            isChecked
            key={`${size}-on`}
            label={`size=${size}`}
            platform={platform}
            size={size}
          />
        ))}
      </Row>
    );
  },
};

export const Checked: TStory = {
  args: { isChecked: true },
};

export const Indeterminate: TStory = {
  args: { isChecked: false, isIndeterminate: true },
};

export const Disabled: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Row>
        <PlatformCheckbox isDisabled label="Unchecked" platform={platform} />
        <PlatformCheckbox isChecked isDisabled label="Checked" platform={platform} />
        <PlatformCheckbox isDisabled isIndeterminate label="Indeterminate" platform={platform} />
      </Row>
    );
  },
};

export const WithoutLabel: TStory = {
  args: { showLabel: false, accessibilityLabel: 'Etiqueta de la opcion', isChecked: true },
};

export const States: TStory = {
  render: (_args, { globals }) => {
    const platform = globals['platform'] as TPlatform;
    return (
      <Column>
        {SIZES.map((size) => (
          <Row key={size}>
            <IsolatedPlatformCheckbox label={`${size} unchecked`} platform={platform} size={size} />
            <IsolatedPlatformCheckbox
              isChecked
              label={`${size} checked`}
              platform={platform}
              size={size}
            />
            <IsolatedPlatformCheckbox
              isIndeterminate
              label={`${size} indeterminate`}
              platform={platform}
              size={size}
            />
            <PlatformCheckbox isDisabled label={`${size} disabled`} platform={platform} size={size} />
            <PlatformCheckbox
              isChecked
              isDisabled
              label={`${size} checked disabled`}
              platform={platform}
              size={size}
            />
          </Row>
        ))}
      </Column>
    );
  },
};
