import { listGroupTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IListGroupProps } from './ListGroup.types';

/** Everything the web ListGroup needs to render. */
interface IUseListGroupResult {
  /** The card: surface, radius and the clip that keeps the rows inside it. */
  listStyle: CSSProperties;
  headerStyle: CSSProperties;
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
      boxSizing: 'border-box',
      listStyle: 'none',
      margin: 0,
      // The rows reach the edges and the radius has to cut them, which is the
      // third of the three things bDS says this component does: *"pone la
      // superficie, el radio y el recorte"*.
      overflow: 'hidden',
      // **No lateral padding, deliberately**: *"ese es margen de la pantalla"*.
      padding: 0,
      width: '100%',
    },
    headerStyle: {
      color: colors.header,
      fontFamily: headerFont,
      fontSize: typography.header.fontSize,
      fontWeight: typography.header.fontWeight,
      letterSpacing: typography.header.letterSpacing,
      lineHeight: typography.header.lineHeightRatio,
      margin: 0,
      // Aligned with the rows' text rather than with the card's edge, which is
      // why it reads the row's own inset.
      paddingBlockEnd: dimension.headerInset,
      paddingInline: dimension.headerInset,
    },
  };
};
