import { dividerTokens } from '@dsm/shared';
import type { StyleProp, ViewStyle } from 'react-native';

import { useThemeMode } from '../../../theme';
import type { IDividerProps } from './Divider.types';

/** Styles the Divider needs to render. */
interface IUseDividerResult {
  lineStyle: StyleProp<ViewStyle>;
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
      // bDS describes the line as a `View` with a border. It is painted with a
      // background and an explicit thickness instead, which lands on the same
      // single pixel while keeping one code path: a border would have to pick a
      // side per orientation (`borderTopWidth` against `borderLeftWidth`) and
      // the colour prop would double with it. Same token, same measurement.
      backgroundColor: line[appearance],
      // Two mechanisms, because which axis needs resolving depends on the
      // parent's `flexDirection` and the component cannot know it.
      // `alignSelf: stretch` fills the cross axis — bDS's own instruction for
      // this platform, and what makes a vertical divider visible inside a row.
      // `minWidth`/`minHeight` at 100% fills the main axis, which is `auto` on a
      // `View` with no children, i.e. zero. Measured on web, where the first
      // version of this hook rendered nothing at all for `horizontal`; the same
      // flexbox rule applies here.
      alignSelf: 'stretch',
      ...(isVertical
        ? { width: thickness, minHeight: '100%' }
        : { height: thickness, minWidth: '100%' }),
    },
  };
};
