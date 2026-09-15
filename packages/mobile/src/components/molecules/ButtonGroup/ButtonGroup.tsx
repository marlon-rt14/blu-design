import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { IButtonGroupProps } from './ButtonGroup.types';
import { useButtonGroup } from './useButtonGroup';

interface IStyleableChildProps {
  style?: StyleProp<ViewStyle>;
}

const mapFillChildren = (children: ReactNode, itemStyle: ViewStyle): ReactNode =>
  Children.map(children, (child) => {
    if (!isValidElement<IStyleableChildProps>(child)) {
      return child;
    }
    return cloneElement(child, {
      style: [itemStyle, child.props.style],
    });
  });

/**
 * Mobile ButtonGroup — lays out related Buttons; does not configure them.
 *
 * Figma slot `actions` → `children`. Owns `orientation`, `distribution` and the
 * gap (`space/inline/md` row, `space/stack/md` column). Hierarchy stays on each
 * Button. No a11y role — not a toolbar or radiogroup (ButtonGroup · Dev).
 *
 * `distribution="fill"` clones `flex: 1` onto each child. Buttons must
 * accept a layout `style` prop — `@dsm/mobile`'s Button does.
 *
 * @example
 * ```tsx
 * <ButtonGroup distribution="fill">
 *   <Button appearance="outline" label="Cancelar" />
 *   <Button label="Continuar" />
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = (props: IButtonGroupProps): ReactElement => {
  const { children, distribution = 'hug', testID } = props;
  const { rootStyle, itemStyle } = useButtonGroup(props);
  const content =
    distribution === 'fill' && itemStyle !== undefined
      ? mapFillChildren(children, itemStyle)
      : children;

  return (
    <View style={rootStyle} testID={testID}>
      {content}
    </View>
  );
};
