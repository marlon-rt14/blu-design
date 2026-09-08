import type { ReactElement } from 'react';
import { View } from 'react-native';

import type { ICardProps } from './Card.types';
import { useCard } from './useCard';

/**
 * React Native Card — a surface that holds content.
 *
 * It sets the background, the radius and the clipping; what goes inside is the
 * caller's decision. The slot is free: no preferred contents, no minimum, no
 * promise about what enters.
 *
 * **It has no accessibility role and no press handling, deliberately.** The Card
 * is not interactive. If the whole card is a destination, the role and the focus
 * come from a `Pressable` or a link wrapping it — never from the surface.
 *
 * It renders two views where the web Card renders one, and the reason is a
 * platform conflict rather than design: on iOS a view that both casts a shadow
 * and clips to its bounds loses the shadow. The outer view carries the paint and
 * the inner one does the clipping. See `useCard`.
 *
 * If what goes inside is list rows, reach for `ListGroup` instead: it is the
 * same surface, but its slot is restricted to `ListItem` and `ChoiceItem` and it
 * resolves the dividers between them.
 *
 * @example
 * ```tsx
 * <Card>{rows}</Card>
 * <Card elevation="raised" padding="md">
 *   <Text>Anything at all.</Text>
 * </Card>
 * ```
 */
export const Card = (props: ICardProps): ReactElement => {
  const { children, testID } = props;
  const { surfaceStyle, clipStyle } = useCard(props);

  return (
    <View style={surfaceStyle} testID={testID}>
      <View style={clipStyle}>{children}</View>
    </View>
  );
};
