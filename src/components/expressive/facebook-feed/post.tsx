'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../internal/utils/cx';
import {
  compactCount,
  cutCaption,
  MediaSurface,
  Portrait,
  splitCaption,
  type FacebookFeedAction,
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
const LIKE_LABEL = 'Like';
const COMMENT_LABEL = 'Comment';
const SHARE_LABEL = 'Share';
const MENU_LABEL = 'More options';
const DISMISS_LABEL = 'Hide post';

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
  liked: boolean;
  onLikedChange: (liked: boolean) => void;
  onAction?: (action: FacebookFeedAction) => void;
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
  liked,
  onLikedChange,
  onAction,
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
                <button
                  type="button"
                  className="facebook-feed-button facebook-feed-post__follow-link"
                  onClick={() => onAction?.('follow')}
                >
                  {FOLLOW_LABEL}
                </button>
              </span>
            ) : null}
          </div>
          <div className="facebook-feed-post__meta">
            <span>{stamp}</span>
            <span aria-hidden="true">{MIDDOT}</span>
            <PrivacyGlobe className="facebook-feed-post__globe" />
          </div>
        </div>
        <div className="facebook-feed-post__controls">
          <button
            type="button"
            className="facebook-feed-button facebook-feed-post__kebab"
            aria-label={MENU_LABEL}
            onClick={() => onAction?.('menu')}
          >
            {KEBAB_PIPS.map((pip) => (
              <span key={pip} className="facebook-feed-post__pip" />
            ))}
          </button>
          <button
            type="button"
            className="facebook-feed-button"
            aria-label={DISMISS_LABEL}
            onClick={() => onAction?.('dismiss')}
          >
            <Dismiss className="facebook-feed-post__close" />
          </button>
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
            <button
              type="button"
              className="facebook-feed-button facebook-feed-post__more"
              onClick={() => onAction?.('more')}
            >
              {MORE_LABEL}
            </button>
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
          <span className="facebook-feed-post__stat">
            <button
              type="button"
              className="facebook-feed-button"
              aria-label={LIKE_LABEL}
              aria-pressed={liked}
              onClick={() => onLikedChange(!liked)}
            >
              <ThumbOutline className="facebook-feed-post__glyph" />
            </button>
            {compactCount(likes + (liked ? 1 : 0))}
          </span>
          <span className="facebook-feed-post__stat">
            <button
              type="button"
              className="facebook-feed-button"
              aria-label={COMMENT_LABEL}
              onClick={() => onAction?.('comment')}
            >
              <CommentOutline className="facebook-feed-post__glyph" />
            </button>
            {compactCount(comments)}
          </span>
          <span className="facebook-feed-post__stat">
            <button
              type="button"
              className="facebook-feed-button"
              aria-label={SHARE_LABEL}
              onClick={() => onAction?.('share')}
            >
              <ShareOutline className="facebook-feed-post__glyph" />
            </button>
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
