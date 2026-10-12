# Chip

Filtro que se prende y se apaga.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Categoría de movimientos, rango, respuesta rápida.

## Cuándo no

Etiqueta no interactiva: Tag.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |
| `selected` | `boolean` | no | false |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Chip } from '@dsm/ui';

<Chip label="Octubre" selected onClick={() => {}} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ChipStandalone({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <button type="button" style={{ minHeight: 32, padding: '0 12px', borderRadius: 999, border: selected ? '1px solid #2760aa' : '1px solid #ced4e3', background: selected ? '#eff3fd' : '#fff', fontFamily: 'Mulish, sans-serif', fontSize: 14, color: '#174183' }}>
      {label}
    </button>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/chip.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
