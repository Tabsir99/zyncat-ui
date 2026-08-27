// Playground-local icon - the DEMO app's OWN icon source.
// -------------------------------------------------------------------------
// Zyncat UI ships no consumer icon set: its components take icons as nodes
// (bring-your-own), so the docs supply their own here. Like a real app should,
// we import EXACTLY the glyphs the demos use - never the whole Phosphor library.
// `name` is typed to the registry, so using a new icon in a demo is a compile
// error until you add its import and one line below.
import {
  Archive,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  ArrowSquareOut,
  Bell,
  Browsers,
  Bug,
  CaretDown,
  CaretRight,
  Check,
  Clock,
  Cloud,
  Code,
  Copy,
  Cpu,
  Crown,
  DotsThreeOutline,
  Gear,
  GithubLogo,
  Globe,
  Hash,
  Heart,
  House,
  Info,
  Lightbulb,
  Lightning,
  List,
  Lock,
  MagnifyingGlass,
  Moon,
  Package,
  PencilSimple,
  Play,
  Plus,
  RocketLaunch,
  ShieldCheck,
  Sparkle,
  Star,
  Sun,
  TerminalWindow,
  Trash,
  User,
  Users,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';

type Glyph = typeof Gear;

const REGISTRY = {
  archive: Archive,
  'arrow-counter-clockwise': ArrowCounterClockwise,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-square-out': ArrowSquareOut,
  bell: Bell,
  browsers: Browsers,
  bug: Bug,
  'caret-down': CaretDown,
  'caret-right': CaretRight,
  check: Check,
  clock: Clock,
  cloud: Cloud,
  code: Code,
  copy: Copy,
  cpu: Cpu,
  crown: Crown,
  gear: Gear,
  github: GithubLogo,
  globe: Globe,
  hash: Hash,
  heart: Heart,
  house: House,
  info: Info,
  lightbulb: Lightbulb,
  lightning: Lightning,
  list: List,
  lock: Lock,
  'magnifying-glass': MagnifyingGlass,
  moon: Moon,
  more: DotsThreeOutline,
  package: Package,
  'pencil-simple': PencilSimple,
  play: Play,
  plus: Plus,
  rocket: RocketLaunch,
  'shield-check': ShieldCheck,
  shuffle: ArrowsClockwise,
  sparkle: Sparkle,
  star: Star,
  sun: Sun,
  terminal: TerminalWindow,
  trash: Trash,
  user: User,
  users: Users,
  'warning-circle': WarningCircle,
  x: X,
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
