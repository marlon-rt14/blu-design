import type { TCoachmarkMedia, TCoachmarkPlacement, TCoachmarkSequence } from '@dsm/shared';
import { Button } from '@dsm/web';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { fn } from 'storybook/test';

import { PlatformCoachmark } from './PlatformCoachmark';
import type { IPlatformCoachmarkProps, TPlatform } from './PlatformCoachmark';

const MEDIA: TCoachmarkMedia[] = ['none', 'image'];
const SEQUENCES: TCoachmarkSequence[] = ['single', 'multi'];
const SIDES: TCoachmarkPlacement[] = ['top', 'right', 'bottom', 'left'];

const DEMO_IMAGE =
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&h=360&fit=crop';

/**
 * Room around the anchor so every placement has somewhere to land.
 * Anchor sits mid-stage so `top-start` (the Figma default) has space above
 * and does not flip to bottom on first paint.
 */
const Stage = ({ children, title }: { children: ReactNode; title: string }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: 520,
        justifyContent: 'center',
        width: 480,
      }}
    >
      {children}
    </div>
  </div>
);

/**
 * Controlled open — Coachmark never opens on hover; the host flips `isOpen`.
 * @param startOpen - Initial open state. Multi-panel stories pass `false` so
 *   native does not stack several Modals (breaks measureInWindow).
 */
const OpenCoachmark = ({
  startOpen = true,
  ...props
}: IPlatformCoachmarkProps & { startOpen?: boolean }): ReactElement => {
  const [open, setOpen] = useState(startOpen);
  return (
    <PlatformCoachmark
      {...props}
      isOpen={open}
      onAction={() => {
        props.onAction?.();
        setOpen(false);
      }}
      onDismiss={() => {
        props.onDismiss?.();
        setOpen(false);
      }}
      onOpenChange={(next) => {
        props.onOpenChange?.(next);
        setOpen(next);
      }}
    >
      <Button label={open ? 'Ancla (abierto)' : 'Abrir guía'} onClick={() => setOpen(true)} />
    </PlatformCoachmark>
  );
};

