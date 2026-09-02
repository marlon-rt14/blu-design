import type { IChoiceItemBaseProps } from '@dsm/shared';

/**
 * Props of the React Native ChoiceItem.
 *
 * Extends the shared {@link IChoiceItemBaseProps} contract with the mobile
 * handler.
 *
 * There is no `name`: web gets its radio grouping from the browser because it
 * renders a native input, and React Native has no equivalent. Here the group is
 * whoever renders the rows — `RadioGroup` — and it holds which one is chosen.
 */
export interface IChoiceItemProps extends IChoiceItemBaseProps {
  /** Called when the user picks this row. Never fires while `isDisabled`. */
  onPress?: () => void;
}
