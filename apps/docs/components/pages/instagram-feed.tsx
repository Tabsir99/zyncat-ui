'use client';

import { useState, type CSSProperties } from 'react';

import { Button } from '@zyncat/ui/button';
import { InstagramFeed, type InstagramFeedAction, type InstagramFeedProps } from '@zyncat/ui/instagram-feed';

import { KnobSegment, KnobSwitch, Playground } from '../playground';

const COLUMN: CSSProperties = { display: 'flex', gap: 'var(--space-4)', flexDirection: 'column' };
const ROW: CSSProperties = { display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' };
const CAPTION: CSSProperties = { font: 'var(--type-caption)', color: 'var(--text-muted)' };
const LOG: CSSProperties = { font: 'var(--type-mono)', color: 'var(--text-subtle)', minHeight: 'var(--space-5)' };

const PHOTO: CSSProperties = {
  background:
    'radial-gradient(120% 90% at 22% 12%, rgba(255, 236, 196, 0.95) 0%, rgba(255, 236, 196, 0) 55%), linear-gradient(168deg, #1f3b33 0%, #3f6d58 38%, #96b184 66%, #e2d3ac 100%)',
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
const REEL_ART = <div style={REEL} />;
const FACE_ART = <div style={FACE} />;

type IgType = NonNullable<InstagramFeedProps['type']>;
type IgWidth = NonNullable<InstagramFeedProps['width']>;
type IgRatio = NonNullable<InstagramFeedProps['ratio']>;
type IgCaption = 'short' | 'long';

export function InstagramPlayground() {
  const [type, setType] = useState<IgType>('image');
  const [width, setWidth] = useState<IgWidth>('web');
  const [ratio, setRatio] = useState<IgRatio>('4:5');
  const [caption, setCaption] = useState<IgCaption>('short');
  const [media, setMedia] = useState(true);

  const code = `<InstagramFeed
  type="${type}"
  width="${width}"
  ratio="${ratio}"
  handle="northfieldsupply"
  caption="${caption === 'short' ? SHORT_CAPTION : LONG_CAPTION.slice(0, 44) + '...'}"
  stamp="1d"${type === 'video' ? '\n  audio="northfieldsupply · Original audio"' : ''}${media ? '\n  media={photo}\n  avatar={face}' : ''}
  likes={760400}
  comments={2600}
  reposts={3100}
/>`;

  return (
    <Playground
      code={code}
      layout="under"
      expandTitle={`Instagram - ${width} feed post`}
      note="Double-tap the media to like it; the heart, bookmark and mute chip are real buttons, reachable by Tab."
      rail={
        <>
          <KnobSegment label="type" value={type} onChange={setType} options={['image', 'video']} />
          <KnobSegment label="width" value={width} onChange={setWidth} options={['mobile', 'web']} />
          <KnobSegment label="ratio" value={ratio} onChange={setRatio} options={['4:5', '1:1']} />
          <KnobSegment label="caption" value={caption} onChange={setCaption} options={['short', 'long']} />
          <KnobSwitch label="media" checked={media} onChange={setMedia} />
        </>
      }
    >
      <InstagramFeed
        type={type}
        width={width}
        ratio={ratio}
        handle="northfieldsupply"
        caption={caption === 'short' ? SHORT_CAPTION : LONG_CAPTION}
        stamp="1d"
        audio={type === 'video' ? 'northfieldsupply · Original audio' : undefined}
        media={media ? (type === 'video' ? REEL_ART : PHOTO_ART) : undefined}
        avatar={media ? FACE_ART : undefined}
        likes={760400}
        comments={2600}
        reposts={3100}
      />
    </Playground>
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
