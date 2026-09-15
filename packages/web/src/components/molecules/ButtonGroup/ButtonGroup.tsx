import type { ReactElement } from 'react';

import type { IButtonGroupProps } from './ButtonGroup.types';
import { useButtonGroup } from './useButtonGroup';

/**
 * Web ButtonGroup — lays out related Buttons; does not configure them.
 *
 * Figma slot `actions` → `children`. Owns `orientation`, `distribution` and the
 * gap (`space/inline/md` row, `space/stack/md` column). Hierarchy stays on each
 * Button. No a11y role — not a toolbar or radiogroup (ButtonGroup · Dev).
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
  const { children, testID } = props;
  const { rootStyle } = useButtonGroup(props);

  return (
    <div data-testid={testID} style={rootStyle}>
      {children}
    </div>
  );
};
