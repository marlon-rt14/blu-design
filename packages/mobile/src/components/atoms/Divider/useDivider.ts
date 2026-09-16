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
      // `alignSelf: stretch` and nothing else. It fills the cross axis, which
      // is what bDS asks for on this platform and what makes a vertical divider
      // visible inside a row.
      //
      // **No `minHeight: '100%'` here, unlike the web hook, and the difference
      // is Yoga.** In CSS a percentage minimum against a parent of indefinite
      // size resolves to `auto` — it imposes nothing — which is exactly what the
      // web side leans on to fill the *main* axis without breaking the cross
      // one. Yoga does not do that: the percentage resolves against the parent
      // and the row grows to every pixel available. On a device the two vertical
      // dividers in a row swallowed the whole screen and pushed their sibling
      // labels out of view.
      //
      // Found on the simulator, not here: Storybook's `platform: native` toggle
      // renders through react-native-web, where this measured a correct 17.5px.
      // Anything that depends on Yoga's own layout rules has to be checked on a
      // device.
      //
      // The limitation this accepts, declared: a **horizontal** divider inside a
      // `flexDirection: 'row'` parent has a main size of `auto`, i.e. zero, so it
      // will not show. That is a layout nobody reaches for — a rule across a row
      // of siblings is a vertical divider — and the web hook only solves it
      // because `minWidth: '100%'` is safe there. Here it is not worth an
      // asymmetry that cannot be checked without a device.
      alignSelf: 'stretch',
      ...(isVertical ? { width: thickness } : { height: thickness }),
    },
  };
};
