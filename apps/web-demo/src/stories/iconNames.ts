import { ICON_META, WEB_ICONS } from './iconRegistry';

/**
 * The export name of every glyph, e.g. `'IconTrash01'`.
 *
 * Read off the registry rather than written out, so a glyph added to the
 * library shows up in Storybook without anyone remembering to list it here.
 *
 * Kept in its own module because `PlatformIcon.tsx` may only export components:
 * anything else in a file Vite fast-refreshes forces a full reload instead.
 */
export type TIconExportName = keyof typeof WEB_ICONS;

/** Every glyph the library exports, alphabetically. 1170 of them. */
export const ICON_NAMES = (Object.keys(WEB_ICONS) as TIconExportName[]).sort();

/**
 * The bDS name a component came from: `IconAlignBottom01` -> `icon/align-bottom-01`.
 *
 * Looked up rather than computed. Splitting on capitals — which is what this
 * used to do — cannot put the dash back before a numeric suffix: it yields
 * `align-bottom01`, and there is no capital to split on inside `01`.
 */
export const toFigmaName = (name: TIconExportName): string =>
  `icon/${ICON_META[name]?.name ?? String(name)}`;

/**
 * The entry point a glyph is imported from: `IconTrash01` -> `general`.
 *
 * The one thing a gallery of 1170 glyphs owes the person reading it — the name
 * alone does not say which of the 19 modules to import.
 */
export const iconSection = (name: TIconExportName): string =>
  ICON_META[name]?.section ?? 'general';
