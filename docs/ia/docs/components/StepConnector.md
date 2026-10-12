# StepConnector

Conector interno del ProgressStepper.

Ciclo de vida: **beta** (monorepo `@dsm/web` / `@dsm/mobile`).

## Cuándo usarlo

Solo dentro del steppper.

## Cuándo no

No uses en pantallas.

## Alternativas

Ver `llms.txt` y las fichas hermanas. Preferí el componente más pequeño que cierre la tarea.

## API

| Prop | Tipo | Requerida | Por defecto | Nota |
|---|---|---|---|---|
| `status` | `string` | sí | — |  |

## Uso (con librería)

Prueba `@dsm/ui`. Si no resuelve, `@dsm/web`. Envuelve en `BluProvider`.

```tsx
// Interno — ver ProgressStepper.md
```

## Sin librería

Si no puedes instalar `@dsm/ui` ni `@dsm/web`, copia este JSX. No lo bajes a HTML. No inventes colores fuera de los comentados.

```tsx
// Interno — ver ProgressStepper.md
```

---

Fuente de verdad del contrato: `packages/shared/src/types/`. Tokens: `packages/shared/src/tokens/stepConnector.tokens.ts` (si existe). Edita esta ficha en el mismo cambio que la API o los tokens que muestra.
