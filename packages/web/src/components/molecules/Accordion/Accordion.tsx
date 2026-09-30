import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';

import type { IAccordionItemProps } from '../../atoms/AccordionItem';
import type { IAccordionProps } from './Accordion.types';
import { useAccordion } from './useAccordion';

/**
 * Web Accordion — the group that owns which sections are open.
 *
 * Unlike `RadioGroup`/`CheckboxGroup`/`Tabs`, which all push selection state
 * out to whoever renders their children, this one keeps it: `allowMultiple`
 * has to be able to close every other section the instant one opens, which
 * needs one owner of the whole open/closed set. It clones each
 * `AccordionItem` child (same mechanics `Tabs` already uses on `TabItem`) to
 * inject `isExpanded`, `onToggle`, `appearance`, `size` and `showDivider` —
 * none of those are props an app sets on an item once it lives here.
 *
 * **`appearance`/`size` always win over whatever a child set**, unlike
 * `Tabs`' own fallback-if-unset merge for `TabItem` — every item in a group
 * shares one appearance and one size, full stop.
 *
 * @example
 * ```tsx
 * <Accordion defaultExpanded={['shipping']}>
 *   <AccordionItem id="shipping" title="Envío">Contenido…</AccordionItem>
 *   <AccordionItem id="returns" title="Devoluciones">Contenido…</AccordionItem>
 * </Accordion>
 * ```
 */
export const Accordion = (props: IAccordionProps): ReactElement => {
  const { appearance = 'default', size = 'sm', children, testID } = props;
  const { rootStyle, expanded, toggle } = useAccordion(props);

  const items = Children.toArray(children).filter(
    (child): child is ReactElement<IAccordionItemProps> => isValidElement<IAccordionItemProps>(child),
  );
  const lastIndex = items.length - 1;

  return (
    <div data-testid={testID} style={rootStyle}>
      {items.map((item, index) =>
        cloneElement(item, {
          appearance,
          size,
          isExpanded: expanded.includes(item.props.id),
          onToggle: () => {
            if (item.props.disabled) return;
            toggle(item.props.id);
          },
          showDivider: index !== lastIndex,
        }),
      )}
    </div>
  );
};
