import type { TTextFieldSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import { ICON_NAMES } from './iconNames';
import { PlatformTextField } from './PlatformTextField';
import type { IPlatformTextFieldProps } from './PlatformTextField';
import { implementationFor } from './themeGlobals';

const SIZES: TTextFieldSize[] = ['sm', 'md', 'lg'];

/**
 * The glyphs the affix controls offer — by export name, since that is what the
 * bridge resolves. All 1170 in one `select` is unusable, so this is the handful
 * a field actually reaches for; `ICON_NAMES` is still the source of truth for
 * the gallery.
 */
const GLYPHS = ICON_NAMES.filter((name) =>
  [
    'IconSearchMd',
    'IconImage01',
    'IconXClose',
    'IconXCircle',
    'IconEye',
    'IconEyeOff',
    'IconLock01',
    'IconCreditCard01',
  ].includes(name),
);

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
  return <PlatformTextField {...props} onChangeText={setValue} value={value} />;
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
          'The pattern every field in the file follows, which is why this one is worth ' +
          'reading first. **Nothing here is a visibility boolean**: Figma has six ' +
          '(`showLeadingIcon`, `showLeadingText`, `showTrailingIcon`, `showTrailingText`, ' +
          '`showHelper`, `showCounter`) and none survive — the presence of the content is ' +
          'the switch. `isFilled` is derived from `value`, and `validation` became `error`: ' +
          'if there is a message, the field is in error, because *"el error lo comunica el ' +
          'mensaje, no el color"*. Use the **Platform** dropdown to switch between ' +
          '`@dsm/web` and `@dsm/mobile`, and **Theme** to preview light and dark.',
      },
    },
  },
  argTypes: {
    // --- Content: what the field is showing --------------------------------
    label: {
      control: 'text',
      description:
        'Required — it is the accessible name. Acts as the placeholder while the field is ' +
        "empty and floats to the edge once there is a value, except at `size='sm'`, where " +
        'it never floats.',
      table: { category: 'Content' },
    },
    placeholder: {
      control: 'text',
      description:
        'Shown in the value\'s place only once the label has floated. **Does not exist in ' +
        'Figma** — there the placeholder and the value are the same text node.',
      table: { category: 'Content' },
    },
    // --- Affixes: leading/trailing text and icon slots ----------------------
    leadingText: {
      control: 'text',
      description:
        'A symbol or prefix: `$`, `+593`. Its presence turns the slot on, and it does not ' +
        'coexist with `leadingIcon` — the contract leaves open that this ought to be a ' +
        'union rather than two optionals.',
      table: { category: 'Affixes' },
    },
    leadingIcon: {
      control: 'select',
      options: [undefined, ...GLYPHS],
      description:
        'The leading glyph, **by export name** — the real prop is a `ReactNode` the caller ' +
        "imports from its section. No default any more: Figma's `icon/search` went with " +
        'the names.',
      table: { category: 'Affixes' },
    },
    trailingText: {
      control: 'text',
      description: 'A unit: `USD`, `kg`. Its presence turns the slot on.',
      table: { category: 'Affixes' },
    },
    trailingIcon: {
      control: 'select',
      options: [undefined, ...GLYPHS],
      description: 'Same contract as `leadingIcon`.',
      table: { category: 'Affixes' },
    },
    // --- Footer -------------------------------------------------------------
    helperText: {
      control: 'text',
      description: 'Its presence renders the helper line. Replaced by `error` while that is set.',
      table: { category: 'Footer' },
    },
    error: {
      control: 'text',
      description:
        '**Its presence puts the field in the error state.** There is no `isInvalid`: a red ' +
        'field with nothing to read is exactly what the rule forbids.',
      table: { category: 'Footer' },
    },
    counter: {
      control: 'object',
      description:
        'Its presence renders the `"n / max"` line, and the component formats it. Two ' +
        "numbers rather than Figma's free text — a divergence the contract asks to be " +
        'signed rather than mapped.',
      table: { category: 'Footer' },
    },
    // --- Appearance & state -------------------------------------------------
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Blocks interaction and applies the disabled styling.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    readOnly: {
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
    onChangeText: {
      description:
        'In the shared contract on both platforms — web unwraps the DOM event for it.',
      table: { category: 'Testing & events' },
    },
    // Owned by ControlledPlatformTextField, not by the controls panel — see above.
    value: { table: { disable: true } },
    // Driven by the toolbar, not by the controls panel.
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Correo',
    value: '',
  },
  render: (args, { globals }) => (
    <ControlledPlatformTextField {...args} platform={implementationFor(globals)} />
  ),
} satisfies Meta<IPlatformTextFieldProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** With helper text guiding the user before any validation has run. */
export const WithHelperText: TStory = {
  args: { helperText: 'Nunca compartimos tu correo.' },
};

