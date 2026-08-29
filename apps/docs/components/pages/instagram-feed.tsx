'use client';

import { useState, type CSSProperties } from 'react';

import { Button } from '@zyncat/ui/button';
import { InstagramFeed, type InstagramFeedAction } from '@zyncat/ui/instagram-feed';

const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexDirection: 'column' };
const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' };
const DECK: CSSProperties = { display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' };
const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
const LOG: CSSProperties = { font: 'var(--type-mono)', color: 'var(--text-subtle)', minHeight: 'var(--space-5)' };

const PHOTO: CSSProperties = {
  background:
    'radial-gradient(120% 90% at 22% 12%, rgba(255, 236, 196, 0.95) 0%, rgba(255, 236, 196, 0) 55%), linear-gradient(168deg, #1f3b33 0%, #3f6d58 38%, #96b184 66%, #e2d3ac 100%)',
};

const SQUARE_PHOTO: CSSProperties = {
  background:
    'conic-gradient(from 210deg at 62% 38%, #f2b271 0deg, #d8577d 110deg, #6c5ce7 210deg, #2f8f9d 300deg, #f2b271 360deg)',
};

const REEL: CSSProperties = {
  inset: 0,
  margin: 'auto',
  width: '100%',
  height: 'auto',
  aspectRatio: '16 / 9',
  background: 'linear-gradient(104deg, #101820 0%, #2b4a6f 40%, #7d5ba6 72%, #e08d79 100%)',
};

const FACE: CSSProperties = { background: 'linear-gradient(145deg, #ffd9a0 0%, #e0736a 52%, #6d3f8c 100%)' };

const LONG_CAPTION =
  'Six hours up the ghat road with @northfieldcrew before the mist lifted #kerala #munnar and the whole valley went gold at once, tea terraces stacked all the way up to the ridge line';

const SHORT_CAPTION = 'Munnar vibe #kerala #travel #dubai';

const PHOTO_ART = <div style={PHOTO} />;
const SQUARE_ART = <div style={SQUARE_PHOTO} />;
const REEL_ART = <div style={REEL} />;
const FACE_ART = <div style={FACE} />;

export function InstagramFeedHero() {
  return (
    <div style={DECK}>
      <InstagramFeed
        width="mobile"
        handle="northfieldsupply"
        caption={SHORT_CAPTION}
        stamp="1d"
        media={PHOTO_ART}
        avatar={FACE_ART}
        likes={760400}
        comments={2600}
        reposts={3100}
      />
      <InstagramFeed
        width="web"
        handle="northfieldsupply"
        caption={SHORT_CAPTION}
        stamp="1d"
        media={PHOTO_ART}
        avatar={FACE_ART}
        likes={760400}
        comments={2600}
        reposts={3100}
      />
    </div>
  );
}

export function InstagramFeedTypes() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        An image post keeps the white header strip. A video post runs the black frame from the top of the card and puts
        the header on it in white, Follow loses its pill, and the audio credit takes a second line.
      </span>
      <div style={DECK}>
        <InstagramFeed
          type="image"
          handle="northfieldsupply"
          caption={SHORT_CAPTION}
          stamp="1d"
          media={PHOTO_ART}
          avatar={FACE_ART}
          likes={760400}
          comments={2600}
          reposts={3100}
        />
        <InstagramFeed
          type="video"
          handle="northfieldsupply"
          caption={SHORT_CAPTION}
          stamp="1d"
          audio="northfieldsupply · Original audio"
          media={REEL_ART}
          avatar={FACE_ART}
          likes={128000}
          comments={940}
          reposts={412}
        />
      </div>
    </div>
  );
}

