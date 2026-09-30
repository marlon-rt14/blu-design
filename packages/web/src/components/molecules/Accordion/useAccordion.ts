import { useState } from 'react';
import type { CSSProperties } from 'react';

import type { IAccordionProps } from './Accordion.types';

interface IUseAccordionResult {
  rootStyle: CSSProperties;
  expanded: string[];
  toggle: (id: string) => void;
}

/**
 * Owns the controlled/uncontrolled open-section state and the
 * `allowMultiple` toggle logic. No tokens to read — Accordion itself has no
 * surface of its own (no border, no radius, no background): it is a stack
 * of `AccordionItem`s separated by the dividers each item draws.
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

  const toggle = (id: string): void => {
    const isOpen = expanded.includes(id);
    const next = isOpen
      ? expanded.filter((openId) => openId !== id)
      : allowMultiple
        ? [...expanded, id]
        : [id];
    if (!isControlled) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  return {
    rootStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    expanded,
    toggle,
  };
};
