import { createElement } from 'react';
import type { ReactNode } from 'react';

import type { IIconBaseProps, TIconSize } from '@dsm/shared';
import type { ComponentType } from 'react';

import type { TIconExportName } from './iconNames';
import { NATIVE_ICONS, WEB_ICONS } from './iconRegistry';
import type { TPlatform } from './PlatformIcon';

/**
 * Builds the glyph a Storybook control asked for, for the platform on screen.
 *
 * Every icon slot in the library is a `ReactNode` — the caller imports the
 * glyph from its section and passes the element. A Storybook control cannot
 * hand over an element, only a string, so every `Platform*` bridge with an icon
 * slot takes the export name and comes through here.
 *
 * **Why this is not a `TIconName` in disguise.** The library deliberately ships
 * no name-to-component registry: one would reference all 1170 glyphs and defeat
 * the per-section entry points. Storybook is the single place that legitimately
 * needs the whole set, and it is not shipped.
 *
 * The `size` is the bridge's to choose, not the story's: it is the size the
 * component used to apply internally, from its own token, and losing it is the
 * one thing that got worse when the slots became nodes.
 */
type TGlyphs = Record<string, ComponentType<IIconBaseProps>>;

export const iconNode = (
  name: TIconExportName | undefined,
  platform: TPlatform,
  size: TIconSize,
): ReactNode => {
  if (name === undefined) return undefined;
  // Indexed through `Record<string, …>` rather than the literal union: 1170
  // keys times two platforms overflows the checker outright (TS2590).
  const glyphs = (platform === 'native' ? NATIVE_ICONS : WEB_ICONS) as TGlyphs;
  const Glyph = glyphs[String(name)];
  return Glyph === undefined ? undefined : createElement(Glyph, { size });
};
