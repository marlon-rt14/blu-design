# SnackbarStack

Pila de hasta 3 Snackbar: colapsada o expandida.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Varios avisos a la vez.

## Cuándo no

Uno solo: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `items` | `ISnackbarStackItem[]` | sí | — |  |
| `onDismiss` | `(id) => void` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { SnackbarStack } from '@dsm/ui';

<SnackbarStack items={items} onDismiss={remove} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SnackbarStackStandalone({ messages }: { messages: string[] }) {
  const z = 1500; // dimension.z.toast
  return (
    <div style={{ position: 'fixed', left: 16, right: 16, bottom: 24, zIndex: z, display: 'flex', flexDirection: 'column-reverse', gap: 8 }}>
      {messages.slice(-3).map((m) => (
        <div key={m} style={{ background: '#232b3d', color: '#fafbfe', borderRadius: 12, padding: 16, fontFamily: 'Mulish, sans-serif' }}>{m}</div>
      ))}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/snackbarStack.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
