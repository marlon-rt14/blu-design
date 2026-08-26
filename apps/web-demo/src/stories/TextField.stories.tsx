import type { TTextFieldSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { PlatformTextField } from './PlatformTextField';
import type { IPlatformTextFieldProps, TPlatform } from './PlatformTextField';

const SIZES: TTextFieldSize[] = ['small', 'medium', 'large'];

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
    // --- Content: what the field is showing --------------------------------
    label: {
      control: 'text',
      description:
        'Acts as the placeholder while the field is empty, and floats above the value once ' +
        "there is one — except at `size='small'`, where it never floats. There is no " +
        'separate `placeholder` prop.',
      table: { category: 'Content' },
    },
    // --- Affixes: prefix/suffix text and icon slots -------------------------
    prefix: {
      control: 'text',
      description: 'Text rendered before the value, when `showPrefixText` is `true`.',
      table: { category: 'Affixes' },
    },
    showPrefixText: {
      control: 'boolean',
      description: 'Whether `prefix` renders.',
      table: { category: 'Affixes', defaultValue: { summary: 'false' } },
    },
    showPrefixIcon: {
      control: 'boolean',
      description:
        'Whether the icon slot before the value renders. No visual effect in this shared story — ' +
        '`prefixIcon` itself is a platform-specific `ReactNode` prop, passed directly to `@dsm/web` / ' +
        '`@dsm/mobile`\u2019s own `TextField`, not through this cross-platform wrapper.',
      table: { category: 'Affixes', defaultValue: { summary: 'false' } },
    },
    suffix: {
      control: 'text',
      description: 'Text rendered after the value, when `showSuffixText` is `true`.',
      table: { category: 'Affixes' },
    },
    showSuffixText: {
      control: 'boolean',
      description: 'Whether `suffix` renders.',
      table: { category: 'Affixes', defaultValue: { summary: 'false' } },
    },
    showSuffixIcon: {
      control: 'boolean',
      description: 'Whether the icon slot after the value renders — see `showPrefixIcon`.',
      table: { category: 'Affixes', defaultValue: { summary: 'false' } },
    },
    // --- Feedback: helper text, error state and the character counter ------
    helperText: {
      control: 'text',
      description: 'Rendered below the field when `showHelper` is `true`. Ignored while `errorMessage` is set.',
      table: { category: 'Feedback' },
    },
    showHelper: {
      control: 'boolean',
      description: 'Whether `helperText` / `errorMessage` renders at all — independent of either being set.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Rendered below the field instead of `helperText` (when `showHelper` is `true`), styled as an error.',
      table: { category: 'Feedback' },
    },
    isInvalid: {
      control: 'boolean',
      description: 'Applies the invalid styling without necessarily showing a message.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    maxLength: {
      control: 'number',
      description: 'Used to compute the `"n / max"` counter text — see `showCounter` for whether it renders.',
      table: { category: 'Feedback' },
    },
    showCounter: {
      control: 'boolean',
      description: 'Whether the `"n / max"` counter renders at all — independent of `maxLength` being set.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    // --- State: size and interaction-blocking flags -------------------------
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Drives height, corner radius and horizontal padding.',
      table: { category: 'State', defaultValue: { summary: 'medium' } },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    isReadOnly: {
      control: 'boolean',
      description: 'Shows the value but blocks editing.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    // --- Testing & events ----------------------------------------------------
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Testing & events' },
    },
    onValueChange: {
      description: 'Mapped to `onChange` on web and to `onChangeText` on mobile.',
      table: { category: 'Testing & events' },
    },
    // Owned by ControlledPlatformTextField, not by the controls panel — see above.
    value: { table: { disable: true } },
    // Driven by the toolbar, not by the controls panel.
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Email',
    value: '',
    // Not `showCounter`/`showHelper` themselves (those default to Figma's own
    // `false`) — just enough content ready so flipping either on in the
    // Playground immediately shows something, instead of an empty footer.
    maxLength: 60,
    helperText: "We'll never share your email.",
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
  args: { helperText: "We'll never share your email.", showHelper: true },
};

/**
 * Invalid state with a message. The border and helper text switch to the
 * error colour. `showHelper: true` is required here — Figma has no separate
 * "always show on error" behaviour; a red border alone fails WCAG 1.4.1, so
 * pairing `errorMessage` with `showHelper` is on the consumer, not automatic.
 */
export const ErrorState: TStory = {
  args: { value: 'not-an-email', errorMessage: 'Enter a valid email address.', showHelper: true },
};

/** The three sizes side by side, so the metric scale is easy to compare. */
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

/**
 * `label` doubles as the placeholder while `value` is empty, and floats
 * above the value once there is one — except at `size='small'`, where it
 * never floats and the value simply replaces it. Compare the three sizes
 * empty (label as placeholder) against filled (label floats at `medium`
 * and `large`, stays put at `small`).
 */
export const FloatingLabel: TStory = {
  render: (_args, { globals }) => (
    <Column>
      {SIZES.map((size) => (
        <ControlledPlatformTextField
          key={`${size}-empty`}
          label={size}
          platform={globals['platform'] as TPlatform}
          size={size}
          value=""
        />
      ))}
      {SIZES.map((size) => (
        <ControlledPlatformTextField
          key={`${size}-filled`}
          label={size}
          platform={globals['platform'] as TPlatform}
          size={size}
          value="Valor ingresado"
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

/** With a `maxLength` and `showCounter: true`, rendering the `"n / max"` counter below the field. */
export const WithCounter: TStory = {
  args: { label: 'Bio', value: 'Building the Blu design system.', maxLength: 120, showCounter: true },
};

/** `showHelper` and `showCounter` toggle independently — both can be on at once. */
export const WithHelperAndCounter: TStory = {
  args: {
    label: 'Bio',
    value: 'Building the Blu design system.',
    maxLength: 120,
    helperText: 'Keep it short and specific.',
    showHelper: true,
    showCounter: true,
  },
};

/**
 * `prefix` / `suffix` render as plain text on either side of the value, each
 * gated by its own `showPrefixText` / `showSuffixText` flag — independent of
 * the icon slots (`prefixIcon` / `suffixIcon`, platform-specific props not
 * exposed through this shared story wrapper).
 */
export const WithAffixes: TStory = {
  args: { label: 'Amount', value: '250', prefix: '$', showPrefixText: true, suffix: 'USD', showSuffixText: true },
};
