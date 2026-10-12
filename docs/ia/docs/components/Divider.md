# Divider

Línea que separa dos bloques sin encerrarlos.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Agrupar sin tarjeta.

## Cuándo no

Borde de Card: no hace falta Divider.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `strength` | `'subtle'|'default'|'strong'` | no | 'default' |  |
| `orientation` | `'horizontal'|'vertical'` | no | 'horizontal' |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Divider } from '@dsm/ui';

<Divider />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function DividerStandalone() {
  const color = '#ced4e3'; // color.component.divider.line.default
  return <hr style={{ border: 'none', borderTop: `1px solid ${color}`, margin: 0 }} />;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/divider.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
