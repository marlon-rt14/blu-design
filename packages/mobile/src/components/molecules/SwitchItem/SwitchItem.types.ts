import type { ISwitchItemBaseProps } from '@dsm/shared';

/**
 * Props of the React Native SwitchItem — the iOS-canonical Switch usage.
 * The entire row is a `Pressable` with `accessibilityRole="switch"`.
 */
export interface ISwitchItemProps extends ISwitchItemBaseProps {
  /** Fired with the new checked value. Not called while `isDisabled`. */
  onValueChange?: (isChecked: boolean) => void;
}
