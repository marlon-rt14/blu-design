import { BluProvider, Button, Card, CardField, Checkbox, ChoiceItem, Divider, IconButton, LinkButton, OTPField, PasswordField, PhoneField, Radio, RadioGroup, Tooltip, useThemeMode } from "@dsm/web";
import { readThemeToken, themeSources } from "@dsm/shared";
import type { TButtonAppearance, TButtonSize, TButtonVariant, TIconColor, TIconSize, TPasswordFieldSize, TPasswordFieldVisibility } from "@dsm/shared";
import { useState } from "react";

import { IconAlertTriangle, IconArrowUpRight, IconCheckCircle, IconChevronRight, IconImage, IconPlus, IconSearch, IconTrash } from "@dsm/web/icons";
import "./App.css";

// Un numero real por marca, para que el selector cambie EL NUMERO y no la
// prop `brand`: la marca se deduce del numero, nunca la elige quien llama.
// La ultima es JCB, una red que bDS no declara: no muestra placa, que es la
// respuesta neutra. Reconocer no es aceptar — si el producto toma esa tarjeta
// es regla de pago y vive en la validacion.
const TARJETAS: [string, string][] = [
  ["Visa", "4539 1488 0343 6467"],
  ["Mastercard", "5425 2334 3010 9903"],
  ["Discover", "6011 0009 9013 9424"],
  ["Diners", "3056 9309 0259 04"],
  ["Amex", "3400 0000 0000 009"],
  ["JCB (fuera del catalogo)", "3530 1113 3330 0000"],
];

const VARIANTS: TButtonVariant[] = ["primary", "danger"];
// `on-inverse` is left out: it only exists for `primary` and needs an inverted surface.
const APPEARANCES: Exclude<TButtonAppearance, "on-inverse">[] = ["fill", "soft", "outline", "ghost"];
const SIZES: TButtonSize[] = ["xs", "sm", "md", "lg"];
const FIELD_SIZES: TPasswordFieldSize[] = ["sm", "md", "lg"];
const METODOS = [
  { id: "Débito", detalle: "Se debita al instante", cuota: "$ 1.200" },
  { id: "Crédito", detalle: "Hasta 12 cuotas", cuota: "$ 1.450" },
  { id: "Transferencia", detalle: "Acreditación en 24 h", cuota: "$ 1.180" },
];

// The six steps of `size/icon/*`, with the px each one resolves to — the point
// of the row is that the number is a token, never a hand-set width.
const ICON_SIZES: [TIconSize, number][] = [
  ["2xs", 8],
  ["xs", 12],
  ["sm", 16],
  ["md", 24],
  ["lg", 32],
  ["xl", 40],
];
// A slice of the 33 roles in `color/icon/*` — the ones that read on the page's
// own surface. The `on-inverse.*`, `on-scene.*` and `action.*` families are left
// out because they only make sense on a surface this demo does not have.
const ICON_COLORS: TIconColor[] = ["primary", "secondary", "tertiary", "disabled", "brand", "danger", "success", "info", "warning"];

/**
 * Las tres apariencias que describen la superficie de abajo, cada una sobre la
 * suya.
 *
 * Es un componente aparte y no un bloque dentro de `App` porque necesita
 * `useThemeMode`, y `App` es quien monta el `BluProvider`: el hook tiene que
 * correr por debajo.
 *
 * `on-scene` y `on-media` van con un color fijo — la escena de marca es oscura
 * en los seis modos y una foto no sigue al tema. `on-inverse` sí se da vuelta,
 * así que su fondo sale de `color/canvas/surface/inverse`. Con un navy a mano
 * el glifo quedaba casi invisible en oscuro.
 */
