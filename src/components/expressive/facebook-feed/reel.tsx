'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../internal/utils/cx';
import { compactCount, MediaSurface, Portrait, type FacebookFeedAction, type FacebookMediaType } from './chrome';
import {
  CommentOutline,
  Magnifier,
  ShareOutline,
  SpeakerOutlineOff,
  SpeakerOutlineOn,
  ThumbOutline,
  VerifiedBadge,
} from './icons';

export type FacebookReelStage = 'narrow' | 'wide';

const KEBAB_PIPS = [0, 1, 2];
const MIDDOT = '·';
const NOTE = '♪';
const FOLLOW_LABEL = 'Follow';
const MORE_LABEL = 'See more';
const MUTE_LABEL = 'Mute';
const LIKE_LABEL = 'Like';
const COMMENT_LABEL = 'Comment';
const SHARE_LABEL = 'Share';
const MENU_LABEL = 'More options';
const SEARCH_LABEL = 'Search';

export interface FacebookReelProps {
  name: string;
  caption: string;
  stage: FacebookReelStage;
  follow: boolean;
  verified: boolean;
  audio: string;
  media?: ReactNode;
  avatar?: ReactNode;
  type: FacebookMediaType;
  likes: number;
  comments: number;
  shares: number;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  liked: boolean;
  onLikedChange: (liked: boolean) => void;
  onAction?: (action: FacebookFeedAction) => void;
  className: string;
  style?: CSSProperties;
  htmlProps?: HTMLAttributes<HTMLElement>;
}

export function FacebookReel({
  name,
  caption,
  stage,
  follow,
  verified,
  audio,
  media,
  avatar,
  type,
  likes,
  comments,
  shares,
  muted,
  onMutedChange,
  liked,
  onLikedChange,
  onAction,
  className,
  style,
  htmlProps,
}: FacebookReelProps) {
  const wide = stage === 'wide';

  return (
    <article
      className={cx(
        'zc-facebook-feed-reel',
        wide ? 'zc-facebook-feed-reel--wide' : 'zc-facebook-feed-reel--narrow',
        className,
      )}
      style={style}
      {...htmlProps}
    >
      <div className="zc-facebook-feed-media zc-facebook-feed-reel__video">
        <MediaSurface media={media} type={type} frontClassName="zc-facebook-feed-media__front" />
      </div>

      <button
        type="button"
        className="zc-facebook-feed-reel__mute"
        aria-label={MUTE_LABEL}
        aria-pressed={muted}
        onClick={() => onMutedChange(!muted)}
      >
        {muted ? (
          <SpeakerOutlineOff className="zc-facebook-feed-reel__mute-glyph" />
        ) : (
          <SpeakerOutlineOn className="zc-facebook-feed-reel__mute-glyph" />
        )}
      </button>

      {wide ? (
        <button
          type="button"
          className="zc-facebook-feed-button zc-facebook-feed-reel__search"
          aria-label={SEARCH_LABEL}
          onClick={() => onAction?.('search')}
        >
          <Magnifier className="zc-facebook-feed-reel__search-glyph" />
        </button>
      ) : null}

      <div className="zc-facebook-feed-reel__rail">
        <span className="zc-facebook-feed-reel__stat">
          <button
            type="button"
            className="zc-facebook-feed-button"
            aria-label={LIKE_LABEL}
            aria-pressed={liked}
            onClick={() => onLikedChange(!liked)}
          >
            <ThumbOutline className="zc-facebook-feed-reel__stat-glyph" />
          </button>
          <span className="zc-facebook-feed-reel__count">{compactCount(likes + (liked ? 1 : 0))}</span>
        </span>
        <span className="zc-facebook-feed-reel__stat">
          <button
            type="button"
            className="zc-facebook-feed-button"
            aria-label={COMMENT_LABEL}
            onClick={() => onAction?.('comment')}
          >
            <CommentOutline className="zc-facebook-feed-reel__stat-glyph" />
          </button>
          <span className="zc-facebook-feed-reel__count">{compactCount(comments)}</span>
        </span>
        <span className="zc-facebook-feed-reel__stat">
          <button
            type="button"
            className="zc-facebook-feed-button"
            aria-label={SHARE_LABEL}
            onClick={() => onAction?.('share')}
          >
            <ShareOutline className="zc-facebook-feed-reel__stat-glyph" />
          </button>
          <span className="zc-facebook-feed-reel__count">{compactCount(shares)}</span>
        </span>
        <button
          type="button"
          className="zc-facebook-feed-button zc-facebook-feed-reel__kebab"
          aria-label={MENU_LABEL}
          onClick={() => onAction?.('menu')}
        >
          {KEBAB_PIPS.map((pip) => (
            <span key={pip} className="zc-facebook-feed-reel__pip" />
          ))}
        </button>
      </div>

      <div className="zc-facebook-feed-reel__overlay">
        <div className="zc-facebook-feed-reel__byline">
          <Portrait avatar={avatar} className="zc-facebook-feed-reel__avatar" />
          <span className="zc-facebook-feed-reel__name">{name}</span>
          {verified ? <VerifiedBadge className="zc-facebook-feed-reel__badge" /> : null}
          {follow ? (
            <span className="zc-facebook-feed-reel__follow">
              <span className="zc-facebook-feed-reel__follow-dot">{MIDDOT}</span>
              <button
                type="button"
                className="zc-facebook-feed-button zc-facebook-feed-reel__follow-label"
                onClick={() => onAction?.('follow')}
              >
                {FOLLOW_LABEL}
              </button>
            </span>
          ) : null}
        </div>
        {wide ? null : (
          <div className="zc-facebook-feed-reel__audio">
            <span className="zc-facebook-feed-reel__note" aria-hidden="true">
              {NOTE}
            </span>
            <span className="zc-facebook-feed-reel__audio-text">{`${name} ${MIDDOT} ${audio}`}</span>
          </div>
        )}
        <div className="zc-facebook-feed-reel__caption">
          <span className="zc-facebook-feed-reel__caption-text">{caption}</span>
          <button
            type="button"
            className="zc-facebook-feed-button zc-facebook-feed-reel__more"
            onClick={() => onAction?.('more')}
          >
            {MORE_LABEL}
          </button>
        </div>
      </div>
    </article>
  );
}
