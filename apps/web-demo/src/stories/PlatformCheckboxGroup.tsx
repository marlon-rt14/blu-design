import { CheckboxGroup as NativeCheckboxGroup, ChoiceItem as NativeChoiceItem } from '@dsm/mobile';
import type { ICheckboxGroupBaseProps } from '@dsm/shared';
import { CheckboxGroup as WebCheckboxGroup, ChoiceItem as WebChoiceItem } from '@dsm/web';
import type { ReactElement } from 'react';

/** Which implementation to render. Mirrors the `platform` toolbar global. */
export type TPlatform = 'web' | 'native';

/** Props of {@link PlatformCheckboxGroup}: the shared contract plus the story's own knobs. */
export interface IPlatformCheckboxGroupProps extends ICheckboxGroupBaseProps {
  /** The options to render as rows. */
  options?: readonly string[];
  /** Which options are chosen. Several, or none. */
  checked?: string[];
  /** Fired with the option the user toggled. */
  onToggle?: (option: string) => void;
  /**
   * Implementation to render.
   *
   * @defaultValue `'web'`
   */
  platform?: TPlatform;
}

const DEFAULT_OPTIONS = ['Opción 1', 'Opción 2', 'Opción 3'];

/**
 * Renders either the web or the React Native CheckboxGroup with matching rows.
 *
 * The rows are `ChoiceItem`s with `control="checkbox"`, which is what
 * Figma's `rows` slot is drawn with — and what makes the legend line up,
 * since the row carries the same lateral inset the group indents its
 * legend by.
 *
 * They have to come from the same platform as the group, which is why this
 * builds them rather than taking children: a web row inside the native
 * group would not render at all.
 */
export const PlatformCheckboxGroup = ({
  options = DEFAULT_OPTIONS,
  checked = [],
  onToggle,
  platform = 'web',
  size = 'sm',
  ...props
}: IPlatformCheckboxGroupProps): ReactElement => {
  if (platform === 'native') {
    return (
      <NativeCheckboxGroup {...props} size={size}>
        {options.map((option) => (
          <NativeChoiceItem
            control="checkbox"
            isChecked={checked.includes(option)}
            key={option}
            label={option}
            onPress={() => onToggle?.(option)}
            size={size}
          />
        ))}
      </NativeCheckboxGroup>
    );
  }

  return (
    <WebCheckboxGroup {...props} size={size}>
      {options.map((option) => (
        <WebChoiceItem
          control="checkbox"
          isChecked={checked.includes(option)}
          key={option}
          label={option}
          onChange={() => onToggle?.(option)}
          size={size}
          value={option}
        />
      ))}
    </WebCheckboxGroup>
  );
};
