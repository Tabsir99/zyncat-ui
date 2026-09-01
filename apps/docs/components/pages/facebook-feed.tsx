'use client';

import { useState, type CSSProperties } from 'react';

import {
  FacebookFeed,
  type FacebookMediaType,
  type FacebookPostWidth,
  type FacebookRatio,
  type FacebookReelStage,
  type FacebookSurface,
} from '@zyncat/ui/facebook-feed';

import { FitStage, KnobSegment, KnobSwitch, Playground } from '../playground';

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

const POST_RATIOS: readonly FacebookRatio[] = ['4:5', '1:1', '16:9'];

const STAGE_WIDTH = { 'post-mobile': 390, 'post-web': 680, 'reel-narrow': 557, 'reel-wide': 1601, story: 486 } as const;

const NOTES: Record<FacebookSurface, string> = {
  post: 'The caption sits above the media - the opposite of Instagram. A still is echoed into the blurred letterbox; a clip letterboxes to flat black.',
  reel: 'Reels letterbox to flat black and their Follow is white, not blue. The wide stage is 1601px - open it at full size to read it.',
  story: 'A 9:16 stage - the space behind the card is a blurred, darkened copy of the same source.',
};

const TITLES: Record<FacebookSurface, string> = {
  post: 'Facebook - feed post',
  reel: 'Facebook - reel',
  story: 'Facebook - story',
};

export function FacebookPlayground() {
  const [surface, setSurface] = useState<FacebookSurface>('post');
  const [width, setWidth] = useState<FacebookPostWidth>('web');
  const [stage, setStage] = useState<FacebookReelStage>('narrow');
  const [type, setType] = useState<FacebookMediaType>('image');
  const [ratio, setRatio] = useState<FacebookRatio>('4:5');
  const [media, setMedia] = useState(true);

  const fitWidth =
    surface === 'post'
      ? STAGE_WIDTH[`post-${width}`]
      : surface === 'reel'
        ? STAGE_WIDTH[`reel-${stage}`]
        : STAGE_WIDTH.story;

  const code = `<FacebookFeed
  surface="${surface}"${surface === 'post' ? `\n  width="${width}"\n  type="${type}"\n  ratio="${ratio}"` : ''}${surface === 'reel' ? `\n  stage="${stage}"\n  type="video"` : ''}${surface === 'story' ? `\n  ratio="${ratio === '16:9' ? '1:1' : ratio}"` : ''}
  name="Alpenglow Daily"
  caption="Three days above the fog line #alps"${media ? '\n  media={photo}\n  avatar={portrait}' : ''}
  likes={12400}
  comments={873}
  shares={1240}
/>`;

  return (
    <Playground
      code={code}
      stage="plate"
      layout="under"
      expandTitle={TITLES[surface]}
      note={NOTES[surface]}
      rail={
        <>
          <KnobSegment label="surface" value={surface} onChange={setSurface} options={['post', 'reel', 'story']} />
          {surface === 'post' ? (
            <>
              <KnobSegment label="width" value={width} onChange={setWidth} options={['mobile', 'web']} />
              <KnobSegment label="type" value={type} onChange={setType} options={['image', 'video']} />
              <KnobSegment label="ratio" value={ratio} onChange={setRatio} options={POST_RATIOS} />
            </>
          ) : null}
          {surface === 'reel' ? (
            <KnobSegment label="stage" value={stage} onChange={setStage} options={['narrow', 'wide']} />
          ) : null}
          <KnobSwitch label="media" checked={media} onChange={setMedia} />
        </>
      }
    >
      <FitStage width={fitWidth}>
        {surface === 'post' ? (
          <FacebookFeed
            surface="post"
            width={width}
            type={type}
            ratio={ratio}
            name="Alpenglow Daily"
            caption={LONG_CAPTION}
            media={media ? <div style={type === 'video' ? DUSK : RIDGE} /> : undefined}
            avatar={media ? <div style={PORTRAIT} /> : undefined}
            likes={12400}
            comments={873}
            shares={1240}
          />
        ) : surface === 'reel' ? (
          <FacebookFeed
            surface="reel"
            stage={stage}
            type="video"
            name="Alpenglow Daily"
            caption={LONG_CAPTION}
            audio="Nils Frahm · Says"
            media={media ? <div style={stage === 'wide' ? RIDGE : DUSK} /> : undefined}
            avatar={media ? <div style={PORTRAIT} /> : undefined}
            likes={1400000}
            comments={48500}
            shares={1000}
          />
        ) : (
          <FacebookFeed
            surface="story"
            ratio={ratio === '16:9' ? '1:1' : ratio}
            segments={5}
            segment={2}
            name="Alpenglow Daily"
            stamp="4h"
            audio="Nils Frahm · Says"
            media={media ? <div style={RIDGE} /> : undefined}
            avatar={media ? <div style={PORTRAIT} /> : undefined}
          />
        )}
      </FitStage>
    </Playground>
  );
}
