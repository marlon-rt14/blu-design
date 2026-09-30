import { Tag as NativeTag } from '@dsm/mobile';
import type { ITagBaseProps } from '@dsm/shared';
import { Tag as WebTag } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

export interface IPlatformTagProps extends Omit<ITagBaseProps, 'leadingIcon'> {
  /**
   * The glyph, **by export name** rather than as a node.
   *
   * The real prop is a `ReactNode` the caller imports from its section; a
   * control can only pass a string, so the bridge builds it — see `iconNode`.
   */
  leadingIcon?: TIconExportName;
  platform?: TPlatform;
}

export const PlatformTag = ({
  leadingIcon,
  platform = 'web',
  ...props
}: IPlatformTagProps): ReactElement => {
  // Tag's `xs`/`sm` steps share their names with Icon's — 12 and 16.
  const glyph = iconNode(leadingIcon, platform, props.size ?? 'sm');
  return platform === 'native' ? (
    <NativeTag {...props} leadingIcon={glyph} />
  ) : (
    <WebTag {...props} leadingIcon={glyph} />
  );
};
