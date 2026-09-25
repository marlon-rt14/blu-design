import { Tag as NativeTag } from '@dsm/mobile';
import type { ITagBaseProps } from '@dsm/shared';
import { Tag as WebTag } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

export interface IPlatformTagProps extends Omit<ITagBaseProps, 'icon'> {
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  icon?: TIconExportName;
  onRemove?: () => void;
  platform?: TPlatform;
}

export const PlatformTag = ({ icon, platform = 'web', ...props }: IPlatformTagProps): ReactElement => {
  // Tag's `sm`/`xs` steps share their names with Icon's — 16 and 12.
  const glyph = iconNode(icon, platform, props.size ?? 'sm');
  return platform === 'native' ? <NativeTag {...props} icon={glyph} /> : <WebTag {...props} icon={glyph} />;
};
