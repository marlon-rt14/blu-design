import { Checkbox as NativeCheckbox } from '@dsm/mobile';
import type { ICheckboxBaseProps } from '@dsm/shared';
import { Checkbox as WebCheckbox } from '@dsm/web';
import type { ReactElement } from 'react';

export type TPlatform = 'web' | 'native';

export interface IPlatformCheckboxProps extends ICheckboxBaseProps {
  onValueChange?: (isChecked: boolean) => void;
  /** Stories pass the `platform` toolbar global here. */
  platform?: TPlatform;
}

export const PlatformCheckbox = ({
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformCheckboxProps): ReactElement =>
  platform === 'native' ? (
    <NativeCheckbox {...props} onValueChange={onValueChange} />
  ) : (
    <WebCheckbox {...props} onChange={onValueChange} />
  );
