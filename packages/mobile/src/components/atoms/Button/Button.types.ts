import type { IButtonBaseProps } from '@dsm/shared';

export interface IButtonProps extends IButtonBaseProps {
  onPress?: () => void;
}
