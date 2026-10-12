# Coachmark

Guía contextual anclada (tourtip).

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Onboarding puntual disparado por el sistema.

## Cuándo no

Ayuda al hover: Tooltip. Toast: Snackbar.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | `string` | sí | — |  |
| `body` | `string` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Coachmark } from '@dsm/ui';

<Coachmark title="Paga desde acá" body="El atajo queda en tu inicio." />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CoachmarkStandalone({ title, body }: { title: string; body: string }) {
  const bg = '#ffffff'; // color.component.coachmark.surface.bg
  const border = '#ced4e3'; // color.component.coachmark.surface.border
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 16, maxWidth: 280, fontFamily: 'Mulish, sans-serif', boxShadow: '0 8px 24px #001e601f' }}>
      <div style={{ fontWeight: 800, color: '#232b3d' }}>{title}</div>
      <div style={{ marginTop: 8, color: '#232b3d' }}>{body}</div>
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/coachmark.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
