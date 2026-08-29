'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../internal/utils/cx';
import { MediaSurface, Portrait, type FacebookFeedAction, type FacebookMediaType, type FacebookRatio } from './chrome';
import { AudienceFriends, ChevronRight, PlaySolid, SpeakerSolidOff, SpeakerSolidOn } from './icons';

const KEBAB_PIPS = [0, 1, 2];
const MIDDOT = '·';
const NOTE = '♪';
const MUTE_LABEL = 'Mute';
const PLAY_LABEL = 'Play';
const MENU_LABEL = 'More options';

export interface FacebookStoryProps {
  name: string;
  stamp: string;
  audio: string;
  ratio: FacebookRatio;
  media?: ReactNode;
  avatar?: ReactNode;
  type: FacebookMediaType;
  segments: number;
  segment: number;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  onAction?: (action: FacebookFeedAction) => void;
  className: string;
  style?: CSSProperties;
  htmlProps?: HTMLAttributes<HTMLElement>;
}

export function FacebookStory({
  name,
  stamp,
  audio,
  ratio,
  media,
  avatar,
  type,
  segments,
  segment,
  muted,
  onMutedChange,
  onAction,
  className,
  style,
  htmlProps,
}: FacebookStoryProps) {
  const track = Array.from({ length: Math.max(1, Math.round(segments)) }, (_, index) => index);

  return (
    <article className={cx('facebook-feed-story', className)} style={style} {...htmlProps}>
      <div className="facebook-feed-story__stage">
        <MediaSurface
          media={media}
          type={type}
          backClassName="facebook-feed-media__back facebook-feed-story__back"
          frontClassName="facebook-feed-media__front facebook-feed-media__front--cover facebook-feed-story__card facebook-feed-ratio"
          frontRatio={ratio}
        />
      </div>

      <div className="facebook-feed-story__segments" aria-hidden="true">
        {track.map((index) => (
          <span
            key={index}
            className={cx(
              'facebook-feed-story__segment',
              index <= segment ? 'facebook-feed-story__segment--filled' : undefined,
            )}
          />
        ))}
      </div>

      <div className="facebook-feed-story__header">
        <Portrait avatar={avatar} className="facebook-feed-story__avatar" />
        <div className="facebook-feed-story__identity">
          <div className="facebook-feed-story__name-row">
            <span className="facebook-feed-story__name">{name}</span>
            <span className="facebook-feed-story__stamp">{stamp}</span>
            <AudienceFriends className="facebook-feed-story__audience" />
          </div>
          <div className="facebook-feed-story__audio">
            <span className="facebook-feed-story__note" aria-hidden="true">
              {NOTE}
            </span>
            <span className="facebook-feed-story__audio-text">{`${name} ${MIDDOT} ${audio}`}</span>
            <ChevronRight className="facebook-feed-story__chevron" />
          </div>
        </div>
        <div className="facebook-feed-story__controls">
          <button
            type="button"
            className="facebook-feed-story__mute"
            aria-label={MUTE_LABEL}
            aria-pressed={muted}
            onClick={() => onMutedChange(!muted)}
          >
            {muted ? (
              <SpeakerSolidOff
                className="facebook-feed-story__mute-glyph"
                crossClassName="facebook-feed-story__mute-cross"
              />
            ) : (
              <SpeakerSolidOn className="facebook-feed-story__mute-glyph" />
            )}
          </button>
          <button
            type="button"
            className="facebook-feed-button"
            aria-label={PLAY_LABEL}
            onClick={() => onAction?.('play')}
          >
            <PlaySolid className="facebook-feed-story__play" />
          </button>
          <button
            type="button"
            className="facebook-feed-button facebook-feed-story__kebab"
            aria-label={MENU_LABEL}
            onClick={() => onAction?.('menu')}
          >
            {KEBAB_PIPS.map((pip) => (
              <span key={pip} className="facebook-feed-story__pip" />
            ))}
          </button>
        </div>
      </div>
    </article>
  );
}
