import { popoverTokens } from '@dsm/shared';
import {
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  shift,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type { FloatingContext } from '@floating-ui/react';
import { useId, useState } from 'react';
import type { CSSProperties } from 'react';

import { useFontFamily, useThemeMode } from '../../../theme';
import type { IPopoverProps } from './Popover.types';

/** What {@link usePopover} hands the component. */
export interface IUsePopoverResult {
  /** `true` while the panel is mounted. */
  open: boolean;
  /** Ref for the wrapper around `trigger`. */
  setReference: (node: HTMLElement | null) => void;
  /** Ref for the panel. */
  setFloating: (node: HTMLElement | null) => void;
  getReferenceProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  /** Position of the panel, from the engine. Merge with {@link shellStyle}. */
  floatingStyles: CSSProperties;
  floatingContext: FloatingContext;
  shellStyle: CSSProperties;
  headerRowStyle: CSSProperties;
  headerTextStyle: CSSProperties;
  contentStyle: CSSProperties;
  /** `id` of the panel itself — what `trigger`'s `aria-controls` points at. */
  panelId: string;
  /** `id` of the header text — what the panel's own `aria-labelledby` points at. */
  headerId: string;
  /** Whether the header row renders at all — a title, a dismiss, or both. */
  renderHeaderRow: boolean;
  showHeader: boolean;
  showDismiss: boolean;
  close: () => void;
}

/**
 * Wires Floating UI and resolves every style the Popover needs.
 *
 * Uncontrolled: there is no `isOpen` prop (see `IPopoverBaseProps`'s docs for
 * why) — a click on `trigger` toggles `open`, the same interaction pattern
 * Select's own menu already uses internally, just routed through Floating
 * UI's `useClick` instead of a raw `onClick`.
 *
 * Unlike `useTooltip` / `useCoachmark`, focus is trapped: `Popover.tsx` mounts
 * `FloatingFocusManager` with `modal` — the dev contract calls this out as
 * the one thing that sets Popover apart from those two ("ATRAPA EL FOCO, a
 * diferencia del Tooltip y del Coachmark").
 */
export const usePopover = ({ header, onDismiss, size, placement }: IPopoverProps): IUsePopoverResult => {
  const mode = useThemeMode();
  const { colors, dimension, header: headerType } = popoverTokens[mode];
  const resolvedSize = size ?? 'md';
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const headerId = useId();
  // Portalled to `document.body`, outside the provider's subtree — without
  // this the header falls back to the UA serif, same reasoning as Tooltip's
  // own `titleFontFamily`.
  const headerFontFamily = useFontFamily(headerType.fontWeight);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [
      offset(dimension.gap),
      // A stated placement is a preference the engine may overrule; with none,
      // it chooses outright — same rule Tooltip and Coachmark already follow.
      placement ? flip() : autoPlacement(),
      shift({ padding: dimension.gap }),
      // Caps the shell at whatever room is actually available, so a tall
      // `children` scrolls inside `contentStyle` instead of overflowing the
      // viewport — the dev contract's own "altura máxima con scroll interno".
      sizeMiddleware({
        padding: dimension.gap,
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, { maxHeight: `${availableHeight}px` });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  // Esc and an outside click both always close it — no `sequence`-style
  // exception like Coachmark's `multi`: a Popover always has to be
  // closeable without choosing anything, per the dev contract's own "Esc
  // cierra siempre".
  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const showHeader = header !== undefined;
  const showDismiss = onDismiss !== undefined;
  const renderHeaderRow = showHeader || showDismiss;
  const sizeTokens = dimension.sizes[resolvedSize];

  return {
    open,
    setReference: refs.setReference,
    setFloating: refs.setFloating,
    getReferenceProps,
    getFloatingProps,
    floatingStyles: { ...floatingStyles, zIndex: dimension.zIndex },
    floatingContext: context,
    shellStyle: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflow: 'hidden',
      // Portalled to `document.body`, outside the provider's subtree — without
      // this, arbitrary `children` (which set no font of their own, unlike
      // Tooltip's/Coachmark's own `body`/`title` strings) falls back to the UA
      // serif instead of inheriting Mulish. Set here, once, so it cascades to
      // both the header and the content.
      fontFamily: headerFontFamily,
      borderWidth: dimension.borderWidth,
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: dimension.borderRadius,
      backgroundColor: colors.surface,
      // Far first, near second: CSS paints the first on top — the same
      // `overlay` ramp Tooltip and Coachmark both use.
      boxShadow: [
        `0 ${dimension.overlayShadowFarY}px ${dimension.overlayShadowFarBlur}px ${colors.overlayShadowFar}`,
        `0 ${dimension.overlayShadowNearY}px ${dimension.overlayShadowNearBlur}px ${colors.overlayShadowNear}`,
      ].join(', '),
    },
    headerRowStyle: {
      boxSizing: 'border-box',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: dimension.gap,
      minHeight: sizeTokens.headerHeight,
      paddingInline: sizeTokens.padding,
    },
    headerTextStyle: {
      margin: 0,
      flex: 1,
      minWidth: 0,
      fontFamily: headerFontFamily,
      fontWeight: headerType.fontWeight,
      fontSize: headerType.fontSize,
      lineHeight: `${headerType.lineHeight}px`,
      color: colors.headerText,
    },
    contentStyle: {
      boxSizing: 'border-box',
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: sizeTokens.padding,
      paddingTop: renderHeaderRow ? 0 : sizeTokens.padding,
    },
    panelId,
    headerId,
    renderHeaderRow,
    showHeader,
    showDismiss,
    close: (): void => setOpen(false),
  };
};
