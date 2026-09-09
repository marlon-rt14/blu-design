import type { IChoiceBoxBaseProps } from '@dsm/shared';

export interface IChoiceBoxProps extends IChoiceBoxBaseProps {
  onValueChange?: (isChecked: boolean) => void;
}
