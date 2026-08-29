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
import { Media, type YouTubeMedia } from './media';

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
const CAPTIONS_LABEL = 'cc';

function progressStyle(progress: number): CSSProperties {
  const clamped = Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, Number(progress) || PROGRESS_MIN));
  return { [PROGRESS_PROPERTY]: clamped } as CSSProperties;
}

function progressValue(progress: number): number {
  return Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, Number(progress) || PROGRESS_MIN));
}

function RailAction({ glyph, name, count }: { glyph: ReactElement; name: string; count?: string }): ReactElement {
  return (
    <li className="youtube-short__action">
      <span className="youtube-short__action-face" aria-hidden="true">
        {glyph}
      </span>
      <span className="youtube-short__action-label">
        {count !== undefined && <span className="youtube__sr">{name} </span>}
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
}: ShortSurfaceProps): ReactElement {
  return (
    <>
      <div className="youtube-short__meta">
        <div className="youtube-short__account">
          <div className="youtube-short__account-avatar">
            <Media source={avatar} className="youtube__avatar-media" />
          </div>
          <span className="youtube-short__handle">{channel}</span>
        </div>
        <p className="youtube-short__title">{title}</p>
      </div>

      <div className="youtube-short__stage">
        <div className="youtube-short__frame">
          <Media source={media} />
        </div>

        <div className="youtube-short__controls">
          <button
            type="button"
            className="youtube-short__control"
            aria-pressed={paused}
            aria-label={paused ? PLAY_LABEL : PAUSE_LABEL}
            onClick={onTogglePaused}
          >
            {paused ? <PlayGlyph /> : <PauseGlyph />}
          </button>
          <span className="youtube-short__control youtube-short__control--static" aria-hidden="true">
            <SpeakerGlyph />
          </span>
        </div>

        <div className="youtube-short__pill" aria-hidden="true">
          <span className="youtube-short__pill-cell">
            <span className="youtube-short__captions">{CAPTIONS_LABEL}</span>
          </span>
          <span className="youtube-short__pill-cell">
            <KebabGlyph />
          </span>
          <span className="youtube-short__pill-cell">
            <ExpandGlyph />
          </span>
        </div>

        <div
          className="youtube-short__progress"
          role="progressbar"
          aria-label={PROGRESS_LABEL}
          aria-valuemin={PROGRESS_MIN}
          aria-valuemax={PROGRESS_MAX}
          aria-valuenow={progressValue(progress)}
        >
          <div className="youtube-short__progress-fill" style={progressStyle(progress)} />
        </div>
      </div>

      <ul className="youtube-short__rail">
        <RailAction glyph={<HeartGlyph />} name={LIKES_LABEL} count={compactCount(likes)} />
        <RailAction glyph={<BubbleGlyph />} name={COMMENTS_LABEL} count={groupedCount(comments)} />
        <RailAction glyph={<ShareGlyph />} name={SHARE_LABEL} />
        <RailAction glyph={<RemixGlyph />} name={REMIXES_LABEL} count={groupedCount(remixes)} />
        <li className="youtube-short__rail-avatar" aria-hidden="true">
          <Media source={avatar} className="youtube__avatar-media" />
        </li>
      </ul>
    </>
  );
}
