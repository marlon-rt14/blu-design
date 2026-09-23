import type { TProgressBarSize, TProgressStatus } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { PlatformProgressBar } from './PlatformProgressBar';
import type { IPlatformProgressBarProps, TPlatform } from './PlatformProgressBar';

const SIZES: TProgressBarSize[] = ['sm', 'md', 'lg'];
const STATUSES: TProgressStatus[] = ['brand', 'accent', 'success', 'warning', 'danger'];

/** A labelled cell, at the width a bar actually gets in a screen. */
const Cell = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    {children}
  </div>
);

const meta = {
  title: 'Atoms/ProgressBar',
  component: PlatformProgressBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A linear bar that says how far along something with a beginning and an end is. ' +
          '**It informs; it is not a control** — no disabled, no hover, no pressed, no state ' +
          'axis at all: *"la barra informa, no se toca"*.\n\n' +
          '**`status` is meaning, not palette.** This is the trap of the component and bDS ' +
          'names it: *"un ProgressBar en danger no es una barra roja bonita, es un progreso que ' +
          'va mal — un límite que se agota, un plazo que se vence"*. `brand` and `accent` are a ' +
          'task moving forward; `success`, `warning` and `danger` are for when the colour ' +
          'encodes the **value** rather than the progress. Choosing by colour is the easiest ' +
          'mistake to make here.\n\n' +
          '**It is not a div with a width.** `role="progressbar"` carries the value, and ' +
          '`label` names it — *"\'75 %\' sin contexto no es información"*. Nothing announces ' +
          'every change: a bar that speaks at each percent *"es inusable con lector"*.\n\n' +
          '**`value` is continuous.** Figma draws five steps *"porque hay que dibujar algo"*; ' +
          'in code it is any number from 0 to 100, clamped. Anything above 0 draws at least a ' +
          'round dot, so a 1 % bar is visible rather than a lie.\n\n' +
          '**There is no indeterminate bar**, here or in Figma. For a wait of unknown length ' +
          'the answer is a different component — *"barra si se puede medir, spinner si no"* — ' +
          'and a long indeterminate bar *"se lee como algo colgado"*.\n\n' +
          '**Eight co-tokens and nothing raw**, which bDS states as an achievement: *"cero ' +
          'valores crudos en las 75 variantes"*. The five fills all clear 3:1 against the ' +
          'track in the four modes, and the track separates from `page`, `surface` and ' +
          '`raised` by at least 1.24.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '0 to 100, clamped. Continuous, unlike Figma’s five steps.',
      table: { category: 'Contract' },
    },
    label: {
      control: 'text',
      description: 'What is progressing. **Names the bar** for a screen reader.',
      table: { category: 'Content' },
    },
    showHeader: {
      control: 'boolean',
      description:
        'The header row as a whole. Wins over the other two: with `false` there is no header, ' +
        'whatever they say.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showLabel: {
      control: 'boolean',
      description:
        'The label’s **text**. `false` hides the text and nothing else — the bar is still named ' +
        'by `label`, the same arrangement `CheckboxGroup` uses for its legend.',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    showValue: {
      control: 'boolean',
      table: { category: 'Content', defaultValue: { summary: 'true' } },
    },
    status: {
      control: 'inline-radio',
      options: STATUSES,
      description: 'What the progress *means*. Never picked by colour.',
      table: { category: 'Appearance', defaultValue: { summary: 'brand' } },
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Track height: 4 · 8 · 12.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    testID: { control: 'text', table: { category: 'Other' } },
    platform: { table: { disable: true } },
  },
  args: {
    value: 60,
    label: 'Subiendo el documento',
    testID: 'progress-bar',
  },
  render: function Render(args, { globals }) {
    return (
      <div style={{ width: 320 }}>
        <PlatformProgressBar {...args} platform={globals.platform as TPlatform} />
      </div>
    );
  },
} satisfies Meta<IPlatformProgressBarProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel; drag `value` and watch it move. */
export const Playground: TStory = {};

/**
 * The five, each with the sentence it is for.
 *
 * Read the labels rather than the colours: that is the whole point of the axis.
 */
