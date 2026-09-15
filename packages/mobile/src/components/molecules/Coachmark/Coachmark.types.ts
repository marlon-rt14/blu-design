import type { ICoachmarkBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the React Native Coachmark.
 *
 * Extends the shared contract with the anchor and the open / action handlers.
 * Opening is host-controlled via `isOpen` — never a press or long-press on the
 * anchor (the anchor keeps its own gestures).
 */
export interface ICoachmarkProps extends ICoachmarkBaseProps {
  /** The element the guide is anchored to. */
  children: ReactNode;
  /** Called when the panel should close (backdrop on single, dismiss, action). */
  onOpenChange?: (open: boolean) => void;
  onAction?: () => void;
  onBack?: () => void;
  onDismiss?: () => void;
}
