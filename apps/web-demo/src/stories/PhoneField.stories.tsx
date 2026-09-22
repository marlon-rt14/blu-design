import { COUNTRY_CODES } from '@dsm/shared';
import type { TPhoneFieldSize } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { PlatformPhoneField } from './PlatformPhoneField';
import type { IPlatformPhoneFieldProps, TPlatform } from './PlatformPhoneField';

const SIZES: TPhoneFieldSize[] = ['sm', 'md', 'lg'];

/** A labelled cell, sized like a form field rather than the full canvas. */
const Cell = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
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
  title: 'Atoms/PhoneField',
  component: PlatformPhoneField,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A phone number, with or without a country selector in front of it. What makes it a ' +
          'PhoneField rather than a TextField is **the data, not the drawing**: a numeric keypad, ' +
          'a phone autofill hint and a country whose dial prefix rides along — *"si el campo no ' +
          'captura un teléfono, es un TextField"*.\n\n' +
          '**The country is one datum.** The flag and the prefix both come out of `country`, so ' +
          'they cannot contradict each other. In Figma they are two loose properties that can — ' +
          'an Ecuadorian flag next to `+1` is a valid variant there and impossible here. That is ' +
          'this component’s largest declared divergence; see `docs/pendientes-diseno.md`.\n\n' +
          '**Two controls, not one.** *"El selector de país es un control aparte del campo de ' +
          'número: dos elementos enfocables, cada uno con su nombre."* Tab moves between them, ' +
          'and the trigger carries its own `size/target/min` touch area. The dial code is part of ' +
          'the input’s accessible description, because *"el prefijo tiene que llegar al lector ' +
          'junto con el número, o quien no ve la pantalla no sabe a qué país está marcando"*.\n\n' +
          '**The list is searchable, and it has to be.** 243 countries are not navigable by ' +
          'arrow keys — *"una lista de países necesita búsqueda por teclado"*. The search box ' +
          'matches the localized name **or** the dial code, accent-folded, so both `espa` and ' +
          '`+34` find Spain. On web the panel is the `Menu` molecule with the options filtered ' +
          'before they are handed over; on native it is a bottom sheet with a `FlatList`, the ' +
          'same call the Select made.\n\n' +
          '**The selector is an axis, not a given.** `leadingContent` is `select` or `none`, and ' +
          'half of Figma’s 144 variants are `none`: *"no trae nada a la izquierda. El campo ' +
          'queda limpio, como un input de texto, y el valor arranca en el borde. Para cuando el ' +
          'país es fijo y ya se sabe cuál, o cuando el código se pide en otra parte del ' +
          'formulario."* It is still a PhoneField without it — what makes it one is the data, ' +
          'not the prefix.\n\n' +
          '**It does not format the number.** `99 123 4567` arrives grouped from a formatter ' +
          'outside the component; `value` is what the user typed.\n\n' +
          '**The flags are the real artwork**, straight from the `.Flag` set in `BDS3 - Assets`: ' +
          '243 of them, one per country in the catalogue, as paths in a generated data module ' +
          'rather than 243 components. Each one is drawn inside a clipped circle with a ' +
          'hairline — bDS’s own requirement, *"para que JP, FI y CH no se pierdan sobre fondo ' +
          'claro"*, since those three have white fields that would bleed into the surface.\n\n' +
          '`showMenu` is not a prop: opening is internal state, the same trap `isOpen` has in ' +
          'the Select. And in code the chevron **rotates** — in Figma it cannot, because ' +
          '*"un booleano prende y apaga, no transforma"*.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The field’s name, and its placeholder until a value floats it.',
      table: { category: 'Contract' },
    },
    value: {
      control: 'text',
      description: 'What the user typed, ungrouped. The component never reformats it.',
      table: { category: 'Contract' },
    },
    country: {
      control: 'select',
      options: COUNTRY_CODES,
      description:
        'ISO 3166-1 alpha-2. Drives **both** the flag and the dial code — they are one datum.',
      table: { category: 'Contract', defaultValue: { summary: 'EC' } },
    },
    countries: {
      control: false,
      description:
        'Narrows which countries are offered. Defaults to all 243 in the catalogue; a product ' +
        'that only ships to four passes four. The *order offered* — favourites, a pinned home ' +
        'country — is an open product decision the catalogue cannot make.',
      table: { category: 'Contract' },
    },
    leadingContent: {
      control: 'inline-radio',
      options: ['select', 'none'],
      description:
        'Whether the country selector rides in front of the number. `none` drops the flag, the ' +
        'dial code, the chevron and the divider, and the value starts at the edge.',
      table: { category: 'Appearance', defaultValue: { summary: 'select' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description:
        '32 / 44 / 56. `sm` never floats the label — a floating label plus the value occupy 42.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    helperText: { control: 'text', table: { category: 'Content' } },
    error: {
      control: 'text',
      description:
        'Its presence puts the field in the error state. *"El error lo comunica el mensaje, no el color."*',
      table: { category: 'Content' },
    },
    disabled: { control: 'boolean', table: { category: 'State', defaultValue: { summary: 'false' } } },
    testID: { control: 'text', table: { category: 'Other' } },
    onChangeText: { table: { disable: true } },
    onCountryChange: { table: { disable: true } },
    platform: { table: { disable: true } },
  },
  args: {
    label: 'Numero de celular',
    value: '',
    // Required by the contract, so it has to be here: without it `StoryObj`
    // treats every story as missing an argument and rejects even `{}`.
    onChangeText: fn(),
    testID: 'phone-field',
  },
  render: function Render(args, { globals }) {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ width: 320 }}>
        <PlatformPhoneField
          {...args}
          onChangeText={(value) => updateArgs({ value })}
          onCountryChange={(country) => updateArgs({ country })}
          platform={globals.platform as TPlatform}
        />
      </div>
    );
  },
} satisfies Meta<IPlatformPhoneFieldProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/**
 * Every prop editable from the controls panel, and the field is live: open the
 * selector, type `espa` or `+34`, pick a country and watch the prefix follow the
 * flag.
 *
 * Switch the `platform` global to `native` and the same list arrives as a bottom
 * sheet instead of a panel.
 */
