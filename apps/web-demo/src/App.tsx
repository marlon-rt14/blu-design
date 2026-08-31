import { BluProvider, Button, PasswordField } from "@dsm/web";
import type { TButtonAppearance, TButtonSize, TButtonVariant, TIconColor, TIconSize, TPasswordFieldSize, TPasswordFieldVisibility } from "@dsm/shared";
import { useState } from "react";

import { IconAlertTriangle, IconCheckCircle, IconImage, IconPlus, IconSearch, IconTrash } from "@dsm/web/icons";
import "./App.css";

const VARIANTS: TButtonVariant[] = ["primary", "danger"];
// `on-inverse` is left out: it only exists for `primary` and needs an inverted surface.
const APPEARANCES: Exclude<TButtonAppearance, "on-inverse">[] = ["fill", "soft", "outline", "ghost"];
const SIZES: TButtonSize[] = ["xs", "sm", "md", "lg"];
const FIELD_SIZES: TPasswordFieldSize[] = ["sm", "md", "lg"];

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

const App = () => {
  const [clicks, setClicks] = useState(0);
  const handleClick = () => setClicks((current) => current + 1);
  // One piece of state per field: the PasswordField is controlled, like any
  // input. The reveal toggle is *not* part of it — the component owns that.
  const [password, setPassword] = useState("MiClave2026");
  const [shortPassword, setShortPassword] = useState("123");
  const [visibility, setVisibility] = useState<TPasswordFieldVisibility>("visible");

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
          </section>
        ))}

        <section className="demo__section">
          <h2 className="demo__section-title">Icon</h2>
          <p className="demo__subtitle">El envoltorio por el que pasa todo icono del sistema. Los 31 glifos de bDS salen ya montados de <code>@dsm/web/icons</code>: <code>&lt;IconTrash size="lg" color="danger" /&gt;</code>. Cada uno es un <code>Icon</code> con sus paths adentro, así que fija la caja desde <code>size/icon/*</code> y resuelve el color del tema.</p>

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
            {([["plus", IconPlus], ["search", IconSearch], ["trash", IconTrash], ["check-circle", IconCheckCircle], ["alert-triangle", IconAlertTriangle], ["image", IconImage]] as const).map(([name, IconComponent]) => (
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
      </main>
    </BluProvider>
  );
};

export default App;