export function InstagramFeedWidths() {
  const [width, setWidth] = useState<'mobile' | 'web'>('web');
  return (
    <div style={COLUMN}>
      <div style={ROW}>
        <Button size="sm" variant={width === 'mobile' ? 'primary' : 'secondary'} onClick={() => setWidth('mobile')}>
          mobile 390
        </Button>
        <Button size="sm" variant={width === 'web' ? 'primary' : 'secondary'} onClick={() => setWidth('web')}>
          web 470
        </Button>
      </div>
      <span style={CAPTION}>The web column adds Follow to the header and rounds the card. Mobile does neither.</span>
      <InstagramFeed
        width={width}
        handle="northfieldsupply"
        caption={SHORT_CAPTION}
        stamp="1d"
        media={PHOTO_ART}
        avatar={FACE_ART}
        likes={760400}
        comments={2600}
        reposts={3100}
      />
    </div>
  );
}

export function InstagramFeedRatios() {
  return (
    <div style={DECK}>
      <InstagramFeed
        ratio="4:5"
        handle="northfieldsupply"
        caption="Portrait, the default frame"
        stamp="4h"
        media={PHOTO_ART}
        avatar={FACE_ART}
        likes={12400}
        comments={188}
        reposts={31}
      />
      <InstagramFeed
        ratio="1:1"
        handle="northfieldsupply"
        caption="Square, the other frame"
        stamp="4h"
        media={SQUARE_ART}
        avatar={FACE_ART}
        likes={12400}
        comments={188}
        reposts={31}
      />
    </div>
  );
}

export function InstagramFeedCaption() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        The caption clips at 125 characters on a word boundary and ends in a grey &quot;... more&quot;. Hashtags and
        mentions take the platform link blue.
      </span>
      <InstagramFeed
        handle="northfieldsupply"
        caption={LONG_CAPTION}
        stamp="2d"
        media={PHOTO_ART}
        avatar={FACE_ART}
        likes={4200}
        comments={96}
        reposts={12}
      />
    </div>
  );
}

export function InstagramFeedPlaceholder() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        With no media and no avatar the card falls back to the platform&apos;s flat fills. Nothing is fetched.
      </span>
      <div style={DECK}>
        <InstagramFeed handle="northfieldsupply" caption="No media supplied" stamp="1h" />
        <InstagramFeed type="video" handle="northfieldsupply" caption="No media supplied" stamp="1h" />
      </div>
    </div>
  );
}

export function InstagramFeedControlled() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [last, setLast] = useState<InstagramFeedAction | null>(null);

  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Double-tap the frame to like it: the toolbar heart pops, the count picks up your like, and a white heart bursts
        over the media. Every glyph is a real button, reachable by Tab.
      </span>
      <InstagramFeed
        type="video"
        handle="northfieldsupply"
        caption="Tap the heart, the bookmark, or the mute chip @northfieldcrew"
        stamp="9h"
        audio="northfieldsupply · Original audio"
        media={REEL_ART}
        avatar={FACE_ART}
        likes={128000}
        comments={940}
        reposts={412}
        liked={liked}
        onLikedChange={setLiked}
        saved={saved}
        onSavedChange={setSaved}
        muted={muted}
        onMutedChange={setMuted}
        onAction={setLast}
      />
      <div style={ROW}>
        <Button size="sm" variant={liked ? 'primary' : 'secondary'} onClick={() => setLiked(!liked)}>
          liked
        </Button>
        <Button size="sm" variant={saved ? 'primary' : 'secondary'} onClick={() => setSaved(!saved)}>
          saved
        </Button>
        <Button size="sm" variant={muted ? 'primary' : 'secondary'} onClick={() => setMuted(!muted)}>
          muted
        </Button>
      </div>
      <span style={LOG}>last stateless action: {last ?? 'none yet'}</span>
    </div>
  );
}

export function InstagramFeedReducedMotion() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Under prefers-reduced-motion the heart and bookmark pops resolve to their settled scale with no travel, the
        hover dim and the fill change collapse to 1ms with every other transition in the system, and the double-tap
        burst never mounts - the like still registers and the count still moves.
      </span>
      <InstagramFeed
        handle="northfieldsupply"
        caption={SHORT_CAPTION}
        stamp="1d"
        media={PHOTO_ART}
        avatar={FACE_ART}
        likes={760400}
        comments={2600}
        reposts={3100}
        defaultLiked
        defaultSaved
      />
    </div>
  );
}
