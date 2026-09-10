import type { ITooltipBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the web Tooltip.
 *
 * Extends the shared {@link ITooltipBaseProps} contract with the trigger. There
 * are no event handlers of its own: what opens the panel is pointing or
 * focusing, and the component wires both itself.
 */
export interface ITooltipProps extends ITooltipBaseProps {
  /**
   * The element being explained. The tooltip anchors itself to whatever this
   * renders and never replaces it.
   */
  children: ReactNode;
}
