import type { TIconSize, TTagSize } from '@dsm/shared';
import type { ReactElement } from 'react';

import { FieldIcon } from '../TextField/FieldIcon';
import { IconX } from '../../../icons';
import type { ITagProps } from './Tag.types';
import { useTag } from './useTag';

/** Tag's own `sm`/`xs` steps share their names with Icon's — no mapping needed. */
const toIconSize = (size: TTagSize): TIconSize => size;

/**
 * Web Tag — a label that is read: what type something is, or what state it
 * is in. **It is not touched to change it** — that is what Chip is for, and
 * why this component carries no interaction state at all.
 *
 * The Combobox's input chip is still a Tag underneath —
 * `showRemove`, `appearance="outline"`, `palette="neutral"` — removable but
 * never selectable.
 */
export const Tag = (props: ITagProps): ReactElement => {
  const { label, size = 'sm', showLeadingIcon = false, icon, showRemove = false, onRemove, testID } = props;
  const { rootStyle, iconWrapperStyle, labelStyle, removeButtonStyle, removeIconWrapperStyle } = useTag(props);

  return (
    <span data-testid={testID} style={rootStyle}>
      {showLeadingIcon && icon ? (
        <span style={iconWrapperStyle}>
          <FieldIcon name={icon} size={toIconSize(size)} />
        </span>
      ) : null}
      <span style={labelStyle}>{label}</span>
      {showRemove ? (
        <button
          aria-label={`Quitar ${label}`}
          onClick={onRemove}
          style={removeButtonStyle}
          type="button"
        >
          <span style={removeIconWrapperStyle}>
            <IconX size="xs" />
          </span>
        </button>
      ) : null}
    </span>
  );
};
