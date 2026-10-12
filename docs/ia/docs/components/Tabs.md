# Tabs

Secciones que se ven de a una, elegidas tocando.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Cambiar de vista hermana en la misma pantalla.

## Cuándo no

Todas visibles a la vez: Accordion. Un solo panel: no uses Tabs.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `items` | ``ITabDef[]`` | sí | — |  |
| `value` | ``string`` | sí | — |  |
| `onChange` | ``fn`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Tabs } from '@dsm/ui';

<Tabs
  items={[{ id: 'a', label: 'Movimientos' }, { id: 'b', label: 'Detalles' }]}
  value={tab}
  onChange={setTab}
/>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function TabsStandalone({ items, value, onChange }: { items: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  const active = '#364481'; // component.tabs.indicator.bg-active
  const activeText = '#232b3d'; // label.text-active
  const inactiveText = '#5f6677'; // label.text-inactive
  return (
    <div role="tablist" style={{ display: 'flex', borderBottom: '1px solid #ced4e3', fontFamily: 'Mulish, sans-serif' }}>
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button key={item.id} type="button" role="tab" aria-selected={selected} onClick={() => onChange(item.id)} style={{ flex: 1, minHeight: 48, border: 'none', background: 'transparent', borderBottom: selected ? `2px solid ${active}` : '2px solid transparent', color: selected ? activeText : inactiveText, fontWeight: selected ? 800 : 400 }}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/tabs.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
