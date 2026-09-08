import type { TOTPFieldLength } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { PlatformOTPField } from './PlatformOTPField';
import type { IPlatformOTPFieldProps, TPlatform } from './PlatformOTPField';

const LENGTHS: TOTPFieldLength[] = [4, 6];

/**
 * `PlatformOTPField` is controlled, so the story holds its own state to make
 * typing possible in the canvas.
 */
const Controlled = (props: IPlatformOTPFieldProps): ReactElement => {
  const [value, setValue] = useState(props.value);
  return <PlatformOTPField {...props} onValueChange={setValue} value={value} />;
};

/** A labelled field, stacked under its caption. */
const Group = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

/**
 * The props table describes the shared contract from `@dsm/shared`, which both
 * implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Atoms/OTPField',
  component: PlatformOTPField,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A one-time code field. **The boxes are presentation: this is one input, never N.** bDS ' +
          'is blunt about why — *"N inputs rompen el pegado y el autorrelleno"*. One input is what ' +
          'lets the OS drop the whole code in at once (`one-time-code` on the web, ' +
          '`textContentType="oneTimeCode"` on iOS, `sms-otp` autofill on Android) and what lets ' +
          'someone paste six digits from their messages app. The real input is transparent and ' +
          'covers the row, so a click anywhere focuses it; the boxes behind it are painted from ' +
          '`value`.\n\n' +
          'Two things follow from that shape. There is **no hover** — with one input there is no ' +
          'per-digit element to hover, so the axis does not exist in Figma either. And there is ' +
          '**no caret**: the ring on the active box is the caret.\n\n' +
          'Unlike the rest of the field family it derives no single `state`. bDS split the old ' +
          'monolithic `state` into independent axes precisely because *"el campo puede estar en ' +
          'error y con foco al mismo tiempo"*, so error and focus compose here. `isDisabled` is ' +
          'the exception and wins over everything — *"es la última palabra del dibujo"*.\n\n' +
          'Figma’s `isFilled` axis is deliberately **not** a prop: it carries no styling (measured ' +
          'against the token set) and exists so designers can preview a field with digits in it. ' +
          'In code "filled" is just `value.length > 0`.',
      },
    },
  },
  argTypes: {
    // --- Content ------------------------------------------------------------
    value: { table: { disable: true } },
    length: {
      control: 'inline-radio',
      options: LENGTHS,
      description:
        'How many boxes to draw. A union rather than `number`: bDS designed 4 and 6 and nothing ' +
        'else, so a 5 is refused by the type.',
      table: { category: 'Content', defaultValue: { summary: '4' } },
    },
    // --- Feedback -----------------------------------------------------------
    helperText: {
      control: 'text',
      description:
        'Rendered below the boxes and centred, when `showHelper` is `true`. Ignored while ' +
        '`errorMessage` is set. bDS’s own default is a resend countdown, which is the slot’s ' +
        'intended use.',
      table: { category: 'Feedback' },
    },
    showHelper: {
      control: 'boolean',
      description: 'Whether the helper slot renders at all — independent of either text being set.',
      table: { category: 'Feedback', defaultValue: { summary: 'true' } },
    },
    errorMessage: {
      control: 'text',
      description: 'Replaces `helperText` and puts the field in its error state by itself.',
      table: { category: 'Feedback' },
    },
    isInvalid: {
      control: 'boolean',
      description:
        'Error state without a message. Every box takes the error border; the background does not ' +
        'change. Composes with focus.',
      table: { category: 'Feedback', defaultValue: { summary: 'false' } },
    },
    // --- State --------------------------------------------------------------
    isDisabled: {
      control: 'boolean',
      description: 'Blocks interaction and wins over error and focus alike.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    // --- Other --------------------------------------------------------------
    accessibilityLabel: {
      control: 'text',
      description:
        'The accessible name. The design has **no label at all**, so without this the input would ' +
        'reach a screen reader unnamed; it defaults to "Código de verificación".',
      table: { category: 'Other', defaultValue: { summary: 'Código de verificación' } },
    },
    testID: {
      control: 'text',
      description:
        'Maps to `data-testid` on web and to the native `testID` on mobile. Each box also gets ' +
        '`${testID}-digit-${index}`.',
      table: { category: 'Other' },
    },
    onValueChange: {
      description:
        'Called with the **sanitized** code — digits only, capped at `length`. Part of the shared ' +
        'contract on both platforms, unlike the family’s `onChange` / `onChangeText`.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: {
    value: '',
    helperText: 'Reenviar código en 00:30',
    testID: 'otp',
  },
  render: (args, { globals }) => <Controlled {...args} platform={globals.platform as TPlatform} />,
} satisfies Meta<IPlatformOTPFieldProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** The two lengths bDS designed. Same box, same rhythm — only the count changes. */
export const Lengths: TStory = {
  render: (args, { globals }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {LENGTHS.map((length) => (
        <Group key={length} title={`length=${length}`}>
          <Controlled {...args} length={length} platform={globals.platform as TPlatform} />
        </Group>
      ))}
    </div>
  ),
};

/**
 * The states that are props. `focus` comes from interaction — click a field and
 * the ring lands on the **first empty box**, which is where the caret is.
 *
 * Note the last two: error and disabled are separate axes, and disabled wins.
 * The errored-and-disabled field shows no trace of the error.
 */
export const States: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Group title="default — empty">
          <Controlled {...args} platform={platform} value="" />
        </Group>
        <Group title="with a value — the boxes are painted from it, one digit each">
          <Controlled {...args} platform={platform} value="12" />
        </Group>
        <Group title="error — every box, background unchanged">
          <Controlled {...args} errorMessage="Código incorrecto" platform={platform} value="12" />
        </Group>
        <Group title="disabled">
          <Controlled {...args} isDisabled platform={platform} value="12" />
        </Group>
        <Group title="error + disabled — disabled is the last word, the error disappears">
          <Controlled
            {...args}
            errorMessage="Código incorrecto"
            isDisabled
            platform={platform}
            value="12"
          />
        </Group>
      </div>
    );
  },
};

/**
 * What one input buys you: the whole code arrives at once.
 *
 * Typing "1234" into the field is a single `change` per keystroke on one
 * element, not four elements handing focus to each other — which is also why
 * pasting works. Letters are dropped and anything past `length` is ignored.
 */
export const Sanitizing: TStory = {
  args: { testID: 'otp-sanitize' },
  play: async ({ canvas, globals }) => {
    // The native implementation renders through react-native-web, whose
    // TextInput does not accept typing the way a DOM input does.
    if (globals.platform === 'native') return;
    const input = canvas.getByTestId('otp-sanitize');
    await userEvent.type(input, '1a2b3c4d5');
    // Letters stripped, and the 5th digit refused by `maxLength`.
    await expect(input).toHaveValue('1234');
    await expect(canvas.getByTestId('otp-sanitize-digit-0')).toHaveTextContent('1');
    await expect(canvas.getByTestId('otp-sanitize-digit-3')).toHaveTextContent('4');
  },
};