const meta = {
  title: 'Molecules/Coachmark',
  component: PlatformCoachmark,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Guía contextual anclada que **dispara el sistema** — presenta una función nueva o ' +
          'explica un flujo. No es un Tooltip (lo pide el usuario, superficie inverse) ni un ' +
          'Snackbar (confirma algo que pasó).\n\n' +
          '**Ejes:** `media` (none | image) × `placement` (13) × `sequence` (single | multi) → 52 ' +
          'variantes. **API parcial** con `show*` independientes, igual que Alert/Snackbar.\n\n' +
          '**Abre con `isOpen`**, nunca por hover. Esc cierra siempre; tocar fuera cierra ' +
          '`single` y deja `multi` quieto. Superficie elevated/floating (clara), no inverse. ' +
          'Ancho fijo 320. Sin velo de fondo.\n\n' +
          '**`placement` es preferencia**, no pin: Floating UI `flip`/`shift` puede ' +
          'moverlo (p. ej. `top-start` debajo si no hay aire arriba al scrollear). ' +
          'El control de Storybook no cambia; el lado resuelto sí.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    body: { control: 'text', table: { category: 'Content' } },
    stepIndex: { control: 'text', table: { category: 'Content' } },
    mediaSrc: { control: 'text', table: { category: 'Content' } },
    mediaAlt: { control: 'text', table: { category: 'Content' } },
    actionLabel: { control: 'text', table: { category: 'Content' } },
    backLabel: { control: 'text', table: { category: 'Content' } },
    children: { table: { disable: true } },
    media: {
      control: 'inline-radio',
      options: MEDIA,
      table: { category: 'Appearance', defaultValue: { summary: 'none' } },
    },
    sequence: {
      control: 'inline-radio',
      options: SEQUENCES,
      table: { category: 'Appearance', defaultValue: { summary: 'single' } },
    },
    placement: {
      control: 'select',
      options: [
        'top-start',
        'top',
        'top-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end',
        'right-start',
        'right',
        'right-end',
        'none',
      ],
      table: { category: 'Appearance', defaultValue: { summary: 'top-start' } },
    },
    showTitle: { control: 'boolean', table: { category: 'Appearance', defaultValue: { summary: 'true' } } },
    showAction: { control: 'boolean', table: { category: 'Appearance', defaultValue: { summary: 'true' } } },
    showBack: { control: 'boolean', table: { category: 'Appearance', defaultValue: { summary: 'true' } } },
    showDismiss: { control: 'boolean', table: { category: 'Appearance', defaultValue: { summary: 'true' } } },
    isOpen: { table: { disable: true } },
    platform: { table: { disable: true } },
    onOpenChange: { table: { category: 'Other' } },
    onAction: { table: { category: 'Other' } },
    onBack: { table: { category: 'Other' } },
    onDismiss: { table: { category: 'Other' } },
    testID: { control: 'text', table: { category: 'Other' } },
  },
  args: {
    title: 'Título de la función',
    body: 'Explicación breve del beneficio, en una o dos líneas.',
    stepIndex: '2 de 4',
    media: 'none',
    sequence: 'single',
    placement: 'top-start',
    showTitle: true,
    showAction: true,
    showBack: true,
    showDismiss: true,
    backLabel: 'Atrás',
    mediaAlt: 'Ilustración de la función',
    mediaSrc: DEMO_IMAGE,
    onAction: fn(),
    onBack: fn(),
    onDismiss: fn(),
    onOpenChange: fn(),
    testID: 'coachmark',
    children: <Button label="Ancla" />,
  },
  render: (args, { globals }) => (
    <Stage title="host-controlled — click the anchor to reopen">
      <OpenCoachmark {...args} platform={globals.platform as TPlatform} />
    </Stage>
  ),
} satisfies Meta<IPlatformCoachmarkProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** `media=none` vs `media=image` — dismiss appearance flips veil → on-media. */
export const Media: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Stage title="media=none — veil dismiss on title row">
          <OpenCoachmark {...args} media="none" platform={platform} startOpen={false} />
        </Stage>
        <Stage title="media=image — on-media dismiss over photo">
          <OpenCoachmark {...args} media="image" platform={platform} startOpen={false} />
        </Stage>
      </div>
    );
  },
};

/** `single` vs `multi` — back + step index only on multi. */
export const Sequence: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Stage title="single — outside press closes">
          <OpenCoachmark {...args} platform={platform} sequence="single" startOpen={false} />
        </Stage>
        <Stage title="multi — back + step; outside press ignored">
          <OpenCoachmark {...args} platform={platform} sequence="multi" startOpen={false} />
        </Stage>
      </div>
    );
  },
};

/** Four sides as preferences — shrink the viewport and watch flip.
 *  Only one open at a time: native uses a Modal per Coachmark and stacking
 *  several open Modals breaks `measureInWindow` (panels look "fixed").
 */
export const Placements: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    const [active, setActive] = useState<TCoachmarkPlacement>('top');
    const sides: TCoachmarkPlacement[] = [...SIDES, 'none'];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sides.map((side) => (
            <Button
              key={side}
              appearance={active === side ? 'fill' : 'outline'}
              label={side}
              onClick={() => setActive(side)}
              size="sm"
            />
          ))}
        </div>
        <Stage title={`${active} — preference; flip/shift if no room`}>
          <OpenCoachmark
            {...args}
            key={active}
            placement={active}
            platform={platform}
          />
        </Stage>
      </div>
    );
  },
};

/** Independent `show*` toggles — not inferred from content. */
export const ShowFlags: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Stage title="showDismiss=false">
          <OpenCoachmark {...args} platform={platform} showDismiss={false} startOpen={false} />
        </Stage>
        <Stage title="showAction=false">
          <OpenCoachmark {...args} platform={platform} showAction={false} startOpen={false} />
        </Stage>
        <Stage title="image + showTitle=false">
          <OpenCoachmark
            {...args}
            media="image"
            platform={platform}
            showTitle={false}
            startOpen={false}
          />
        </Stage>
        <Stage title="multi + showBack=false">
          <OpenCoachmark
            {...args}
            platform={platform}
            sequence="multi"
            showBack={false}
            startOpen={false}
          />
        </Stage>
      </div>
    );
  },
};
