import { Select as NativeSelect } from '@dsm/mobile';
import type { ISelectBaseProps, ISelectOption } from '@dsm/shared';
import { Select as WebSelect } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

/** One row as a story writes it: the glyph by export name, not as a node. */
export interface IPlatformSelectOption extends Omit<ISelectOption, 'icon'> {
  icon?: TIconExportName;
}

export interface IPlatformSelectProps extends Omit<ISelectBaseProps, 'leadingIcon' | 'options'> {
  options: IPlatformSelectOption[];
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  leadingIcon?: TIconExportName;
  onChange: (value: string) => void;
  platform?: TPlatform;
}

export const PlatformSelect = ({
  leadingIcon,
  options,
  platform = 'web',
  ...props
}: IPlatformSelectProps): ReactElement => {
  // The field's own steps: sm/md bind `size/icon/sm`, lg binds `size/icon/md`.
  const size = props.size === 'lg' ? 'md' : 'sm';
  const resolved = options.map((option) => ({ ...option, icon: iconNode(option.icon, platform, size) }));
  const glyph = iconNode(leadingIcon, platform, size);
  return platform === 'native' ? (
    <NativeSelect {...props} leadingIcon={glyph} options={resolved} />
  ) : (
    <WebSelect {...props} leadingIcon={glyph} options={resolved} />
  );
};
