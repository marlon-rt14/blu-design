/** Generic leaf shape produced by the Supernova Style Dictionary export. */
interface IThemeTokenLeaf {
  value: string;
  type: string;
  description?: string;
}

type TThemeTokenNode = IThemeTokenLeaf | { [key: string]: TThemeTokenNode };

const isLeaf = (node: TThemeTokenNode): node is IThemeTokenLeaf =>
  typeof (node as IThemeTokenLeaf).value === 'string';

/**
 * Reads a single resolved value out of a Supernova-exported theme file by its
 * dot-separated path (e.g. `'color.component.textfield.container.border-focus'`).
 *
 * The JSON under `theme/base` and `theme/dark` ships fully resolved — no
 * `{alias}` references left — so this only walks the tree and returns the
 * leaf `value`. Throws instead of returning `undefined`: a missing token means
 * the design system and the code have drifted, and that should fail loudly at
 * import time, not render as a blank style somewhere.
 *
 * @param tree - The parsed JSON of a theme file (`color.json`, `dimension.json`, etc.).
 * @param path - Dot-separated path to the token, matching its shape in the JSON.
 */
export const readThemeToken = (tree: unknown, path: string): string => {
  const segments = path.split('.');
  let node = tree as TThemeTokenNode;

  for (const segment of segments) {
    if (typeof node !== 'object' || node === null || !(segment in node)) {
      throw new Error(`Theme token not found: "${path}" (missing segment "${segment}")`);
    }
    node = (node as Record<string, TThemeTokenNode>)[segment] as TThemeTokenNode;
  }

  if (!isLeaf(node)) {
    throw new Error(`Theme token "${path}" does not resolve to a leaf value.`);
  }

  return node.value;
};

/**
 * Same as {@link readThemeToken}, but strips a trailing `px` unit and returns
 * a number.
 *
 * Mobile consumes dimensions as unitless numbers (React Native treats them as
 * density-independent pixels) and web re-adds `px` at the CSS layer, so every
 * dimension token is parsed once, here, instead of in each component.
 */
export const readThemeDimension = (tree: unknown, path: string): number => {
  const raw = readThemeToken(tree, path);
  const match = /^(?<amount>-?\d+(?:\.\d+)?)px$/.exec(raw);
  const amount = match?.groups?.['amount'];

  if (!amount) {
    throw new Error(`Theme token "${path}" is not a pixel dimension: "${raw}"`);
  }

  return Number(amount);
};

/** A typography token resolved into its discrete CSS-shorthand parts. */
export interface IThemeTypographyValue {
  fontWeight: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

/**
 * Reads a typography token and splits its CSS shorthand (`"400 14px/17px Mulish"`)
 * into discrete fields.
 *
 * Web can use the shorthand as-is via a single CSS custom property; mobile
 * needs the parts separately because React Native's `TextStyle` has no
 * shorthand form.
 */
export const readThemeTypography = (tree: unknown, path: string): IThemeTypographyValue => {
  const raw = readThemeToken(tree, path);
  const match =
    /^(?<weight>\d+)\s+(?<size>\d+(?:\.\d+)?)px\/(?<lineHeight>\d+(?:\.\d+)?)px\s+(?<family>.+)$/.exec(
      raw,
    );
  const weight = match?.groups?.['weight'];
  const size = match?.groups?.['size'];
  const lineHeight = match?.groups?.['lineHeight'];
  const family = match?.groups?.['family'];

  if (!weight || !size || !lineHeight || !family) {
    throw new Error(`Theme token "${path}" is not a typography shorthand: "${raw}"`);
  }

  return {
    fontWeight: weight,
    fontSize: Number(size),
    lineHeight: Number(lineHeight),
    fontFamily: family,
  };
};
