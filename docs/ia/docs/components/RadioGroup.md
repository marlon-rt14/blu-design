# RadioGroup

Grupo de radios con label y error.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Una pregunta, una respuesta.

## Cuándo no

Varias respuestas: CheckboxGroup.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `label` | `string` | sí | — |  |
| `children` | `ReactNode` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import { Radio, RadioGroup } from '@dsm/ui';

<RadioGroup label="Tipo de cuenta">
  <Radio checked label="Ahorros" value="a" onChange={() => {}} />
  <Radio checked={false} label="Corriente" value="c" onChange={() => {}} />
</RadioGroup>
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function RadioGroupStandalone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: 'none', padding: 0 }}>
      <legend style={{ fontWeight: 700, fontFamily: 'Mulish, sans-serif', marginBottom: 8 }}>{label}</legend>
      {children}
    </fieldset>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/radioGroup.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
