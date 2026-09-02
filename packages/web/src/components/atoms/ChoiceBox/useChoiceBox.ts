import { choiceBoxTokens } from '@dsm/shared';
import type { CSSProperties } from 'react';

import { useFontFamily, usePrefersReducedMotion, useThemeMode } from '../../../theme';
import type { IChoiceBoxProps } from './ChoiceBox.types';

interface IUseChoiceBoxParams extends IChoiceBoxProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
}

interface IUseChoiceBoxResult {
  rowStyle: CSSProperties;
  surfaceStyle: CSSProperties;
  overlayStyle: CSSProperties | undefined;
  headerRowStyle: CSSProperties;
  contentStyle: CSSProperties;
  titleStyle: CSSProperties;
  descriptionStyle: CSSProperties;
  isSelected: boolean;
  isDisabled: boolean;
}

export const useChoiceBox = ({
  isSelected = false,
  isDisabled = false,
  variant = 'row',
  isHovered,
  isPressed,
  isFocusVisible,
}: IUseChoiceBoxParams): IUseChoiceBoxResult => {
  const mode = useThemeMode();
  const tokens = choiceBoxTokens[mode];
  const prefersReducedMotion = usePrefersReducedMotion();
  const fontFamily = useFontFamily(tokens.typography.title.fontWeight);
  const descriptionFontFamily = useFontFamily(tokens.typography.description.fontWeight);

  const backgroundColor = isDisabled
    ? tokens.colors.surface.backgroundDisabled
    : isSelected
      ? tokens.colors.surface.backgroundSelected
      : tokens.colors.surface.background;

  const borderColor = isDisabled
    ? tokens.colors.surface.borderDisabled
    : isSelected
      ? tokens.colors.surface.borderSelected
      : isPressed
        ? tokens.colors.surface.borderSelected
        : tokens.colors.surface.borderDefault;

  const overlayColor = isDisabled
    ? undefined
    : isPressed
      ? tokens.colors.surface.overlayPressed
      : isHovered
        ? tokens.colors.surface.overlayHover
        : undefined;

  const overlayStyle: CSSProperties | undefined = overlayColor
    ? {
        position: 'absolute',
        inset: 0,
        borderRadius: tokens.dimension.borderRadius,
        backgroundColor: overlayColor,
        pointerEvents: 'none',
      }
    : undefined;

  // Border width never changes — the extra "selected" thickness lands as an
  // inset shadow instead, so choosing an option never nudges the layout
  const shadows: string[] = [];
  if (isSelected) {
    shadows.push(`inset 0 0 0 ${tokens.dimension.selectionRingWidth}px ${borderColor}`);
  }
  if (isFocusVisible && !isDisabled) {
    shadows.push(
      `0 0 0 ${tokens.dimension.focusRingOffset}px ${tokens.colors.focusRingGap}, 0 0 0 ${tokens.dimension.focusRingSpread}px ${tokens.colors.surface.borderFocus}`,
    );
  }
  const boxShadow = shadows.length > 0 ? shadows.join(', ') : undefined;

  const isCompact = variant === 'compact';
  const isTile = variant === 'tile';

  const rowStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    // compact hugs its content (Figma's `Hug`); row/tile fill their row or grid column.
    width: isCompact ? undefined : '100%',
    minHeight: variant === 'row' ? tokens.dimension.minHeight : undefined,
    boxSizing: 'border-box',
    cursor: isDisabled ? 'default' : 'pointer',
  };

  const surfaceStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: variant === 'row' ? 'row' : 'column',
    alignItems: 'flex-start',
    flex: isCompact ? undefined : 1,
    gap: isTile ? tokens.dimension.blockGap : tokens.dimension.gapInline,
    width: '100%',
    boxSizing: 'border-box',
    paddingBlock: isCompact ? tokens.dimension.paddingCompact : tokens.dimension.paddingVertical,
    paddingInline: isCompact ? tokens.dimension.paddingCompact : tokens.dimension.paddingHorizontal,
    borderRadius: tokens.dimension.borderRadius,
    borderWidth: tokens.dimension.borderWidth,
    borderStyle: 'solid',
    borderColor,
    backgroundColor,
    boxShadow,
    overflow: 'hidden',
    transition: prefersReducedMotion
      ? 'none'
      : 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
  };

  // Only meaningful for `tile`: the media + control line sitting above the text block.
  const headerRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: tokens.dimension.gapInline,
  };

  const contentStyle: CSSProperties = {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.dimension.gap,
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    fontFamily,
    fontWeight: tokens.typography.title.fontWeight,
    fontSize: tokens.typography.title.fontSize,
    lineHeight: `${tokens.typography.title.lineHeight}px`,
    color: isDisabled ? tokens.colors.title.disabled : tokens.colors.title.default,
  };

  const descriptionStyle: CSSProperties = {
    fontFamily: descriptionFontFamily,
    fontWeight: tokens.typography.description.fontWeight,
    fontSize: tokens.typography.description.fontSize,
    lineHeight: `${tokens.typography.description.lineHeight}px`,
    color: isDisabled ? tokens.colors.description.disabled : tokens.colors.description.default,
  };

  return {
    rowStyle,
    surfaceStyle,
    overlayStyle,
    headerRowStyle,
    contentStyle,
    titleStyle,
    descriptionStyle,
    isSelected,
    isDisabled,
  };
};

