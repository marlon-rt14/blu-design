import type { ReactElement } from 'react';

import { Tag } from '../../atoms/Tag';
import type { ITagGroupProps } from './TagGroup.types';
import { useTagGroup } from './useTagGroup';

/**
 * Web TagGroup — a row of Tags with overflow, what AvatarGroup is to Avatar.
 *
 * **No slot.** The group has to guarantee that every item is a Tag at its own
 * `size` — a free slot could not promise that, and inside a field it would
 * break the height `size/field/height/*` promises.
 *
 * **Does not decide how many fit** — that is the width of whatever contains
 * it. Pass every tag and cap the visible ones with `max`: the rest collapse
 * into a trailing "+N" tile that carries no remove control, since a counter is
 * not a selection. The N is counted, never written.
 */
export const TagGroup = (props: ITagGroupProps): ReactElement => {
  const { tags, size = 'sm', max, testID } = props;
  const { rowStyle, overflowStyle, overflowTextStyle } = useTagGroup(props);
  const visible = max === undefined ? tags : tags.slice(0, max);
  const hidden = tags.length - visible.length;

  return (
    <div data-testid={testID} style={rowStyle}>
      {visible.map((tag, index) => (
        <Tag key={index} {...tag} size={size} />
      ))}
      {hidden > 0 ? (
        // The accessible name spells the count out: a bare "+3" tells a
        // screen reader nothing, and the number is counted, never passed in.
        <span aria-label={`${hidden} etiquetas más`} role="img" style={overflowStyle}>
          <span aria-hidden="true" style={overflowTextStyle}>
            {`+${hidden}`}
          </span>
        </span>
      ) : null}
    </div>
  );
};
