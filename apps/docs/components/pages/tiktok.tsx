'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

import { Button } from '@zyncat/ui/button';
import { TikTok, type TikTokRatio } from '@zyncat/ui/tiktok';

const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexDirection: 'column' };
const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' };
const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
const LOG: CSSProperties = { font: 'var(--type-mono)', color: 'var(--text-subtle)', minHeight: 'var(--space-5)' };

const SCROLLER: CSSProperties = {
  overflowX: 'auto',
  overflowY: 'hidden',
  borderRadius: 'var(--radius-lg)',
  border: 'var(--border-hairline) solid var(--border-subtle)',
};

const PHONES: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-start' };

const SHOT_ONE: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(142deg, #f8c46a 0%, #e0653f 44%, #6f2554 100%)',
};
const SHOT_TWO: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(214deg, #7fe3c4 0%, #2f8fa8 52%, #1d2a5c 100%)',
};
const SHOT_THREE: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(28deg, #ffd1e8 0%, #a45cd8 46%, #2b1b56 100%)',
};
const PORTRAIT: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(180deg, #dfe7ef 0%, #8fa3bd 38%, #35405e 100%)',
};
const FACE: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle at 50% 34%, #ffe0c2 0%, #d38a5a 46%, #4a2a1c 100%)',
};
const DISC_ART: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'conic-gradient(from 20deg, #fe2c55, #25f4ee, #fe2c55)',
};

const SHOT_A: ReactNode = <div style={SHOT_ONE} />;
const SHOT_B: ReactNode = <div style={SHOT_TWO} />;
const SHOT_C: ReactNode = <div style={SHOT_THREE} />;
const AVATAR: ReactNode = <div style={FACE} />;
const DISC: ReactNode = <div style={DISC_ART} />;
const VERTICAL: ReactNode = <div style={PORTRAIT} />;

const CAROUSEL_MEDIA: ReactNode = [SHOT_A, SHOT_B, SHOT_C];

const NAME = 'ABRAR ISLAM SAIFUL';
const PLACE = 'Shariatpur';
const STORY =
  'Golden hour on the coast road, second stop of the day. The whole set is in the carousel and I still cannot pick a favourite';
const HANDLE = 'Ahssan Mahfuj';
const MOBILE_STORY = 'Tell me where I know you from,,, #ppppppppppppppppp';
const MUSIC = 'lahfuj';
const SOUND = 'original sound - Ahssan Mahfuj';

const DESKTOP_RATIOS: TikTokRatio[] = ['3:2', '4:3', '1:1', '16:9', '9:16'];
const MOBILE_RATIOS: TikTokRatio[] = ['4:3', '3:2', '1:1', '16:9', '3:4', '9:16'];

export function TikTokDesktopHero() {
  return (
    <div style={SCROLLER}>
      <TikTok
        surface="desktop"
        ratio="3:2"
        name={NAME}
        location={PLACE}
        caption={STORY}
        media={CAROUSEL_MEDIA}
        avatar={AVATAR}
        sticker={DISC}
        likes={3149}
        comments={201}
        saves={480}
        shares={789}
      />
    </div>
  );
}

export function TikTokDesktopRatioDemo() {
  const [ratio, setRatio] = useState<TikTokRatio>('3:2');
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        The frame is a fixed 959x824 platform metric. The media keeps its own ratio inside it and the letterbox is
        filled by a blurred, saturated copy of the same slide - the platform fills the bars with the post&apos;s own
        artwork rather than black.
      </span>
      <div style={ROW}>
        {DESKTOP_RATIOS.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === ratio ? 'primary' : 'ghost'}
            onClick={() => setRatio(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <div style={SCROLLER}>
        <TikTok
          surface="desktop"
          ratio={ratio}
          name={NAME}
          location={PLACE}
          caption={STORY}
          media={SHOT_A}
          avatar={AVATAR}
          sticker={DISC}
          likes={3149}
          comments={201}
          saves={480}
          shares={789}
        />
      </div>
    </div>
  );
}

export function TikTokCarouselDemo() {
  const [slide, setSlide] = useState(1);
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Paging is a transition, not a simulation: the engine animates the track to its destination on the slow duration
        band. Drag the strip, use the chevrons, or focus it and press the arrow keys.
      </span>
      <div style={ROW}>
        <Button size="sm" onClick={() => setSlide(1)}>
          Slide 1
        </Button>
        <Button size="sm" onClick={() => setSlide(2)}>
          Slide 2
        </Button>
        <Button size="sm" onClick={() => setSlide(3)}>
          Slide 3
        </Button>
      </div>
      <span style={LOG}>slide {slide}</span>
      <div style={SCROLLER}>
        <TikTok
          surface="desktop"
          slide={slide}
          onSlideChange={setSlide}
          name={NAME}
          location={PLACE}
          caption={STORY}
          media={CAROUSEL_MEDIA}
          avatar={AVATAR}
          sticker={DISC}
          likes={3149}
          comments={201}
          saves={480}
          shares={789}
        />
      </div>
    </div>
  );
}

