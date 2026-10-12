# EmptyState

Pantalla o bloque sin contenido: por qué y el siguiente paso.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Lista vacía, búsqueda sin resultados.

## Cuándo no

Error de carga: Alert + reintento. No es un fallo de red.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | sí | — |  |
| `body` | ``string`` | no | — |  |
| `action` | ``ReactNode`` | no | — | Button |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Button, EmptyState } from '@dsm/ui';

<EmptyState
  title="Todavía no hay movimientos en octubre"
  body="Cuando recibas o envíes dinero, van a aparecer aquí."
  action={<Button label="Enviar dinero" onClick={() => {}} />}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function EmptyStateStandalone({ title, body }: { title: string; body?: string }) {
  const padding = 24; // dimension.component.emptystate.padding
  const titleColor = '#232b3d'; // color.component.emptystate.title
  const bodyColor = '#434959'; // color.component.emptystate.body
  return (
    <div style={{ padding, textAlign: 'center', fontFamily: 'Mulish, sans-serif' }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: titleColor }}>{title}</div>
      {body ? <p style={{ color: bodyColor, marginTop: 8 }}>{body}</p> : null}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/emptyState.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
