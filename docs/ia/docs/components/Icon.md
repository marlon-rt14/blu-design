# Icon

Contenedor de todo glifo: tamaño y color del sistema.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Todo icono pasa por Icon; nunca un svg suelto con width/height.

## Cuándo no

Acción solo icono: IconButton.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `size` | `'2xs'|'xs'|'sm'|'md'|'lg'|'xl'` | sí | — | nunca number |
| `children` | `ReactNode` | sí | — | paths |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Icon } from '@dsm/ui';
import { IconChevronLeft } from '@dsm/web/icons/arrows';

<IconChevronLeft size="md" />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function IconStandalone({ label }: { label: string }) {
  const size = 24; // size.icon.md
  return (
    <svg aria-label={label} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#323949" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/icon.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
