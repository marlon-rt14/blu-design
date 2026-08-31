import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Platform, View } from 'react-native';

import type { IIconProps } from './Icon.types';
import { useIcon } from './useIcon';

/**
 * Temporary Icon atom. Ships a single `name="icon"` glyph — Figma's
 * `icon/placeholder` even-odd path — until the real Icon set lands.
 *
 * On web (Storybook / react-native-web) this paints the real SVG path.
 * Native has no SVG primitive in this package (`react-native-svg` is
 * not a dependency), so it falls back to a square frame matching the
 * placeholder's inset border.
 *
 * @example
 * ```tsx
 * <Icon />
 * <Icon name="icon" size="sm" />
 * ```
 */
export const Icon = ({ name = 'icon', size = 'md', color, testID }: IIconProps): ReactElement => {
  const { sizePx, fill, path, wrapperStyle } = useIcon({ name, size, color });

  if (Platform.OS === 'web') {
    return (
      <View accessible={false} style={wrapperStyle} testID={testID}>
        {createElement(
          'svg',
          {
            width: sizePx,
            height: sizePx,
            viewBox: '0 0 24 24',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
            'aria-hidden': true,
          },
          createElement('path', { d: path, fill, fillRule: 'evenodd' }),
        )}
      </View>
    );
  }

  // View-equivalent of the even-odd frame (2.4/24 ≈ 10% inset). The
  // diagonal bar is omitted — there is no path primitive without
  // react-native-svg. Storybook hits the SVG branch above.
  const inset = sizePx * 0.1;
  return (
    <View
      accessible={false}
      style={[wrapperStyle, { borderWidth: inset, borderColor: fill }]}
      testID={testID}
    />
  );
};
