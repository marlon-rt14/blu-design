# Callout

Mensaje proactivo opcional: tip o oportunidad, sin severidad.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Sugerir una función o dato en contexto.

## Cuándo no

Error o aviso de sistema: Alert. Toast: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | `string` | no | — |  |
| `body` | `string` | sí | — |  |
| `tone` | `string` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Callout } from '@dsm/ui';

<Callout body="Activa notificaciones para enterarte del pago." />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CalloutStandalone({ body }: { body: string }) {
  const padding = 16; // dimension.component.callout.padding
  const gap = 12; // dimension.component.callout.gap
  const radius = 12; // dimension.component.callout.radius
  return (
    <aside style={{ padding, gap, borderRadius: radius, background: '#eff3fd', display: 'flex', fontFamily: 'Mulish, sans-serif', fontSize: 16, color: '#232b3d' }}>
      {body}
    </aside>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/callout.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
