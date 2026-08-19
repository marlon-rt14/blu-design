export type TButtonVariant = 'primary' | 'secondary';

export type TButtonSize = 'small' | 'medium' | 'large';

/**
 * Platform-agnostic contract for the Button.
 *
 * It deliberately leaves out event handlers: each platform adds its own when
 * extending this interface (`onClick` on web, `onPress` on mobile).
 */
export interface IButtonBaseProps {
  label: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  isDisabled?: boolean;
  testID?: string;
}
