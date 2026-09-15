import type { TDividerAppearance, TDividerOrientation } from '@dsm/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { PlatformDivider } from './PlatformDivider';
import type { IPlatformDividerProps, TPlatform } from './PlatformDivider';

const ORIENTATIONS: TDividerOrientation[] = ['horizontal', 'vertical'];
const APPEARANCES: TDividerAppearance[] = ['subtle', 'default', 'strong'];

/** A labelled cell. The caption sits outside, since the line is 1px of colour. */
const Cell = ({ title, children }: { title: string; children: ReactNode }): ReactNode => (
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
  title: 'Atoms/Divider',
  component: PlatformDivider,
  parameters: {
    // 'fullscreen', not 'centered' — lets ThemedStory's own centering (see
    // .storybook/preview.tsx) paint its background full-bleed.
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A decorative rule between blocks of content. Two props, no children, no text and — ' +
          'deliberately — **no states**: *"el Divider no tiene estados y no deberia tenerlos. Es ' +
          'decorativo: no se toca, no recibe foco y no cambia con la interaccion."*\n\n' +
          '**It is not a border.** `component/divider/line/*` sits at about 1.5 contrast on ' +
          'purpose, so it does not delimit a control and it does not outline an input. For a ' +
          'load-bearing edge the token is `color/border/input/*`, which runs 3.79 to 8.81. ' +
          'Reaching for a Divider to draw the edge of a field is the mistake this component is ' +
          'documented to prevent.\n\n' +
          '**There is no thickness axis.** The line is always `border/width/divider`: 1 in `light` ' +
          'and `dark`, **2 in both high-contrast modes**, never written by hand. Flip Mode to ' +
          '`HC light` in the toolbar and the line doubles on its own — in those modes the ' +
          'separation cannot lean on tint, which is exactly why hardcoding the 1 breaks them. ' +
          'A dotted or heavier line is not a prop either; bDS keeps it declared: *"si aparece la ' +
          'necesidad de una punteada o de una mas gruesa, es CHG"*.\n\n' +
          '**It is always decorative to a screen reader**, on both platforms. bDS asks for ' +
          '`role="separator"` when the line separates groups that carry meaning, but React Native ' +
          'has no separator role — `AccessibilityRole` runs from `none` to `iconmenu` and does not ' +
          'include one — so the semantic case would be a web-only behaviour behind a contract ' +
          'that is symmetric everywhere else here. bDS answers that case itself anyway: *"agrupar ' +
          'no es nombrar. Un divisor no reemplaza a un encabezado."*\n\n' +
          '**Rows bring their own line.** `ListItem`, `ChoiceItem` and `SwitchItem` each have a ' +
          '`showDivider`, because bDS keeps the divider inside the row so the last one does not ' +
          'drag it along. Use this component between blocks, not between list rows.\n\n' +
          'One open divergence, declared by design: there is no written rule yet for **when to ' +
          'use each appearance**. Until it lands, `default` is the answer unless there is a ' +
          'reason — *"sin esa regla los tres se eligen a ojo, y el resultado es que la misma ' +
          'pantalla mezcla dos"*.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ORIENTATIONS,
      description:
        'Which way the line runs. A vertical divider has no length of its own: it stretches to ' +
        'its container, which is what makes it visible inside a flex row.',
      table: { category: 'Appearance', defaultValue: { summary: 'horizontal' } },
    },
    appearance: {
      control: 'inline-radio',
      options: APPEARANCES,
      description:
        'How much weight the line carries, from `component/divider/line/*`. Figma’s variant axis ' +
        'reads `strong · default · subtle`, heaviest first, so its panel reports `strong` as the ' +
        'default; the real default is `default`.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    testID: {
      control: 'text',
      description: 'Maps to `data-testid` on web and to the native `testID` on mobile.',
      table: { category: 'Other' },
    },
    platform: { table: { disable: true } },
  },
  args: { testID: 'divider' },
  render: (args, { globals }) => (
    <div style={{ alignItems: 'center', display: 'flex', height: 120, width: 320 }}>
      <PlatformDivider {...args} platform={globals.platform as TPlatform} />
    </div>
  ),
} satisfies Meta<IPlatformDividerProps>;

export default meta;

type TStory = StoryObj<typeof meta>;

/** Every prop editable from the controls panel. */
export const Playground: TStory = {};

/**
 * The full matrix: three appearances by two orientations — the same grid Figma
 * draws on the component's own page.
 *
 * The three are a real intensity ramp and they all move with the mode. Switch
 * Mode in the toolbar to see it: in `light` they run `#e5e8f1`, `#ced4e3`,
 * `#7c8396`, and in `dark` the order inverts in lightness because the surface
 * did.
 */
export const Matrix: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {ORIENTATIONS.map((orientation) => (
          <div key={orientation} style={{ display: 'flex', gap: 40 }}>
            {APPEARANCES.map((appearance) => (
              <Cell key={appearance} title={`${orientation} · ${appearance}`}>
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: orientation === 'vertical' ? 160 : 1,
                    width: orientation === 'vertical' ? 1 : 320,
                  }}
                >
                  <PlatformDivider
                    {...args}
                    appearance={appearance}
                    orientation={orientation}
                    platform={platform}
                    testID={`divider-${orientation}-${appearance}`}
                  />
                </div>
              </Cell>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * A vertical divider inside a flex row that has **no height of its own** — the
 * layout it is actually used in.
 *
 * It is visible because the hook stretches it to the row rather than setting
 * `height: 100%`. A definite cross size would opt the item out of stretching,
 * and the percentage would then resolve against an indefinite parent height,
 * which CSS treats as `auto` — zero on an element with no content. The divider
 * would vanish exactly here.
 */
export const VerticalInARow: TStory = {
  args: { orientation: 'vertical' },
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ alignItems: 'center', display: 'flex', fontSize: 14, gap: 16 }}>
        <span>Débito</span>
        <PlatformDivider {...args} platform={platform} testID="divider-inline" />
        <span>Crédito</span>
        <PlatformDivider {...args} platform={platform} testID="divider-inline-2" />
        <span>Transferencia</span>
      </div>
    );
  },
};

/**
 * What the component is documented to prevent: using the decorative line where a
 * load-bearing edge belongs.
 *
 * Left is `component/divider/line/default`, around 1.5 contrast. Right is
 * `color/border/input/default`, which runs 3.79 to 8.81. At a glance the
 * difference looks like taste; for someone who needs to find the edge of a
 * field, it is the difference between a control and a smudge.
 */
export const NotABorder: TStory = {
  render: (args, { globals }) => {
    const platform = globals.platform as TPlatform;
    return (
      <div style={{ display: 'flex', gap: 40 }}>
        <Cell title="divider · decorative (~1.5)">
          <div style={{ display: 'flex', height: 44, width: 220 }}>
            <PlatformDivider {...args} platform={platform} testID="divider-decorative" />
          </div>
        </Cell>
        <Cell title="border/input · load-bearing (3.79+)">
          <div
            style={{
              alignItems: 'center',
              border: '1px solid var(--dsm-demo-input-border, #8a90a2)',
              borderRadius: 8,
              display: 'flex',
              fontSize: 13,
              height: 44,
              paddingLeft: 12,
              width: 220,
            }}
          >
            Un campo de verdad
          </div>
        </Cell>
      </div>
    );
  },
};
