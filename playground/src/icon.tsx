// Playground-local icon - the DEMO app's OWN icon source.
// -------------------------------------------------------------------------
// premium-ds ships no consumer icon set: its components take icons as nodes
// (bring-your-own), so the docs supply their own here. Like a real app should,
// we import EXACTLY the glyphs the demos use - never the whole Phosphor library.
// `name` is typed to the registry, so using a new icon in a demo is a compile
// error until you add its import and one line below.
import {
  Archive,
  Bell,
  CaretDown,
  Clock,
  Cloud,
  Copy,
  Crown,
  DotsThreeOutline,
  Gear,
  Globe,
  Hash,
  Heart,
  House,
  Info,
  Lightning,
  Lock,
  MagnifyingGlass,
  Moon,
  PencilSimple,
  Plus,
  Star,
  Sun,
  Trash,
  User,
  Users,
  WarningCircle,
} from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';

type Glyph = typeof Gear;

const REGISTRY = {
  archive: Archive,
  bell: Bell,
  'caret-down': CaretDown,
  clock: Clock,
  cloud: Cloud,
  copy: Copy,
  crown: Crown,
  more: DotsThreeOutline,
  gear: Gear,
  globe: Globe,
  hash: Hash,
  heart: Heart,
  house: House,
  info: Info,
  lightning: Lightning,
  lock: Lock,
  'magnifying-glass': MagnifyingGlass,
  moon: Moon,
  'pencil-simple': PencilSimple,
  plus: Plus,
  star: Star,
  sun: Sun,
  trash: Trash,
  user: User,
  users: Users,
  'warning-circle': WarningCircle,
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof REGISTRY;

type IconSize = 'sm' | 'md' | 'lg';
const SIZE_PX: Record<IconSize, number> = { sm: 16, md: 20, lg: 24 };

export interface IconProps {
  name: IconName;
  size?: IconSize;
  weight?: IconWeight;
}

export function Icon({ name, size = 'md', weight = 'regular' }: IconProps) {
  const Glyph = REGISTRY[name];
  return <Glyph size={SIZE_PX[size]} weight={weight} aria-hidden />;
}
