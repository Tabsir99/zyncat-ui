import type { ReactElement, ReactNode } from 'react';

import { cx } from '../../internal/utils/cx';

export type YouTubeMedia = string | ReactNode;

function isEmpty(source: YouTubeMedia): boolean {
  return source === undefined || source === null || source === false || source === '';
}

export function Media({ source, className }: { source?: YouTubeMedia; className?: string }): ReactElement {
  if (typeof source === 'string') return <img className={cx('youtube__media', className)} src={source} alt="" />;
  if (!isEmpty(source)) return <div className={cx('youtube__media', className)}>{source}</div>;
  return <div className={cx('youtube__media', 'youtube__placeholder', className)} />;
}
