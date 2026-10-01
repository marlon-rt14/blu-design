import type { IEmptyStateBaseProps } from '@dsm/shared';

/**
 * Props of the web EmptyState — identical to the shared contract; there is
 * nothing web-only to add. `action.onPress`/`secondaryAction.onPress` are
 * already real handlers in the shared contract, same pattern as
 * `ITooltipLink`.
 */
export type IEmptyStateProps = IEmptyStateBaseProps;
