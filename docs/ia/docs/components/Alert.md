# Alert

Aviso no modal en el flujo del documento. Empuja contenido; no se va solo.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Mensajes de sistema con severidad (info, success, warning, danger, neutral) dentro de la página.

## Cuándo no

Toast que se va solo: Snackbar. Confirmación que interrumpe: Card + Alert + ButtonGroup (no hay Dialog).

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `status` | `'info'|'success'|'warning'|'danger'|'neutral'` | sí | — |  |
| `title` | `string` | no | — |  |
| `body` | `string` | sí | — |  |
| `placement` | `'section'|'page'` | no | — |  |
| `showIcon` | `boolean` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Alert } from '@dsm/ui';

<Alert status="danger" title="Esta acción es permanente" body="Si eliminas tu cuenta perderás todos tus datos." showIcon />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function AlertStandalone({ title, body }: { title: string; body: string }) {
  const surface = '#ffe0df'; // color.component.alert.surface.bg-danger
  const chip = '#b22c42'; // color.component.alert.chip.bg-danger
  const titleColor = '#232b3d'; // color.component.alert.content.title
  const bodyColor = '#434959'; // color.component.alert.content.body
  return (
    <div role="alert" style={{ background: surface, borderRadius: 12, padding: 16, display: 'flex', gap: 12, fontFamily: 'Mulish, sans-serif' }}>
      <span aria-hidden style={{ width: 8, borderRadius: 4, background: chip }} />
      <div>
        <div style={{ fontWeight: 800, fontSize: 16, color: titleColor }}>{title}</div>
        <div style={{ fontWeight: 400, fontSize: 16, color: bodyColor, marginTop: 4 }}>{body}</div>
      </div>
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/alert.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
