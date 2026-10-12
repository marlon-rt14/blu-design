# Button

La acción. Confirmar, cancelar, continuar, borrar.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Todo lo que el usuario puede hacer en una pantalla.

## Cuándo no

Solo icono: IconButton. Enlace textual: LinkButton.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | ``string`` | sí | — |  |
| `variant` | ``'primary'\|'danger'`` | no | 'primary' |  |
| `appearance` | ``'fill'\|'soft'\|'outline'\|'ghost'\|'on-inverse'`` | no | 'fill' | on-inverse solo con primary |
| `size` | ``'xs'\|'sm'\|'md'\|'lg'`` | no | 'md' |  |
| `isDisabled` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Button } from '@dsm/ui';

<Button appearance="fill" label="Continuar" onClick={() => {}} />
<Button appearance="outline" label="Eliminar" variant="danger" onClick={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
import type { CSSProperties } from 'react';

export function ButtonStandalone({
  label,
  appearance = 'fill',
  variant = 'primary',
  isDisabled = false,
  onClick,
}: {
  label: string;
  appearance?: 'fill' | 'outline';
  variant?: 'primary' | 'danger';
  isDisabled?: boolean;
  onClick?: () => void;
}) {
  const isDanger = variant === 'danger';
  const fillBg = isDanger ? '#b22c42' : '#364481'; // color.component.button.{danger|primary}.bg-default
  const fillLabel = '#ffffff'; // text on fill
  const outlineBorder = isDanger ? '#d74b5c' : '#2760aa'; // *-outline.border-default
  const outlineLabel = isDanger ? '#b22c42' : '#174183'; // *-outline.text-default
  const height = 44; // dimension.size.control.height.md
  const radius = 12; // dimension.radius.action (web)
  const padX = 24; // space.inset.xl

  const style: CSSProperties = {
    boxSizing: 'border-box',
    minHeight: height,
    padding: `0 ${padX}px`,
    borderRadius: radius,
    border: appearance === 'outline' ? `1px solid ${outlineBorder}` : '1px solid transparent',
    background: appearance === 'fill' ? fillBg : 'transparent',
    color: appearance === 'fill' ? fillLabel : outlineLabel,
    fontFamily: 'Mulish, sans-serif',
    fontWeight: 500, // font.weight.medium (código actual)
    fontSize: 16,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
  };

  return (
    <button type="button" disabled={isDisabled} onClick={onClick} style={style}>
      {label}
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/button.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
