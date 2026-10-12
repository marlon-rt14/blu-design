# ListItem

Fila de lista: la pieza más repetida.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Movimiento, contacto, producto.

## Cuándo no

Opción seleccionable: ChoiceItem.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `title` | `string` | sí | — |  |
| `description` | `string` | no | — |  |
| `divider` | `boolean` | no | false | último de grupo |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { ListItem } from '@dsm/ui';

<ListItem title="Enviaste a Luis Ramos" description="6 oct · −US$ 250.00" divider />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ListItemStandalone({ title, description, divider }: { title: string; description?: string; divider?: boolean }) {
  return (
    <div style={{ minHeight: 56, padding: '12px 16px', borderBottom: divider ? '1px solid #ced4e3' : undefined, fontFamily: 'Mulish, sans-serif' }}>
      <div style={{ fontWeight: 700, color: '#232b3d' }}>{title}</div>
      {description ? <div style={{ color: '#434959', fontSize: 14 }}>{description}</div> : null}
    </div>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/listItem.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
