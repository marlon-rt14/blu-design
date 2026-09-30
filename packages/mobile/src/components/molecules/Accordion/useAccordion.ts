import { useEffect, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { AccessibilityInfo, LayoutAnimation } from 'react-native';

import type { IAccordionProps } from './Accordion.types';

interface IUseAccordionResult {
  rootStyle: StyleProp<ViewStyle>;
  expanded: string[];
  toggle: (id: string) => void;
}

/**
 * Owns the controlled/uncontrolled open-section state and the
 * `allowMultiple` toggle logic — same shape as web's `useAccordion`.
 *
 * `LayoutAnimation.configureNext` runs synchronously right before the state
 * change that flips a section's `isExpanded`, which is what animates the
 * resulting height change on the next render — RN's own purpose-built
 * mechanism for exactly this "a view mounts/unmounts, animate the layout
 * shift" case (see `AccordionItem.tsx`, which conditionally mounts its
 * content rather than measuring height the way web's `useLayoutEffect` has
 * to).
 */
export const useAccordion = ({
  allowMultiple = true,
  expanded: controlledExpanded,
  defaultExpanded = [],
  onExpandedChange,
}: IAccordionProps): IUseAccordionResult => {
  const isControlled = controlledExpanded !== undefined;
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>(defaultExpanded);
  const expanded = isControlled ? controlledExpanded : uncontrolledExpanded;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!cancelled) {
        setPrefersReducedMotion(enabled);
      }
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setPrefersReducedMotion);
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  const toggle = (id: string): void => {
    const isOpen = expanded.includes(id);
    const next = isOpen
      ? expanded.filter((openId) => openId !== id)
      : allowMultiple
        ? [...expanded, id]
        : [id];
    if (!prefersReducedMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    if (!isControlled) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  return {
    rootStyle: {
      width: '100%',
    },
    expanded,
    toggle,
  };
};
