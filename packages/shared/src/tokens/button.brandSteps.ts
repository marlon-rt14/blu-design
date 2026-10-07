/**
 * Which brand primitive each semantic takes, per Button colour token.
 *
 * **Generated — do not edit.** `node scripts/brand-crosses/button.mjs` reads it
 * out of section `07 · Origen de cada color` of the Figma frame
 * `Button · Plataformas` (`1507:65184`), which is where design annotates it.
 *
 * The step is the tail of a primitive path: the full one is
 * `color.{step}` under `color.<tone>.brand.<brand>`, e.g. `light/fill-hc` for
 * brand `discover` is `color.light.brand.discover.fill-hc`. Those primitives are
 * byte-identical in all 18 exported folders — 60 paths checked — so the cross
 * needs no new folder and no wider theme key.
 *
 * Only the `fill` family is here. The section's other ten rows point at numeric
 * ramp steps (`light/700`) or at `static/*`, and are out of scope by decision.
 *
 * Note `mc-dark` takes the same step as `dark`, and `hc-light` the same as
 * `mc-light`: the semantic chooses the rung, and the choice is not derivable
 * from the semantic's name. That is the reason this table exists instead of a
 * three-line function.
 */
export const buttonBrandSteps = {
  'primary/bg-default': {
    'light': 'light/fill',
    'dark': 'dark/fill',
    'mc-light': 'light/fill-hc',
    'mc-dark': 'dark/fill',
    'hc-light': 'light/fill-hc',
    'hc-dark': 'dark/fill-hc',
  },
  'primary/bg-hover': {
    'light': 'light/fill-hover',
    'dark': 'dark/fill-hover',
    'mc-light': 'light/fill-hover-hc',
    'mc-dark': 'dark/fill-hover',
    'hc-light': 'light/fill-hover-hc',
    'hc-dark': 'dark/fill-hover-hc',
  },
  'primary/bg-pressed': {
    'light': 'light/fill-pressed',
    'dark': 'dark/fill-pressed',
    'mc-light': 'light/fill-pressed-hc',
    'mc-dark': 'dark/fill-pressed',
    'hc-light': 'light/fill-pressed-hc',
    'hc-dark': 'dark/fill-pressed-hc',
  },
} as const satisfies Record<string, Record<string, `${'light' | 'dark'}/${string}`>>;

/** The colour tokens of the Button that carry the brand, as section `07` lists them. */
export type TButtonBrandToken = keyof typeof buttonBrandSteps;
