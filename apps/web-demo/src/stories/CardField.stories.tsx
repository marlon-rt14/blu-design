import { CARD_BRANDS, CARD_BRAND_NAMES, detectCardBrand } from '@dsm/shared';
import type { TCardFieldPart, TCardFieldSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { PlatformCardField } from './PlatformCardField';
import type { IPlatformCardFieldProps, TPlatform } from './PlatformCardField';

const PARTS: TCardFieldPart[] = ['number', 'expiry', 'cvv'];
const SIZES: TCardFieldSize[] = ['sm', 'md', 'lg'];

/** A real number per brand, so detection can be seen rather than described. */
const SAMPLE_NUMBERS: Record<string, string> = {
  visa: '4539 1488 0343 6467',
  mastercard: '5425 2334 3010 9903',
  discover: '6011 0009 9013 9424',
  diners: '3056 9309 0259 04',
  amex: '3400 0000 0000 009',
};

/** A labelled cell, sized like a form field rather than the full canvas. */
const Cell = ({ title, width = 320, children }: { title: string; width?: number; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

/**
 * The props table describes the shared contract from `@dsm/shared`, which both
 * implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package — and even less a discriminated union.
 */
const meta = {
  title: 'Atoms/CardField',
  component: PlatformCardField,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One of the three fields a card needs. `part` picks which, and with it the keyboard, ' +
          'the accepted length, the autocomplete token and whether the characters are masked. ' +
          'Everything else — the box, the floating label, the helper line, the three sizes — is ' +
          'shared.\n\n' +
          '**One component, not three, and the type keeps it honest.** The contract is a ' +
          'discriminated union: `brand` exists only when `part` is `\'number\'`, so ' +
          '`<CardField part="cvv" brand="visa" />` is a compile error rather than a no-op. ' +
          'Whether these should be three components sharing a style is an open architecture ' +
          'decision in bDS — *"puede que number, expiry y cvv sean tres componentes que ' +
          'comparten estilo, no uno con tres modos"* — and if it lands that way the split is ' +
          'mechanical, because `part` is required. See `docs/pendientes-diseno.md`.\n\n' +
          '**The brand is detected, never chosen.** *"brandIcon es un slot: la marca se deduce ' +
          'del número en código, nunca la elige quien diseña."* Type a number in the Playground ' +
          'and the logo appears on its own. Passing `brand` overrides it; nothing else can.\n\n' +
          '**The four marks are the real artwork**, from the `.Brand rect` set in ' +
          '`BDS3 - Assets`, and **the plate comes with them**: `#1434CB` for Visa, navy for ' +
          'Mastercard and Discover, white for Diners. Only Diners paints nothing and lets the ' +
          'field’s own plate show, because that plate is already its colour. Which is exactly ' +
          'what made the wrong rule look right for a whole implementation: with Diners as the ' +
          'only mark in the repo, a token plate plus a coloured glyph was indistinguishable ' +
          'from the truth.\n\n' +
          '**It does not format the value.** `4539 1488 0343 6467` arrives grouped from a ' +
          'formatter — *"el formato lo pone el formateador, no el componente"*. And two rules ' +
          'that are not about drawing: never store or show the full number, and the CVV is ' +
          'masked as typed and never autocompleted. That second one is wired here — the CVV asks ' +
          'for no autocomplete token at all, on either platform, because asking is what invites ' +
          'the browser or the OS to keep it.\n\n' +
          'Figma has 432 variants of this component, the second largest set in the file. In code ' +
          'only `readOnly` and `disabled` are props: `isFilled` is derived from the value, hover ' +
          'and focus come from interaction, and `validation`’s `warning` and `success` states are ' +
          'not in the contract, so their tokens are deliberately left unread.',
      },
    },
  },
  argTypes: {
    part: {
      control: 'inline-radio',
      options: PARTS,
      description:
        'Which field this is. **Required**, and it decides the keyboard, the length, the ' +
        'autocomplete token and the masking. `brand` only exists on `number`.',
      table: { category: 'Contract' },
    },
    label: {
      control: 'text',
      description:
        'The field’s name, and its placeholder until a value floats it. One per instance: bDS ' +
        'requires each of the three to carry its own — *"un solo \'Datos de la tarjeta\' para ' +
        'los tres deja al lector de pantalla sin saber en cuál está"*.',
      table: { category: 'Contract' },
    },
    value: { control: 'text', table: { category: 'Contract' } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: '32 / 44 / 56. `sm` never floats the label — a floating label plus the value occupy 42.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    brand: {
      control: 'select',
      options: [undefined, ...CARD_BRANDS],
      description:
        'Overrides the detected brand. Leave it empty — detection from the value is the intended ' +
        'behaviour. Only available when `part` is `number`.',
      table: { category: 'Appearance' },
    },
    helperText: { control: 'text', table: { category: 'Content' } },
    error: {
      control: 'text',
      description: 'Its presence puts the field in the error state. *"El error lo comunica el mensaje, no el color."*',
      table: { category: 'Content' },
    },
    readOnly: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    testID: { control: 'text', table: { category: 'Other' } },
    onChangeText: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    part: 'number',
    label: 'Numero de tarjeta',
    value: '',
    // Required by the contract, so it has to be here: without it `StoryObj`
    // treats every story as missing an argument and rejects even `{}`.
    onChangeText: fn(),
    testID: 'card-field',
  },
  render: function Render(args, { globals }) {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: 320 }}>
        <PlatformCardField
          {...args}
          onChangeText={(value) => updateArgs({ value })}
          platform={globals.platform as TPlatform}
        />
      </div>
    );
  },
} satisfies Meta<IPlatformCardFieldProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/**
 * Every prop editable from the controls panel, and the field is live — type a
 * card number with `part="number"` and the brand logo appears by itself.
 *
 * Try `4539…` for Visa, `5425…` for Mastercard, `6011…` for Discover and
 * `3056…` for Diners. Only the last one draws its real mark.
 */