const FilasSobreSuperficie = ({ onPress }: { onPress: () => void }) => {
  const mode = useThemeMode();
  const inversa = readThemeToken(themeSources[mode].color, "color.color.canvas.surface.inverse");
  const filas = [
    ["on-scene", "#364481"],
    ["on-media", "#6b7280"],
    ["on-inverse", inversa],
  ] as const;
  return (
    <div className="demo__row">
      {filas.map(([appearance, fondo]) => (
        <div key={appearance} style={{ alignItems: "center", background: fondo, borderRadius: 8, display: "flex", gap: 12, padding: 12 }}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <IconButton appearance={appearance} icon={IconTrash} key={size} label="Eliminar" onPress={onPress} size={size} testID={`ib-${appearance}-${size}`} />
          ))}
          <IconButton appearance={appearance} disabled icon={IconTrash} label="Eliminar" onPress={() => {}} testID={`ib-${appearance}-disabled`} />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [clicks, setClicks] = useState(0);
  const handleClick = () => setClicks((current) => current + 1);
  // One piece of state per field: the PasswordField is controlled, like any
  // input. The reveal toggle is *not* part of it — the component owns that.
  const [password, setPassword] = useState("MiClave2026");
  // Los tres campos de la tarjeta viven por separado: en codigo son tres
  // campos, con su mascara y su teclado. El agrupado de a 4 lo pondria un
  // formateador — aca el valor arranca ya agrupado a proposito.
  const [cardNumber, setCardNumber] = useState("3056 9309 0259 04");
  const [cardExpiry, setCardExpiry] = useState("12/34");
  const [cardCvv, setCardCvv] = useState("123");
  const [phone, setPhone] = useState("99 123 4567");
  const [shortPassword, setShortPassword] = useState("123");
  const [visibility, setVisibility] = useState<TPasswordFieldVisibility>("visible");
  // Guarda el id de la opción elegida, que es lo que un grupo de radios necesita.
  const [metodo, setMetodo] = useState("Débito");
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [wrongCode, setWrongCode] = useState("1234");

  return (
    // BluProvider is what actually loads Mulish (see @dsm/web's theme/font.ts) —
    // importing the package alone no longer pulls fonts in, on purpose.
    <BluProvider style={{ minHeight: "100vh" }}>
      <main className="demo">
        <h1 className="demo__title">@dsm/web · demo</h1>
        <p className="demo__subtitle">Componentes del design system consumidos desde una app Vite. Resuelven tokens de bDS para el tema activo — cambia la apariencia del sistema y se repinta.</p>

        <p className="demo__counter">
          Clicks: <strong data-testid="click-counter">{clicks}</strong>
        </p>

        <section className="demo__section">
          <h2 className="demo__section-title">RadioGroup · ChoiceItem</h2>
          <p className="demo__counter">
            Método: <strong data-testid="metodo">{metodo}</strong>
          </p>
          {/* La combinación que muestra Figma: el grupo es el fieldset con su
              legend, y las filas son ChoiceItem. La fila entera es el target, y
              su sangrado lateral es el mismo que el de la leyenda — por eso el
              control y el título arrancan en la misma columna.

              El divisor se apaga en la última fila: el grupo no puede hacerlo
              por vos, porque lo que entra por el slot lo controla quien lo arma. */}
          <div style={{ maxWidth: 360 }}>
            <RadioGroup helperText="Se puede cambiar antes de confirmar" legend="Método de pago">
              {METODOS.map((metodoOpcion, index) => (
                <ChoiceItem
                  description={metodoOpcion.detalle}
                  isChecked={metodo === metodoOpcion.id}
                  key={metodoOpcion.id}
                  label={metodoOpcion.id}
                  name="metodo"
                  onChange={() => setMetodo(metodoOpcion.id)}
                  showDescription
                  showDivider={index < METODOS.length - 1}
                  showTrailingText
                  testID={`choice-${metodoOpcion.id}`}
                  trailingText={metodoOpcion.cuota}
                  value={metodoOpcion.id}
                />
              ))}
            </RadioGroup>
          </div>
          {/* El mismo grupo en error: solo se pinta el helper. NO tiñe las filas
              — el grupo no promete nada sobre lo que hay dentro del slot. */}
          <div style={{ maxWidth: 360 }}>
            <RadioGroup helperText="Elegí un método para continuar" isInvalid legend="Con error" size="md">
              <ChoiceItem label="Opción 1" name="err" size="md" />
              <ChoiceItem isChecked label="Opción 2" name="err" size="md" />
            </RadioGroup>
          </div>
          {/* El Radio suelto sigue existiendo como átomo, para cuando no hace
              falta una fila entera. */}
          <div className="demo__row">
            <Radio isChecked label="Radio suelto" name="atomo" />
            <Radio isDisabled label="Deshabilitado" name="atomo-2" />
            <Radio isChecked isDisabled label="Deshabilitado y marcado — sin punto, fiel a Figma" name="atomo-3" />
          </div>
          <div className="demo__row">
            <Checkbox isChecked={checked} label="Checkbox — este sí alterna" onChange={() => setChecked((prev) => !prev)} />
            <LinkButton label="LinkButton" />
            <Button label="Button" variant="primary" />
          </div>
        </section>

        {VARIANTS.map((variant) => (
          <section className="demo__section" key={variant}>
            <h2 className="demo__section-title">{variant}</h2>
            <div className="demo__row">
              {APPEARANCES.map((appearance) => (
                <Button appearance={appearance} key={appearance} label={appearance} onClick={handleClick} testID={`button-${variant}-${appearance}`} variant={variant} />
              ))}
            </div>
            <div className="demo__row">
              {SIZES.map((size) => (
                <Button key={size} label={size} onClick={handleClick} size={size} testID={`button-${variant}-${size}`} variant={variant} />
              ))}
              <Button isDisabled label="disabled" onClick={handleClick} testID={`button-${variant}-disabled`} variant={variant} />
            </div>
            {/* Los slots de icono. El tamaño del icono no es el del control: xs y sm
                usan 16, md y lg usan 24. El color no se configura — el <button> ya
                pone `color` para su etiqueta y el icono resuelve a currentColor. */}
            <div className="demo__row">
              {SIZES.map((size) => (
                <Button key={size} label={size} leadingIcon={IconPlus} onClick={handleClick} size={size} testID={`button-${variant}-icon-${size}`} trailingIcon={IconChevronRight} variant={variant} />
              ))}
              <Button label="Salir" onClick={handleClick} testID={`button-${variant}-trailing`} trailingIcon={IconArrowUpRight} variant={variant} />
              <Button isDisabled label="disabled" leadingIcon={IconTrash} onClick={handleClick} testID={`button-${variant}-icon-disabled`} variant={variant} />
            </div>
          </section>
        ))}

        <section className="demo__section">
          <h2 className="demo__section-title">Icon</h2>
          <p className="demo__subtitle">
            El envoltorio por el que pasa todo icono del sistema. Los 31 glifos de bDS salen ya montados de <code>@dsm/web/icons</code>: <code>&lt;IconTrash size="lg" color="danger" /&gt;</code>. Cada uno es un <code>Icon</code> con sus paths adentro, así que fija la caja desde <code>size/icon/*</code> y resuelve el color del tema.
          </p>

          {/* Los 6 pasos. El label es el valor que resuelve el token, no un width escrito a mano. */}
          <div className="demo__row" style={{ alignItems: "flex-end", gap: 24 }}>
            {ICON_SIZES.map(([size, px]) => (
              <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <IconImage size={size} testID={`icon-size-${size}`} />
                <span style={{ fontSize: 12, opacity: 0.65 }}>
                  {size} · {px}px
                </span>
              </div>
            ))}
          </div>

          {/* Herencia: ningún Icon de aquí recibe `color`. Con la prop sin poner, el
              glifo resuelve a `currentColor`, así que toma el color del contenedor —
              que es exactamente lo que hace el componente de Figma, que no tiene eje
              de color. Es lo que hará que un icono dentro de un Button tome el color
              del label sin configurar nada. */}
          <div className="demo__row" style={{ gap: 24 }}>
            {["#174183", "#b22c42", "#008557"].map((color) => (
              <span key={color} style={{ color, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <IconPlus size="md" />
                hereda {color}
                <IconTrash size="md" />
              </span>
            ))}
          </div>

          {/* Roles semánticos: para un icono suelto que carga un significado propio.
              A diferencia del hex de arriba, un rol sigue al tema. */}
          <div className="demo__row" style={{ gap: 24 }}>
            {ICON_COLORS.map((color) => (
              <div key={color} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <IconAlertTriangle color={color} size="lg" testID={`icon-color-${color}`} />
                <span style={{ fontSize: 12, opacity: 0.65 }}>{color}</span>
              </div>
            ))}
          </div>

          {/* Un puñado del set, para ver que son glifos distintos y no el mismo repetido. */}
          <div className="demo__row" style={{ gap: 24 }}>
            {(
              [
                ["plus", IconPlus],
                ["search", IconSearch],
                ["trash", IconTrash],
                ["check-circle", IconCheckCircle],
                ["alert-triangle", IconAlertTriangle],
                ["image", IconImage],
              ] as const
            ).map(([name, IconComponent]) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <IconComponent size="lg" testID={`icon-glyph-${name}`} />
                <span style={{ fontSize: 12, opacity: 0.65 }}>{name}</span>
              </div>
            ))}
          </div>

          {/* Accesibilidad: decorativo por defecto. El primero se esconde del árbol
              de accesibilidad porque el texto de al lado ya dice lo que significa;
              el segundo es el único portador de la información, así que se etiqueta. */}
          <div className="demo__row" style={{ gap: 24 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <IconCheckCircle color="success" testID="icon-decorative" />
              Cuenta verificada — icono decorativo, aria-hidden
            </span>
            <IconCheckCircle accessibilityLabel="Cuenta verificada" color="success" size="md" testID="icon-labelled" />
          </div>
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">PasswordField</h2>
          <div className="demo__row">
            <PasswordField
              label="Controlada por el padre"
              onChange={(event) => setPassword(event.target.value)}
              // Passing the handler is what makes it controlled: the reveal
              // action now reports the next value instead of changing itself,
              // so `visibility` stays the single source of truth.
              onVisibilityChange={setVisibility}
              testID="password-controlled"
              visibility={visibility}
              value={password}
            />
            <Button label={`Visibility toggle (${visibility})`} onClick={() => setVisibility((current) => (current === "visible" ? "hidden" : "visible"))} />
            {FIELD_SIZES.map((size) => (
              <div key={size} style={{ width: 280 }}>
                <PasswordField label={`Contraseña (${size})`} onChange={(event) => setPassword(event.target.value)} size={size} testID={`password-${size}`} value={password} />
              </div>
            ))}
          </div>
          <div className="demo__row">
            <div style={{ width: 280 }}>
              <PasswordField errorMessage="Mínimo 8 caracteres" label="Contraseña corta" onChange={(event) => setShortPassword(event.target.value)} showHelper testID="password-error" value={shortPassword} />
            </div>
            <div style={{ width: 280 }}>
              <PasswordField
                helperText="Se guarda cifrada"
                label="Nueva contraseña"
                onChange={(event) => setPassword(event.target.value)}
                showHelper
                testID="password-new"
                value={password}
                // On a sign-up or change-password form this tells the password
                // manager to offer a generated one instead of an existing one.
                autoComplete="new-password"
              />
            </div>
            <div style={{ width: 280 }}>
              <PasswordField isDisabled label="Deshabilitada" testID="password-disabled" value={password} />
            </div>
          </div>
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">OTPField</h2>
          {/* Las cajas son presentación: debajo hay UN input, no seis. Eso es lo
              que deja que el sistema operativo pegue el código completo del SMS
              y que se pueda pegar a mano desde mensajes. Por eso tampoco hay
              cursor — el anillo en la caja activa es el cursor.

              Fijate que el anillo salta a la primera caja vacía a medida que
              escribís, y que las letras se caen solas. */}
          <p className="demo__counter">
            Código: <strong data-testid="otp-value">{code || "(vacío)"}</strong>
          </p>
          <div className="demo__row">
            <OTPField
              helperText="Reenviar código en 00:30"
              onValueChange={setCode}
              testID="otp-6"
              length={6}
              value={code}
            />
          </div>
          <div className="demo__row">
            <OTPField
              helperText="Cuatro dígitos"
              onValueChange={setCode}
              testID="otp-4"
              value={code}
            />
            {/* Error y foco son ejes independientes: este se puede enfocar y
                sigue en rojo. El disabled de al lado, en cambio, gana sobre
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
          </div>
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">Card</h2>
          {/* Una superficie y nada más: fondo, radio y recorte. No es
              interactiva y no lleva rol — si la tarjeta entera fuera un
              destino, el rol y el foco los pondría un enlace o un botón
              envolviéndola.

              Ojo con lo que hace `raised` en los dos temas que exportamos:
              Figma bindea borde Y sombra, pero el color del borde es
              transparente acá, así que hoy es 1px invisible que solo ocupa
              lugar. Una tarjeta raised mide 2px más que una flat con el mismo
              contenido. El borde aparece solo el día que llegue un tema de
              alto contraste.

              De paso: estos cards de la demo (.demo__section) son CSS a mano y
              siguen blancos en dark. Este componente es justamente lo que
              deberían usar. */}
          <div className="demo__row">
            {(["flat", "raised"] as const).map((elevation) =>
              (["none", "md"] as const).map((padding) => (
                <div key={`${elevation}-${padding}`} style={{ width: 220 }}>
                  <p className="demo__counter">{elevation} · padding {padding}</p>
                  <Card elevation={elevation} padding={padding} testID={`card-${elevation}-${padding}`}>
                    {/* Sin radio propio: con padding none el recorte de la
                        tarjeta es lo único que le redondea las esquinas. */}
                    <div style={{ alignItems: "center", background: "#e5e8f1", color: "#232b3d", display: "flex", fontSize: 13, height: 72, paddingLeft: 12 }}>
                      {elevation} / {padding}
                    </div>
                  </Card>
                </div>
              )),
            )}
          </div>
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">CardField</h2>
          {/* Los tres campos de una tarjeta. `part` decide cuál, y con eso el
              teclado, el largo aceptado, el token de autocompletado y si los
              caracteres se enmascaran. Todo lo demás lo comparten, que es por
              qué es un componente y no tres.

              La MARCA SE DETECTA, no se elige: escribí un número y el logo
              aparece solo. 4539… Visa, 5425… Mastercard, 6011… Discover,
              3056… Diners. Las cuatro traen su arte real y LA PLACA VIENE CON
              LA MARCA: azul en Visa, azul marino en Mastercard y Discover,
              blanca en Diners. Solo Diners no pinta fondo, porque la placa del
              campo ya es de ese color.

              El componente NO FORMATEA: el agrupado de a 4 lo pone un
              formateador de afuera.

              El CVV va enmascarado y SIN autocompletado en las dos
              plataformas: pedir el token del código de seguridad es justo lo
              que invita al navegador a guardarlo. */}
          {/* El selector cambia el NUMERO, no la marca: asi se ve lo que el
              componente hace de verdad, que es deducirla de los digitos. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {TARJETAS.map(([nombre, numero]) => (
              <Button
                appearance={cardNumber === numero ? "fill" : "outline"}
                key={nombre}
                label={nombre}
                onClick={() => setCardNumber(numero)}
                size="xs"
                testID={`cardfield-marca-${nombre.toLowerCase()}`}
                variant="primary"
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
            <CardField
              label="Numero de tarjeta"
              onChangeText={setCardNumber}
              part="number"
              testID="cardfield-number"
              value={cardNumber}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <CardField
                  label="Vencimiento"
                  onChangeText={setCardExpiry}
                  part="expiry"
                  testID="cardfield-expiry"
                  value={cardExpiry}
                />
              </div>
              <div style={{ flex: 1 }}>
                <CardField
                  label="CVV"
                  onChangeText={setCardCvv}
                  part="cvv"
                  testID="cardfield-cvv"
                  value={cardCvv}
                />
              </div>
            </div>
            <CardField
              error="El numero esta incompleto"
              label="Numero de tarjeta"
              onChangeText={() => {}}
              part="number"
              testID="cardfield-error"
              value="4539 14"
            />
          </div>
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">PhoneField</h2>
          {/* EL SELECTOR ES UN EJE, no un dado: `leadingContent` es `select` o
              `none`, y la mitad del set de Figma —72 de 144 variantes— es
              `none`.

              - select: trae el bloque de la izquierda, bandera + codigo +
                chevron, con su propia area tocable de 48.
              - none: "no trae nada a la izquierda. El campo queda limpio, como
                un input de texto, y el valor arranca en el borde. Para cuando
                el pais es fijo y ya se sabe cual, o cuando el codigo se pide en
                otra parte del formulario."

              Y SIN SELECTOR SIGUE SIENDO UN PhoneField, no un TextField:
              conserva el teclado de telefono, la pista de autocompletado y la
              validacion. Lo que lo define es el dato, no el prefijo. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
            <PhoneField
              helperText="leadingContent=select — bandera, codigo, chevron y separador"
              label="Numero de celular"
              onChangeText={setPhone}
              testID="phonefield-select"
              value={phone}
            />
            <PhoneField
              helperText="leadingContent=none — el valor arranca en el borde"
              label="Numero de celular"
              leadingContent="none"
              onChangeText={setPhone}
              testID="phonefield-none"
              value={phone}
            />
            {/* El helper y el error no dependen del prefijo. */}
            <PhoneField
              error="El numero esta incompleto"
              label="Numero de celular"
              leadingContent="none"
              onChangeText={() => {}}
              testID="phonefield-none-error"
              value="99 12"
            />
          </div>
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">Divider</h2>
          {/* Una línea decorativa y nada más: dos props, sin children, sin
              texto y sin estados. Es a propósito — "es decorativo: no se toca,
              no recibe foco y no cambia con la interacción".

              NO es un borde. `component/divider/line/*` da ~1.5 de contraste
              adrede; para delimitar un campo el token es
              `color/border/input/*`, que va de 3.79 a 8.81.

              El grosor sale de `border/width/divider`: 1 en light y dark, 2 en
              los dos modos de alto contraste. Cambiá el tema del SO y la línea
              engorda sola — escribir el 1 a mano es lo que rompe esos modos.

              Siempre va oculto al lector de pantalla, en las dos plataformas.
              React Native no tiene rol de separador, así que el caso semántico
              sería una conducta solo-web. Y bDS ya resuelve ese caso:
              "agrupar no es nombrar, un divisor no reemplaza a un encabezado". */}
          {/* Apiladas y no en fila: una línea horizontal ocupa todo el ancho
              que le dan, así que tres en la misma fila se pisarían. */}
          {(["subtle", "default", "strong"] as const).map((appearance) => (
            <div key={appearance} style={{ marginBottom: 20 }}>
              <p className="demo__counter">horizontal · {appearance}</p>
              <Divider appearance={appearance} testID={`divider-${appearance}`} />
            </div>
          ))}
          {/* La vertical no lleva alto propio: se estira a la fila. Acá la fila
              no tiene alto declarado y la línea igual se ve, porque el hook usa
              `alignSelf: stretch` y no `height: 100%` — un alto definido saca
              al item del estirado y el porcentaje contra un padre indefinido
              resuelve a `auto`, o sea cero. */}
          <p className="demo__counter">vertical, en una fila sin alto propio</p>
          <div style={{ alignItems: "center", display: "flex", fontSize: 14, gap: 16 }}>
            <span>Débito</span>
            <Divider orientation="vertical" testID="divider-inline-1" />
            <span>Crédito</span>
            <Divider orientation="vertical" testID="divider-inline-2" />
            <span>Transferencia</span>
          </div>
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">IconButton</h2>
          {/* La misma acción que el Button pero sin etiqueta. Por eso `label`
              es obligatoria: es el único nombre que va a tener el control, y
              dice la acción y no el dibujo — "Eliminar", no "tacho".

              Las siete apariencias se parten en dos: brand, neutral, ghost y
              veil describen una FORMA; on-scene, on-media y on-inverse
              describen la SUPERFICIE de abajo, así que sin el fondo correcto
              no se ven o mienten. Por eso cada fila trae el suyo. */}
          <div className="demo__row">
            {(["brand", "neutral", "ghost", "veil"] as const).map((appearance) => (
              <div key={appearance} style={{ alignItems: "center", display: "flex", gap: 12 }}>
                <span className="demo__counter">{appearance}</span>
                {(["xs", "sm", "md", "lg"] as const).map((size) => (
                  <IconButton appearance={appearance} icon={IconTrash} key={size} label="Eliminar" onPress={() => setClicks((n) => n + 1)} size={size} testID={`ib-${appearance}-${size}`} />
                ))}
                <IconButton appearance={appearance} disabled icon={IconTrash} label="Eliminar" onPress={() => {}} testID={`ib-${appearance}-disabled`} />
              </div>
            ))}
          </div>
          {/* Las tres atadas a una superficie, cada una sobre la suya. */}
          <FilasSobreSuperficie onPress={() => setClicks((n) => n + 1)} />
        </section>

        <section className="demo__section">
          <h2 className="demo__section-title">Tooltip</h2>
          {/* El Tooltip ENVUELVE a su disparador: `children` es la cosa que se
              explica, y el panel se ancla a ella. En web se abre apuntando o
              enfocando; en móvil, manteniendo presionado, porque el tap le
              pertenece al control de adentro.

              `placement` es una preferencia, no una orden: si no hay lugar de
              ese lado, el motor lo voltea. Achicá la ventana y miralo.

              Tres cosas vienen de WCAG 1.4.13 y no son configurables: Esc lo
              cierra, meter el puntero DENTRO del panel no lo cierra —si no, el
              link de adentro sería inalcanzable— y nunca se va por tiempo. */}
          <div className="demo__row" style={{ alignItems: "center", gap: 32, minHeight: 120 }}>
            <Tooltip body="Se envía a tu correo apenas confirmes." testID="tt-desc">
              <Button label="Descriptive" variant="primary" />
            </Tooltip>
            {/* `info` se queda hasta que lo cierren, y por eso es el único que
                tiene título y equis. La presencia del valor sustituye al
                booleano: no hay showTitle ni showLink ni showDismiss. */}
            <Tooltip
              body="Tu sesión se cierra a los 15 minutos sin actividad."
              link={{ label: "Cambiar", onPress: () => setClicks((n) => n + 1) }}
              onDismiss={() => setClicks((n) => n + 1)}
              testID="tt-info"
              title="Sesión"
              type="info"
            >
              <Button label="Info" variant="primary" />
            </Tooltip>
            <Tooltip body="Sin punta: señala una zona y no un punto." placement="none" testID="tt-none">
              <Button appearance="outline" label="placement none" />
            </Tooltip>
          </div>
        </section>
      </main>
    </BluProvider>
  );
};

export default App;
