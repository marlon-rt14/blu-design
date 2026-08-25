import { textFieldTokens } from '@dsm/shared';
import { StyleSheet } from 'react-native';

// `layout` (unlike `colors`) doesn't vary between `light` and `dark` today,
// so reading it once from `light` here is safe — see the doc comment on
// `textFieldTokens` in @dsm/shared for which fields that guarantee does and
// doesn't cover.
const { stackGap, inlineGap } = textFieldTokens.light.layout;

/** Static layout, independent of theme, size or state. Colors and metrics live in `useTextField`. */
export const textFieldStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: stackGap,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: inlineGap,
  },
});
