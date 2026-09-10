import {
  Avatar,
  AvatarGroup,
  BluProvider,
  Button,
  Card,
  Checkbox,
  ChoiceBox,
  ChoiceItem,
  IconButton,
  LinkButton,
  ListItem,
  OTPField,
  Radio,
  RadioGroup,
  Tag,
  TagGroup,
  useFontFamily,
  useThemeMode,
} from '@dsm/mobile';
import { colors, readThemeToken, spacing, themeSources, typography } from '@dsm/shared';
import type {
  IAvatarGroupItem,
  ITagGroupItem,
  TAvatarTone,
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
  IconArrowUpRight,
  IconCheckCircle,
  IconChevronRight,
  IconImage,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@dsm/mobile/icons';

const METODOS = [
  { id: 'Débito', detalle: 'Se debita al instante', cuota: '$ 1.200' },
  { id: 'Crédito', detalle: 'Hasta 12 cuotas', cuota: '$ 1.450' },
  { id: 'Transferencia', detalle: 'Acreditación en 24 h', cuota: '$ 1.180' },
];

const VARIANTS: TButtonVariant[] = ['primary', 'danger'];
// `on-inverse` is left out: it only exists for `primary` and needs an inverted surface.
const APPEARANCES: Exclude<TButtonAppearance, 'on-inverse'>[] = [
  'fill',
  'soft',
  'outline',
  'ghost',
];
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

const AVATAR_TONES: TAvatarTone[] = [
  'brand',
  'sky',
  'teal',
  'green',
  'lime',
  'amber',
  'orange',
  'pink',
  'violet',
];

const TEAM: IAvatarGroupItem[] = [
  { initials: 'JG', tone: 'sky' },
  { initials: 'MP', tone: 'teal' },
  { initials: 'AL', tone: 'lime' },
  { initials: 'RS', tone: 'violet' },
  { initials: 'CV', tone: 'pink' },
];

const CITIES: ITagGroupItem[] = [
  { label: 'Quito' },
  { label: 'Manta' },
  { label: 'Cuenca' },
];
/**
 * Las tres apariencias que describen la superficie de abajo, cada una sobre la
 * suya.
 *
 * Componente aparte y no un bloque dentro de `App` porque necesita
 * `useThemeMode`, que es un hook de contexto: `App` monta el `BluProvider`, así
 * que el hook tiene que correr por debajo. (`useFontFamily` sí se puede llamar
 * arriba porque en esta plataforma es una función pura.)
 *
 * `on-scene` y `on-media` van con un color fijo — la escena de marca es oscura
 * en los seis modos y una foto no sigue al tema. `on-inverse` sí se da vuelta,
 * así que su fondo sale de `color/canvas/surface/inverse`. Con un navy a mano el
 * glifo quedaba casi invisible en oscuro; lo vi en el simulador.
 */
const FilasSobreSuperficie = ({ onPress }: { onPress: () => void }) => {
  const mode = useThemeMode();
  const inversa = readThemeToken(
    themeSources[mode].color,
    'color.color.canvas.surface.inverse',
  );
  const filas = [
    ['on-scene', '#364481'],
    ['on-media', '#6b7280'],
    ['on-inverse', inversa],
  ] as const;
  return (
    <>
      {filas.map(([appearance, fondo]) => (
        <View key={appearance} style={[styles.row, styles.onSurface, { backgroundColor: fondo }]}>
          {(['sm', 'md', 'lg'] as const).map(size => (
            <IconButton
              appearance={appearance}
              icon={IconTrash}
              key={size}
              label="Eliminar"
              onPress={onPress}
              size={size}
              testID={`ib-${appearance}-${size}`}
            />
          ))}
          <IconButton
            appearance={appearance}
            disabled
            icon={IconTrash}
            label="Eliminar"
            onPress={onPress}
            testID={`ib-${appearance}-disabled`}
          />
        </View>
      ))}
    </>
  );
};

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
  const [checked, setChecked] = useState(false);
  // Guarda el id de la opción elegida, que es lo que un grupo de radios necesita.
  const [metodo, setMetodo] = useState('Débito');
  const [code, setCode] = useState('');
  const [wrongCode, setWrongCode] = useState('1234');

  return (
    <BluProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.title, { fontFamily: semiboldFont }]}>
              @dsm/mobile · demo
            </Text>
            <Text style={[styles.subtitle, { fontFamily: regularFont }]}>
              El mismo Button del design system, consumido desde una app React
              Native. Resuelve tokens de bDS para el tema activo.
            </Text>

            <Text
              style={[styles.counter, { fontFamily: mediumFont }]}
              testID="press-counter"
            >
              Presses: {presses}
            </Text>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>
                RadioGroup · ChoiceItem
              </Text>
              {/* La combinación que muestra Figma: el grupo aporta la leyenda y
                  el helper, y cada fila es un ChoiceItem. El estado guarda *cuál*
                  está elegido, no un booleano por fila — un radio no alterna.

                  El divisor se apaga en la última fila: el grupo no puede
                  hacerlo por vos, porque quien arma el slot decide qué entra. */}
              <RadioGroup
                helperText="Se puede cambiar antes de confirmar"
                legend="Método de pago"
              >
                {METODOS.map((metodoOpcion, index) => (
                  <ChoiceItem
                    description={metodoOpcion.detalle}
                    isChecked={metodo === metodoOpcion.id}
                    key={metodoOpcion.id}
                    label={metodoOpcion.id}
                    onPress={() => setMetodo(metodoOpcion.id)}
                    showDescription
                    showDivider={index < METODOS.length - 1}
                    showTrailingText
                    testID={`choice-${metodoOpcion.id}`}
                    trailingText={metodoOpcion.cuota}
                  />
                ))}
              </RadioGroup>

              {/* El mismo grupo en error: solo se pinta el helper. NO tiñe las
                  filas — el grupo no promete nada sobre el contenido del slot. */}
              <RadioGroup
                helperText="Elegí un método para continuar"
                isInvalid
                legend="Con error"
              >
                <ChoiceItem label="Opción 1" />
                <ChoiceItem isChecked label="Opción 2" />
              </RadioGroup>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>
                Radio
              </Text>
              {/* El Radio suelto sigue existiendo como átomo, para cuando no
                  hace falta una fila entera. */}
              <View style={styles.row}>
                <Radio isChecked label="Radio suelto" />
                <Radio isDisabled label="Deshabilitado" />
                <Checkbox label="Checkbox" isChecked={checked} onValueChange={() => setChecked(prev => !prev)} />
                <LinkButton label="LinkButton" onPress={handlePress} />
                <Button label="Button" variant="primary" />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>
                IconButton
              </Text>
              {/* La misma acción que el Button pero sin etiqueta, así que
                  `label` es obligatoria: es el único nombre que va a tener el
                  control. Dice la acción, no el dibujo.

                  En xs, sm y md el control queda por debajo del mínimo tocable
                  de 48, así que el componente pone `hitSlop` — crece lo que
                  responde al dedo sin mover el dibujo. En web eso lo tiene que
                  poner quien lo aloja. */}
              {(['brand', 'neutral', 'ghost', 'veil'] as const).map(appearance => (
                <View key={appearance} style={styles.row}>
                  <Text style={[styles.subtitle, { fontFamily: regularFont }]}>
                    {appearance}
                  </Text>
                  {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
                    <IconButton
                      appearance={appearance}
                      icon={IconTrash}
                      key={size}
                      label="Eliminar"
                      onPress={handlePress}
                      size={size}
                      testID={`ib-${appearance}-${size}`}
                    />
                  ))}
                  <IconButton
                    appearance={appearance}
                    disabled
                    icon={IconTrash}
                    label="Eliminar"
                    onPress={handlePress}
                    testID={`ib-${appearance}-disabled`}
                  />
                </View>
              ))}
              {/* Las tres atadas a una superficie, cada una sobre la suya: sin
                  el fondo correcto no se ven o mienten. */}
              <FilasSobreSuperficie onPress={handlePress} />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>
                Card
              </Text>
              {/* Una superficie y nada más: fondo, radio y recorte. No es
                  interactiva y no lleva rol — si la tarjeta entera fuera un
                  destino, el rol y el foco los pondría un Pressable
                  envolviéndola.

                  En nativo son DOS View donde web usa una sola, y el motivo es
                  de la plataforma: en iOS una vista que a la vez proyecta
                  sombra y recorta a sus bordes pierde la sombra. La de afuera
                  pinta, la de adentro recorta.

                  Ojo con `raised`: el color del borde es transparente en los
                  dos temas, así que hoy es 1px invisible que solo ocupa lugar
                  — una raised mide 2px más que una flat. */}
              {(['flat', 'raised'] as const).map(elevation =>
                (['none', 'md'] as const).map(padding => (
                  <View key={`${elevation}-${padding}`} style={styles.cardCell}>
                    <Text style={[styles.subtitle, { fontFamily: regularFont }]}>
                      {elevation} · padding {padding}
                    </Text>
                    <Card
                      elevation={elevation}
                      padding={padding}
                      testID={`card-${elevation}-${padding}`}
                    >
                      {/* Sin radio propio: con padding none el recorte de la
                          tarjeta es lo único que le redondea las esquinas. */}
                      <View style={styles.cardFiller}>
                        <Text style={[styles.cardFillerText, { fontFamily: regularFont }]}>
                          {elevation} / {padding}
                        </Text>
                      </View>
                    </Card>
                  </View>
                )),
              )}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>
                OTPField
              </Text>
              {/* Las cajas son presentación: debajo hay UN TextInput, no seis.
                  Eso es lo que deja que iOS ofrezca el código sobre el teclado
                  y que Android lo autocomplete del SMS. Por eso tampoco hay
                  cursor — el anillo en la caja activa es el cursor.

                  Tocá cualquier caja: el foco va al input único, y el anillo
                  salta a la primera vacía mientras escribís. */}
              <Text style={[styles.counter, { fontFamily: mediumFont }]} testID="otp-value">
                Código: {code || '(vacío)'}
              </Text>
              <OTPField
                helperText="Reenviar código en 00:30"
                length={6}
                onValueChange={setCode}
                testID="otp-6"
                value={code}
              />
              <OTPField
                helperText="Cuatro dígitos"
                onValueChange={setCode}
                testID="otp-4"
                value={code}
              />
              {/* Error y foco son ejes independientes: este se puede enfocar y
                  sigue en rojo. El de abajo está deshabilitado, que gana sobre
                  todo y no deja rastro del error. */}
              <OTPField
                errorMessage="Código incorrecto"
                onValueChange={setWrongCode}
                testID="otp-error"
                value={wrongCode}
              />
              <OTPField
                errorMessage="Código incorrecto"
                isDisabled
                testID="otp-disabled"
                value={wrongCode}
              />
            </View>

            {VARIANTS.map(variant => (
              <View key={variant} style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { fontFamily: regularFont }]}
                >
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
                {/* Slots de icono. El tamano del icono no es el del control: xs y
                    sm usan 16, md y lg usan 24. En RN no hay currentColor, asi que
                    el Button pasa el color de la etiqueta por tintColor. */}
                <View style={styles.row}>
                  {SIZES.map(size => (
                    <Button
                      key={size}
                      label={size}
                      leadingIcon={IconPlus}
                      onPress={handlePress}
                      size={size}
                      testID={`button-${variant}-icon-${size}`}
                      trailingIcon={IconChevronRight}
                      variant={variant}
                    />
                  ))}
                  <Button
                    label="Salir"
                    onPress={handlePress}
                    testID={`button-${variant}-trailing`}
                    trailingIcon={IconArrowUpRight}
                    variant={variant}
                  />
                  <Button
                    isDisabled
                    label="disabled"
                    leadingIcon={IconTrash}
                    onPress={handlePress}
                    testID={`button-${variant}-icon-disabled`}
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
                  isChecked={selectedChoice === 'monthly'}
                  onValueChange={() => setSelectedChoice('monthly')}
                  showDescription
                  testID="choicebox-monthly"
                  title="Plan mensual"
                />
                <ChoiceBox
                  description="Ahorra un 20% con el pago anual."
                  icon="image"
                  isChecked={selectedChoice === 'annual'}
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
                    isChecked={selectedTile === 'sms'}
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
                    isChecked={selectedTile === 'email'}
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
                    isChecked={selectedCompact === installments}
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
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>AVATAR</Text>
              <View style={styles.row}>
                <Avatar initials="JG" testID="avatar-initials" />
                <Avatar icon="user" testID="avatar-icon" type="icon" />
                <Avatar imageUrl="https://i.pravatar.cc/160" testID="avatar-image" type="image" />
                <Avatar imageUrl="https://i.pravatar.cc/160" testID="avatar-logo" type="logo" />
              </View>

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                AVATAR · TONE
              </Text>
              <View style={styles.row}>
                {AVATAR_TONES.map(tone => (
                  <Avatar initials="JG" key={tone} testID={`avatar-tone-${tone}`} tone={tone} />
                ))}
              </View>

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                AVATAR · SIZE / RING / INDICATOR
              </Text>
              <View style={styles.row}>
                <Avatar initials="JG" size="xs" testID="avatar-size-xs" />
                <Avatar initials="JG" size="sm" testID="avatar-size-sm" />
                <Avatar initials="JG" size="md" testID="avatar-size-md" />
                <Avatar initials="JG" size="lg" testID="avatar-size-lg" />
                <Avatar initials="JG" showRing testID="avatar-ring" />
                <Avatar initials="JG" showIndicator status="online" testID="avatar-indicator-online" />
                <Avatar initials="JG" showIndicator status="busy" testID="avatar-indicator-busy" />
              </View>

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                AVATARGROUP
              </Text>
              <AvatarGroup avatars={TEAM} overflowLabel="+4" showOverflow testID="avatar-group" />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>LISTITEM · LEADING</Text>
              <ListItem label="Sin leading" testID="listitem-none" />
              <ListItem icon="user" label="Con icono" leadingContent="icon" testID="listitem-icon" />
              <ListItem avatarInitials="JG" label="Con avatar" leadingContent="avatar" testID="listitem-avatar" />

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                LISTITEM · SIZE
              </Text>
              <ListItem avatarInitials="JG" label="Tamaño sm" leadingContent="avatar" size="sm" testID="listitem-size-sm" />
              <ListItem avatarInitials="JG" label="Tamaño md" leadingContent="avatar" size="md" testID="listitem-size-md" />

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                LISTITEM · CONTENIDO
              </Text>
              <ListItem
                avatarInitials="JG"
                description="Hoy, 14:32"
                label="Envío a Juan García"
                leadingContent="avatar"
                showDescription
                showDivider
                showTrailingText
                testID="listitem-content-1"
                trailingText="$1.250,00"
              />
              <ListItem
                avatarInitials="MP"
                description="Ayer, 09:10"
                label="Pago de servicios"
                leadingContent="avatar"
                showDescription
                showTrailingText
                testID="listitem-content-2"
                trailingText="$430,00"
              />

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                LISTITEM · INTERACTIVO / TRAILING / DISABLED
              </Text>
              <ListItem
                icon="user"
                label="Ver todos los contactos"
                leadingContent="icon"
                onPress={handlePress}
                showTrailing
                testID="listitem-interactive"
                trailing={<IconChevronRight color="secondary" size="sm" />}
              />
              <ListItem
                avatarInitials="RS"
                isDisabled
                label="Cuenta suspendida"
                leadingContent="avatar"
                testID="listitem-disabled"
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>TAG · APPEARANCE</Text>
              <View style={styles.row}>
                <Tag appearance="fill" label="Aprobado" palette="success" testID="tag-fill-success" />
                <Tag appearance="soft" label="Pendiente" palette="warning" testID="tag-soft-warning" />
                <Tag appearance="outline" label="Rechazado" palette="danger" testID="tag-outline-danger" />
              </View>

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                TAG · SIZE / ICON / REMOVE
              </Text>
              <View style={styles.row}>
                <Tag label="Tamaño sm" size="sm" testID="tag-size-sm" />
                <Tag label="Tamaño xs" size="xs" testID="tag-size-xs" />
                <Tag icon="check-circle" label="Verificado" palette="success" showLeadingIcon testID="tag-icon" />
                <Tag
                  appearance="outline"
                  label="Chip removible"
                  onRemove={handlePress}
                  showRemove
                  testID="tag-remove"
                />
              </View>

              <Text style={[styles.sectionTitle, { fontFamily: regularFont, marginTop: spacing.md }]}>
                TAGGROUP
              </Text>
              <TagGroup overflowLabel="+2" showOverflow tags={CITIES} testID="tag-group" />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontFamily: regularFont }]}>
                ICON
              </Text>
              <Text style={[styles.subtitle, { fontFamily: regularFont }]}>
                Los 31 glifos de bDS salen ya montados de @dsm/mobile/icons:
                &lt;IconTrash size="lg" color="danger" /&gt;. Cada uno es un
                Icon con sus paths adentro, asi que fija la caja desde
                size/icon/* y resuelve el color del tema.
              </Text>

              <IconImage size="lg" />

              {/* Los 6 pasos. El label es el valor que resuelve el token, no un
                  width escrito a mano. */}
              <View style={[styles.row, styles.iconRow]}>
                {ICON_SIZES.map(([size, px]) => (
                  <View key={size} style={styles.iconCell}>
                    <IconImage size={size} testID={`icon-size-${size}`} />
                    <Text
                      style={[styles.iconLabel, { fontFamily: regularFont }]}
                    >
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
                    <Text
                      style={[styles.iconLabel, { fontFamily: regularFont }]}
                    >
                      {tint}
                    </Text>
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
                    <Text
                      style={[styles.iconLabel, { fontFamily: regularFont }]}
                    >
                      {color}
                    </Text>
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
                    <Text
                      style={[styles.iconLabel, { fontFamily: regularFont }]}
                    >
                      {name}
                    </Text>
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
  // La sombra de una Card raised se sale de sus bordes, asi que la celda
  // reserva aire abajo para que no la tape la siguiente.
  cardCell: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  // Los on-* necesitan su propia superficie debajo para leerse.
  onSurface: {
    borderRadius: 8,
    padding: spacing.md,
  },
  cardFiller: {
    height: 72,
    justifyContent: 'center',
    paddingLeft: spacing.md,
    backgroundColor: colors.slate200,
  },
  cardFillerText: {
    fontSize: typography.fontSizes.sm,
    color: colors.slate900,
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
