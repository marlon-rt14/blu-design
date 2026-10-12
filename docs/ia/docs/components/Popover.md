# Popover

Superficie anclada sin punta (el Popover no tiene tip).

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Contenido corto anclado a un control.

## Cuándo no

Con tip: Tooltip / Coachmark. Menú de acciones: Menu.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | ``ReactNode`` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Popover } from '@dsm/ui';

<Popover>{/* contenido */}</Popover>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function PopoverStandalone({ children }: { children: React.ReactNode }) {
  const bg = '#ffffff'; // color.component.menu.surface.bg
  const border = '#ced4e3';
  const z = 1200; // dimension.z.popover
  return <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 12, zIndex: z, boxShadow: '0 8px 24px #001e601f' }}>{children}</div>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/popover.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
