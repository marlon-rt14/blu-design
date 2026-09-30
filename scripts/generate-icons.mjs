/**
 * Turns `.figma-assets/icons/` into one module per section, for both platforms:
 * `packages/{web,mobile}/src/icons/<section>.tsx`.
 *
 * **One entry point per section, and no barrel over them.** The collection is
 * 1170 glyphs and ~2.3 MB of path data; a module that re-exported all of it
 * would be a single import away from landing whole in a bundle, and Metro does
 * no tree-shaking at all. Importing from `@dsm/mobile/icons/layout` costs the 63
 * glyphs of that section and nothing else.
 *
 * The two platforms differ in exactly one token — `path` vs `Path` from
 * `react-native-svg` — which is why they are generated from the same pass
 * instead of being kept in step by hand.
 *
 * Three things happen to every path:
 * 1. **`fill="#323949"` is dropped.** That is `color/icon/primary` in the light
 *    theme; left in, the glyph ignores the theme and every role. The `Icon`
 *    container sets the fill and SVG inheritance carries it down.
 * 2. `fill-rule` / `clip-rule` become `fillRule` / `clipRule`. Only `caps-lock`
 *    has them, and dropping them would fill its cut-outs solid.
 * 3. Exact duplicate paths inside one glyph are dropped — see `fingerprint-03`.
 * 4. The coordinates are left alone. Every export in the collection is on the
 *    `0 0 24 24` grid the container supplies — verified, not assumed.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import { readFile, readdir, writeFile, rm, mkdir } from 'node:fs/promises';

const ASSETS = new URL('../.figma-assets/icons/', import.meta.url);
const PLATFORMS = [
  {
    name: 'web',
    dir: new URL('../packages/web/src/icons/', import.meta.url),
    element: 'path',
    imports: (props) =>
      `import { Icon } from '../components/atoms/Icon';\nimport type { ${props} } from '../components/atoms/Icon';\n`,
  },
  {
    name: 'mobile',
    dir: new URL('../packages/mobile/src/icons/', import.meta.url),
    element: 'Path',
    imports: (props) =>
      `import { Path } from 'react-native-svg';\n\nimport { Icon } from '../components/atoms/Icon';\nimport type { ${props} } from '../components/atoms/Icon';\n`,
  },
];

/** `align-bottom-01` → `IconAlignBottom01`. */
const exportName = (name) =>
  `Icon${name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`;

/**
 * Reads the `<path>` elements out of an SVG.
 *
 * Attributes are parsed, not grepped: a previous pass at the card marks matched
 * `d=` inside `id=` and generated four glyphs whose `d` was the literal string
 * `"Vector"`. Typecheck and lint were both green.
 */
const readPaths = (svg) => {
  const seen = new Set();
  return [...svg.matchAll(/<path\b([^>]*)\/?>/gu)]
    .map(([, raw]) => {
      const attributes = new Map(
        [...raw.matchAll(/([a-zA-Z-]+)="([^"]*)"/gu)].map(([, key, value]) => [key, value]),
      );
      return {
        d: attributes.get('d'),
        fillRule: attributes.get('fill-rule'),
        clipRule: attributes.get('clip-rule'),
      };
    })
    .filter(({ d }) => {
      // `fingerprint-03` exports the same path twice, three times over: the
      // design file has the layer duplicated. Painting an identical path on top
      // of itself draws nothing, so the copy is bytes and no pixels.
      if (seen.has(d)) {
        duplicates += 1;
        return false;
      }
      seen.add(d);
      return true;
    });
};

/** Figma writes `Alerts & feedback. Palabras clave: alert, alerta.` */
const glyphDoc = (icon) => {
  const keywords = /Palabras clave:\s*(?<list>[^.]+)/u.exec(icon.description)?.groups?.list;
  const suffix = keywords === undefined ? '' : ` Keywords: ${keywords.trim()}.`;
  return `/** \`${icon.name}\`.${suffix} */`;
};

const { icons, fetchedAt } = JSON.parse(await readFile(new URL('index.json', ASSETS), 'utf8'));

const sections = new Map();
for (const icon of icons) {
  const section = sections.get(icon.slug) ?? { title: icon.section, icons: [] };
  section.icons.push(icon);
  sections.set(icon.slug, section);
}

const date = fetchedAt.slice(0, 10);
let paths = 0;
let duplicates = 0;

