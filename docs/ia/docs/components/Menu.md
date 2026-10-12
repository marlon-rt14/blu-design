# Menu

Menú flotante de acciones u opciones.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Acciones sobre un ítem sin salir de la pantalla.

## Cuándo no

Navegación de app: no. Select de formulario: Select.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Menu } from '@dsm/ui';

<Menu>{/* items */}</Menu>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function MenuStandalone({ items }: { items: string[] }) {
  const bg = '#ffffff'; // color.component.menu.surface.bg
  const border = '#ced4e3'; // color.component.menu.surface.border
  return (
    <ul role="menu" style={{ listStyle: 'none', margin: 0, padding: 8, background: bg, border: `1px solid ${border}`, borderRadius: 12, boxShadow: '0 8px 24px #001e601f', minWidth: 200 }}>
      {items.map((item) => (
        <li key={item} role="menuitem" style={{ padding: '10px 12px', fontFamily: 'Mulish, sans-serif', cursor: 'pointer' }}>{item}</li>
      ))}
    </ul>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/menu.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
