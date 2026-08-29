'use client';

import { useState, type CSSProperties } from 'react';

import { Button } from '@zyncat/ui/button';
import { YouTube } from '@zyncat/ui/youtube';

const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexDirection: 'column' };
const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' };
const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };

const CANVAS: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: 'var(--space-5)',
  borderRadius: 'var(--radius-lg)',
  border: 'var(--border-hairline) solid var(--border-default)',
  background: '#ffffff',
  overflowX: 'auto',
};

const WIDE_CANVAS: CSSProperties = { ...CANVAS, justifyContent: 'flex-start' };

const REDUCED: CSSProperties = {
  '--duration-fast': '1ms',
  '--duration-base': '1ms',
  '--duration-slow': '1ms',
  '--duration-slower': '1ms',
} as CSSProperties;

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

export function YouTubeVideoHero() {
  return (
    <div style={CANVAS}>
      <YouTube
        surface="video"
        title={VIDEO_TITLE}
        channel="Shark Tank Global"
        views="2m views"
        age="1 year ago"
        duration="34:46"
        verified
        media={THUMB}
        avatar={AVATAR}
      />
    </div>
  );
}

export function YouTubeVideoPlaceholderDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>No media, no avatar, no duration, no tick - every empty state is CSS only</span>
      <div style={CANVAS}>
        <YouTube
          surface="video"
          title="A short title"
          channel="Unverified Channel"
          views="812 views"
          age="2 days ago"
        />
      </div>
    </div>
  );
}

export function YouTubeShortDemo() {
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(7);
  return (
    <div style={COLUMN}>
      <div style={WIDE_CANVAS}>
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
          media={SHORT_MEDIA}
          avatar={AVATAR}
        />
      </div>
      <div style={ROW}>
        <Button size="sm" variant="secondary" onClick={() => setPaused(!paused)}>
          {paused ? 'paused' : 'playing'}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setProgress(0)}>
          0%
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setProgress(42)}>
          42%
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setProgress(100)}>
          100%
        </Button>
        <span style={CAPTION}>progress is a prop - the bar transitions to it, it never runs on a timer</span>
      </div>
    </div>
  );
}

export function YouTubeShortUncontrolledDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>Uncontrolled: the play control owns its own state, the bar sits where progress says</span>
      <div style={WIDE_CANVAS}>
        <YouTube
          surface="short"
          title="No media supplied - the stage falls back to a CSS placeholder"
          channel="@zyncat"
          likes={2400000}
          comments={128}
          remixes={0}
          progress={64}
        />
      </div>
    </div>
  );
}

export function YouTubePostCarouselDemo() {
  const [page, setPage] = useState(0);
  return (
    <div style={COLUMN}>
      <div style={CANVAS}>
        <YouTube
          surface="post"
          channel="HappyCairek"
          age="9 days ago"
          text={POST_TEXT}
          likes={2000}
          comments={207}
          carousel={SLIDES}
          page={page}
          onPageChange={setPage}
          avatar={POST_AVATAR}
        />
      </div>
      <div style={ROW}>
        <span style={CAPTION}>
          page {page + 1} of {SLIDES.length} - drag the strip, press the arrows, or focus it and use the arrow keys
        </span>
      </div>
    </div>
  );
}

export function YouTubePostSingleDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>One image: no arrows, no stack badge, no carousel role</span>
      <div style={CANVAS}>
        <YouTube
          surface="post"
          channel="HappyCairek"
          age="9 days ago"
          text="A single frame post."
          likes={2000}
          comments={207}
          media={POST_IMAGE}
          avatar={POST_AVATAR}
        />
      </div>
    </div>
  );
}

export function YouTubeCountsDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>187000 renders 187k, 3539 stays 3,539, 2000 renders 2k, 207 stays 207</span>
      <div style={WIDE_CANVAS}>
        <YouTube
          surface="short"
          title={SHORT_TITLE}
          channel="@actuallycarterpcs"
          likes={187000}
          comments={3539}
          remixes={3}
          progress={7}
          media={SHORT_MEDIA}
          avatar={AVATAR}
        />
      </div>
    </div>
  );
}

export function YouTubeReducedMotionDemo() {
  const [page, setPage] = useState(0);
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Duration tokens pinned to 1ms - the carousel and the progress bar land on the right frame with no travel
      </span>
      <div style={{ ...CANVAS, ...REDUCED }}>
        <YouTube
          surface="post"
          channel="HappyCairek"
          age="9 days ago"
          text={POST_TEXT}
          likes={2000}
          comments={207}
          carousel={SLIDES}
          page={page}
          onPageChange={setPage}
          avatar={POST_AVATAR}
        />
      </div>
    </div>
  );
}
