import { StyleSheet } from 'react-native';

/** Static layout, independent of theme or state. Colors and metrics live in `useTextArea`. */
export const textAreaStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
