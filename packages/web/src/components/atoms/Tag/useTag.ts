import { tagTokens, TAG_LINE_HEIGHT_RATIO } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { ITagProps } from './Tag.types';

interface IUseTagResult {
  rootStyle: CSSProperties;
  iconWrapperStyle: CSSProperties;
  labelStyle: CSSProperties;
  removeButtonStyle: CSSProperties;
  removeIconWrapperStyle: CSSProperties;
}

/**
 * Resolves every style the Tag needs. There is no interaction state to
 * derive — bDS removed Tag's `state` axis entirely: a Tag is read, not
 * touched (`showRemove`'s button is its own separate target, not the tag).
 */
export const useTag = ({
  appearance = 'soft',
  palette = 'neutral',
  size = 'sm',
}: ITagProps): IUseTagResult => {
  const mode = useThemeMode();
  const tokens = tagTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const colors = tokens.colors.palettes[palette][appearance];
  const sizeTokens = tokens.dimension.sizes[size];
  const labelFont = useFontFamily(tokens.dimension.fontWeight);

  return {
    rootStyle: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      gap: tokens.dimension.gap,
      height: sizeTokens.height,
      paddingInline: sizeTokens.paddingHorizontal,
      borderRadius: tokens.dimension.borderRadius,
      borderWidth: colors.border ? tokens.dimension.borderWidth : 0,
      borderStyle: 'solid',
      borderColor: colors.border ?? 'transparent',
      backgroundColor: colors.background,
      transition: prefersReducedMotion ? 'none' : 'background-color 120ms ease, border-color 120ms ease',
    },
    iconWrapperStyle: {
      display: 'inline-flex',
      flexShrink: 0,
      color: colors.icon,
    },
    labelStyle: {
      color: colors.text,
      fontFamily: labelFont,
      fontWeight: tokens.dimension.fontWeight,
      fontSize: sizeTokens.fontSize,
      lineHeight: `${sizeTokens.fontSize * TAG_LINE_HEIGHT_RATIO}px`,
      whiteSpace: 'nowrap',
    },
    removeButtonStyle: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: tokens.dimension.removeTargetSize,
      height: tokens.dimension.removeTargetSize,
      margin: 0,
      padding: 0,
      border: 'none',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      color: colors.icon,
      cursor: 'pointer',
    },
    removeIconWrapperStyle: {
      display: 'inline-flex',
    },
  };
};
