# Tooltip

Ayuda breve al hover/foco, con tip.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Explicar un control sin ocupar espacio permanente.

## Cuándo no

Tour: Coachmark. Toast: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `body` | ``string`` | sí | — |  |
| `title` | ``string`` | no | — |  |
| `placement` | ``string`` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Tooltip } from '@dsm/ui';

<Tooltip body="Comisión US$ 1.50 a otros bancos" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TooltipStandalone({ body }: { body: string }) {
  const bg = '#232b3d'; // color.component.tooltip.surface.bg
  const text = '#fafbfe'; // content
  return (
    <div role="tooltip" style={{ background: bg, color: text, borderRadius: 8, padding: '8px 12px', fontFamily: 'Mulish, sans-serif', fontSize: 14, maxWidth: 240 }}>
      {body}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/tooltip.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
