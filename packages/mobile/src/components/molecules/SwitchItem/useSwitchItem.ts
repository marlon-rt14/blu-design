import { switchItemTokens } from '@dsm/shared';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { resolveMulishFontFamily, useThemeMode } from '../../../theme';
import type { ISwitchItemProps } from './SwitchItem.types';

/** Params of {@link useSwitchItem}: the props plus the live press state. */
interface IUseSwitchItemParams extends ISwitchItemProps {
  isPressed: boolean;
}

/** Styles and derived values the SwitchItem needs to render. */
interface IUseSwitchItemResult {
  rowStyle: StyleProp<ViewStyle>;
  overlayStyle: StyleProp<ViewStyle> | undefined;
  textColumnStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  descriptionStyle: StyleProp<TextStyle>;
  dividerStyle: StyleProp<ViewStyle>;
  isDisabled: boolean;
}

/**
 * Resolves SwitchItem row styles. No hover on mobile. Pressed overlay on
 * the row; the embedded Switch is visual-only (`isContained`).
 */
export const useSwitchItem = ({
  size = 'md',
  isDisabled = false,
  isPressed,
}: IUseSwitchItemParams): IUseSwitchItemResult => {
  const mode = useThemeMode();
  const tokens = switchItemTokens[mode];
  const sizeTokens = tokens.sizes[size];

  const overlayColor = isDisabled ? undefined : isPressed ? tokens.colors.surface.overlayPressed : undefined;

  const rowStyle: StyleProp<ViewStyle> = {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.dimension.contentGap,
    width: '100%',
    minHeight: sizeTokens.minHeight,
    paddingHorizontal: tokens.dimension.paddingHorizontal,
    backgroundColor: tokens.colors.surface.background,
  };

  const overlayStyle: StyleProp<ViewStyle> | undefined = overlayColor
    ? {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: overlayColor,
      }
    : undefined;

  const textColumnStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'center',
    gap: tokens.dimension.stackGap,
    minWidth: 0,
  };

  const labelStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.label.fontWeight),
    fontSize: tokens.typography.label.fontSize,
    lineHeight: tokens.typography.label.lineHeight,
    color: isDisabled ? tokens.colors.label.disabled : tokens.colors.label.default,
  };

  const descriptionStyle: StyleProp<TextStyle> = {
    fontFamily: resolveMulishFontFamily(tokens.typography.description.fontWeight),
    fontSize: tokens.typography.description.fontSize,
    lineHeight: tokens.typography.description.lineHeight,
    color: isDisabled ? tokens.colors.description.disabled : tokens.colors.description.default,
  };

  const dividerStyle: StyleProp<ViewStyle> = {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: tokens.dimension.paddingHorizontal,
    height: tokens.dimension.dividerHeight,
    backgroundColor: tokens.colors.divider.background,
  };

  return {
    rowStyle,
    overlayStyle,
    textColumnStyle,
    labelStyle,
    descriptionStyle,
    dividerStyle,
    isDisabled,
  };
};
