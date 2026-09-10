import type { TIconName } from '@dsm/shared';
import type { ComponentType, ReactElement } from 'react';

import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconArrowUpRight,
  IconCapsLock,
  IconCheck,
  IconCheckCircle,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsRight,
  IconCircle,
  IconCreditCard,
  IconDots,
  IconEye,
  IconEyeOff,
  IconFlag,
  IconImage,
  IconInfo,
  IconLock,
  IconMinus,
  IconPlaceholder,
  IconPlus,
  IconSearch,
  IconStar,
  IconStore,
  IconTrash,
  IconUser,
  IconX,
  IconXCircle,
} from '../../../icons';
import type { TIconProps } from '../Icon';

/**
 * Figma InstanceSwap: `TIconName` → the published glyph. Lives next to
 * TabItem rather than in `@dsm/mobile/icons` — that entry point ships no
 * name-to-component registry on purpose (tree-shaking).
 */
const TAB_ICONS = {
  'alert-circle': IconAlertCircle,
  'alert-triangle': IconAlertTriangle,
  'arrow-right': IconArrowRight,
  'arrow-up-right': IconArrowUpRight,
  'caps-lock': IconCapsLock,
  check: IconCheck,
  'check-circle': IconCheckCircle,
  'chevron-down': IconChevronDown,
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight,
  'chevron-up': IconChevronUp,
  'chevrons-right': IconChevronsRight,
  circle: IconCircle,
  'credit-card': IconCreditCard,
  dots: IconDots,
  eye: IconEye,
  'eye-off': IconEyeOff,
  flag: IconFlag,
  image: IconImage,
  info: IconInfo,
  lock: IconLock,
  minus: IconMinus,
  placeholder: IconPlaceholder,
  plus: IconPlus,
  search: IconSearch,
  star: IconStar,
  store: IconStore,
  trash: IconTrash,
  user: IconUser,
  x: IconX,
  'x-circle': IconXCircle,
} as const satisfies Record<TIconName, ComponentType<TIconProps>>;

/** Renders the glyph `name` through the real Icon set. */
export const TabIcon = ({ name, ...props }: TIconProps & { name: TIconName }): ReactElement => {
  const Glyph = TAB_ICONS[name];
  return <Glyph {...props} />;
};
