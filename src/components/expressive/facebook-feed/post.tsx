import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../internal/utils/cx';
import {
  compactCount,
  countValue,
  cutCaption,
  MediaSurface,
  Portrait,
  splitCaption,
  type FacebookMediaType,
  type FacebookRatio,
} from './chrome';
import { CommentOutline, Dismiss, HeartSolid, PrivacyGlobe, ShareOutline, ThumbOutline, ThumbSolid } from './icons';

export type FacebookPostWidth = 'mobile' | 'web';

const KEBAB_PIPS = [0, 1, 2];
const ELLIPSIS = '… ';
const MIDDOT = '·';
const FOLLOW_LABEL = 'Follow';
const MORE_LABEL = 'See more';
const REACTIONS_LABEL = 'Like and love reactions';

export interface FacebookPostProps {
  name: string;
  caption: string;
  stamp: string;
  follow: boolean;
  ring: boolean;
  ratio: FacebookRatio;
  media?: ReactNode;
  avatar?: ReactNode;
  type: FacebookMediaType;
  likes: number;
  comments: number;
  shares: number;
  width: FacebookPostWidth;
  className: string;
  style?: CSSProperties;
  htmlProps?: HTMLAttributes<HTMLElement>;
}

export function FacebookPost({
  name,
  caption,
  stamp,
  follow,
  ring,
  ratio,
  media,
  avatar,
  type,
  likes,
  comments,
  shares,
  width,
  className,
  style,
  htmlProps,
}: FacebookPostProps) {
  const trimmed = cutCaption(caption);
  const runs = splitCaption(trimmed.head);

  return (
    <article
      className={cx(
        'facebook-feed-post',
        width === 'web' ? 'facebook-feed-post--web' : 'facebook-feed-post--mobile',
        className,
      )}
      style={style}
      {...htmlProps}
    >
      <div className="facebook-feed-post__header">
        <div className={cx('facebook-feed-post__avatar', ring ? undefined : 'facebook-feed-post__avatar--plain')}>
          <Portrait avatar={avatar} className="facebook-feed-post__portrait" />
        </div>
        <div className="facebook-feed-post__identity">
          <div className="facebook-feed-post__name-row">
            <span className="facebook-feed-post__name">{name}</span>
            {follow ? (
              <span className="facebook-feed-post__follow">
                <span className="facebook-feed-post__separator">{MIDDOT}</span>
                <span className="facebook-feed-post__follow-link">{FOLLOW_LABEL}</span>
              </span>
            ) : null}
          </div>
          <div className="facebook-feed-post__meta">
            <span>{stamp}</span>
            <span aria-hidden="true">{MIDDOT}</span>
            <PrivacyGlobe className="facebook-feed-post__globe" />
          </div>
        </div>
        <div className="facebook-feed-post__controls" aria-hidden="true">
          <span className="facebook-feed-post__kebab">
            {KEBAB_PIPS.map((pip) => (
              <span key={pip} className="facebook-feed-post__pip" />
            ))}
          </span>
          <Dismiss className="facebook-feed-post__close" />
        </div>
      </div>

      <div className="facebook-feed-post__caption">
        {runs.map((run, index) => (
          <span key={index} className={run.link ? 'facebook-feed-post__link' : ''}>
            {run.text}
          </span>
        ))}
        {trimmed.cut ? (
          <>
            <span className="facebook-feed-post__ellipsis">{ELLIPSIS}</span>
            <span className="facebook-feed-post__more">{MORE_LABEL}</span>
          </>
        ) : null}
      </div>

      <div className="facebook-feed-media facebook-feed-ratio" data-ratio={ratio}>
        <MediaSurface
          media={media}
          type={type}
          backClassName="facebook-feed-media__back"
          frontClassName="facebook-feed-media__front"
        />
      </div>

      <div className="facebook-feed-post__actions">
        <div className="facebook-feed-post__stats">
          <span className="facebook-feed-post__stat" role="img" aria-label={`${countValue(likes)} likes`}>
            <ThumbOutline className="facebook-feed-post__glyph" />
            {compactCount(likes)}
          </span>
          <span className="facebook-feed-post__stat" role="img" aria-label={`${countValue(comments)} comments`}>
            <CommentOutline className="facebook-feed-post__glyph" />
            {compactCount(comments)}
          </span>
          <span className="facebook-feed-post__stat" role="img" aria-label={`${countValue(shares)} shares`}>
            <ShareOutline className="facebook-feed-post__glyph" />
            {compactCount(shares)}
          </span>
        </div>
        <div className="facebook-feed-post__reactions" role="img" aria-label={REACTIONS_LABEL}>
          <span className="facebook-feed-post__reaction facebook-feed-post__reaction--like">
            <ThumbSolid />
          </span>
          <span className="facebook-feed-post__reaction facebook-feed-post__reaction--love">
            <HeartSolid />
          </span>
        </div>
      </div>
    </article>
  );
}
