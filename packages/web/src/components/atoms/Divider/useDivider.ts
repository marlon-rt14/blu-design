import { dividerTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useThemeMode } from '../../../theme';
import type { IDividerProps } from './Divider.types';

/** Styles the Divider needs to render. */
interface IUseDividerResult {
  lineStyle: CSSProperties;
}

/**
 * Resolves the Divider's line style from the active theme and its two axes.
 *
 * There is no interaction state to track — the Divider is decorative and has no
 * states at all — so, like the Card, this hook takes the props alone.
 *
 * @param params - The Divider props.
 * @returns The resolved line style.
 */
export const useDivider = ({
  orientation = 'horizontal',
  appearance = 'default',
}: IDividerProps): IUseDividerResult => {
  const mode = useThemeMode();
  const { line, thickness } = dividerTokens[mode];
  const isVertical = orientation === 'vertical';

  return {
    lineStyle: {
      // The UA stylesheet gives `<hr>` an inset 1px border and
      // `margin: 0.5em auto`. Both have to go: the border would draw a second
      // line around the first, and the margin would add ~8px of space per side
      // that no token asked for.
      border: 'none',
      margin: 0,
      backgroundColor: line[appearance],
      // A 1px line is the first thing a flex container shrinks away. React
      // Native already defaults this to 0; CSS defaults it to 1, so it only
      // needs saying on this side.
      flexShrink: 0,
      // The length comes from two mechanisms on purpose, because **which axis
      // needs resolving depends on the parent**, and the component cannot know
      // the parent's `flex-direction`:
      //
      // - `alignSelf: stretch` fills the *cross* axis. It is what makes a
      //   vertical divider visible inside a flex row, which is the layout it is
      //   normally used in, and it works even when that row's height is
      //   indefinite.
      // - `minWidth`/`minHeight` at 100% fills the *main* axis. Without it a
      //   horizontal divider in a flex row measures 1px tall and **zero wide**:
      //   its main size is `auto`, and `auto` on an element with no content is
      //   nothing. Measured — the first version of this hook rendered nothing at
      //   all for `orientation="horizontal"`.
      //
      // A `min-*` rather than the `height: 100%` bDS writes down, because a
      // definite cross size opts the item out of stretching and a percentage
      // against an indefinite parent resolves to `auto`, i.e. zero. `min-*`
      // leaves the cross size `auto`, so both mechanisms can coexist.
      alignSelf: 'stretch',
      ...(isVertical
        ? { width: thickness, minHeight: '100%' }
        : { height: thickness, minWidth: '100%' }),
    },
  };
};
