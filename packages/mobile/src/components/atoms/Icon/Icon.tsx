import type { ReactElement } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';

import type { IIconProps } from './Icon.types';
import { useIcon } from './useIcon';

/**
 * React Native Icon — the wrapper every icon in the system passes through.
 *
 * **It is not the drawing.** It fixes the box from `size/icon/*`, resolves the
 * colour from the active theme, and renders the `Svg` that holds whatever paths
 * it is given:
 *
 * ```tsx
 * export const IconTrash = (props: TIconProps) => (
 *   <Icon {...props}>
 *     <Path d="M3 6H5H21" />
 *   </Icon>
 * );
 * ```
 *
 * That is exactly how the 31 published glyphs in `@dsm/mobile/icons` are built,
 * so most screens never touch this component directly — they use `IconTrash` and
 * friends. Reach for it to add artwork the library does not ship.
 *
 * The `viewBox` is fixed at `0 0 24 24`, the grid bDS authors on, and the size is
 * only ever chosen through `size`. Passing that number to the `Svg` rather than
 * only to a wrapper is not a preference: a `View` of 24x24 does **not** scale an
 * SVG child the way a DOM element does.
 *
 * The outer `View` carries the accessibility decision and the no-flex guarantee,
 * keeping both consistent with the rest of `@dsm/mobile` instead of relying on
 * how faithfully `Svg` forwards native view props.
 *
 * Colour resolves `tintColor` → `color` → `color/icon/primary`. Unlike web there
 * is no inheriting from the container, because React Native has no
 * `currentColor` — a parent that wants to tint passes `tintColor`.
 *
 * Decorative by default: without `accessibilityLabel` the icon is hidden from
 * the accessibility tree, since an icon beside a label that already says what it
 * means is noise when announced twice.
 */
export const Icon = (props: IIconProps): ReactElement => {
  const { children, accessibilityLabel, testID } = props;
  const { boxStyle, edge, color, viewBox } = useIcon(props);
  const isDecorative = accessibilityLabel === undefined;

  return (
    <View
      accessibilityElementsHidden={isDecorative}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={isDecorative ? 'none' : 'image'}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'yes'}
      style={boxStyle}
      testID={testID}
    >
      {/* `fill` here is what colours the children: Svg wraps them in a G that
          carries it, and any child without its own fill inherits from that G. */}
      <Svg fill={color} height={edge} viewBox={viewBox} width={edge}>
        {children}
      </Svg>
    </View>
  );
};
