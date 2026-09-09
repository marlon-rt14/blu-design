import type { ReactElement } from 'react';

import type { ICardProps } from './Card.types';
import { useCard } from './useCard';

/**
 * Web Card — a surface that holds content.
 *
 * It sets the background, the radius and the clipping; what goes inside is the
 * caller's decision. The slot is free: no preferred contents, no minimum, no
 * promise about what enters.
 *
 * **It renders a plain `<div>` with no role, and that is deliberate.** The Card
 * is not interactive. If the whole card is a destination, the role and the focus
 * come from a link or a button wrapping it — never from the surface. Asking this
 * component to become a button would give you a focusable div, which is the
 * thing to avoid.
 *
 * If what goes inside is list rows, reach for `ListGroup` instead: it is the
 * same surface, but its slot is restricted to `ListItem` and `ChoiceItem` and it
 * resolves the dividers between them.
 *
 * @example
 * ```tsx
 * <Card>{rows}</Card>
 * <Card elevation="raised" padding="md">
 *   <p>Anything at all.</p>
 * </Card>
 * ```
 */
export const Card = (props: ICardProps): ReactElement => {
  const { children, testID } = props;
  const { surfaceStyle } = useCard(props);

  return (
    <div data-testid={testID} style={surfaceStyle}>
      {children}
    </div>
  );
};
