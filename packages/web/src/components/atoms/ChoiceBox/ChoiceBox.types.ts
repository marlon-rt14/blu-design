import type { IChoiceBoxBaseProps } from '@dsm/shared';
import type { FocusEventHandler } from 'react';

/**
 * The whole surface is the real control (no nested `<input>`) — focus and
 * blur target the surface itself, not the mirrored Checkbox inside it.
 */
export interface IChoiceBoxProps extends IChoiceBoxBaseProps {
  onChange?: (isSelected: boolean) => void;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  id?: string;
}
