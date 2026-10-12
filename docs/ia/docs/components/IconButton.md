# IconButton

Acción sin etiqueta visible, solo icono. label es el nombre accesible.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Cerrar, editar, compartir cuando el significado es obvio.

## Cuándo no

Con texto: Button. appearance outline no existe.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `icon` | `ReactNode` | sí | — |  |
| `label` | `string` | sí | — | accessible name |
| `appearance` | `'brand'|'neutral'|'ghost'|'veil'|'on-scene'|'on-media'|'on-inverse'` | no | — |  |
| `onPress` | `() => void` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { IconButton } from '@dsm/ui';
import { IconChevronLeft } from '@dsm/web/icons/arrows';

<IconButton appearance="ghost" icon={<IconChevronLeft size="md" />} label="Página anterior" onPress={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function IconButtonStandalone({ label, onPress }: { label: string; onPress: () => void }) {
  const min = 48; // size.target.min
  return (
    <button type="button" aria-label={label} onClick={onPress} style={{ width: min, height: min, border: 'none', borderRadius: 999, background: 'transparent', cursor: 'pointer' }}>
      <svg aria-hidden width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#323949" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/iconButton.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
