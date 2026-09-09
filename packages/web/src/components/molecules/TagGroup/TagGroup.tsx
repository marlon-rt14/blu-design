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
 * it. Pass however many already fit in `tags`, and set `showOverflow` for the
 * rest: the trailing "+N" tile carries no remove control, since a counter is
 * not a selection.
 */
export const TagGroup = (props: ITagGroupProps): ReactElement => {
  const { tags, size = 'sm', showOverflow = false, overflowLabel = '+3', overflowAccessibilityLabel, testID } = props;
  const { rowStyle, overflowStyle, overflowTextStyle } = useTagGroup(props);

  return (
    <div data-testid={testID} style={rowStyle}>
      {tags.map((tag, index) => (
        <Tag key={index} {...tag} size={size} />
      ))}
      {showOverflow ? (
        <span aria-label={overflowAccessibilityLabel ?? overflowLabel} role="img" style={overflowStyle}>
          <span aria-hidden="true" style={overflowTextStyle}>
            {overflowLabel}
          </span>
        </span>
      ) : null}
    </div>
  );
};
