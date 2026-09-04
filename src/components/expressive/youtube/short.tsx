'use client';

import type { CSSProperties, ReactElement } from 'react';

import { compactCount, groupedCount } from './format';
import {
  BubbleGlyph,
  ExpandGlyph,
  HeartGlyph,
  KebabGlyph,
  PauseGlyph,
  PlayGlyph,
  RemixGlyph,
  ShareGlyph,
  SpeakerGlyph,
} from './glyphs';
import { Media, type YouTubeAction, type YouTubeMedia } from './media';

const PROGRESS_PROPERTY = '--youtube-progress';
const PROGRESS_MIN = 0;
const PROGRESS_MAX = 100;

const PLAY_LABEL = 'Play';
const PAUSE_LABEL = 'Pause';
const PROGRESS_LABEL = 'Playback progress';
const LIKES_LABEL = 'Likes';
const COMMENTS_LABEL = 'Comments';
const REMIXES_LABEL = 'Remixes';
const SHARE_LABEL = 'Share';
const LIKE_ACTION = 'Like';
const COMMENT_ACTION = 'Comment';
const REMIX_ACTION = 'Remix';
const CAPTIONS_LABEL = 'cc';
const MENU_LABEL = 'More options';
const EXPAND_LABEL = 'Expand';

function progressStyle(progress: number): CSSProperties {
  const clamped = Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, Number(progress) || PROGRESS_MIN));
  return { [PROGRESS_PROPERTY]: clamped } as CSSProperties;
}

function progressValue(progress: number): number {
  return Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, Number(progress) || PROGRESS_MIN));
}

function RailAction({
  glyph,
  action,
  name,
  count,
  pressed,
  onClick,
}: {
  glyph: ReactElement;
  action: string;
  name: string;
  count?: string;
  pressed?: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <li className="zc-youtube-short__action">
      <button
        type="button"
        className="zc-youtube-button zc-youtube-short__action-face"
        aria-label={action}
        aria-pressed={pressed}
        onClick={onClick}
      >
        {glyph}
      </button>
      <span className="zc-youtube-short__action-label">
        {count !== undefined && <span className="zc-youtube__sr">{name} </span>}
        {count ?? name}
      </span>
    </li>
  );
}

export interface ShortSurfaceProps {
  title: string;
  channel: string;
  likes: number;
  comments: number;
  remixes: number;
  paused: boolean;
  progress: number;
  media?: YouTubeMedia;
  avatar?: YouTubeMedia;
  onTogglePaused: () => void;
  liked: boolean;
  onLikedChange: (liked: boolean) => void;
  onAction?: (action: YouTubeAction) => void;
}

export function ShortSurface({
  title,
  channel,
  likes,
  comments,
  remixes,
  paused,
  progress,
  media,
  avatar,
  onTogglePaused,
  liked,
  onLikedChange,
  onAction,
}: ShortSurfaceProps): ReactElement {
  return (
    <>
      <div className="zc-youtube-short__meta">
        <div className="zc-youtube-short__account">
          <div className="zc-youtube-short__account-avatar">
            <Media source={avatar} className="zc-youtube__avatar-media" />
          </div>
          <span className="zc-youtube-short__handle">{channel}</span>
        </div>
        <p className="zc-youtube-short__title">{title}</p>
      </div>

      <div className="zc-youtube-short__stage">
        <div className="zc-youtube-short__frame">
          <Media source={media} />
        </div>

        <div className="zc-youtube-short__controls">
          <button
            type="button"
            className="zc-youtube-short__control"
            aria-pressed={paused}
            aria-label={paused ? PLAY_LABEL : PAUSE_LABEL}
            onClick={onTogglePaused}
          >
            {paused ? <PlayGlyph /> : <PauseGlyph />}
          </button>
          <span className="zc-youtube-short__control zc-youtube-short__control--static" aria-hidden="true">
            <SpeakerGlyph />
          </span>
        </div>

        <div className="zc-youtube-short__pill">
          <span className="zc-youtube-short__pill-cell" aria-hidden="true">
            <span className="zc-youtube-short__captions">{CAPTIONS_LABEL}</span>
          </span>
          <button
            type="button"
            className="zc-youtube-button zc-youtube-short__pill-cell"
            aria-label={MENU_LABEL}
            onClick={() => onAction?.('menu')}
          >
            <KebabGlyph />
          </button>
          <button
            type="button"
            className="zc-youtube-button zc-youtube-short__pill-cell"
            aria-label={EXPAND_LABEL}
            onClick={() => onAction?.('expand')}
          >
            <ExpandGlyph />
          </button>
        </div>

        <div
          className="zc-youtube-short__progress"
          role="progressbar"
          aria-label={PROGRESS_LABEL}
          aria-valuemin={PROGRESS_MIN}
          aria-valuemax={PROGRESS_MAX}
          aria-valuenow={progressValue(progress)}
        >
          <div className="zc-youtube-short__progress-fill" style={progressStyle(progress)} />
        </div>
      </div>

      <ul className="zc-youtube-short__rail">
        <RailAction
          glyph={<HeartGlyph />}
          action={LIKE_ACTION}
          name={LIKES_LABEL}
          count={compactCount(likes + (liked ? 1 : 0))}
          pressed={liked}
          onClick={() => onLikedChange(!liked)}
        />
        <RailAction
          glyph={<BubbleGlyph />}
          action={COMMENT_ACTION}
          name={COMMENTS_LABEL}
          count={groupedCount(comments)}
          onClick={() => onAction?.('comment')}
        />
        <RailAction
          glyph={<ShareGlyph />}
          action={SHARE_LABEL}
          name={SHARE_LABEL}
          onClick={() => onAction?.('share')}
        />
        <RailAction
          glyph={<RemixGlyph />}
          action={REMIX_ACTION}
          name={REMIXES_LABEL}
          count={groupedCount(remixes)}
          onClick={() => onAction?.('remix')}
        />
        <li className="zc-youtube-short__rail-avatar" aria-hidden="true">
          <Media source={avatar} className="zc-youtube__avatar-media" />
        </li>
      </ul>
    </>
  );
}