export const Playground: TStory = {
  args: {
    part: "number",
    size: "md",
    helperText: "",
    error: "",
    readOnly: false,
    disabled: false
  }
};

/**
 * The three parts as a form actually lays them out: the number on its own line,
 * the expiry and the CVV sharing the next one.
 *
 * The tab order is number → expiry → CVV, *"el mismo que tiene la tarjeta
 * física"*, and it comes from the DOM order rather than from a `tabindex`.
 */
export const Parts: TStory = {
  args: {
    part: "number"
  },

  render: function Render(args, { globals }) {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
        <PlatformCardField
          label="Numero de tarjeta"
          onChangeText={() => {}}
          part="number"
          platform={platform}
          size={args.size}
          testID="part-number"
          value={SAMPLE_NUMBERS.diners ?? ''}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <PlatformCardField
              label="Vencimiento"
              onChangeText={() => {}}
              part="expiry"
              platform={platform}
              size={args.size}
              testID="part-expiry"
              value="12/34"
            />
          </div>
          <div style={{ flex: 1 }}>
            <PlatformCardField
              label="CVV"
              onChangeText={() => {}}
              part="cvv"
              platform={platform}
              size={args.size}
              testID="part-cvv"
              value="123"
            />
          </div>
        </div>
      </div>
    );
  }
};

/**
 * The three sizes, filled so the label floats — except in `sm`, where it never
 * does and the value shows instead.
 *
 * The brand plate scales with the field: 24x16, 36x24 and 48x32, always a 3:2
 * card, with the mark at half the plate's width. Measured on Figma's own
 * variants rather than inferred.
 */
export const Sizes: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SIZES.map((size) => (
          <Cell key={size} title={`size ${size}`}>
            <PlatformCardField
              label="Numero de tarjeta"
              onChangeText={() => {}}
              part="number"
              platform={platform}
              size={size}
              testID={`size-${size}`}
              value={SAMPLE_NUMBERS.diners ?? ''}
            />
          </Cell>
        ))}
      </div>
    );
  },
};

/**
 * What the contract can actually reach: empty, filled, with helper text, in
 * error, read-only and disabled.
 *
 * Focus and hover are missing on purpose — they are produced by interaction,
 * not by props. And `warning` and `success` are missing because the code
 * contract has no such states, even though Figma's `validation` axis does.
 */
export const States: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const rows: { title: string; props: Partial<IPlatformCardFieldProps> }[] = [
      { title: 'vacio — la etiqueta hace de placeholder', props: { value: '' } },
      { title: 'con valor — la etiqueta flota', props: { value: SAMPLE_NUMBERS.visa ?? '' } },
      { title: 'con texto de apoyo', props: { value: '', helperText: 'Los 16 digitos del frente' } },
      { title: 'en error', props: { value: '4539 14', error: 'El numero esta incompleto' } },
      { title: 'solo lectura', props: { value: SAMPLE_NUMBERS.diners ?? '', readOnly: true } },
      { title: 'deshabilitado', props: { value: SAMPLE_NUMBERS.diners ?? '', disabled: true } },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {rows.map((row, index) => (
          <Cell key={row.title} title={row.title}>
            <PlatformCardField
              label="Numero de tarjeta"
              onChangeText={() => {}}
              part="number"
              platform={platform}
              testID={`state-${index}`}
              value=""
              {...row.props}
            />
          </Cell>
        ))}
      </div>
    );
  },
};

/**
 * Detection, brand by brand, from real IIN prefixes — nothing is passed in.
 *
 * All four draw their own artwork, plate included. They are decorative and
 * hidden from a screen reader, which hears the brand's name as text instead.
 *
 * The last row is a JCB number, a network bDS does not declare: it shows no
 * logo at all. That is the neutral answer, and what a product *should* do with
 * a card it does not recognize is still open — see `docs/pendientes-diseno.md`.
 *
 * **Recognizing is not accepting.** The field says what the digits describe;
 * whether the product takes that card is a payment rule and lives in
 * validation.
 */
export const BrandDetection: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const samples = [
      ...CARD_BRANDS.map((b) => [CARD_BRAND_NAMES[b], SAMPLE_NUMBERS[b] ?? ''] as const),
      // A brand the set does not have, to show what an unrecognized card does.
      ['JCB — fuera del catalogo', '3530 1113 3330 0000'] as const,
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {samples.map(([name, number]) => (
          <Cell key={name} title={`${name} → ${detectCardBrand(number) ?? 'sin marca'}`}>
            <PlatformCardField
              label="Numero de tarjeta"
              onChangeText={() => {}}
              part="number"
              platform={platform}
              testID={`brand-${name}`}
              value={number}
            />
          </Cell>
        ))}
      </div>
    );
  },
};
