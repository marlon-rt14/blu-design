# AGENTS.md

Contract for screens that consume this design system. Component and token internals stay in `CLAUDE.md`.

## Imports

- Components come from `@dsm/web`. Wrap the tree in `BluProvider`.
- Types and token helpers come from `@dsm/shared`. They are not re-exported by `@dsm/web`. `IProgressStepDef` is the step item of `ProgressStepper`; importing it from `@dsm/web` does not compile.
- Icons are a subpath, one module per section, no barrel. `import { IconChevronLeft } from '@dsm/web/icons/arrows'`. Do not import an icon from `@dsm/web`.

## Components that do not exist

There is no Dialog, Modal, Confirm, EmptyState, or Pagination. Compose what is public:

- Confirmation: `Card` + `Alert status="danger"` + `ButtonGroup`.
- Empty state: `Card` + `Alert` (or `Image`) + `Button`. Do not ship a raw HTML page with a local stylesheet.
- Pager: `IconButton` with `IconChevronLeft` / `IconChevronRight` from `@dsm/web/icons/arrows`.

`ProgressStepper` is the wizard rail. Pass `steps: IProgressStepDef[]`. Do not render `Step` yourself.

## Actions

`variant` is meaning (`primary` | `danger`). `appearance` is weight (`fill` > `soft` > `outline` > `ghost`). Lower the hierarchy with `appearance`.

The safe action is `appearance="fill"` and comes first. The destructive action is `variant="danger"` and `appearance="outline"`. Never `appearance="fill"` on a danger button.

`Button` uses `onClick` and `label`. `IconButton` uses `onPress` and a required `label`, which is its only accessible name. Say the action (`"Previous page"`), not the glyph.

## Style

Do not set color, font size, line height, margin, padding, or an overlay background in `style`. Components resolve tokens themselves. A raw `rgba(...)`, hex, `padding: '24px'`, or `lineHeight: '20px'` bypasses the system.

```tsx
import type { IProgressStepDef } from '@dsm/shared';
import { Alert, BluProvider, Button, ButtonGroup, Card, ProgressStepper } from '@dsm/web';
import { IconChevronLeft } from '@dsm/web/icons/arrows';

const steps: IProgressStepDef[] = [
  { label: 'Plan', status: 'done' },
  { label: 'Calendar', status: 'active' },
  { label: 'Contacts', status: 'pending' },
];

export function Example() {
  return (
    <BluProvider>
      <ProgressStepper purpose="wizard" steps={steps} />
      <Card elevation="raised" padding="md">
        <Alert
          body="Si eliminas tu cuenta perderás todos tus datos. Esta acción no se puede deshacer."
          placement="section"
          showIcon
          status="danger"
          title="Esta acción es permanente"
        />
        <ButtonGroup distribution="fill">
          <Button appearance="fill" label="Cancelar" onClick={onCancel} />
          <Button appearance="outline" label="Eliminar cuenta" onClick={onConfirm} variant="danger" />
        </ButtonGroup>
      </Card>
    </BluProvider>
  );
}
```
