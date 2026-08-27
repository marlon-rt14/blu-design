import { BluProvider, Button } from '@dsm/web'
import type { TButtonAppearance, TButtonSize, TButtonVariant } from '@dsm/shared'
import { useState } from 'react'

import './App.css'

const VARIANTS: TButtonVariant[] = ['primary', 'danger']
// `on-inverse` is left out: it only exists for `primary` and needs an inverted surface.
const APPEARANCES: Exclude<TButtonAppearance, 'on-inverse'>[] = ['fill', 'soft', 'outline', 'ghost']
const SIZES: TButtonSize[] = ['xs', 'sm', 'md', 'lg']

const App = () => {
  const [clicks, setClicks] = useState(0)
  const handleClick = () => setClicks((current) => current + 1)

  return (
    // BluProvider is what actually loads Mulish (see @dsm/web's theme/font.ts) —
    // importing the package alone no longer pulls fonts in, on purpose.
    <BluProvider style={{ minHeight: '100vh' }}>
      <main className="demo">
        <h1 className="demo__title">@dsm/web · demo</h1>
        <p className="demo__subtitle">
          El mismo Button del design system, consumido desde una app Vite. Resuelve tokens de bDS
          para el tema activo — cambia la apariencia del sistema y se repinta.
        </p>

        <p className="demo__counter">
          Clicks: <strong data-testid="click-counter">{clicks}</strong>
        </p>

        {VARIANTS.map((variant) => (
          <section className="demo__section" key={variant}>
            <h2 className="demo__section-title">{variant}</h2>
            <div className="demo__row">
              {APPEARANCES.map((appearance) => (
                <Button
                  appearance={appearance}
                  key={appearance}
                  label={appearance}
                  onClick={handleClick}
                  testID={`button-${variant}-${appearance}`}
                  variant={variant}
                />
              ))}
            </div>
            <div className="demo__row">
              {SIZES.map((size) => (
                <Button
                  key={size}
                  label={size}
                  onClick={handleClick}
                  size={size}
                  testID={`button-${variant}-${size}`}
                  variant={variant}
                />
              ))}
              <Button
                isDisabled
                label="disabled"
                onClick={handleClick}
                testID={`button-${variant}-disabled`}
                variant={variant}
              />
            </div>
          </section>
        ))}
      </main>
    </BluProvider>
  )
}

export default App
