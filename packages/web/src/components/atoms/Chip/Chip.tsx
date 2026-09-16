import type { TChipSize, TIconSize } from '@dsm/shared';
import { useState } from 'react';
import type { ReactElement } from 'react';

import { FieldIcon } from '../TextField/FieldIcon';
import { IconX } from '../../../icons';
import type { IChipProps } from './Chip.types';
import { useChip } from './useChip';

/** Chip's own `sm`/`xs` steps share their names with Icon's — no mapping needed. */
const toIconSize = (size: TChipSize): TIconSize => size;

/**
 * Web Chip — a filter that is touched, not a label that is read (that is
 * Tag): `aria-pressed` carries the state, not a checkbox role.
 *
 * The × is an icon inside the chip, not a nested IconButton — it has no
 * focus stop or hit target of its own yet. That is a real, documented gap
 * in the live component (dev contract §07 — an anatomy change owned by
 * design, not something this build invents a fix for): removing a chip
 * with the keyboard isn't possible today.
 *
 * @example
 * ```tsx
 * <Chip label="Activos" selected={isActive} onToggle={setIsActive} />
 * ```
 */
export const Chip = (props: IChipProps): ReactElement => {
  const { label, selected, leadingIcon, size = 'sm', disabled = false, onToggle, onRemove, testID } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const { rootStyle, iconWrapperStyle, labelStyle, removeWrapperStyle } = useChip({
    ...props,
    isHovered,
    isPressed,
    isFocusVisible,
  });

  return (
    <button
      aria-pressed={selected}
      data-testid={testID}
      disabled={disabled}
      onBlur={() => setIsFocusVisible(false)}
      onClick={() => onToggle(!selected)}
      onFocus={(event) => setIsFocusVisible(event.currentTarget.matches(':focus-visible'))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={rootStyle}
      type="button"
    >
      {leadingIcon ? (
        <span style={iconWrapperStyle}>
          <FieldIcon name={leadingIcon} size={toIconSize(size)} />
        </span>
      ) : null}
      <span style={labelStyle}>{label}</span>
      {onRemove ? (
        // Not a nested <button> on purpose — see the dev contract's own note on this gap.
        <span
          onClick={(event) => {
            event.stopPropagation();
            if (!disabled) onRemove();
          }}
          style={removeWrapperStyle}
        >
          <IconX size="xs" />
        </span>
      ) : null}
    </button>
  );
};
