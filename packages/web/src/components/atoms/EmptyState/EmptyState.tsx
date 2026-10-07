import type { ReactElement } from 'react';

import { Button } from '../Button';
import { LinkButton } from '../LinkButton';
import type { IEmptyStateProps } from './EmptyState.types';
import { useEmptyState } from './useEmptyState';

/**
 * Web EmptyState — what renders when a screen or a block has no content,
 * saying why it's empty and what to do next.
 *
 * **It is never an error.** If something failed, that's `Alert`. **Load
 * first** — while content is still arriving, show a `Skeleton`, not this.
 *
 * `role="status"` on the container is unconditional rather than a prop: it
 * only actually announces when the browser treats mounting this as a
 * *change* (the dev contract's own "si aparece después de filtrar,
 * anuncialo" case) — a region already present in the initial markup when
 * the page loads doesn't get announced as new, so this reads right for the
 * closed "no vacío al cargar" case too without needing a second prop to
 * tell the two apart.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   action={{ label: 'Ver mis tarjetas', onPress: goToCards }}
 *   body="Cuando uses tu tarjeta, tus compras y pagos van a aparecer acá"
 *   graphic={<IconCreditCard01 />}
 *   title="Aún no tienes movimientos"
 * />
 * ```
 */
export const EmptyState = (props: IEmptyStateProps): ReactElement => {
  const { title, body, graphic, action, secondaryAction, testID } = props;
  const {
    rootStyle,
    graphicWrapStyle,
    textBlockStyle,
    titleStyle,
    bodyStyle,
    actionsWrapStyle,
    buttonAppearance,
    buttonSize,
    buttonMinWidth,
  } = useEmptyState(props);

  const showSecondaryAction = action !== undefined && secondaryAction !== undefined;

  return (
    <div data-testid={testID} role="status" style={rootStyle}>
      {graphic ? (
        <span aria-hidden style={graphicWrapStyle}>
          {graphic}
        </span>
      ) : null}
      <div style={textBlockStyle}>
        <p style={titleStyle}>{title}</p>
        <p style={bodyStyle}>{body}</p>
      </div>
      {action ? (
        <div style={actionsWrapStyle}>
          <Button
            appearance={buttonAppearance}
            label={action.label}
            onClick={action.onPress}
            size={buttonSize}
            style={buttonMinWidth === undefined ? undefined : { minWidth: buttonMinWidth }}
            variant="primary"
          />
          {showSecondaryAction ? (
            <LinkButton label={secondaryAction.label} onClick={secondaryAction.onPress} size="sm" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
