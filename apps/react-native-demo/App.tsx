import { BluProvider, Button, ChoiceBox, useFontFamily } from '@dsm/mobile';
import { colors, spacing, typography } from '@dsm/shared';
import type {
  TButtonAppearance,
  TButtonSize,
  TButtonVariant,
  TIconColor,
  TIconSize,
} from '@dsm/shared';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  IconAlertTriangle,
  IconCheckCircle,
  IconImage,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@dsm/mobile/icons';

const VARIANTS: TButtonVariant[] = ['primary', 'danger'];
// `on-inverse` is left out: it only exists for `primary` and needs an inverted surface.
const APPEARANCES: Exclude<TButtonAppearance, 'on-inverse'>[] = ['fill', 'soft', 'outline', 'ghost'];
const SIZES: TButtonSize[] = ['xs', 'sm', 'md', 'lg'];

// The six steps of `size/icon/*`, with the px each one resolves to — the point of
// the row is that the number is a token, never a hand-set width.
const ICON_SIZES: [TIconSize, number][] = [
  ['2xs', 8],
  ['xs', 12],
  ['sm', 16],
  ['md', 24],
  ['lg', 32],
  ['xl', 40],
];
// A slice of the 33 roles in `color/icon/*` — the ones that read on this screen's
// own surface. The `on-inverse.*`, `on-scene.*` and `action.*` families are left
// out because they only make sense on a surface this demo does not have.
const ICON_COLORS: TIconColor[] = [
  'primary',
  'secondary',
  'disabled',
  'brand',
  'danger',
  'success',
  'info',
  'warning',
];

