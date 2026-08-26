import type { TTextFieldSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { PlatformTextField } from './PlatformTextField';
import type { IPlatformTextFieldProps, TPlatform } from './PlatformTextField';

const SIZES: TTextFieldSize[] = ['medium', 'large'];

/** Lays several fields out in a column, so labels and helper text stay readable. */
const Column = ({ children }: { children: ReactNode }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 280 }}>{children}</div>
);

/**
 * `PlatformTextField` is controlled, so the story needs to hold its own state
 * to make typing possible in the canvas. `value` is intentionally left out of
 * the controls panel (see `argTypes` below) — it is owned by this wrapper, not
 * by Storybook's args.
 */
const ControlledPlatformTextField = (props: IPlatformTextFieldProps): ReactElement => {
  const [value, setValue] = useState(props.value);
  return <PlatformTextField {...props} value={value} onValueChange={setValue} />;
};

/**
 * The props table below describes the shared contract from `@dsm/shared`,
 * which both implementations honour. `argTypes` are declared explicitly
 * rather than inferred, because react-docgen cannot resolve props inherited
 * from another package.
 */
const meta = {
  title: 'Atoms/TextField',
  component: PlatformTextField,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Use the **Platform** dropdown to switch between the React implementation ' +
          '(`@dsm/web`) and the React Native one (`@dsm/mobile`), and the **Theme** ' +
          'dropdown to preview light and dark. Both implementations take the same ' +
          'props and read the same `theme/base` (light) and `theme/dark` token export ' +
          'from `@dsm/shared` — web through CSS custom properties, mobile through ' +
          '`useThemeMode()`.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Rendered above the field.',
    },
    placeholder: {
      control: 'text',
      description: 'Shown when the field is empty.',
    },
    helperText: {
      control: 'text',
      description: 'Rendered below the field. Hidden while `errorMessage` is set.',
    },
    errorMessage: {
      control: 'text',
      description: 'Rendered below the field instead of `helperText`, styled as an error.',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Applies the invalid styling without necessarily showing a message.',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Drives height, corner radius and horizontal padding.',
      table: { defaultValue: { summary: 'medium' } },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { defaultValue: { summary: 'false' } },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Shows the value but blocks editing.',
      table: { defaultValue: { summary: 'false' } },
    },
    maxLength: {
      control: 'number',
      description: 'When set, renders a `"n / max"` counter below the field.',
    },
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
    },
    onValueChange: {
      description: 'Mapped to `onChange` on web and to `onChangeText` on mobile.',
    },
    // Owned by ControlledPlatformTextField, not by the controls panel — see above.
    value: { table: { disable: true } },
    // Driven by the toolbar, not by the controls panel.
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    value: '',
  },
  render: (args, { globals }) => (
    <ControlledPlatformTextField {...args} platform={globals['platform'] as TPlatform} />
  ),
} satisfies Meta<IPlatformTextFieldProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** With helper text guiding the user before any validation has run. */
export const WithHelperText: TStory = {
  args: { helperText: "We'll never share your email." },
};

/** Invalid state with a message. The border and helper text switch to the error colour. */
export const ErrorState: TStory = {
  args: { value: 'not-an-email', errorMessage: 'Enter a valid email address.' },
};

/** The two sizes side by side, so the metric scale is easy to compare. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <Column>
      {SIZES.map((size) => (
        <ControlledPlatformTextField
          {...args}
          key={size}
          label={size}
          platform={globals['platform'] as TPlatform}
          size={size}
        />
      ))}
    </Column>
  ),
};

/** Blocks interaction entirely — the handler must not fire in this state. */
export const Disabled: TStory = {
  args: { value: 'Locked value', isDisabled: true },
};

/** Shows a value the user cannot edit through this control — a different look from disabled. */
export const ReadOnly: TStory = {
  args: { label: 'Account number', value: '1234 5678 9012', isReadOnly: true },
};

/** With a `maxLength`, rendering the `"n / max"` counter below the field. */
export const WithCounter: TStory = {
  args: { label: 'Bio', value: 'Building the Blu design system.', maxLength: 120 },
};
