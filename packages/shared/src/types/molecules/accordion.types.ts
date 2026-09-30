import type { ReactNode } from 'react';

/**
 * Which surface the Accordion sits on. Every `AccordionItem` inherits this
 * from its parent `Accordion` — it is not a prop an app sets per item, the
 * same way `Tabs` fixes `size`/`layout` for every `TabItem` it clones.
 *
 * @defaultValue `'default'`
 */
export type TAccordionAppearance = 'default' | 'on-scene' | 'on-inverse';

/**
 * Header height — `sm` (48) or `lg` (56). Accordion-level only, same
 * inheritance rule as {@link TAccordionAppearance}.
 *
 * @defaultValue `'sm'`
 */
export type TAccordionSize = 'sm' | 'lg';

/**
 * Platform-agnostic contract for the Accordion — the group that owns which
 * sections are open. Unlike `RadioGroup`/`CheckboxGroup`/`Tabs`, which all
 * push selection state out to whoever renders their children, Accordion
 * keeps it here: `allowMultiple=false` has to close every other section the
 * instant one opens, and nothing enforces that without one owner of the
 * whole open/closed set.
 *
 * Controlled/uncontrolled, the same shape as a native `<input>`:
 * `expanded` + `onExpandedChange` for a caller that owns the array itself,
 * `defaultExpanded` for one that doesn't. Leave both unset and it starts
 * empty.
 *
 * @example
 * ```tsx
 * <Accordion defaultExpanded={['shipping']}>
 *   <AccordionItem id="shipping" title="Envío">...</AccordionItem>
 *   <AccordionItem id="returns" title="Devoluciones">...</AccordionItem>
 * </Accordion>
 * ```
 */
export interface IAccordionBaseProps {
  /**
   * @defaultValue `'default'`
   */
  appearance?: TAccordionAppearance;
  /**
   * @defaultValue `'sm'`
   */
  size?: TAccordionSize;
  /**
   * Whether more than one section can stay open at once. `false` closes
   * whichever section was open the instant another one is picked.
   *
   * @defaultValue `true`
   */
  allowMultiple?: boolean;
  /** The open section ids. Passing this makes the Accordion controlled — pair it with `onExpandedChange`. */
  expanded?: string[];
  /** Initial open section ids for an uncontrolled Accordion. Ignored once `expanded` is passed. */
  defaultExpanded?: string[];
  /** Called with the next open section ids, controlled or not. */
  onExpandedChange?: (ids: string[]) => void;
  /** `AccordionItem` elements — the sections. */
  children: ReactNode;
  testID?: string;
}

/**
 * Platform-agnostic contract for one `AccordionItem` — a section's header
 * (title, optional icon, chevron) plus its content panel.
 *
 * **No `isExpanded` here.** Whether a section is open is state the parent
 * `Accordion` owns and injects, the same way `Tabs` injects `layout`/`size`
 * into every `TabItem` — it is not a prop an app sets directly on an item
 * that lives inside an `Accordion`. Each platform's own prop type adds it
 * back (defaulted, so the atom still renders sensibly on its own in
 * Storybook) precisely because it's the parent's to set, not this
 * contract's.
 */
export interface IAccordionItemBaseProps {
  /** Identifies the section — what `expanded`/`defaultExpanded`/`onExpandedChange` key on. */
  id: string;
  title: string;
  /** Presence turns the leading icon on — no separate `showIcon`, same convention as `Callout`. */
  icon?: ReactNode;
  /**
   * @defaultValue `false`
   */
  disabled?: boolean;
  /** The panel's content, shown once the section is open. */
  children: ReactNode;
  testID?: string;
}
