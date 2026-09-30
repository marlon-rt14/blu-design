import type { IAccordionItemBaseProps, TAccordionAppearance, TAccordionSize } from '@dsm/shared';

/**
 * Props of the web AccordionItem.
 *
 * Extends the shared {@link IAccordionItemBaseProps} contract with the
 * fields the parent `Accordion` injects (`isExpanded`, `onToggle`,
 * `appearance`, `size`, `showDivider`) — the same relationship `TabItem` has
 * with `layout`/`tabIndex` from `Tabs`. All default, so this still renders
 * sensibly mounted on its own.
 */
export interface IAccordionItemProps extends IAccordionItemBaseProps {
  /**
   * Whether the panel is open. Injected by `Accordion`.
   *
   * @defaultValue `false`
   */
  isExpanded?: boolean;
  /** Called when the header is activated. Injected by `Accordion`; never fires while `disabled`. */
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
   * `Accordion` (every item but the last) — not something an app chooses
   * directly.
   *
   * @defaultValue `false`
   */
  showDivider?: boolean;
}
