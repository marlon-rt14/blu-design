import type { ICoachmarkBaseProps } from '@dsm/shared';
import type { ReactNode } from 'react';

/**
 * Props of the web Coachmark.
 *
 * Extends the shared contract with the anchor, open-change callback and the
 * footer / dismiss handlers. Opening is never hover-driven — the host sets
 * {@link ICoachmarkBaseProps.isOpen}.
 */
export interface ICoachmarkProps extends ICoachmarkBaseProps {
  /**
   * The element the guide is anchored to. The panel positions itself against
   * it and never replaces it — same Figma divergence as Tooltip.
   */
  children: ReactNode;
  /** Called when Esc, outside press (single), dismiss, or action closes it. */
  onOpenChange?: (open: boolean) => void;
  /** Primary footer Button. Also closes the panel after firing. */
  onAction?: () => void;
  /** Back Button — only rendered on `sequence="multi"` with `showBack`. */
  onBack?: () => void;
  /** Dismiss IconButton. */
  onDismiss?: () => void;
}
