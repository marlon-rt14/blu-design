import { textAreaTokens } from '@dsm/shared';
import { StyleSheet } from 'react-native';

// `stackGap` / `footerInlineGap` don't vary between `light` and `dark` today
// — same reasoning as @dsm/mobile's TextField.styles.ts.
const { stackGap, footerInlineGap } = textAreaTokens.light.dimension;

/** Static layout, independent of theme or state. Colors and metrics live in `useTextArea`. */
export const textAreaStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: stackGap,
  },
  input: {
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: footerInlineGap,
  },
});
