'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../internal/utils/cx';
import { compactCount, countValue, MediaSurface, Portrait, type FacebookMediaType } from './chrome';
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
  className,
  style,
  htmlProps,
}: FacebookReelProps) {
  const wide = stage === 'wide';

  return (
    <article
      className={cx('facebook-feed-reel', wide ? 'facebook-feed-reel--wide' : 'facebook-feed-reel--narrow', className)}
      style={style}
      {...htmlProps}
    >
      <div className="facebook-feed-media facebook-feed-reel__video">
        <MediaSurface media={media} type={type} frontClassName="facebook-feed-media__front" />
      </div>

      <button
        type="button"
        className="facebook-feed-reel__mute"
        aria-label={MUTE_LABEL}
        aria-pressed={muted}
        onClick={() => onMutedChange(!muted)}
      >
        {muted ? (
          <SpeakerOutlineOff className="facebook-feed-reel__mute-glyph" />
        ) : (
          <SpeakerOutlineOn className="facebook-feed-reel__mute-glyph" />
        )}
      </button>

      {wide ? <Magnifier className="facebook-feed-reel__search" /> : null}

      <div className="facebook-feed-reel__rail">
        <span className="facebook-feed-reel__stat" role="img" aria-label={`${countValue(likes)} likes`}>
          <ThumbOutline className="facebook-feed-reel__stat-glyph" />
          <span className="facebook-feed-reel__count">{compactCount(likes)}</span>
        </span>
        <span className="facebook-feed-reel__stat" role="img" aria-label={`${countValue(comments)} comments`}>
          <CommentOutline className="facebook-feed-reel__stat-glyph" />
          <span className="facebook-feed-reel__count">{compactCount(comments)}</span>
        </span>
        <span className="facebook-feed-reel__stat" role="img" aria-label={`${countValue(shares)} shares`}>
          <ShareOutline className="facebook-feed-reel__stat-glyph" />
          <span className="facebook-feed-reel__count">{compactCount(shares)}</span>
        </span>
        <span className="facebook-feed-reel__kebab" aria-hidden="true">
          {KEBAB_PIPS.map((pip) => (
            <span key={pip} className="facebook-feed-reel__pip" />
          ))}
        </span>
      </div>

      <div className="facebook-feed-reel__overlay">
        <div className="facebook-feed-reel__byline">
          <Portrait avatar={avatar} className="facebook-feed-reel__avatar" />
          <span className="facebook-feed-reel__name">{name}</span>
          {verified ? <VerifiedBadge className="facebook-feed-reel__badge" /> : null}
          {follow ? (
            <span className="facebook-feed-reel__follow">
              <span className="facebook-feed-reel__follow-dot">{MIDDOT}</span>
              <span className="facebook-feed-reel__follow-label">{FOLLOW_LABEL}</span>
            </span>
          ) : null}
        </div>
        {wide ? null : (
          <div className="facebook-feed-reel__audio">
            <span className="facebook-feed-reel__note" aria-hidden="true">
              {NOTE}
            </span>
            <span className="facebook-feed-reel__audio-text">{`${name} ${MIDDOT} ${audio}`}</span>
          </div>
        )}
        <div className="facebook-feed-reel__caption">
          <span className="facebook-feed-reel__caption-text">{caption}</span>
          <span className="facebook-feed-reel__more">{MORE_LABEL}</span>
        </div>
      </div>
    </article>
  );
}
