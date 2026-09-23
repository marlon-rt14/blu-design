import type { ICalloutBaseProps } from '@dsm/shared';

/**
 * Props of the React Native Callout — identical to the shared contract;
 * there is nothing mobile-only to add. `action.onPress` and `onDismiss` are
 * already real handlers in `ICalloutBaseProps`, and the dismiss control is
 * the shipped `IconButton`, which ships its own `hitSlop` and tracks its
 * own press/focus state — Callout doesn't need to.
 */
export type ICalloutProps = ICalloutBaseProps;
