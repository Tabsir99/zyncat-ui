'use client';

import { Badge, type BadgeProps } from './Badge';
import { DigitStrip } from './digit-strip';

export interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  /** The chip content - stringified; in `roll` mode each digit becomes an odometer column. */
  value: string | number;
  /** Odometer: digits roll vertically on change. */
  roll?: boolean;
}

export function CountBadge({ value, tone = 'neutral', roll = false, ...rest }: CountBadgeProps) {
  const str = String(value);
  return (
    <Badge tone={tone} {...rest}>
      {roll ? <DigitStrip value={str} /> : str}
    </Badge>
  );
}
