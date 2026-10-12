# SwitchItem

Fila con label + Switch.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Ajuste en lista de preferencias.

## Cuándo no

Switch suelto sin texto: Switch.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | ``string`` | sí | — |  |
| `checked` | ``boolean`` | sí | — |  |
| `onChange` | ``fn`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { SwitchItem } from '@dsm/ui';

<SwitchItem title="Notificaciones" checked={on} onChange={setOn} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SwitchItemStandalone({ title, checked, onChange }: { title: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, fontFamily: 'Mulish, sans-serif' }}>
      <span style={{ fontWeight: 700 }}>{title}</span>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} style={{ width: 52, height: 32, borderRadius: 999, border: 'none', background: checked ? '#364481' : '#ced4e3' }}>
        <span style={{ display: 'block', width: 28, height: 28, margin: 2, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(20px)' : undefined }} />
      </button>
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/switchItem.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