export const Playground: TStory = {
  args: {
    country: 'EC',
    leadingContent: 'select',
    size: 'md',
    helperText: '',
    error: '',
    disabled: false,
  },
};

/**
 * The three sizes, filled so the label floats — except in `sm`, where it never
 * does and the value shows instead.
 *
 * The prefix keeps its own height across all three: the trigger's touch area is
 * `size/target/min` (48) even inside the 32-tall `sm` box, reached through the
 * block size so it grows the target without moving the field.
 */
export const Sizes: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SIZES.map((size) => (
          <Cell key={size} title={`size ${size}`}>
            <PlatformPhoneField
              label="Numero de celular"
              onChangeText={() => {}}
              platform={platform}
              size={size}
              testID={`size-${size}`}
              value="99 123 4567"
            />
          </Cell>
        ))}
      </div>
    );
  },
};

/**
 * What the contract can actually reach: empty, filled, with helper text, in
 * error and disabled.
 *
 * Focus and hover are missing on purpose — they are produced by interaction,
 * not by props. There is no `readOnly` here either: the contract does not have
 * one, because a read-only country selector is a label, not a control.
 */
export const States: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const rows: { title: string; props: Partial<IPlatformPhoneFieldProps> }[] = [
      { title: 'vacio — la etiqueta hace de placeholder', props: { value: '' } },
      { title: 'con valor — la etiqueta flota', props: { value: '99 123 4567' } },
      { title: 'con texto de apoyo', props: { helperText: 'Te enviaremos un codigo por SMS' } },
      { title: 'en error', props: { value: '99 12', error: 'El numero esta incompleto' } },
      { title: 'deshabilitado', props: { value: '99 123 4567', disabled: true } },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {rows.map((row, index) => (
          <Cell key={row.title} title={row.title}>
            <PlatformPhoneField
              label="Numero de celular"
              onChangeText={() => {}}
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
 * The two halves of the set. `select` carries the flag, the dial code, the
 * chevron and the divider; `none` carries nothing and the value starts at the
 * edge.
 *
 * **`none` is not a TextField.** It keeps the phone keypad, the `tel` autofill
 * hint and the phone validation — *"si el campo no captura un teléfono, es un
 * TextField"*, and this one still does. bDS reaches for it *"para cuando el
 * país es fijo y ya se sabe cuál, o cuando el código se pide en otra parte del
 * formulario"*.
 *
 * `country` still says which country the number belongs to with `none`; it
 * simply stops being drawn, and `onCountryChange` is never called because there
 * is nothing to open.
 */
export const LeadingContent: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const [phone, setPhone] = useState('99 123 4567');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Cell title="leadingContent=select — bandera, codigo, chevron y separador">
          <PlatformPhoneField
            label="Numero de celular"
            leadingContent="select"
            onChangeText={setPhone}
            platform={platform}
            testID="leading-select"
            value={phone}
          />
        </Cell>
        <Cell title="leadingContent=none — el valor arranca en el borde">
          <PlatformPhoneField
            label="Numero de celular"
            leadingContent="none"
            onChangeText={setPhone}
            platform={platform}
            testID="leading-none"
            value={phone}
          />
        </Cell>
        <Cell title="none + helper y error, que no dependen del prefijo">
          <PlatformPhoneField
            error="El numero esta incompleto"
            label="Numero de celular"
            leadingContent="none"
            onChangeText={() => {}}
            platform={platform}
            testID="leading-none-error"
            value="99 12"
          />
        </Cell>
      </div>
    );
  },
};
