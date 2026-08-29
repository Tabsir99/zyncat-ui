import type { ReactElement } from 'react';

import { KebabGlyph, VerifiedGlyph } from './glyphs';
import { Media, type YouTubeMedia } from './media';

export interface VideoSurfaceProps {
  title: string;
  channel: string;
  views: string;
  age: string;
  duration: string;
  verified: boolean;
  media?: YouTubeMedia;
  avatar?: YouTubeMedia;
}

export function VideoSurface({
  title,
  channel,
  views,
  age,
  duration,
  verified,
  media,
  avatar,
}: VideoSurfaceProps): ReactElement {
  return (
    <>
      <div className="youtube-video__frame">
        <Media source={media} />
        {duration && <span className="youtube-video__duration">{duration}</span>}
      </div>

      <div className="youtube-video__meta">
        <div className="youtube-video__avatar">
          <Media source={avatar} className="youtube__avatar-media" />
        </div>

        <div className="youtube-video__text">
          <h3 className="youtube-video__title">{title}</h3>
          <p className="youtube-video__byline">
            <span className="youtube-video__channel">{channel}</span>
            {verified && (
              <span className="youtube-video__verified">
                <VerifiedGlyph />
              </span>
            )}
          </p>
          <p className="youtube-video__stats">
            {views}
            <span className="youtube-video__dot" aria-hidden="true">
              •
            </span>
            {age}
          </p>
        </div>

        <span className="youtube-video__more" aria-hidden="true">
          <KebabGlyph />
        </span>
      </div>
    </>
  );
}