for (const platform of PLATFORMS) {
  // The directory is rebuilt from scratch: a section renamed in Figma has to
  // stop existing here, and a leftover module would keep compiling silently.
  await rm(platform.dir, { recursive: true, force: true });
  await mkdir(platform.dir, { recursive: true });

  for (const [slug, section] of sections) {
    const body = [];
    for (const icon of section.icons) {
      const svg = await readFile(new URL(`${slug}/${icon.name}.svg`, ASSETS), 'utf8');
      const elements = readPaths(svg);
      if (elements.length === 0 || elements.some(({ d }) => d === undefined)) {
        throw new Error(`${slug}/${icon.name}.svg: no se pudo leer el path`);
      }
      paths += elements.length;
      const drawn = elements
        .map(({ d, fillRule, clipRule }) => {
          const extra = [
            clipRule === undefined ? '' : ` clipRule="${clipRule}"`,
            fillRule === undefined ? '' : ` fillRule="${fillRule}"`,
          ].join('');
          return `    <${platform.element}${extra} d="${d}" />`;
        })
        .join('\n');
      body.push(
        `${glyphDoc(icon)}\nexport const ${exportName(icon.name)} = (props: TIconProps) => (\n  <Icon {...props}>\n${drawn}\n  </Icon>\n);`,
      );
    }

    const header = `/**
 * \`@dsm/${platform.name}/icons/${slug}\` — the **${section.title}** section of the bDS icon
 * collection, ${section.icons.length} glyph${section.icons.length === 1 ? '' : 's'}.
 *
 * \`\`\`tsx
 * import { ${exportName(section.icons[0].name)} } from '@dsm/${platform.name}/icons/${slug}';
 *
 * <${exportName(section.icons[0].name)} color="danger" size="lg" />
 * \`\`\`
 *
 * Each glyph is an {@link Icon} with its paths already inside, so it takes the
 * same props: \`size\`, \`color\`, \`accessibilityLabel\`, \`testID\`. The section is
 * the entry point on purpose — importing one costs its own glyphs and no others.
 *
 * Prefixed \`Icon…\`, matching bDS's own \`icon/${section.icons[0].name}\`. It groups them in
 * autocomplete and keeps names like \`Image\`, \`Circle\` and \`Star\` from shadowing
 * identically-named exports of React Native and react-native-svg.
 *
 * **Generated — do not edit.** \`node scripts/fetch-figma-icons.mjs\` then
 * \`node scripts/generate-icons.mjs\`, from \`bDS - Icons\` on ${date}.
 */

${platform.imports('TIconProps')}
${body.join('\n\n')}
`;
    await writeFile(new URL(`${slug}.tsx`, platform.dir), header);
  }
}

// ── Storybook's registry ─────────────────────────────────────────────────────
// The gallery is the one place that legitimately needs every glyph at once, and
// it is the reason the library ships no name-to-component map: this file
// references all 1170 twice over, which is exactly what an app must not do.
// Generated so a section renamed in Figma cannot leave the gallery half empty.
const camel = (slug) =>
  slug.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());

const slugs = [...sections.keys()];
const registryPath = new URL('../apps/web-demo/src/stories/iconRegistry.ts', import.meta.url);
await writeFile(
  registryPath,
  `/**
 * Every glyph of both platforms, flattened — **for Storybook only**.
 *
 * The library publishes one module per section and no registry over them, so
 * that an app pays for the sections it imports and nothing else. A gallery is
 * the exception that proves the rule: it has to reach all ${icons.length} glyphs, and it
 * references every one of them twice, once per platform. Storybook is not
 * shipped, so the cost lands nowhere real.
 *
 * Section order is Figma's own, alphabetical by slug.
 *
 * **Generated — do not edit.** \`node scripts/generate-icons.mjs\`, from
 * \`bDS - Icons\` on ${date}.
 */
${slugs.map((slug) => `import * as web${camel(slug).replace(/^./u, (c) => c.toUpperCase())} from '@dsm/web/icons/${slug}';`).join('\n')}
${slugs.map((slug) => `import * as native${camel(slug).replace(/^./u, (c) => c.toUpperCase())} from '@dsm/mobile/icons/${slug}';`).join('\n')}

/** The web component of every glyph, keyed by its export name. */
export const WEB_ICONS = {
${slugs.map((slug) => `  ...web${camel(slug).replace(/^./u, (c) => c.toUpperCase())},`).join('\n')}
};

/** The React Native component of every glyph, keyed by its export name. */
export const NATIVE_ICONS = {
${slugs.map((slug) => `  ...native${camel(slug).replace(/^./u, (c) => c.toUpperCase())},`).join('\n')}
};

/**
 * The bDS name and the section of each glyph, keyed by export name.
 *
 * Both are things the gallery has to show and cannot derive: \`name\` because
 * splitting \`IconAlignBottom01\` back on capitals yields \`align-bottom01\`, and
 * \`section\` because it is the entry point a consumer must import from.
 */
export const ICON_META: Record<string, { name: string; section: string }> = {
${icons.map((icon) => `  ${exportName(icon.name)}: { name: '${icon.name}', section: '${icon.slug}' },`).join('\n')}
};

/** The sections, in Figma's order, with the glyph count the file reports. */
export const ICON_SECTIONS: { slug: string; title: string; count: number }[] = [
${slugs.map((slug) => `  { slug: '${slug}', title: ${JSON.stringify(sections.get(slug).title)}, count: ${sections.get(slug).icons.length} },`).join('\n')}
];
`,
);

console.log(
  `secciones: ${sections.size}, glifos: ${icons.length}, paths: ${paths / PLATFORMS.length}` +
    `, duplicados descartados: ${duplicates / PLATFORMS.length}`,
);
for (const [slug, section] of sections) {
  console.log(`  ${slug.padEnd(20)} ${String(section.icons.length).padStart(4)}`);
}
