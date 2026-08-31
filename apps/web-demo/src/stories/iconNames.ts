import * as WebIcons from '@dsm/web/icons';

/**
 * The export name of every glyph, e.g. `'IconTrash'`.
 *
 * Read off the module rather than written out, so a glyph added to the library
 * shows up in Storybook without anyone remembering to list it here.
 *
 * Kept in its own module because `PlatformIcon.tsx` may only export components:
 * anything else in a file Vite fast-refreshes forces a full reload instead.
 */
export type TIconExportName = keyof typeof WebIcons;

/** Every glyph the library exports, alphabetically. */
export const ICON_NAMES = (Object.keys(WebIcons) as TIconExportName[]).sort();

/**
 * The bDS name a component came from: `IconAlertTriangle` -> `icon/alert-triangle`.
 *
 * Splitting on capitals rather than inserting dashes between a lowercase and an
 * uppercase letter, because that naive version turns `IconXCircle` into
 * `xcircle` — there is no lowercase before the `C`.
 */
export const toFigmaName = (name: TIconExportName): string =>
  `icon/${(name.replace(/^Icon/, '').match(/[A-Z][a-z0-9]*/g) ?? []).join('-').toLowerCase()}`;
