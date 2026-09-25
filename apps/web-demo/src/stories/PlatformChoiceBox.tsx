import { ChoiceBox as NativeChoiceBox } from '@dsm/mobile';
import type { IChoiceBoxBaseProps } from '@dsm/shared';
import { ChoiceBox as WebChoiceBox } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

export interface IPlatformChoiceBoxProps extends Omit<IChoiceBoxBaseProps, 'icon'> {
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  icon?: TIconExportName;
  onValueChange?: (isChecked: boolean) => void;
  platform?: TPlatform;
}

export const PlatformChoiceBox = ({
  icon,
  onValueChange,
  platform = 'web',
  ...props
}: IPlatformChoiceBoxProps): ReactElement => {
  // `lg` is what the component hardcoded on its media glyph.
  const glyph = iconNode(icon, platform, 'lg');
  return platform === 'native' ? (
    <NativeChoiceBox {...props} icon={glyph} onValueChange={onValueChange} />
  ) : (
    <WebChoiceBox {...props} icon={glyph} onChange={onValueChange} />
  );
};