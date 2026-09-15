import type { ReactElement } from 'react';

import type { IDividerProps } from './Divider.types';
import { useDivider } from './useDivider';

/**
 * Web Divider — a decorative rule between blocks of content.
 *
 * It draws one line and nothing else: no text, no children, no states. Its
 * length comes from whatever contains it, so a horizontal divider fills the
 * width it is given and a vertical one stretches to the height of its flex row.
 *
 * **It renders an `<hr>` that is hidden from assistive technology.** The element
 * is the semantically right one and its UA styles are reset in `useDivider`;
 * `aria-hidden` is there because a decorative line that announces itself is
 * noise — bDS puts it plainly: *"un divisor decorativo que se anuncia es ruido
 * en el lector de pantalla"*. If the line is the only thing marking a change of
 * group, the fix is a heading, not a louder divider: *"agrupar no es nombrar"*.
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
 * // In a flex row, the vertical one needs no height of its own:
 * <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 *   <span>Debito</span>
 *   <Divider orientation="vertical" />
 *   <span>Credito</span>
 * </div>
 * ```
 */
export const Divider = (props: IDividerProps): ReactElement => {
  const { testID } = props;
  const { lineStyle } = useDivider(props);

  return <hr aria-hidden="true" data-testid={testID} style={lineStyle} />;
};
