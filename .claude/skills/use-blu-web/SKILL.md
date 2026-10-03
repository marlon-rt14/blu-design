---
name: use-blu-web
description: How to build a screen with @dsm/web. Use when writing React UI that should follow the Blu design system, including confirmation before a destructive action.
---

# Use @dsm/web

Import components from `@dsm/web` and wrap the screen in `BluProvider`. Import contract types from `@dsm/shared`. `IProgressStepDef` is the item type of `ProgressStepper`; it is not exported by `@dsm/web`.

Icons are not on the root barrel. Import them from the section module: `import { IconChevronLeft } from '@dsm/web/icons/arrows'`.

There is no Dialog, Modal, Confirm, EmptyState, or Pagination component. A confirmation or an empty state is a `Card` plus an `Alert` plus a `Button` or `ButtonGroup`. A pager is `IconButton` (`onPress`, required `label`) plus a chevron from `@dsm/web/icons/arrows`. `ProgressStepper` takes `steps: IProgressStepDef[]` from `@dsm/shared`; do not render `Step`.

```tsx
import { Alert, BluProvider, Button, ButtonGroup, Card } from '@dsm/web';

export function TaskScreen() {
  return (
    <BluProvider>
      <Card elevation="raised" padding="md">
        <Alert
          status="danger"
          placement="section"
          showIcon
          title="Esta acción es permanente"
          body="Si eliminas tu cuenta perderás todos tus datos. Esta acción no se puede deshacer."
        />
        <ButtonGroup distribution="fill">
          <Button appearance="fill" label="Cancelar" onClick={onCancel} />
          <Button appearance="outline" label="Eliminar cuenta" variant="danger" onClick={onConfirm} />
        </ButtonGroup>
      </Card>
    </BluProvider>
  );
}
```

Rules:

- `variant` is meaning (`primary` or `danger`). `appearance` is weight (`fill` > `soft` > `outline` > `ghost`). Lower the hierarchy with `appearance`, not by swapping `variant`.
- The safe action is `appearance="fill"` and comes first. The destructive action is `variant="danger"` and `appearance="outline"`. Never `appearance="fill"` on a danger button.
- Status glyphs inside an alert come from `<Alert showIcon status="...">`. Any other glyph is an import from `@dsm/web/icons/<section>`, never from `@dsm/web`.
- Do not set color, font size, line height, margin, padding, blur, or overlay backgrounds in `style`. `Card`, `Alert`, `Button`, and `ButtonGroup` already resolve tokens. A raw `rgba(...)`, hex, `padding`, or `lineHeight` is a failure.
