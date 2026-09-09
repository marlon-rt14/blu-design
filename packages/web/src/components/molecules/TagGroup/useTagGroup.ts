import { tagTokens, TAG_LINE_HEIGHT_RATIO } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { ITagGroupProps } from './TagGroup.types';

interface IUseTagGroupResult {
  rowStyle: CSSProperties;
  overflowStyle: CSSProperties;
  overflowTextStyle: CSSProperties;
}

export const useTagGroup = ({ size = 'sm' }: ITagGroupProps): IUseTagGroupResult => {
  const mode = useThemeMode();
  const tokens = tagTokens[mode];
  const sizeTokens = tokens.dimension.sizes[size];
  // Neutral/outline reads as a counter rather than another labelled tone.
  const colors = tokens.colors.palettes.neutral.outline;
  const font = useFontFamily(tokens.dimension.fontWeight);

  const rowStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.dimension.gap * 2,
  };

  const overflowStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeTokens.height,
    paddingInline: sizeTokens.paddingHorizontal,
    borderRadius: tokens.dimension.borderRadius,
    borderWidth: tokens.dimension.borderWidth,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
  };

  const overflowTextStyle: CSSProperties = {
    color: colors.text,
    fontFamily: font,
    fontWeight: tokens.dimension.fontWeight,
    fontSize: sizeTokens.fontSize,
    lineHeight: sizeTokens.fontSize * TAG_LINE_HEIGHT_RATIO,
    whiteSpace: 'nowrap',
  };

  return { rowStyle, overflowStyle, overflowTextStyle };
};