const App = () => {
  const [presses, setPresses] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState('monthly');
  const [selectedTile, setSelectedTile] = useState('email');
  const [selectedCompact, setSelectedCompact] = useState('6');
  const handlePress = () => setPresses(current => current + 1);
  // fontWeight isn't set alongside fontFamily below — each Mulish-*.ttf is
  // already a single static weight, same constraint as @dsm/mobile's own
  // components (see TextField's useTextField).
  const regularFont = useFontFamily(typography.fontWeights.regular);
  const mediumFont = useFontFamily(typography.fontWeights.medium);
  const semiboldFont = useFontFamily(typography.fontWeights.semibold);

  return (
    <BluProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.title, { fontFamily: semiboldFont }]}>@dsm/mobile · demo</Text>
            <Text style={[styles.subtitle, { fontFamily: regularFont }]}>
              El mismo Button del design system, consumido desde una app React
              Native. Resuelve tokens de bDS para el tema activo.
            </Text>

            <Text style={[styles.counter, { fontFamily: mediumFont }]} testID="press-counter">
              Presses: {presses}
            </Text>

            {VARIANTS.map(variant => (
              <View key={variant} style={styles.section}>
                <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>
                  {variant.toUpperCase()}
                </Text>
                <View style={styles.row}>
                  {APPEARANCES.map(appearance => (
                    <Button
                      appearance={appearance}
                      key={appearance}
                      label={appearance}
                      onPress={handlePress}
                      testID={`button-${variant}-${appearance}`}
                      variant={variant}
                    />
                  ))}
                </View>
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

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>CHOICEBOX</Text>
              <View style={styles.choiceBoxList}>
                <ChoiceBox
                  description="Facturacion mensual, sin permanencia."
                  icon="image"
                  isSelected={selectedChoice === 'monthly'}
                  onValueChange={() => setSelectedChoice('monthly')}
                  showDescription
                  testID="choicebox-monthly"
                  title="Plan mensual"
                />
                <ChoiceBox
                  description="Ahorra un 20% con el pago anual."
                  icon="image"
                  isSelected={selectedChoice === 'annual'}
                  onValueChange={() => setSelectedChoice('annual')}
                  showDescription
                  testID="choicebox-annual"
                  title="Plan anual"
                />
                <ChoiceBox
                  description="Esta opcion no esta disponible ahora."
                  icon="image"
                  isDisabled
                  showDescription
                  testID="choicebox-disabled"
                  title="Plan empresarial"
                />
              </View>

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                CHOICEBOX · TILE
              </Text>
              <View style={styles.choiceBoxTileGrid}>
                <View style={styles.choiceBoxTileCell}>
                  <ChoiceBox
                    description="Al ****6760"
                    icon="image"
                    isSelected={selectedTile === 'sms'}
                    onValueChange={() => setSelectedTile('sms')}
                    showDescription
                    testID="choicebox-tile-sms"
                    title="Mensaje de texto"
                    variant="tile"
                  />
                </View>
                <View style={styles.choiceBoxTileCell}>
                  <ChoiceBox
                    description="A j****@mail.com"
                    icon="image"
                    isSelected={selectedTile === 'email'}
                    onValueChange={() => setSelectedTile('email')}
                    showDescription
                    testID="choicebox-tile-email"
                    title="Correo"
                    variant="tile"
                  />
                </View>
              </View>

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                CHOICEBOX · COMPACT
              </Text>
              <View style={styles.row}>
                {(['3', '6', '12'] as const).map(installments => (
                  <ChoiceBox
                    description={installments === '3' ? 'Sin interes' : 'Con interes'}
                    isSelected={selectedCompact === installments}
                    key={installments}
                    onValueChange={() => setSelectedCompact(installments)}
                    showDescription
                    testID={`choicebox-compact-${installments}`}
                    title={`${installments} cuotas`}
                    variant="compact"
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>ICON</Text>
              <Text style={[styles.subtitle, { fontFamily: regularFont }]}>
                Los 31 glifos de bDS salen ya montados de @dsm/mobile/icons:
                &lt;IconTrash size="lg" color="danger" /&gt;. Cada uno es un Icon con
                sus paths adentro, asi que fija la caja desde size/icon/* y resuelve
                el color del tema.
              </Text>

              <IconImage size='lg' />

              {/* Los 6 pasos. El label es el valor que resuelve el token, no un
                  width escrito a mano. */}
              <View style={[styles.row, styles.iconRow]}>
                {ICON_SIZES.map(([size, px]) => (
                  <View key={size} style={styles.iconCell}>
                    <IconImage size={size} testID={`icon-size-${size}`} />
                    <Text style={[styles.iconLabel, { fontFamily: regularFont }]}>
                      {size} · {px}px
                    </Text>
                  </View>
                ))}
              </View>

              {/* tintColor: el canal que web no necesita. React Native no tiene
                  currentColor ni cascada, así que un padre que ya resolvió un color
                  — un Button tiñendo su icono para igualar el label — lo presta por
                  aquí. Los tres de abajo comparten glifo y tamaño, y solo cambia
                  el color prestado. */}
              <View style={[styles.row, styles.iconRow]}>
                {['#174183', '#b22c42', '#008557'].map(tint => (
                  <View key={tint} style={styles.iconCell}>
                    <IconPlus size="md" tintColor={tint} />
                    <Text style={[styles.iconLabel, { fontFamily: regularFont }]}>{tint}</Text>
                  </View>
                ))}
              </View>

              {/* Roles semánticos: para un icono suelto que carga un significado
                  propio. A diferencia del hex de arriba, un rol sigue al tema. */}
              <View style={[styles.row, styles.iconRow]}>
                {ICON_COLORS.map(color => (
                  <View key={color} style={styles.iconCell}>
                    <IconAlertTriangle
                      color={color}
                      size="lg"
                      testID={`icon-color-${color}`}
                    />
                    <Text style={[styles.iconLabel, { fontFamily: regularFont }]}>{color}</Text>
                  </View>
                ))}
              </View>

              {/* Un punado del set, para ver que son glifos distintos. */}
              <View style={[styles.row, styles.iconRow]}>
                {(
                  [
                    ['plus', IconPlus],
                    ['search', IconSearch],
                    ['trash', IconTrash],
                    ['check-circle', IconCheckCircle],
                    ['alert-triangle', IconAlertTriangle],
                    ['image', IconImage],
                  ] as const
                ).map(([name, IconComponent]) => (
                  <View key={name} style={styles.iconCell}>
                    <IconComponent size="lg" testID={`icon-glyph-${name}`} />
                    <Text style={[styles.iconLabel, { fontFamily: regularFont }]}>{name}</Text>
                  </View>
                ))}
              </View>

              {/* Accesibilidad: decorativo por defecto. El primero se esconde del
                  árbol de accesibilidad porque el texto de al lado ya dice lo que
                  significa; el segundo es el único portador de la información, así
                  que se etiqueta. */}
              <View style={styles.row}>
                <IconCheckCircle color="success" testID="icon-decorative" />
                <Text style={[styles.iconLabel, { fontFamily: regularFont }]}>
                  Cuenta verificada — icono decorativo, oculto para el lector
                </Text>
                <IconCheckCircle
                  accessibilityLabel="Cuenta verificada"
                  color="success"
                  size="md"
                  testID="icon-labelled"
                />
              </View>
            </View>
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
    color: colors.slate900,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.slate700,
  },
  counter: {
    fontSize: typography.fontSizes.md,
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
  choiceBoxList: {
    gap: spacing.md,
  },
  choiceBoxTileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  choiceBoxTileCell: {
    width: '47%',
  },
  // Icons of different sizes sit on a shared bottom edge, so the six steps read
  // as one ascending scale instead of six centred dots.
  iconRow: {
    alignItems: 'flex-end',
    gap: spacing.lg,
  },
  iconCell: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconLabel: {
    fontSize: 12,
    color: colors.slate700,
  },
});

export default App;
