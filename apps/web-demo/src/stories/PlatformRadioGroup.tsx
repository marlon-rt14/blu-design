import { ChoiceItem as NativeChoiceItem, RadioGroup as NativeRadioGroup } from '@dsm/mobile';
import type { IRadioGroupBaseProps } from '@dsm/shared';
import { ChoiceItem as WebChoiceItem, RadioGroup as WebRadioGroup } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformRadioGroup}: the shared contract plus the story's own knobs. */
export interface IPlatformRadioGroupProps extends IRadioGroupBaseProps {
  /** The options to render as rows. */
  options?: string[];
  /** Which option is chosen. */
  selected?: string;
  /** Fired with the option the user picked. */
  onSelect?: (option: string) => void;
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

const DEFAULT_OPTIONS = ['Opción 1', 'Opción 2', 'Opción 3'];

/**
 * Renders either the web or the React Native RadioGroup with matching rows.
 *
 * The rows are `ChoiceItem`s, which is what Figma's `rows` slot is drawn with —
 * and what makes the legend line up, since the row carries the same lateral
 * inset the group indents its legend by.
 *
 * They have to come from the same platform as the group, which is why this
 * builds them rather than taking children: a web row inside the native group
 * would not render at all.
 *
 * The divergence worth watching is `name`. Web passes it to every row, so the
 * browser groups them and the arrow keys work; mobile has no equivalent and
 * leans entirely on the `selected` prop.
 */
export const PlatformRadioGroup = ({
  options = DEFAULT_OPTIONS,
  selected,
  onSelect,
  platform = 'web',
  size = 'sm',
  ...props
}: IPlatformRadioGroupProps): ReactElement => {
  const chosen = selected ?? options[0];

  if (platform === 'native') {
    return (
      <NativeRadioGroup {...props} size={size}>
        {options.map((option) => (
          <NativeChoiceItem
            isChecked={chosen === option}
            key={option}
            label={option}
            onPress={() => onSelect?.(option)}
            size={size}
          />
        ))}
      </NativeRadioGroup>
    );
  }

  return (
    <WebRadioGroup {...props} size={size}>
      {options.map((option) => (
        <WebChoiceItem
          isChecked={chosen === option}
          key={option}
          label={option}
          name={`group-${props.legend}`}
          onChange={() => onSelect?.(option)}
          size={size}
          value={option}
        />
      ))}
    </WebRadioGroup>
  );
};
