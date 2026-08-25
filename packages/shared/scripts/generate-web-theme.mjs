#!/usr/bin/env node
/**
 * Generates `packages/web/src/styles/textfield-theme.css` from the Supernova
 * token export in `src/theme/{base,dark}`.
 *
 * This is NOT Style Dictionary — Supernova's own pipeline already produced
 * fully-resolved JSON in `theme/base` (light) and `theme/dark`. This script
 * only turns the handful of tokens a component needs into CSS custom
 * properties, so `@dsm/web` never hand-mirrors a value that already exists in
 * that JSON.
 *
 * Re-run after Supernova syncs new values:
 *   pnpm --filter @dsm/shared build:theme-css
 *
 * To add another component: add its color path map to COMPONENT_COLOR_PATHS,
 * and its dimension/typography paths to STATIC_DIMENSION_PATHS /
 * STATIC_TYPOGRAPHY_PATHS below. The resolver functions never change.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const themeDir = join(here, '..', 'src', 'theme');
const outputFile = join(here, '..', '..', 'web', 'src', 'styles', 'textfield-theme.css');

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

/** Walks a dot-separated path down a Supernova token tree and returns the leaf `value`. */
const readTokenValue = (tree, path) => {
  const node = path.split('.').reduce((current, segment) => current?.[segment], tree);
  if (!node || typeof node.value !== 'string') {
    throw new Error(`Token not found while generating CSS: "${path}"`);
  }
  return node.value;
};

const THEMES = [
  { mode: 'light', folder: 'base', selector: ':root' },
  { mode: 'dark', folder: 'dark', selector: "[data-dsm-theme='dark']" },
];

// Color varies by theme — one entry per CSS variable suffix, mapped to its
// path in color.json. Prefixed `--dsm-textfield-color-` in the output.
const COMPONENT_COLOR_PATHS = {
  'container-bg-default': 'color.component.textfield.container.bg-default',
  'container-bg-disabled': 'color.component.textfield.container.bg-disabled',
  'container-bg-readonly': 'color.component.textfield.container.bg-readonly',
  'container-border-default': 'color.component.textfield.container.border-default',
  'container-border-hover': 'color.component.textfield.container.border-hover',
  'container-border-focus': 'color.component.textfield.container.border-focus',
  'container-border-error': 'color.component.textfield.container.border-error',
  'container-border-disabled': 'color.component.textfield.container.border-disabled',
  'container-border-readonly': 'color.component.textfield.container.border-readonly',
  'container-overlay-hover': 'color.component.textfield.container.overlay-hover',
  'label-default': 'color.component.textfield.label.text-default',
  'label-disabled': 'color.component.textfield.label.text-disabled',
  'value-placeholder': 'color.component.textfield.value.text-placeholder',
  'value-filled': 'color.component.textfield.value.text-filled',
  'value-disabled': 'color.component.textfield.value.text-disabled',
  'value-readonly': 'color.component.textfield.value.text-readonly',
  'helper-default': 'color.component.textfield.helper.text-default',
  'helper-error': 'color.component.textfield.helper.text-error',
  'helper-disabled': 'color.component.textfield.helper.text-disabled',
  'counter-default': 'color.component.textfield.counter.text-default',
  'counter-error': 'color.component.textfield.counter.text-error',
  'counter-disabled': 'color.component.textfield.counter.text-disabled',
  'icon-default': 'color.component.textfield.icon.icon-default',
  'icon-disabled': 'color.component.textfield.icon.icon-disabled',
};

// Page-level roles, so the Storybook canvas itself can switch theme, not just
// the component inside it. Not TextField-specific, but too small to warrant
// their own generator step.
const PAGE_COLOR_PATHS = {
  background: 'color.color.canvas.background.page',
  text: 'color.color.text.primary',
};

// Dimension and typography carry no theme variance today — read once from
// `base`. Prefixed `--dsm-textfield-size-` / `--dsm-textfield-typography-`.
const STATIC_DIMENSION_PATHS = {
  'medium-height': 'dimension.size.field.height.md',
  'medium-radius': 'dimension.radius.field.sm',
  'medium-padding-x': 'dimension.space.inset.lg',
  'large-height': 'dimension.size.field.height.lg',
  'large-radius': 'dimension.radius.field.md',
  'large-padding-x': 'dimension.space.inset.lg',
  'border-width-default': 'dimension.border.width.default',
  'border-width-focus': 'dimension.border.width.focus',
  'stack-gap': 'dimension.space.inset.xs',
  'inline-gap': 'dimension.space.inset.sm',
  'icon-size': 'dimension.size.icon.sm',
};

const STATIC_TYPOGRAPHY_PATHS = {
  label: 'typography.component.inputs.input-text.typography.text-holder',
  content: 'typography.component.inputs.input-text.typography.content',
  helper: 'typography.component.inputs.input-text.typography.helper',
  counter: 'typography.component.inputs.input-text.typography.character-count',
};

// The token value is just "Mulish" — Supernova defines the intended family,
// not a web fallback stack. `@dsm/web` loads the real Mulish files via
// @fontsource-variable/mulish (see index.ts); this generic fallback only
// covers the brief load window or a font-loading failure.
const WEB_FONT_FALLBACK = 'sans-serif';

const renderBlock = (selector, entries) => `${selector} {\n${entries.join('\n')}\n}`;

const colorBlocks = THEMES.map(({ folder, selector }) => {
  const color = readJson(join(themeDir, folder, 'color.json'));
  const componentEntries = Object.entries(COMPONENT_COLOR_PATHS).map(
    ([name, path]) => `  --dsm-textfield-color-${name}: ${readTokenValue(color, path)};`,
  );
  const pageEntries = Object.entries(PAGE_COLOR_PATHS).map(
    ([name, path]) => `  --dsm-page-${name}: ${readTokenValue(color, path)};`,
  );
  return renderBlock(selector, [...componentEntries, ...pageEntries]);
});

const stringTokens = readJson(join(themeDir, 'base', 'string.json'));
const baseFontFamily = readTokenValue(stringTokens, 'string.platform.font.family');
const fontFamilyBlock = renderBlock(':root', [
  `  --dsm-font-family-base: ${baseFontFamily}, ${WEB_FONT_FALLBACK};`,
]);

const dimension = readJson(join(themeDir, 'base', 'dimension.json'));
const sizeEntries = Object.entries(STATIC_DIMENSION_PATHS).map(
  ([name, path]) => `  --dsm-textfield-size-${name}: ${readTokenValue(dimension, path)};`,
);

const typography = readJson(join(themeDir, 'base', 'typography.json'));
const typographyEntries = Object.entries(STATIC_TYPOGRAPHY_PATHS).map(
  ([name, path]) =>
    `  --dsm-textfield-typography-${name}: ${readTokenValue(typography, path)}, ${WEB_FONT_FALLBACK};`,
);

const css = `/*
 * GENERATED FILE — do not edit by hand.
 *
 * Produced by packages/shared/scripts/generate-web-theme.mjs from the
 * Supernova token export in packages/shared/src/theme/{base,dark}. Re-run
 * \`pnpm --filter @dsm/shared build:theme-css\` after Supernova syncs new
 * values.
 */
${colorBlocks.join('\n\n')}

${fontFamilyBlock}

${renderBlock(':root', sizeEntries)}

${renderBlock(':root', typographyEntries)}
`;

writeFileSync(outputFile, css);
console.log(`Wrote ${outputFile}`);
