import { ChoiceBox as NativeChoiceBox } from '@dsm/mobile';
import type { IChoiceBoxBaseProps } from '@dsm/shared';
import { ChoiceBox as WebChoiceBox } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformChoiceBoxProps extends IChoiceBoxBaseProps {
  onValueChange?: (isChecked: boolean) => void;
  platform?: TPlatform;
}

export const PlatformChoiceBox = ({
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformChoiceBoxProps): ReactElement =>
  platform === 'native' ? (
    <NativeChoiceBox {...props} onValueChange={onValueChange} />
  ) : (
    <WebChoiceBox {...props} onChange={onValueChange} />
  );