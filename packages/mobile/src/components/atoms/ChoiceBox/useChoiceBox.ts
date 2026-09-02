import { choiceBoxTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { IChoiceBoxProps } from './ChoiceBox.types';

interface IUseChoiceBoxParams extends IChoiceBoxProps {
  isPressed: boolean;
}

interface IUseChoiceBoxResult {
  rowStyle: StyleProp<ViewStyle>;
  surfaceStyle: StyleProp<ViewStyle>;
  selectionRingStyle: StyleProp<ViewStyle> | undefined;
  headerRowStyle: StyleProp<ViewStyle>;
  contentStyle: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  descriptionStyle: StyleProp<TextStyle>;
  isSelected: boolean;
  isDisabled: boolean;
}

export const useChoiceBox = ({
  isSelected = false,
  isDisabled = false,
  variant = 'row',
  isPressed,
}: IUseChoiceBoxParams): IUseChoiceBoxResult => {
  const mode = useThemeMode();
  const tokens = choiceBoxTokens[mode];

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

  // Border width never changes — the extra "selected" thickness comes from an
  // absolutely-positioned inset ring instead, so choosing an option never
  // nudges the layout (Figma's `strokesIncludedInLayout=false`).
  const selectionRingStyle: StyleProp<ViewStyle> | undefined = isSelected
    ? {
        position: 'absolute',
        inset: tokens.dimension.borderWidth,
        borderRadius: tokens.dimension.borderRadius - tokens.dimension.borderWidth,
        borderWidth: tokens.dimension.selectionRingWidth,
        borderColor,
      }
    : undefined;

  const isCompact = variant === 'compact';
  const isTile = variant === 'tile';

  const rowStyle: StyleProp<ViewStyle> = {
    // compact hugs its content (Figma's `Hug`); row/tile fill their row or grid column.
    width: isCompact ? undefined : '100%',
    alignSelf: isCompact ? 'flex-start' : undefined,
    minHeight: variant === 'row' ? tokens.dimension.minHeight : undefined,
    flexShrink: 0,
  };

  const surfaceStyle: StyleProp<ViewStyle> = {
    position: 'relative',
    flex: isCompact ? undefined : 1,
    flexDirection: variant === 'row' ? 'row' : 'column',
    alignItems: 'flex-start',
    gap: isTile ? tokens.dimension.blockGap : tokens.dimension.gapInline,
    paddingHorizontal: isCompact ? tokens.dimension.paddingCompact : tokens.dimension.paddingHorizontal,
    paddingVertical: isCompact ? tokens.dimension.paddingCompact : tokens.dimension.paddingVertical,
    borderRadius: tokens.dimension.borderRadius,
    borderWidth: tokens.dimension.borderWidth,
    borderColor,
    backgroundColor,
    overflow: 'hidden',
  };

  // Only meaningful for `tile`: the media + control line sitting above the text block.
  const headerRowStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: tokens.dimension.gapInline,
  };

  const contentStyle: StyleProp<ViewStyle> = {
    flex: 1,
    alignItems: 'flex-start',
    gap: tokens.dimension.gap,
    minWidth: 0,
  };

  const titleStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.title.fontWeight),
    fontSize: tokens.typography.title.fontSize,
    lineHeight: tokens.typography.title.lineHeight,
    color: isDisabled ? tokens.colors.title.disabled : tokens.colors.title.default,
  };

  const descriptionStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.description.fontWeight),
    fontSize: tokens.typography.description.fontSize,
    lineHeight: tokens.typography.description.lineHeight,
    color: isDisabled ? tokens.colors.description.disabled : tokens.colors.description.default,
  };

  return {
    rowStyle,
    surfaceStyle,
    selectionRingStyle,
    headerRowStyle,
    contentStyle,
    titleStyle,
    descriptionStyle,
    isSelected,
    isDisabled,
  };
};

