'use client';

import { useState, type CSSProperties } from 'react';

import { FacebookFeed } from '@zyncat/ui/facebook-feed';

const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-5)', flexDirection: 'column' };
const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start', flexWrap: 'wrap' };
const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
const LABELLED: CSSProperties = { display: 'grid', gap: 'var(--space-2)', justifyItems: 'start' };
const LOG: CSSProperties = { font: 'var(--type-mono)', color: 'var(--text-subtle)', minHeight: 'var(--space-5)' };

const CANVAS: CSSProperties = {
  padding: 'var(--space-5)',
  background: 'var(--bg-app)',
  borderRadius: 'var(--radius-lg)',
};

const NARROW_REEL_SCALE = 0.4;
const WIDE_REEL_SCALE = 0.34;
const STORY_SCALE = 0.44;

const NARROW_REEL_BOX: CSSProperties = {
  width: 557 * NARROW_REEL_SCALE,
  height: 878 * NARROW_REEL_SCALE,
  overflow: 'hidden',
};
const WIDE_REEL_BOX: CSSProperties = {
  width: 1601 * WIDE_REEL_SCALE,
  height: 886 * WIDE_REEL_SCALE,
  overflow: 'hidden',
};
const STORY_BOX: CSSProperties = { width: 486 * STORY_SCALE, height: 864 * STORY_SCALE, overflow: 'hidden' };

const NARROW_REEL_FIT: CSSProperties = { transform: `scale(${NARROW_REEL_SCALE})`, transformOrigin: 'top left' };
const WIDE_REEL_FIT: CSSProperties = { transform: `scale(${WIDE_REEL_SCALE})`, transformOrigin: 'top left' };
const STORY_FIT: CSSProperties = { transform: `scale(${STORY_SCALE})`, transformOrigin: 'top left' };

const RIDGE: CSSProperties = {
  background:
    'repeating-linear-gradient(118deg, #2f6f8f 0 34px, #3f8fae 34px 62px, #7fb9c4 62px 78px, #d8c9a4 78px 104px)',
};
const DUSK: CSSProperties = {
  background: 'radial-gradient(88% 66% at 30% 22%, #f0a970 0%, #b8556a 44%, #2b2a52 100%)',
};
const PORTRAIT: CSSProperties = {
  background: 'conic-gradient(from 210deg at 50% 50%, #7a5cf0, #f06ca8, #ffb36b, #7a5cf0)',
};

const LONG_CAPTION =
  'Three days above the fog line and the light never repeated itself once. We started at the Oeschinensee ' +
  'trailhead before sunrise, traversed the ridge with @swissalpineclub, and dropped into the valley just as ' +
  'the last of the cloud burned off. Bring more film than you think you need, and do not trust the forecast ' +
  'past midday. #switzerland #alps #filmphotography and a few more words so the cut actually lands.';

export function FacebookPostSurfaces() {
  return (
    <div style={COLUMN}>
      <div style={LABELLED}>
        <span style={CAPTION}>web 680px, no media - the CSS-only placeholder, no request is ever made</span>
        <div style={CANVAS}>
          <FacebookFeed surface="post" />
        </div>
      </div>

      <div style={LABELLED}>
        <span style={CAPTION}>mobile 390px, square corners, node media echoed into the blurred letterbox</span>
        <div style={CANVAS}>
          <FacebookFeed surface="post" width="mobile" media={<div style={RIDGE} />} name="Alpenglow Daily" />
        </div>
      </div>

      <div style={LABELLED}>
        <span style={CAPTION}>
          ratio=&quot;16:9&quot;, type=&quot;video&quot; - a clip is never echoed, so the frame letterboxes to flat
          black
        </span>
        <div style={CANVAS}>
          <FacebookFeed surface="post" ratio="16:9" type="video" media={<div style={DUSK} />} stamp="2h" />
        </div>
      </div>

      <div style={LABELLED}>
        <span style={CAPTION}>
          caption over 250 characters - cut at a word boundary with See more; #tags and @mentions in link blue
        </span>
        <div style={CANVAS}>
          <FacebookFeed
            surface="post"
            caption={LONG_CAPTION}
            ratio="1:1"
            likes={12400}
            comments={873}
            shares={1240}
            media={<div style={RIDGE} />}
            avatar={<div style={PORTRAIT} />}
          />
        </div>
      </div>

      <div style={LABELLED}>
        <span style={CAPTION}>follow=false, ring=false - no blue ring, no · Follow, counts exact under 1,000</span>
        <div style={CANVAS}>
          <FacebookFeed surface="post" follow={false} ring={false} likes={999} comments={0} shares={4} />
        </div>
      </div>
    </div>
  );
}

