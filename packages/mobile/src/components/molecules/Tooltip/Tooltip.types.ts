import type { ITooltipBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the React Native Tooltip.
 *
 * Extends the shared {@link ITooltipBaseProps} contract with the trigger. There
 * are no handlers of its own: a **long press** opens the panel and the
 * component wires it, leaving the plain press to whatever `children` renders.
 */
export interface ITooltipProps extends ITooltipBaseProps {
  /**
   * The element being explained. A long press on it opens the tooltip; a plain
   * press still belongs to the child, which is usually a control with an action
   * of its own.
   */
  children: ReactNode;
}
