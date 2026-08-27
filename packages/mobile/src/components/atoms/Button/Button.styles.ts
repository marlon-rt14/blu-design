import { StyleSheet } from 'react-native';

/** Static layout, independent of theme or state. Colors and metrics live in `useButton`. */
export const buttonStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
