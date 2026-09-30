import { SNACKBAR_STACK_MAX } from '@dsm/shared';
import { useEffect, useRef, useState } from 'react';
import type { FocusEvent, ReactElement } from 'react';

import { Snackbar } from '../../atoms/Snackbar';
import type { ISnackbarStackProps } from './SnackbarStack.types';
import { useSnackbarStack } from './useSnackbarStack';

/**
 * Up to three Snackbars. Collapsed, only the newest is interactive and the
 * older ones peek behind it. Hover, focus, or — once open — an outside
 * press and scroll follow the component description on `1706:3753`.
 */
export const SnackbarStack = ({
  items,
  expanded,
  onExpandedChange,
  onDismiss,
  testID,
}: ISnackbarStackProps): ReactElement | null => {
  const { rootStyle, gap, slot } = useSnackbarStack();
  const rootRef = useRef<HTMLDivElement>(null);
  const onDismissRef = useRef(onDismiss);
  const onExpandedChangeRef = useRef(onExpandedChange);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  useEffect(() => {
    onExpandedChangeRef.current = onExpandedChange;
  });

  const isControlled = expanded !== undefined;
  const visible = items.slice(-SNACKBAR_STACK_MAX);
  const open = (isControlled ? expanded : isHovered || isFocused) && visible.length > 1;

  const overflowKey = items
    .slice(0, Math.max(0, items.length - SNACKBAR_STACK_MAX))
    .map((item) => item.id)
    .join('\0');

  useEffect(() => {
    if (overflowKey === '') {
      return;
    }
    for (const id of overflowKey.split('\0')) {
      onDismissRef.current?.(id);
    }
  }, [overflowKey]);

  useEffect(() => {
    if (visible.length > 1 || isControlled) {
      return;
    }
    setIsHovered(false);
    setIsFocused(false);
  }, [visible.length, isControlled]);

  useEffect(() => {
    if (!open || isControlled) {
      return;
    }
    const close = (): void => {
      setIsHovered(false);
      setIsFocused(false);
      onExpandedChangeRef.current?.(false);
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', close, true);
    };
  }, [open, isControlled]);

  if (visible.length === 0) {
    return null;
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  };

  return (
    <div
      data-testid={testID}
      onBlur={handleBlur}
      onFocus={() => setIsFocused(true)}
      onMouseEnter={() => {
        if (!isControlled) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      ref={rootRef}
      style={{ ...rootStyle, gap: open ? gap : 0 }}
    >
      {visible.map((item, index) => {
        const distance = visible.length - 1 - index;
        const { isPeek, style } = slot(distance, open);
        return (
          <div aria-hidden={isPeek || undefined} key={item.id} style={style}>
            <Snackbar
              {...item}
              onExpire={() => onDismissRef.current?.(item.id)}
              paused={open}
            />
          </div>
        );
      })}
    </div>
  );
};
