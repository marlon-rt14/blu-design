import { BluProvider, Button, PasswordField } from "@dsm/web";
import type { TButtonAppearance, TButtonSize, TButtonVariant, TPasswordFieldSize, TPasswordFieldVisibility } from "@dsm/shared";
import { useState } from "react";

import "./App.css";

const VARIANTS: TButtonVariant[] = ["primary", "danger"];
// `on-inverse` is left out: it only exists for `primary` and needs an inverted surface.
const APPEARANCES: Exclude<TButtonAppearance, "on-inverse">[] = ["fill", "soft", "outline", "ghost"];
const SIZES: TButtonSize[] = ["xs", "sm", "md", "lg"];
const FIELD_SIZES: TPasswordFieldSize[] = ["sm", "md", "lg"];

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
