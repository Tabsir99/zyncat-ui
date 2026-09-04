import type { ReactElement, ReactNode } from 'react';

import { cx } from '../../internal/utils/cx';

export type YouTubeMedia = string | ReactNode;

/** The surface actions that carry no state of their own. */
export type YouTubeAction = 'comment' | 'share' | 'remix' | 'menu' | 'expand';

function isEmpty(source: YouTubeMedia): boolean {
  return source === undefined || source === null || source === false || source === '';
}

export function Media({ source, className }: { source?: YouTubeMedia; className?: string }): ReactElement {
  if (typeof source === 'string') return <img className={cx('zc-youtube__media', className)} src={source} alt="" />;
  if (!isEmpty(source)) return <div className={cx('zc-youtube__media', className)}>{source}</div>;
  return <div className={cx('zc-youtube__media', 'zc-youtube__placeholder', className)} />;
}
