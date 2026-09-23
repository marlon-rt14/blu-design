import type { CSSProperties } from 'react';

import type { IProgressStepperProps } from './ProgressStepper.types';

interface IUseProgressStepperResult {
  listStyle: CSSProperties;
  isVertical: boolean;
}

/**
 * Resolves the ProgressStepper list layout. No interaction state — the host
 * is read-only. Connectors live inside each Step.
 */
export const useProgressStepper = ({
  orientation = 'horizontal',
}: IProgressStepperProps): IUseProgressStepperResult => {
  const isVertical = orientation === 'vertical';

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: isVertical ? 'stretch' : 'flex-start',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return { listStyle, isVertical };
};
