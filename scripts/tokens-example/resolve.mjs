/**
 * Flattens `tokens.source.example.json` into the per-platform reading view.
 *
 * ```sh
 * node scripts/tokens-example/resolve.mjs
 * ```
 *
 * Two files, two needs — not two formats. The **source** is what you maintain:
 * one hex per colour, aliases upward, and the mode table on the single link that
 * branches. This **resolved** view is what you read when you want to see the
 * component without crossing anything in your head: platform first, every
 * combination spelled out.
 *
 * Generating one from the other is the point. A hand-kept flat view is a second
 * source of truth, and the day design retunes a contrast — as it did on
 * 2026-10-01 for `discover` and `clubmiles` — one of the two is wrong and
 * nothing says so.
 *
 * ## The split, and why `hibrido` carries almost everything
 *
 * Of the Button's tokens the platform moves **three**: the radius, the family and
 * the weight. Everything else is the same on the three. So `hibrido` holds the
 * values, stated once, and each platform holds only what differs plus the one
 * thing it alone can say: **which states it actually renders.**
 *
 * `hover` and `focus` are absent on iOS and Android not because their value
 * changes but because the interaction does not exist — no pointer to hover, no
 * keyboard focus to walk. `disabled` is on all three: it is a prop, not an
 * interaction.
 *
 * Without that split this file would be the 18-folder export again, with every
 * colour repeated three times for an axis that does not move colour at all.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'tokens.source.example.json';
const OUT = 'tokens.resolved.example.json';
const source = JSON.parse(readFileSync(SRC, 'utf8'));

/** Only two brands, because the source's palette only carries two. */
const BRANDS = ['blu', 'discover'];
const SEMANTICS = ['light', 'dark', 'mc-light', 'mc-dark', 'hc-light', 'hc-dark'];
const LAYOUTS = ['compact', 'regular', 'expanded'];

/** Which states each platform renders. The only thing a platform block says that `hibrido` cannot. */
const STATES = {
  web: ['default', 'hover', 'pressed', 'focus', 'disabled'],
  ios: ['default', 'pressed', 'disabled'],
  android: ['default', 'pressed', 'disabled'],
};

/** The two variants, as the source nests them: `button.<variant>.<appearance>.<key>`. */
const VARIANTS = ['primary', 'danger'];

const at = (path) =>
  path.split('.').reduce((node, segment) => (node == null ? undefined : node[segment]), source);

const modesOf = (leaf) => leaf.$extensions?.['bds.modes'];
const axesOf = (leaf) => Object.keys(modesOf(leaf) ?? {}).filter((k) => !k.startsWith('$') && k !== 'brandOverrides');

/**
 * Resolves a leaf to a literal, following aliases and picking the mode the
 * requested axes select.
 *
 * The `$template` case is the interesting one: a bridge does not hold six
 * values, it holds six *step names* plus `{color.brand.<brand>.<step>}`. The
 * semantic picks the step, the brand fills the slot, and the recursion lands on
 * the one hex that exists. `brandOverrides` is where a brand takes a different
 * step — discover and clubmiles shifted theirs one darker for contrast.
 */
const resolve = (path, axes, depth = 0) => {
  if (depth > 12) throw new Error(`Alias cycle at ${path}`);
  const leaf = at(path);
  if (leaf?.$value === undefined) throw new Error(`No leaf at ${path}`);

  const modes = modesOf(leaf);
  if (modes) {
    for (const axis of axesOf(leaf)) {
      const override = modes.brandOverrides?.[axes.brand]?.[axes[axis]];
      const picked = override ?? modes[axis][axes[axis]];
      if (picked === undefined) continue;
      // A mode value in braces is a full reference, not a step: the dark side of
      // the soft fills does not come from the brand at all, it comes from a white
      // alpha. Bare steps only mean something when there is a template to put
      // them in; otherwise the mode table holds literals, like `1px`.
      if (String(picked).startsWith('{')) return resolve(String(picked).slice(1, -1), axes, depth + 1);
      if (!modes.$template) return picked;
      const target = modes.$template.replace('<brand>', axes.brand).replace('<step>', picked);
      return resolve(target.slice(1, -1), axes, depth + 1);
    }
  }
  const alias = /^\{(.+)\}$/.exec(String(leaf.$value));
  return alias ? resolve(alias[1], axes, depth + 1) : leaf.$value;
};

/** Which axes move a token, following its alias chain. */
const axesMoving = (path, depth = 0, found = new Set()) => {
  if (depth > 12) return found;
  const leaf = at(path);
  if (leaf?.$value === undefined) return found;
  for (const axis of axesOf(leaf)) found.add(axis);
  if (modesOf(leaf)?.$template) found.add('brand');
  const alias = /^\{(.+)\}$/.exec(String(leaf.$value));
  if (alias) axesMoving(alias[1], depth + 1, found);
  return found;
};

