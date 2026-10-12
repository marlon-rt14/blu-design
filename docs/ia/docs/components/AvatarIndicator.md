# AvatarIndicator

Punto de estado en la esquina del Avatar.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Estado online / away sobre un Avatar.

## Cuándo no

Solo: Badge.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `status` | `string` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Avatar, AvatarIndicator } from '@dsm/ui';

<div style={{ position: 'relative', width: 40, height: 40 }}>
  <Avatar name="María" />
  <AvatarIndicator status="online" />
</div>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function AvatarIndicatorStandalone() {
  const size = 10; // dimension.component.avatar.size.indicator.md (aprox)
  return <span aria-label="En línea" style={{ width: size, height: size, borderRadius: '50%', background: '#008557', border: '2px solid #fff', display: 'inline-block' }} />;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/avatarIndicator.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
