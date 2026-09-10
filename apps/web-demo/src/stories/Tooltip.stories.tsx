import type { TTooltipPlacement, TTooltipType } from '@dsm/shared';
import { Button } from '@dsm/web';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { fn } from 'storybook/test';

import { PlatformTooltip } from './PlatformTooltip';
import type { IPlatformTooltipProps, TPlatform } from './PlatformTooltip';

const TYPES: TTooltipType[] = ['descriptive', 'info'];
const SIDES: TTooltipPlacement[] = ['top', 'right', 'bottom', 'left'];

/**
 * A trigger with room around it, so a panel on any side has somewhere to go.
 *
 * The stories give the canvas real space on purpose: with the trigger against
 * an edge the engine flips, which is correct behaviour and confusing to look
 * at when you are trying to see one placement.
 */
const Stage = ({ children, title }: { children: ReactNode; title: string }): ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 12, opacity: 0.65 }}>{title}</span>
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        height: 180,
        justifyContent: 'center',
        width: 320,
      }}
    >
      {children}
    </div>
  </div>
);

/**
 * The props table describes the shared contract from `@dsm/shared`, which both
 * implementations honour. `argTypes` are declared explicitly rather than
 * inferred, because react-docgen cannot resolve props inherited from another
 * package.
 */
const meta = {
  title: 'Molecules/Tooltip',
  component: PlatformTooltip,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A short explanation anchored to the element that triggers it. **It wraps its ' +
          'trigger** — `children` is the thing being explained, which is a divergence from ' +
          'Figma, where the panel floats with nothing anchoring it.\n\n' +
          '**Hover or focus opens it on web; a long press opens it on mobile.** Not a tap: the ' +
          'trigger is usually a control with an action of its own. bDS is blunt about the cost — ' +
          'on touch a `descriptive` tooltip can barely be opened, so *"si la información hace ' +
          'falta, va visible. Esconderla detrás de un gesto largo es esconderla."* Never put the ' +
          'only copy of something important in one.\n\n' +
          '**`placement` is a preference, not an instruction.** It is the divergence bDS flags ' +
          'hardest: the thirteen values are *the result* of measuring the space, not an input. ' +
          'Leave it unset and the engine picks; set it and the engine still flips away from a ' +
          'side with no room, because *"un tooltip que insiste en ir arriba cuando no hay lugar ' +
          'arriba es un tooltip cortado"*. `none` draws no pointer.\n\n' +
          '**The two types differ in how they leave.** `descriptive` goes away on its own; ' +
          '`info` stays until the person closes it, which is why the title and the dismiss only ' +
          'appear there. There is no `state` axis at all: *"está o no está"*.\n\n' +
          'Three behaviours come from WCAG 1.4.13 and are not configurable on web: `Esc` closes ' +
          'it, moving the pointer **into** the panel does not (otherwise a link inside would be ' +
          'unreachable), and it never times out.',
      },
    },
  },
  argTypes: {
    // --- Content ------------------------------------------------------------
    body: {
      control: 'text',
      description: 'The explanation. Required — *"un tooltip sin cuerpo no tiene razón de existir"*.',
      table: { category: 'Content' },
    },
    title: {
      control: 'text',
      description:
        'A heading above the body. **Its presence is the switch** — there is no `showTitle`. Only ' +
        'meaningful with `type="info"`; on a `descriptive` tooltip it is ignored.',
      table: { category: 'Content' },
    },
    link: {
      description:
        'An action inside the panel, as `{ label, onPress }`. Its presence renders it. Always a ' +
        'LinkButton with `appearance="on-inverse"` and `size="sm"`, both fixed.',
      table: { category: 'Content' },
    },
    children: { table: { disable: true } },
    // --- Appearance ---------------------------------------------------------
    type: {
      control: 'inline-radio',
      options: TYPES,
      description: '`descriptive` leaves on its own; `info` waits to be closed.',
      table: { category: 'Appearance', defaultValue: { summary: 'descriptive' } },
    },
    placement: {
      control: 'select',
      options: [undefined, ...SIDES, 'top-start', 'top-end', 'none'],
      description:
        'Preferred side and alignment. Omit it and the engine chooses freely; `none` draws no ' +
        'pointer. Even when set, the engine flips away from a side with no room.',
      table: { category: 'Appearance', defaultValue: { summary: 'auto' } },
    },
    // --- Other --------------------------------------------------------------
    onDismiss: {
      description:
        'Called when the person closes it. **Its presence draws the dismiss**, and it only makes ' +
        'sense with `type="info"`: a tooltip that leaves on its own needs no close.',
      table: { category: 'Other' },
    },
    testID: {
      control: 'text',
      description:
        'Maps to `data-testid` on web and to the native `testID` on mobile. The panel gets ' +
        '`${testID}-panel`.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: {
    body: 'Se envía a tu correo apenas confirmes.',
    // Required by the contract, so the meta has to supply one. Every `render`
    // below replaces it with a trigger of its own.
    children: <Button label="Disparador" />,
    testID: 'tooltip',
  },
  render: (args, { globals }) => (
    <Stage title="hover or focus the trigger — long press on native">
      <PlatformTooltip {...args} platform={globals.platform as TPlatform}>
        <Button label="Disparador" />
      </PlatformTooltip>
    </Stage>
  ),
} satisfies Meta<IPlatformTooltipProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/**
 * The two types side by side.
 *
 * `descriptive` is body only, and it leaves when you stop pointing at it.
 * `info` gains the title, the link and the dismiss, and waits — try moving the
 * pointer away from it.
 */
export const Types: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Stage title="descriptive — leaves on its own">
          <PlatformTooltip {...args} platform={platform}>
            <Button label="Descriptive" />
          </PlatformTooltip>
        </Stage>
        <Stage title="info — stays until closed">
          <PlatformTooltip
            {...args}
            body="Tu sesión se cierra a los 15 minutos sin actividad."
            link={{ label: 'Cambiar', onPress: fn() }}
            onDismiss={fn()}
            platform={platform}
            title="Sesión"
            type="info"
          >
            <Button label="Info" />
          </PlatformTooltip>
        </Stage>
      </div>
    );
  },
};

/**
 * The four sides, each as a *preference*.
 *
 * Shrink the window until one of them runs out of room and watch it flip: that
 * is the engine doing its job, not the placement being ignored.
 */
export const Placements: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {SIDES.map((side) => (
          <Stage key={side} title={side}>
            <PlatformTooltip {...args} placement={side} platform={platform}>
              <Button label={side} />
            </PlatformTooltip>
          </Stage>
        ))}
        <Stage title="none — positioned, but no pointer">
          <PlatformTooltip {...args} placement="none" platform={platform}>
            <Button label="none" />
          </PlatformTooltip>
        </Stage>
      </div>
    );
  },
};
