import type { IAccordionItemBaseProps, TAccordionAppearance, TAccordionSize } from '@dsm/shared';

/**
 * Props of the React Native AccordionItem.
 *
 * Extends the shared {@link IAccordionItemBaseProps} contract with the
 * fields the parent `Accordion` injects (`isExpanded`, `onToggle`,
 * `appearance`, `size`, `showDivider`) — same relationship as web's own
 * `IAccordionItemProps`. All default, so this still renders sensibly
 * mounted on its own.
 */
export interface IAccordionItemProps extends IAccordionItemBaseProps {
  /**
   * Whether the panel is open. Injected by `Accordion`.
   *
   * @defaultValue `false`
   */
  isExpanded?: boolean;
  /** Called when the header is pressed. Injected by `Accordion`; never fires while `disabled`. */
  onToggle?: () => void;
  /**
   * Injected by `Accordion` — every item in a group shares one appearance.
   *
   * @defaultValue `'default'`
   */
  appearance?: TAccordionAppearance;
  /**
   * Injected by `Accordion` — every item in a group shares one size.
   *
   * @defaultValue `'sm'`
   */
  size?: TAccordionSize;
  /**
   * Whether the bottom divider renders. Derived from position by
   * `Accordion` (every item but the last).
   *
   * @defaultValue `false`
   */
  showDivider?: boolean;
}
