# ChoiceBox

Selector de caja: la opción entera es el control.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

La elección es la tarea de la pantalla; cada opción necesita descripción.

## Cuándo no

Lista densa: ChoiceItem / RadioGroup.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `selected` | `boolean` | sí | — |  |
| `title` | `string` | sí | — |  |
| `description` | `string` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ChoiceBox } from '@dsm/ui';

<ChoiceBox selected title="Cuenta en dólares" description="···4521" onSelect={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ChoiceBoxStandalone({ title, description, selected, onSelect }: { title: string; description?: string; selected: boolean; onSelect: () => void }) {
  const border = selected ? '#2760aa' : '#6e7587'; // border-selected | border-default
  const bg = selected ? '#eff3fd' : '#ffffff';
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} style={{ textAlign: 'left', width: '100%', padding: 12, borderRadius: 12, border: `2px solid ${border}`, background: bg, fontFamily: 'Mulish, sans-serif' }}>
      <div style={{ fontWeight: 700, color: '#232b3d' }}>{title}</div>
      {description ? <div style={{ color: '#434959', marginTop: 4 }}>{description}</div> : null}
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/choiceBox.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