export const Statuses: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const casos: { status: TProgressStatus; label: string; value: number }[] = [
      { status: 'brand', label: 'Subiendo el documento', value: 60 },
      { status: 'accent', label: 'Perfil completo', value: 40 },
      { status: 'success', label: 'Meta de ahorro alcanzada', value: 100 },
      { status: 'warning', label: 'Cupo usado', value: 82 },
      { status: 'danger', label: 'Plazo por vencer', value: 95 },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {casos.map((caso) => (
          <Cell key={caso.status} title={caso.status}>
            <PlatformProgressBar
              label={caso.label}
              platform={platform}
              status={caso.status}
              testID={`status-${caso.status}`}
              value={caso.value}
            />
          </Cell>
        ))}
      </div>
    );
  },
};

/** 4 · 8 · 12. The header does not change with the size — only the track does. */
export const Sizes: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SIZES.map((size) => (
          <Cell key={size} title={`size ${size}`}>
            <PlatformProgressBar
              label="Subiendo el documento"
              platform={platform}
              size={size}
              testID={`size-${size}`}
              value={60}
            />
          </Cell>
        ))}
      </div>
    );
  },
};

/**
 * The edges, and the two rules that live there.
 *
 * At **1 %** the fill is a round dot rather than nothing: *"cualquier valor
 * mayor que 0 dibuja como mínimo el alto de la pista"*. At **0** it is empty.
 * And `120` is clamped to 100 rather than overflowing its track.
 */
export const Edges: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const casos: { title: string; value: number; label?: string; showValue?: boolean }[] = [
      { title: 'value 0 — vacío', value: 0 },
      { title: 'value 1 — un punto, no nada', value: 1 },
      { title: 'value 100', value: 100 },
      { title: 'value 120 — recortado a 100', value: 120 },
      { title: 'sin porcentaje', value: 60, showValue: false },
      { title: 'sin etiqueta — un número sin sujeto', value: 60, label: undefined },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {casos.map((caso, index) => (
          <Cell key={caso.title} title={caso.title}>
            <PlatformProgressBar
              label={'label' in caso ? caso.label : 'Subiendo el documento'}
              platform={platform}
              showValue={caso.showValue}
              testID={`edge-${index}`}
              value={caso.value}
            />
          </Cell>
        ))}
      </div>
    );
  },
};

/**
 * The value changing, which is the only thing that moves in this component.
 *
 * The fill slides over `motion/duration/normal` with
 * `motion/easing/standard`, and **jumps instead with Reduce Motion on** — turn
 * it on in the OS and reload to see it.
 */
export const Animated: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const [value, setValue] = useState(0);
    useEffect(() => {
      const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 20)), 1200);
      return () => clearInterval(id);
    }, []);
    return (
      <Cell title="sube de 20 en 20 y vuelve a empezar">
        <PlatformProgressBar
          label="Subiendo el documento"
          platform={platform}
          testID="animated"
          value={value}
        />
      </Cell>
    );
  },
};

/**
 * The header, switched off three different ways — and what each one costs.
 *
 * `showLabel={false}` is the interesting one: the text goes and **the name
 * stays**. The bar still announces "Subiendo el documento, 60 %", which is why
 * it is a prop rather than just leaving `label` out. Same arrangement
 * `CheckboxGroup` uses for its legend.
 *
 * `showHeader={false}` wins over both: no row at all, and no vertical space
 * taken by an empty one.
 */
export const Header: TStory = {
  render: function Render(_args, { globals }) {
    const platform = globals.platform as TPlatform;
    const casos: { title: string; props: Partial<IPlatformProgressBarProps> }[] = [
      { title: 'todo — etiqueta y porcentaje', props: {} },
      { title: 'showValue=false — solo la etiqueta', props: { showValue: false } },
      { title: 'showLabel=false — solo el porcentaje, pero la barra sigue nombrada', props: { showLabel: false } },
      { title: 'showHeader=false — sin fila, y sin el alto de una fila vacía', props: { showHeader: false } },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {casos.map((caso, index) => (
          <Cell key={caso.title} title={caso.title}>
            <PlatformProgressBar
              label="Subiendo el documento"
              platform={platform}
              testID={`header-${index}`}
              value={60}
              {...caso.props}
            />
          </Cell>
        ))}
      </div>
    );
  },
};
