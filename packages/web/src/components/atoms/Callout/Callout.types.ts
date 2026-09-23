import type { ICalloutBaseProps } from '@dsm/shared';

/**
 * Props of the web Callout — identical to the shared contract; there is
 * nothing web-only to add. `action.onPress` and `onDismiss` are already
 * real handlers in `ICalloutBaseProps` (same pattern as `ITooltipLink`), and
 * the dismiss control is the shipped `IconButton`, which tracks its own
 * hover/press/focus state — Callout doesn't need to.
 */
export type ICalloutProps = ICalloutBaseProps;
