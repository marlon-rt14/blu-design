# Switch

Interruptor on/off.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Preferencia binaria inmediata.

## Cuándo no

Checkbox de formulario: Checkbox.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `checked` | ``boolean`` | sí | — |  |
| `onChange` | ``(v: boolean) => void`` | sí | — |  |
| `disabled` | ``boolean`` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Switch } from '@dsm/ui';

<Switch checked={on} onChange={setOn} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function SwitchStandalone({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const track = checked ? '#364481' : '#ced4e3';
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} style={{ width: 52, height: 32, borderRadius: 999, border: 'none', background: track, padding: 2, cursor: 'pointer' }}>
      <span style={{ display: 'block', width: 28, height: 28, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 150ms' }} />
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/switch.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
