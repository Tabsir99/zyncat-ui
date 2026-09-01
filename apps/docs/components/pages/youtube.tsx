'use client';

import { useState, type CSSProperties } from 'react';

import { YouTube, type YouTubeSurface } from '@zyncat/ui/youtube';

import { FitStage, KnobRange, KnobSegment, KnobSwitch, Playground } from '../playground';

const FILL: CSSProperties = { width: '100%', height: '100%' };

const THUMB_ART: CSSProperties = {
  ...FILL,
  background: 'linear-gradient(135deg, #2b1a12 0%, #a4531d 46%, #f0b429 72%, #1c1208 100%)',
};

const SHORT_ART: CSSProperties = {
  ...FILL,
  background: 'linear-gradient(190deg, #1b2a6b 0%, #3b4fb8 40%, #7f6fd4 78%, #10163a 100%)',
};

const AVATAR_ART: CSSProperties = {
  ...FILL,
  background: 'radial-gradient(circle at 34% 30%, #ffd25a 0%, #c47b12 52%, #1a1206 100%)',
};

const POSTER_ART: CSSProperties = {
  ...FILL,
  background: 'radial-gradient(circle at 60% 34%, #f2b6a0 0%, #b8503c 55%, #2a0f0a 100%)',
};

const SLIDE_ONE: CSSProperties = {
  ...FILL,
  background: 'linear-gradient(160deg, #7fc7e8 0%, #2f6f9a 55%, #10344b 100%)',
};

const SLIDE_TWO: CSSProperties = {
  ...FILL,
  background: 'linear-gradient(160deg, #f6d9a0 0%, #cf8f3f 52%, #4a2c0c 100%)',
};

const SLIDE_THREE: CSSProperties = {
  ...FILL,
  background: 'linear-gradient(160deg, #b7e3c0 0%, #3f8f63 55%, #143526 100%)',
};

const THUMB = <div style={THUMB_ART} />;
const SHORT_MEDIA = <div style={SHORT_ART} />;
const AVATAR = <div style={AVATAR_ART} />;
const POST_AVATAR = <div style={POSTER_ART} />;
const POST_IMAGE = <div style={SLIDE_ONE} />;
const SLIDES = [
  <div key="a" style={SLIDE_ONE} />,
  <div key="b" style={SLIDE_TWO} />,
  <div key="c" style={SLIDE_THREE} />,
];

const VIDEO_TITLE = "Mark Cuban's Biggest Investments EVER | Shark Tank US | Shark Tank Global";
const SHORT_TITLE = 'Which AI do I trust the most?? (Top 5 List) #carterpcs #ai';
const POST_TEXT =
  'Unc is on a little side quest in Sardinia. More livestreams and videos coming soon. I need that robodog asap';

const WHITE_MAT: CSSProperties = { background: '#ffffff' };

const SURFACE_WIDTH: Record<YouTubeSurface, number> = { video: 533, short: 1106, post: 638 };

const NOTES: Record<YouTubeSurface, string> = {
  video: 'The feed grid card - thumbnail badge, verified tick, meta line.',
  short:
    'The 1106px watch page, scaled to fit this column - open it at full size for the real metrics. progress and paused are consumer state, never a timer.',
  post: 'Drag the strip, press the arrows, or focus it and use the arrow keys.',
};

const TITLES: Record<YouTubeSurface, string> = {
  video: 'YouTube - feed card',
  short: 'YouTube - Shorts watch page',
  post: 'YouTube - community post',
};

export function YouTubePlayground() {
  const [surface, setSurface] = useState<YouTubeSurface>('video');
  const [media, setMedia] = useState(true);
  const [verified, setVerified] = useState(true);
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(42);
  const [carousel, setCarousel] = useState(true);
  const [page, setPage] = useState(0);

  const surfaceCode: Record<YouTubeSurface, string> = {
    video: `<YouTube
  surface="video"
  title="${VIDEO_TITLE.slice(0, 42)}..."
  channel="Shark Tank Global"
  views="2m views"
  age="1 year ago"
  duration="34:46"
  verified={${verified}}${media ? '\n  media={thumb}\n  avatar={avatar}' : ''}
/>`,
    short: `<YouTube
  surface="short"
  title="${SHORT_TITLE}"
  channel="@actuallycarterpcs"
  likes={187000}
  comments={3539}
  paused={${paused}}
  onPausedChange={setPaused}
  progress={${progress}}${media ? '\n  media={clip}\n  avatar={avatar}' : ''}
/>`,
    post: `<YouTube
  surface="post"
  channel="HappyCairek"
  age="9 days ago"
  text="${POST_TEXT.slice(0, 40)}..."
  likes={2000}
  comments={207}
  ${carousel ? 'carousel={slides}\n  page={page}\n  onPageChange={setPage}' : 'media={image}'}${media ? '\n  avatar={avatar}' : ''}
/>`,
  };

  return (
    <Playground
      code={surfaceCode[surface]}
      stage="plate"
      layout="under"
      stageStyle={WHITE_MAT}
      expandTitle={TITLES[surface]}
      note={NOTES[surface]}
      rail={
        <>
          <KnobSegment label="surface" value={surface} onChange={setSurface} options={['video', 'short', 'post']} />
          {surface === 'video' ? <KnobSwitch label="verified" checked={verified} onChange={setVerified} /> : null}
          {surface === 'short' ? (
            <>
              <KnobSwitch label="paused" checked={paused} onChange={setPaused} />
              <KnobRange
                label="progress"
                value={progress}
                onChange={setProgress}
                min={0}
                max={100}
                step={1}
                format={(v) => `${v}%`}
              />
            </>
          ) : null}
          {surface === 'post' ? <KnobSwitch label="carousel" checked={carousel} onChange={setCarousel} /> : null}
          <KnobSwitch label="media" checked={media} onChange={setMedia} />
        </>
      }
    >
      <FitStage width={SURFACE_WIDTH[surface]}>
        {surface === 'video' ? (
          <YouTube
            surface="video"
            title={VIDEO_TITLE}
            channel="Shark Tank Global"
            views="2m views"
            age="1 year ago"
            duration="34:46"
            verified={verified}
            media={media ? THUMB : undefined}
            avatar={media ? AVATAR : undefined}
          />
        ) : surface === 'short' ? (
          <YouTube
            surface="short"
            title={SHORT_TITLE}
            channel="@actuallycarterpcs"
            likes={187000}
            comments={3539}
            remixes={3}
            paused={paused}
            onPausedChange={setPaused}
            progress={progress}
            media={media ? SHORT_MEDIA : undefined}
            avatar={media ? AVATAR : undefined}
          />
        ) : (
          <YouTube
            surface="post"
            channel="HappyCairek"
            age="9 days ago"
            text={POST_TEXT}
            likes={2000}
            comments={207}
            carousel={carousel ? SLIDES : undefined}
            media={carousel ? undefined : POST_IMAGE}
            page={carousel ? page : undefined}
            onPageChange={carousel ? setPage : undefined}
            avatar={media ? POST_AVATAR : undefined}
          />
        )}
      </FitStage>
    </Playground>
  );
}
