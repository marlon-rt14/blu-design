import { TagGroup as NativeTagGroup } from '@dsm/mobile';
import type { ITagGroupBaseProps, ITagGroupItem } from '@dsm/shared';
import { TagGroup as WebTagGroup } from '@dsm/web';
import type { ReactElement } from 'react';

import type { TIconExportName } from './iconNames';
import { iconNode } from './iconNode';

export type TPlatform = 'web' | 'native';

/** One tag as a story writes it: the glyph by export name, not as a node. */
export interface IPlatformTagGroupItem extends Omit<ITagGroupItem, 'icon'> {
  icon?: TIconExportName;
}

export interface IPlatformTagGroupProps extends Omit<ITagGroupBaseProps, 'tags'> {
  tags: IPlatformTagGroupItem[];
  platform?: TPlatform;
}

export const PlatformTagGroup = ({
  tags,
  platform = 'web',
  ...props
}: IPlatformTagGroupProps): ReactElement => {
  const size = props.size ?? 'sm';
  const resolved = tags.map((item) => ({ ...item, icon: iconNode(item.icon, platform, size) }));
  return platform === 'native' ? (
    <NativeTagGroup {...props} tags={resolved} />
  ) : (
    <WebTagGroup {...props} tags={resolved} />
  );
};