/**
 * The error state, which is just a message: setting `error` recolours the
 * border and replaces the helper line. There is no flag to pair it with — a
 * red border alone fails WCAG 1.4.1, so the contract removed the way to ask
 * for one.
 */
export const ErrorState: TStory = {
  args: { value: 'no-es-un-correo', error: 'Escribe un correo válido.' },
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
          platform={implementationFor(globals)}
          size={size}
        />
      ))}
    </Column>
  ),
};

/**
 * `label` doubles as the placeholder while `value` is empty, and floats to the
 * edge of the field once there is one — except at `size='sm'`, where it never
 * floats and the value simply replaces it. Compare the three sizes empty
 * (label as placeholder) against filled (label floats at `md` and `lg`, stays
 * put at `sm`).
 */
export const FloatingLabel: TStory = {
  render: (_args, { globals }) => (
    <Column>
      {SIZES.map((size) => (
        <ControlledPlatformTextField
          key={`${size}-empty`}
          label={size}
          onChangeText={() => undefined}
          platform={implementationFor(globals)}
          size={size}
          value=""
        />
      ))}
      {SIZES.map((size) => (
        <ControlledPlatformTextField
          key={`${size}-filled`}
          label={size}
          onChangeText={() => undefined}
          platform={implementationFor(globals)}
          size={size}
          value="Valor ingresado"
        />
      ))}
    </Column>
  ),
};

/** Blocks interaction entirely — the handler must not fire in this state. */
export const Disabled: TStory = {
  args: { value: 'Valor bloqueado', disabled: true },
};

/** Shows a value the user cannot edit through this control — a different look from disabled. */
export const ReadOnly: TStory = {
  args: { label: 'Número de cuenta', value: '1234 5678 9012', readOnly: true },
};

/** `counter` renders the `"n / max"` line. Passing it is the only way to get one. */
export const WithCounter: TStory = {
  args: {
    label: 'Bio',
    value: 'Construyendo el design system de Blu.',
    counter: { current: 37, max: 120 },
  },
};

/** Helper and counter are independent — both render when both are passed. */
export const WithHelperAndCounter: TStory = {
  args: {
    label: 'Bio',
    value: 'Construyendo el design system de Blu.',
    counter: { current: 37, max: 120 },
    helperText: 'Breve y concreto.',
  },
};

/**
 * The affixes live in `inputRow` *under* the floating label (Figma `content` →
 * `label` + `inputRow`), not beside it. Text on one side, glyph on the other:
 * the contract says a leading icon and a leading text do not coexist.
 */
export const WithAffixes: TStory = {
  args: {
    label: 'Monto',
    value: '250',
    size: 'lg',
    leadingText: '$',
    trailingText: 'USD',
  },
};

/** Empty field: no float, so the leading glyph sits on the placeholder line. */
export const WithIcons: TStory = {
  args: {
    label: 'Buscar',
    value: '',
    leadingIcon: 'IconSearchMd',
    trailingIcon: 'IconXClose',
  },
};
