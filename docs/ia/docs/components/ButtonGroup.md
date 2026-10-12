# ButtonGroup

Contenedor de 2 o 3 acciones: dirección, gap y reparto de ancho.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Pie de formulario o confirmación con acciones relacionadas.

## Cuándo no

Una sola acción: Button suelto.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | sí | — | Buttons |
| `distribution` | `'hug'\|'fill'` | no | — |  |
| `orientation` | `'horizontal'\|'vertical'` | no | 'horizontal' |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Button, ButtonGroup } from '@dsm/ui';

<ButtonGroup distribution="fill">
  <Button appearance="fill" label="Cancelar" onClick={() => {}} />
  <Button appearance="outline" label="Eliminar" variant="danger" onClick={() => {}} />
</ButtonGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ButtonGroupStandalone({ children }: { children: React.ReactNode }) {
  const gap = 12; // dimension.space.inline.md / space.stack.md
  return <div style={{ display: 'flex', gap, width: '100%' }}>{children}</div>;
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/buttonGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
