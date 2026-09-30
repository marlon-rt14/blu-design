import { SNACKBAR_STACK_MAX } from '@dsm/shared';
import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { Snackbar } from '../../atoms/Snackbar';
import type { ISnackbarStackProps } from './SnackbarStack.types';
import { useSnackbarStack } from './useSnackbarStack';

/**
 * Up to three Snackbars. Collapsed, only the newest is interactive and the
 * older ones peek behind it. A press opens the pile; an outside press,
 * scroll, or a single remaining bar closes it (`1706:3753`).
 */
export const SnackbarStack = ({
  items,
  expanded,
  onExpandedChange,
  onDismiss,
  testID,
}: ISnackbarStackProps): ReactElement | null => {
  const { rootStyle, gap, slot } = useSnackbarStack();
  const rootRef = useRef<React.ComponentRef<typeof View>>(null);
  const onDismissRef = useRef(onDismiss);
  const onExpandedChangeRef = useRef(onExpandedChange);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  useEffect(() => {
    onExpandedChangeRef.current = onExpandedChange;
  });

  const isControlled = expanded !== undefined;
  const visible = items.slice(-SNACKBAR_STACK_MAX);
  const open = (isControlled ? expanded : isOpen) && visible.length > 1;

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
    setIsOpen(false);
  }, [visible.length, isControlled]);

  useEffect(() => {
    if (!open || isControlled) {
      return;
    }
    const host = globalThis as {
      addEventListener?: (type: string, listener: () => void, capture?: boolean) => void;
      removeEventListener?: (type: string, listener: () => void, capture?: boolean) => void;
      document?: {
        addEventListener: (type: string, listener: (event: { target: unknown }) => void) => void;
        removeEventListener: (type: string, listener: (event: { target: unknown }) => void) => void;
      };
    };
    if (!host.document || !host.addEventListener) {
      return;
    }
    const close = (): void => {
      setIsOpen(false);
      onExpandedChangeRef.current?.(false);
    };
    const onPointerDown = (event: { target: unknown }): void => {
      const root = rootRef.current as unknown as { contains?: (target: unknown) => boolean } | null;
      if (root?.contains && !root.contains(event.target)) {
        close();
      }
    };
    host.addEventListener('scroll', close, true);
    host.document.addEventListener('pointerdown', onPointerDown);
    return () => {
      host.removeEventListener?.('scroll', close, true);
      host.document?.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, isControlled]);

  if (visible.length === 0) {
    return null;
  }

  return (
    <View ref={rootRef}>
      <Pressable
        accessibilityRole="none"
        onPress={() => {
          if (!open && !isControlled && visible.length > 1) {
            setIsOpen(true);
            onExpandedChangeRef.current?.(true);
          }
        }}
        style={[rootStyle, { gap: open ? gap : 0 }]}
        testID={testID}
      >
      {visible.map((item, index) => {
        const distance = visible.length - 1 - index;
        const { isPeek, style } = slot(distance, open);
        return (
          <View
            accessibilityElementsHidden={isPeek}
            importantForAccessibility={isPeek ? 'no-hide-descendants' : 'auto'}
            key={item.id}
            pointerEvents={isPeek ? 'none' : 'auto'}
            style={style}
          >
            <Snackbar {...item} onExpire={() => onDismissRef.current?.(item.id)} paused={open} />
          </View>
        );
      })}
      </Pressable>
    </View>
  );
};
