# CheckboxGroup

Fieldset de checkboxes: pregunta, filas, ayuda o error.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Varias opciones no exclusivas con label de grupo.

## Cuándo no

Una casilla: Checkbox.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `label` | `string` | sí | — |  |
| `children` | `ReactNode` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Checkbox, CheckboxGroup } from '@dsm/ui';

<CheckboxGroup label="Beneficios">
  <Checkbox checked label="Seguro" onChange={() => {}} />
</CheckboxGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function CheckboxGroupStandalone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <legend style={{ fontFamily: 'Mulish, sans-serif', fontWeight: 700, marginBottom: 8 }}>{label}</legend>
      {children}
    </fieldset>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/checkboxGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
