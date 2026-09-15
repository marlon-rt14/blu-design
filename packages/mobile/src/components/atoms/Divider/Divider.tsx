import type { ReactElement } from 'react';
import { View } from 'react-native';

import type { IDividerProps } from './Divider.types';
import { useDivider } from './useDivider';

/**
 * React Native Divider — a decorative rule between blocks of content.
 *
 * It draws one line and nothing else: no text, no children, no states. Its
 * length comes from whatever contains it, so a horizontal divider fills the
 * width of its column and a vertical one stretches to the height of its row.
 *
 * **It carries `accessibilityRole="none"`, which is the whole story here.**
 * React Native has no separator role — `AccessibilityRole` runs from `'none'` to
 * `'iconmenu'` and does not include one — so unlike the web there is no second
 * behaviour to choose between. That matches what bDS wants anyway: *"un divisor
 * decorativo que se anuncia es ruido en el lector de pantalla"*. When the line
 * is the only thing marking a change of group, the fix is a heading, because
 * *"agrupar no es nombrar"*.
 *
 * **It is not a border.** `component/divider/line/*` sits around 1.5 contrast on
 * purpose. To outline a field or any control that has to be found, the token is
 * `color/border/input/*`, which runs 3.79 to 8.81.
 *
 * Rows bring their own line: `ListItem`, `ChoiceItem` and `SwitchItem` all have
 * a `showDivider` of their own, because bDS keeps the divider inside the row so
 * the last one does not drag it along. Use this component between blocks, not
 * between list rows.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider appearance="subtle" />
 * // In a row, the vertical one needs no height of its own:
 * <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
 *   <Text>Debito</Text>
 *   <Divider orientation="vertical" />
 *   <Text>Credito</Text>
 * </View>
 * ```
 */
export const Divider = (props: IDividerProps): ReactElement => {
  const { testID } = props;
  const { lineStyle } = useDivider(props);

  return <View accessibilityRole="none" style={lineStyle} testID={testID} />;
};
