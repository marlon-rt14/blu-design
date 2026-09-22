import type { TPopoverPlacement, TPopoverSize } from '@dsm/shared';
import { Button, Popover } from '@dsm/web';
import type { IPopoverProps } from '@dsm/web';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement, ReactNode } from 'react';
import { fn } from 'storybook/test';

const SIZES: TPopoverSize[] = ['md', 'sm'];
const SIDES: TPopoverPlacement[] = ['top', 'right', 'bottom', 'left'];

/**
 * Room around the trigger, so a panel on any side has somewhere to go.
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
        height: 220,
        justifyContent: 'center',
        width: 320,
      }}
    >
      {children}
    </div>
  </div>
);

const meta = {
  title: 'Molecules/Popover',
  component: Popover,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A free-content floating surface anchored to a trigger. If the content is a list of ' +
          'options, this is the wrong component — that is `Menu`, whose slot only accepts the ' +
          '`MenuItem` family and has no trigger or open state of its own.\n\n' +
          '**It wraps `trigger`.** `children` is the content, `trigger` is what opens it — a ' +
          'divergence from Figma, where the panel floats free with nothing anchoring it.\n\n' +
          '**Uncontrolled.** There is no `isOpen`/`onOpenChange` — a click on `trigger` opens it, ' +
          'Esc or an outside click always closes it.\n\n' +
          '**Unlike Tooltip and Coachmark, it traps focus.** Opening moves focus inside and keeps ' +
          'it there; closing returns it to `trigger`. That, and the real `role="dialog"`, is what ' +
          'the dev contract calls out as the difference from those two.\n\n' +
          '**`size` changes the header height and padding only** — never the width, which comes ' +
          'from the trigger or the content. Content taller than the available space scrolls inside ' +
          'the panel; the header never scrolls.\n\n' +
          '**Web and desktop only, for now.** On native this surface is replaced entirely by a ' +
          'different component — an action sheet on iOS, a Material bottom sheet on Android — not ' +
          'a smaller version of this one.',
      },
    },
  },
  argTypes: {
    // --- Content ------------------------------------------------------------
    header: {
      control: 'text',
      description: 'Shown above the content. Its presence turns the header on — no separate `showHeader`.',
      table: { category: 'Content' },
    },
    children: { table: { disable: true } },
    trigger: { table: { disable: true } },
    // --- Appearance ---------------------------------------------------------
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Header height and padding. Never the width.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    placement: {
      control: 'select',
      options: [undefined, ...SIDES, 'top-start', 'top-end'],
      description:
        'Preferred side and alignment. Omit it and the engine chooses freely — even when set, it ' +
        'flips away from a side with no room.',
      table: { category: 'Appearance', defaultValue: { summary: 'auto' } },
    },
    // --- Other --------------------------------------------------------------
    onDismiss: {
      description: 'Called when the × is pressed. **Its presence draws it** — no separate `showDismiss`.',
      table: { category: 'Other' },
    },
    testID: {
      control: 'text',
      description: 'Maps to `data-testid`. The panel gets `${testID}-panel`.',
      table: { category: 'Other' },
    },
  },
  args: {
    // Required by the contract, so the meta has to supply one. Every `render`
    // below replaces it with a trigger of its own.
    trigger: <Button label="Disparador" />,
    children: <p style={{ margin: 0 }}>Tu cupo se renueva el 5 de cada mes.</p>,
    testID: 'popover',
  },
  render: (args) => (
    <Stage title="click the trigger">
      <Popover {...args} />
    </Stage>
  ),
} satisfies Meta<IPopoverProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/** `header`'s presence draws the title — omit it and only the content shows. */
export const WithHeader: TStory = {
  args: {
    header: 'Cupo disponible',
    trigger: <Button label="Ver cupo" />,
  },
};

/** `onDismiss`'s presence draws the ×, `ghost` and `xs`, next to the header. */
export const WithDismiss: TStory = {
  args: {
    header: 'Simular cuota',
    onDismiss: fn(),
    trigger: <Button label="Simular cuota" />,
  },
};

/** The two sizes — only the header height and padding change. */
export const Sizes: TStory = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {SIZES.map((size) => (
        <Stage key={size} title={size}>
          <Popover {...args} header="Cupo disponible" size={size} trigger={<Button label={size} />} />
        </Stage>
      ))}
    </div>
  ),
};

/**
 * The four sides, each as a *preference*.
 *
 * Shrink the window until one of them runs out of room and watch it flip:
 * that is the engine doing its job, not the placement being ignored.
 */
export const Placements: TStory = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {SIDES.map((side) => (
        <Stage key={side} title={side}>
          <Popover {...args} placement={side} trigger={<Button label={side} />} />
        </Stage>
      ))}
    </div>
  ),
};

/** Content taller than the available space scrolls inside the panel; the header stays put. */
export const LongContent: TStory = {
  args: {
    header: 'Términos del cupo',
    trigger: <Button label="Ver términos" />,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} style={{ margin: 0 }}>
            Párrafo {index + 1}. Los consumos en curso ya están descontados de tu cupo disponible.
          </p>
        ))}
      </div>
    ),
  },
  render: (args) => (
    <Stage title="scrolls inside the panel, not the page">
      <Popover {...args} />
    </Stage>
  ),
};
