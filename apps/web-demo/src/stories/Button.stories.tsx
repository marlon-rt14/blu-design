import type { TButtonSize, TButtonVariant } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';

import { PlatformButton } from './PlatformButton';
import type { IPlatformButtonProps, TPlatform } from './PlatformButton';

const VARIANTS: TButtonVariant[] = ['primary', 'secondary'];
const SIZES: TButtonSize[] = ['small', 'medium', 'large'];

/** Lays several buttons out in a wrapping row. */
const Row = ({ children }: { children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    {children}
  </div>
);

/**
 * The props table below describes the shared contract from `@dsm/shared`, which
 * both implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Atoms/Button',
  component: PlatformButton,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Use the **Platform** dropdown in the toolbar to switch between the React ' +
          'implementation (`@dsm/web`) and the React Native one (`@dsm/mobile`). They ' +
          'take the same props and share the same colour and spacing scales, but each ' +
          'owns its own look: the web one is a pill with an uppercase label and a hover ' +
          'lift, the native one is a rounded rectangle.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text rendered inside the button.',
    },
    variant: {
      control: 'inline-radio',
      options: VARIANTS,
      description: 'Visual weight. Use `primary` for the main action of a view.',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Drives padding, font size and corner radius.',
      table: { defaultValue: { summary: 'medium' } },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { defaultValue: { summary: 'false' } },
    },
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
    },
    onAction: {
      description: 'Mapped to `onClick` on web and to `onPress` on mobile.',
    },
    // Driven by the toolbar, not by the controls panel.
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Button',
    onAction: fn(),
  },
  render: (args, { globals }) => (
    <PlatformButton {...args} platform={globals.platform as TPlatform} />
  ),
} satisfies Meta<IPlatformButtonProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** The two variants side by side, at the default size. */
export const Variants: TStory = {
  render: (args, { globals }) => (
    <Row>
      {VARIANTS.map((variant) => (
        <PlatformButton
          {...args}
          key={variant}
          label={variant}
          platform={globals.platform as TPlatform}
          variant={variant}
        />
      ))}
    </Row>
  ),
};

/** The three sizes, so the metric scale is easy to compare. */
export const Sizes: TStory = {
  render: (args, { globals }) => (
    <Row>
      {SIZES.map((size) => (
        <PlatformButton
          {...args}
          key={size}
          label={size}
          platform={globals.platform as TPlatform}
          size={size}
        />
      ))}
    </Row>
  ),
};

/** Both variants disabled. The handler must not fire in this state. */
export const Disabled: TStory = {
  args: { isDisabled: true },
  render: (args, { globals }) => (
    <Row>
      {VARIANTS.map((variant) => (
        <PlatformButton
          {...args}
          key={variant}
          label={variant}
          platform={globals.platform as TPlatform}
          variant={variant}
        />
      ))}
    </Row>
  ),
};
