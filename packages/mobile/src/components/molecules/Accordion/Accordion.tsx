import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { View } from 'react-native';

import type { IAccordionItemProps } from '../../atoms/AccordionItem';
import type { IAccordionProps } from './Accordion.types';
import { useAccordion } from './useAccordion';

/**
 * React Native Accordion — the group that owns which sections are open.
 * Same architecture as web's own `Accordion`: it clones each `AccordionItem`
 * child to inject `isExpanded`, `onToggle`, `appearance`, `size` and
 * `showDivider`, and `appearance`/`size` always win over whatever a child
 * set — every item in a group shares one of each.
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
    <View style={rootStyle} testID={testID}>
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
    </View>
  );
};
