import { BluProvider, Button } from '@dsm/mobile';
import { colors, spacing, typography } from '@dsm/shared';
import type { TButtonSize, TButtonVariant } from '@dsm/shared';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const VARIANTS: TButtonVariant[] = ['primary', 'secondary'];
const SIZES: TButtonSize[] = ['small', 'medium', 'large'];

const App = () => {
  const [presses, setPresses] = useState(0);
  const handlePress = () => setPresses(current => current + 1);

  return (
    <BluProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>@dsm/mobile · demo</Text>
            <Text style={styles.subtitle}>
              El mismo Button del design system, consumido desde una app React
              Native.
            </Text>

            <Text style={styles.counter} testID="press-counter">
              Presses: {presses}
            </Text>

            {VARIANTS.map(variant => (
              <View key={variant} style={styles.section}>
                <Text style={styles.sectionTitle}>{variant.toUpperCase()}</Text>
                <View style={styles.row}>
                  {SIZES.map(size => (
                    <Button
                      key={size}
                      label={size}
                      onPress={handlePress}
                      size={size}
                      testID={`button-${variant}-${size}`}
                      variant={variant}
                    />
                  ))}
                  <Button
                    isDisabled
                    label="disabled"
                    onPress={handlePress}
                    testID={`button-${variant}-disabled`}
                    variant={variant}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </BluProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.slate100,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: typography.fontWeights.semibold,
    color: colors.slate900,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.slate700,
  },
  counter: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.slate900,
  },
  section: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    letterSpacing: 1,
    color: colors.slate400,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    alignItems: 'center',
  },
});

export default App;