const AXIS_VALUES = { brand: BRANDS, semantic: SEMANTICS, layout: LAYOUTS };
const AXIS_ORDER = ['brand', 'semantic', 'layout'];

/**
 * Expands one token over the axes that move it, outermost first.
 *
 * Recurses on an **accumulated** axis object rather than re-spreading a base at
 * each level. An earlier version re-spread it, so the inner loop quietly reset
 * the outer axis and every brand resolved to `blu` — the output looked complete
 * and was wrong in four of five brands.
 */
const expand = (path) => {
  const order = AXIS_ORDER.filter((axis) => axesMoving(path).has(axis));
  const nest = (axes, remaining) => {
    if (remaining.length === 0) return resolve(path, axes);
    const [axis, ...rest] = remaining;
    return Object.fromEntries(
      AXIS_VALUES[axis].map((value) => [value, nest({ ...axes, [axis]: value }, rest)]),
    );
  };
  return nest({ brand: 'blu', semantic: 'light', layout: 'compact', platform: 'web' }, order);
};

const button = at('component.button');

/**
 * Resolves one appearance: `<asunto>.<estado>`, four concerns deep.
 *
 * Inside an appearance everything is a colour — it is the only thing an
 * appearance moves — so the two levels are always concern then state.
 */
const resolveAppearance = (path, node) =>
  Object.fromEntries(
    Object.keys(node)
      .filter((k) => !k.startsWith('$'))
      .map((concern) => [
        concern,
        Object.fromEntries(
          Object.keys(node[concern])
            .filter((k) => !k.startsWith('$'))
            .map((state) => [state, expand(`${path}.${concern}.${state}`)]),
        ),
      ]),
  );

// --- hibrido: every value the platform does not move -------------------------
const hybrid = { geometry: {} };
for (const [key, node] of Object.entries(button.geometry)) {
  if (key.startsWith('$')) continue;
  const path = `component.button.geometry.${key}`;
  if (node.$value === undefined) {
    hybrid.geometry[key] = Object.fromEntries(
      Object.entries(node)
        .filter(([k]) => !k.startsWith('$'))
        .map(([size]) => [size, expand(`${path}.${size}`)]),
    );
  } else if (!axesMoving(path).has('platform')) {
    hybrid.geometry[key] = expand(path);
  }
}
for (const variant of VARIANTS) {
  const group = button[variant];
  for (const appearance of Object.keys(group).filter((k) => !k.startsWith('$'))) {
    (hybrid[variant] ??= {})[appearance] = resolveAppearance(
      `component.button.${variant}.${appearance}`,
      group[appearance],
    );
  }
}
hybrid.focus = Object.fromEntries(
  Object.keys(button.focus)
    .filter((k) => !k.startsWith('$'))
    .map((k) => [k, expand(`component.button.focus.${k}`)]),
);

// --- the three platforms: only what differs, plus their state set ------------
const platforms = Object.fromEntries(
  Object.keys(STATES).map((platform) => {
    const only = {};
    for (const [key, node] of Object.entries(button.geometry)) {
      if (key.startsWith('$') || node.$value === undefined) continue;
      const path = `component.button.geometry.${key}`;
      if (axesMoving(path).has('platform')) {
        only[key] = resolve(path, { brand: 'blu', semantic: 'light', layout: 'compact', platform });
      }
    }
    return [platform, { $states: STATES[platform], components: { button: only } }];
  }),
);

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      _comment: [
        'GENERADO. No editar — sale de tokens.source.example.json con',
        '`node scripts/tokens-example/resolve.mjs`.',
        '',
        'Esta es la vista para LEER: plataforma primero y cada combinación escrita. Sirve',
        'para ver el componente sin cruzar nada en la cabeza. No sirve para mantener: aquí',
        'un color de marca aparece 12 veces (2 marcas x 6 temas) y con las 5 marcas serían',
        '30. Cambiar un contraste serían 30 ediciones. Eso se hace en la fuente.',
        '',
        '`hibrido` lleva todo lo que la plataforma NO mueve, dicho una vez. Las tres',
        'plataformas llevan lo que difiere — 3 tokens — y lo único que solo ellas pueden',
        'decir: qué estados renderizan. hover y focus no faltan en táctil porque su valor',
        'cambie, sino porque la interacción no existe. disabled está en las tres: es una',
        'prop, no una interacción.',
        '',
        'Solo blu y discover y solo `primary · fill`, porque es lo que la fuente trae. El',
        'archivo real traería las cinco marcas y las ocho combinaciones de variant x',
        'appearance — la misma forma, multiplicada. Que multiplicar salga caro es justo el',
        'argumento de por qué esta vista se genera y no se mantiene.',
      ],
      platform: { ...platforms, hibrido: { components: { button: hybrid } } },
    },
    null,
    2,
  )}\n`,
);
console.log(`${OUT} escrito`);
