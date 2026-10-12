# Snackbar

Toast efímero sobre la UI. Se va solo.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Algo acaba de pasar: guardado, enviado, error breve.

## Cuándo no

Aviso persistente: Alert. Pila: SnackbarStack.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `message` | `string` | sí | — |  |
| `status` | `'info'\|'success'\|'warning'\|'danger'` | no | 'info' |  |
| `action` | `{label,onPress}` | no | — | XOR con onDismiss |
| `onDismiss` | `() => void` | no | — |  |
| `duration` | `number` | no | 6000 | 10000 |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Snackbar } from '@dsm/ui';

<Snackbar
  message="Se guardó el cambio en tu tarjeta"
  status="success"
  action={{ label: 'Deshacer', onPress: () => {} }}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SnackbarStandalone({ message, onAction }: { message: string; onAction?: () => void }) {
  const surface = '#232b3d'; // color.component.snackbar.surface.bg
  const text = '#fafbfe'; // color.component.snackbar.content.text
  const z = 1500; // dimension.z.toast
  return (
    <div role="status" style={{ position: 'fixed', left: 16, right: 16, bottom: 24, zIndex: z, background: surface, color: text, borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ flex: 1 }}>{message}</span>
      {onAction ? <button type="button" onClick={onAction} style={{ background: 'none', border: 'none', color: text, fontWeight: 700, cursor: 'pointer' }}>Deshacer</button> : null}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/snackbar.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
