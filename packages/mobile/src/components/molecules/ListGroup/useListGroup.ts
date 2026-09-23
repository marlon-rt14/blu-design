import { listGroupTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IListGroupProps } from './ListGroup.types';

/** Everything the native ListGroup needs to render. */
interface IUseListGroupResult {
  /** The card: surface, radius and the clip that keeps the rows inside it. */
  listStyle: StyleProp<ViewStyle>;
  headerStyle: StyleProp<TextStyle>;
}

/**
 * Resolves the ListGroup's two styles.
 *
 * There is nothing else to resolve: the component has no states, no axes and no
 * size — *"es un componente con un hueco"*. The rows bring their own
 * everything.
 *
 * @param props - The ListGroup props.
 * @returns The card's style and the header's.
 */
export const useListGroup = (_props: IListGroupProps): IUseListGroupResult => {
  const mode = useThemeMode();
  const { colors, dimension, typography } = listGroupTokens[mode];
  const headerFont = useFontFamily(typography.header.fontWeight);

  return {
    listStyle: {
      backgroundColor: colors.surface,
      borderRadius: dimension.borderRadius,
      // The rows reach the edges and the radius has to cut them — the third of
      // the three things bDS says this component does: *"pone la superficie, el
      // radio y el recorte"*. On Android this is also what keeps a row's ripple
      // inside the corners.
      overflow: 'hidden',
      width: '100%',
    },
    headerStyle: {
      color: colors.header,
      fontFamily: headerFont,
      fontSize: typography.header.fontSize,
      letterSpacing: typography.header.letterSpacing,
      // Pixels, not a ratio: `lineHeight` is a multiplier in CSS and an
      // absolute length on this platform.
      lineHeight: typography.header.fontSize * typography.header.lineHeightRatio,
      paddingBottom: dimension.headerInset,
      paddingHorizontal: dimension.headerInset,
    },
  };
};