export function FacebookReelSurfaces() {
  return (
    <div style={COLUMN}>
      <div style={LABELLED}>
        <span style={CAPTION}>narrow stage 557x878 around a 9:16 video, scaled to fit this page</span>
        <div style={CANVAS}>
          <div style={NARROW_REEL_BOX}>
            <div style={NARROW_REEL_FIT}>
              <FacebookFeed
                surface="reel"
                stage="narrow"
                type="video"
                media={<div style={DUSK} />}
                avatar={<div style={PORTRAIT} />}
                caption={LONG_CAPTION}
                audio="Nils Frahm · Says"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={LABELLED}>
        <span style={CAPTION}>wide stage 1601x886 around a 16:9 video - adds the magnifier, drops the audio line</span>
        <div style={CANVAS}>
          <div style={WIDE_REEL_BOX}>
            <div style={WIDE_REEL_FIT}>
              <FacebookFeed
                surface="reel"
                stage="wide"
                type="video"
                media={<div style={RIDGE} />}
                avatar={<div style={PORTRAIT} />}
                caption={LONG_CAPTION}
                verified={false}
                likes={1400000}
                comments={48500}
                shares={1000}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FacebookStorySurface() {
  return (
    <div style={ROW}>
      <div style={LABELLED}>
        <span style={CAPTION}>486x864 stage, 1:1 card, stage behind it blurred and darkened</span>
        <div style={CANVAS}>
          <div style={STORY_BOX}>
            <div style={STORY_FIT}>
              <FacebookFeed
                surface="story"
                ratio="1:1"
                media={<div style={RIDGE} />}
                avatar={<div style={PORTRAIT} />}
                audio="Nils Frahm · Says"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={LABELLED}>
        <span style={CAPTION}>five segments, third one current - every earlier segment fills</span>
        <div style={CANVAS}>
          <div style={STORY_BOX}>
            <div style={STORY_FIT}>
              <FacebookFeed
                surface="story"
                ratio="4:5"
                segments={5}
                segment={2}
                media={<div style={DUSK} />}
                name="Alpenglow Daily"
                stamp="4h"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FacebookMuteControl() {
  const [muted, setMuted] = useState(true);

  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        The sound button is the one real control: a toggle button with aria-pressed. It owns no video - you wire it to
        yours.
      </span>
      <div style={ROW}>
        <div style={CANVAS}>
          <div style={NARROW_REEL_BOX}>
            <div style={NARROW_REEL_FIT}>
              <FacebookFeed
                surface="reel"
                type="video"
                muted={muted}
                onMutedChange={setMuted}
                media={<div style={DUSK} />}
                avatar={<div style={PORTRAIT} />}
              />
            </div>
          </div>
        </div>
        <div style={CANVAS}>
          <div style={STORY_BOX}>
            <div style={STORY_FIT}>
              <FacebookFeed
                surface="story"
                ratio="1:1"
                muted={muted}
                onMutedChange={setMuted}
                media={<div style={RIDGE} />}
                avatar={<div style={PORTRAIT} />}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={LOG}>muted: {String(muted)}</div>
    </div>
  );
}

export function FacebookReducedMotion() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Nothing here animates on its own. The only transitions are the sound button&apos;s hover wash, written on
        var(--duration-fast), which the global reduced-motion rule collapses to 1ms. Turn the OS setting on and the
        three surfaces are pixel-identical.
      </span>
      <div style={ROW}>
        <div style={CANVAS}>
          <FacebookFeed surface="post" width="mobile" media={<div style={RIDGE} />} />
        </div>
        <div style={CANVAS}>
          <div style={STORY_BOX}>
            <div style={STORY_FIT}>
              <FacebookFeed surface="story" ratio="1:1" media={<div style={DUSK} />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
