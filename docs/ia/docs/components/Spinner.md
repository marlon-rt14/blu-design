# Spinner

Indicador de carga indeterminado.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Espera corta sin porcentaje.

## Cuándo no

Progreso conocido: ProgressBar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `appearance` | `string` | no | — | brand | default | on-brand |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Spinner } from '@dsm/ui';

<Spinner />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SpinnerStandalone() {
  const indicator = '#364481'; // color.component.spinner.indicator.brand
  return (
    <div role="status" aria-label="Cargando" style={{ width: 24, height: 24, borderRadius: '50%', border: `3px solid #ced4e3`, borderTopColor: indicator, animation: 'spin 0.8s linear infinite' }} />
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/spinner.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
