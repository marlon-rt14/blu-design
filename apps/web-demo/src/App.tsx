import { Button } from '@dsm/web'
import type { TButtonSize, TButtonVariant } from '@dsm/shared'
import { useState } from 'react'

import './App.css'

const VARIANTS: TButtonVariant[] = ['primary', 'secondary']
const SIZES: TButtonSize[] = ['small', 'medium', 'large']

const App = () => {
  const [clicks, setClicks] = useState(0)
  const handleClick = () => setClicks((current) => current + 1)

  return (
    <main className="demo">
      <h1 className="demo__title">@dsm/web · demo</h1>
      <p className="demo__subtitle">
        El mismo Button del design system, consumido desde una app Vite.
      </p>

      <p className="demo__counter">
        Clicks: <strong data-testid="click-counter">{clicks}</strong>
      </p>

      {VARIANTS.map((variant) => (
        <section className="demo__section" key={variant}>
          <h2 className="demo__section-title">{variant}</h2>
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
  )
}

export default App