export function TikTokSingleSlideDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        One slide removes the whole carousel: no chevrons, no dot pill, no drag surface and no tab stop. Counts print
        exactly below ten thousand and abbreviate above it, the way the platform does.
      </span>
      <div style={SCROLLER}>
        <TikTok
          surface="desktop"
          name={NAME}
          location={PLACE}
          caption={STORY}
          media={SHOT_B}
          avatar={AVATAR}
          sticker={DISC}
          likes={1240000}
          comments={9999}
          saves={10400}
          shares={789}
        />
      </div>
    </div>
  );
}

export function TikTokMuteDemo() {
  const [muted, setMuted] = useState(true);
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        The mute control is chrome with a real toggle contract - it reports aria-pressed and fires onMutedChange. The
        component never calls play() or pause(): wire this to whatever player you pass as media.
      </span>
      <span style={LOG}>{muted ? 'muted' : 'audible'}</span>
      <div style={SCROLLER}>
        <TikTok
          surface="desktop"
          muted={muted}
          onMutedChange={setMuted}
          translation={false}
          name={NAME}
          location={PLACE}
          caption={STORY}
          media={SHOT_C}
          avatar={AVATAR}
          sticker={DISC}
          likes={3149}
          comments={201}
          saves={480}
          shares={789}
        />
      </div>
    </div>
  );
}

export function TikTokMobileHero() {
  return (
    <div style={PHONES}>
      <TikTok
        surface="mobile"
        ratio="4:3"
        name={HANDLE}
        caption={MOBILE_STORY}
        music={MUSIC}
        sound={SOUND}
        media={SHOT_A}
        avatar={AVATAR}
        sticker={DISC}
        likes={619}
        comments={11}
        shares={18}
      />
      <TikTok
        surface="mobile"
        ratio="9:16"
        name={HANDLE}
        caption={MOBILE_STORY}
        music={MUSIC}
        sound={SOUND}
        media={VERTICAL}
        avatar={AVATAR}
        sticker={DISC}
        likes={619}
        comments={11}
        shares={18}
      />
    </div>
  );
}

export function TikTokMobileRatioDemo() {
  const [ratio, setRatio] = useState<TikTokRatio>('4:3');
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Mobile overlays anchor to the viewport, not to the media, so a short post shows the blurred backdrop above and
        below while a 9:16 post very nearly fills the 452x822 frame. The rail drops the save action and the glyphs lose
        their pucks.
      </span>
      <div style={ROW}>
        {MOBILE_RATIOS.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === ratio ? 'primary' : 'ghost'}
            onClick={() => setRatio(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <TikTok
        surface="mobile"
        ratio={ratio}
        name={HANDLE}
        caption={MOBILE_STORY}
        music={MUSIC}
        sound={SOUND}
        media={SHOT_B}
        avatar={AVATAR}
        sticker={DISC}
        likes={619}
        comments={11}
        shares={18}
      />
    </div>
  );
}

export function TikTokPlaceholderDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        With no media, avatar or sticker the component draws a neutral CSS placeholder. It never makes a network request
        - the chrome is what is being reproduced, the content is yours.
      </span>
      <div style={PHONES}>
        <TikTok
          surface="mobile"
          name={HANDLE}
          caption={MOBILE_STORY}
          music={MUSIC}
          sound={SOUND}
          likes={619}
          comments={11}
          shares={18}
        />
      </div>
    </div>
  );
}

export function TikTokReducedMotionDemo() {
  return (
    <div style={COLUMN}>
      <span style={CAPTION}>
        Under prefers-reduced-motion every --duration-* collapses to 1ms, so the carousel jumps to the destination slide
        instead of sliding. Nothing loops and nothing pulses here, so there is nothing else to snap: the drag still
        tracks the pointer, because that is input, not animation.
      </span>
      <div style={SCROLLER}>
        <TikTok
          surface="desktop"
          defaultSlide={2}
          name={NAME}
          location={PLACE}
          caption={STORY}
          media={CAROUSEL_MEDIA}
          avatar={AVATAR}
          sticker={DISC}
          likes={3149}
          comments={201}
          saves={480}
          shares={789}
        />
      </div>
    </div>
  );
}
