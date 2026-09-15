import type { IDividerBaseProps } from '@dsm/shared';

/**
 * Props of the React Native Divider: the shared contract, with nothing added.
 *
 * No children and no text, because the component has neither. No `style`
 * either, matching every other component here — a Divider takes its length from
 * whatever contains it.
 */
export interface IDividerProps extends IDividerBaseProps {}
