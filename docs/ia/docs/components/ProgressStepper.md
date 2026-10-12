# ProgressStepper

Riel de pasos de un wizard.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Flujo multipaso con estados pending/active/done/error/warning.

## Cuándo no

Progreso continuo: ProgressBar. No renderices Step a mano en una pantalla.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
| --- | --- | --- | --- | --- |
| `steps` | `IProgressStepDef[]` | sí | — | desde @dsm/shared |
| `purpose` | `string` | sí | — | ej. 'wizard' |
| `orientation` | `'horizontal'\|'vertical'` | no | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
import type { IProgressStepDef } from '@dsm/shared';
import { ProgressStepper } from '@dsm/ui';

const steps: IProgressStepDef[] = [
  { label: 'Plan', status: 'done' },
  { label: 'Calendar', status: 'active' },
  { label: 'Contacts', status: 'pending' },
];

<ProgressStepper purpose="wizard" steps={steps} />
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
export function ProgressStepperStandalone({ labels }: { labels: string[] }) {
  const active = '#364481'; // rail.indicator-active
  const done = '#008557'; // rail.indicator-done
  const pending = '#6e7587'; // indicator-border-pending
  return (
    <ol style={{ display: 'flex', gap: 16, listStyle: 'none', padding: 0, fontFamily: 'Mulish, sans-serif' }}>
      {labels.map((label, i) => (
        <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: i === 0 ? done : i === 1 ? '#232b3d' : '#5f6677' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? done : i === 1 ? active : 'transparent', border: i > 1 ? `2px solid ${pending}` : undefined }} />
          {label}
        </li>
      ))}
    </ol>
  );
}
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/progressStepper.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
