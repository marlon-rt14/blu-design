import { resolveBadgeAccessibleLabel, resolveBadgeCountText } from '@dsm/shared';
import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import type { IBadgeProps } from './Badge.types';
import { useBadge } from './useBadge';

/**
 * React Native Badge — the counter or the notice dot. No nested instances,
 * no interaction states: a pill with a number, or a point. If the content
 * needs a label that can be read or removed, use `Tag`; if it also needs to
 * be pressed to toggle, `Chip`.
 *
 * **It does not position itself.** Anchoring it to the corner of an icon or
 * an avatar is the caller's job.
 *
 * **`count=0` (or omitted) renders nothing** — a zero badge is worse than no
 * badge at all, per the dev contract's own closed decision.
 *
 * @example
 * ```tsx
 * <Badge count={3} label="mensajes sin leer" status="danger" />
 * <Badge label="hay actividad nueva" type="dot" />
 * ```
 */
export const Badge = (props: IBadgeProps): ReactElement | null => {
  const { type = 'count', count, max, label, testID } = props;
  const { rootStyle, textStyle } = useBadge(props);

  const countText = type === 'count' ? resolveBadgeCountText(count, max) : undefined;
  if (type === 'count' && countText === undefined) return null;

  const accessibleLabel = resolveBadgeAccessibleLabel(type, countText, label);

  return (
    <View
      accessibilityLabel={accessibleLabel}
      accessible={accessibleLabel !== undefined}
      style={rootStyle}
      testID={testID}
    >
      {countText !== undefined ? <Text style={textStyle}>{countText}</Text> : null}
    </View>
  );
};
