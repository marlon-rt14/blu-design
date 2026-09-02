import type { IRadioBaseProps } from '@dsm/shared';

/**
 * Props of the React Native Radio.
 *
 * Extends the shared {@link IRadioBaseProps} contract with the mobile handler.
 *
 * There is no `name`: web gets its grouping from the browser because it renders
 * a real `<input type="radio">`, and React Native has no equivalent. Here the
 * group is whatever renders the radios — `RadioGroup`, once it exists — and
 * `accessibilityRole="radio"` plus `accessibilityState.checked` is what tells
 * VoiceOver and TalkBack that these belong together.
 */
export interface IRadioProps extends IRadioBaseProps {
  /** Called when the user picks this option. Never fires while `isDisabled`. */
  onPress?: () => void;
}
