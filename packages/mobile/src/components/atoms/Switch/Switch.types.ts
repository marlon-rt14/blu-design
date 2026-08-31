import type { ISwitchBaseProps } from '@dsm/shared';

/**
 * Props of the React Native Switch.
 *
 * Extends {@link ISwitchBaseProps} with `onValueChange`. This is a custom
 * `Pressable` track + thumb — **do not** use RN's `Switch` / `UISwitch`
 * (Apple green, 51×31, wrong tokens). Figma `track.bg-on` (`#2760aa`) is
 * the on-fill, not system green.
 *
 * `isContained` is the composition seam for SwitchItem: visual only, no
 * own Pressable, no extra hit target.
 */
export interface ISwitchProps extends ISwitchBaseProps {
  /** Fired with the new checked value. Not called while `isDisabled`. */
  onValueChange?: (isChecked: boolean) => void;
  /**
   * Visual-only embedding inside SwitchItem: no own Pressable, no extra
   * hit-target padding. The row owns a11y and the 48pt target.
   *
   * @defaultValue `false`
   */
  isContained?: boolean;
}
