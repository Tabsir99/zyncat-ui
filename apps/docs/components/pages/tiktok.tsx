'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

import { TikTok, type TikTokRatio, type TikTokSurface } from '@zyncat/ui/tiktok';

import { FitStage, KnobSegment, KnobSwitch, Playground } from '../playground';

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

const CAROUSEL_MEDIA: ReactNode = [SHOT_A, SHOT_B, SHOT_C];

const NAME = 'ABRAR ISLAM SAIFUL';
const PLACE = 'Shariatpur';
const STORY =
  'Golden hour on the coast road, second stop of the day. The whole set is in the carousel and I still cannot pick a favourite';
const HANDLE = 'Ahssan Mahfuj';
const MOBILE_STORY = 'Tell me where I know you from,,, #ppppppppppppppppp';
const MUSIC = 'lahfuj';
const SOUND = 'original sound - Ahssan Mahfuj';

const RATIOS: Record<TikTokSurface, readonly TikTokRatio[]> = {
  desktop: ['3:2', '4:3', '1:1', '16:9', '9:16'],
  mobile: ['4:3', '3:2', '1:1', '16:9', '3:4', '9:16'],
};

const SURFACE_WIDTH: Record<TikTokSurface, number> = { desktop: 1584, mobile: 452 };

export function TikTokPlayground() {
  const [surface, setSurface] = useState<TikTokSurface>('desktop');
  const [ratio, setRatio] = useState<TikTokRatio>('3:2');
  const [carousel, setCarousel] = useState(true);
  const [media, setMedia] = useState(true);

  const pickSurface = (next: TikTokSurface) => {
    setSurface(next);
    if (!RATIOS[next].includes(ratio)) setRatio(RATIOS[next][0]);
  };

  const mediaCode = !media
    ? ''
    : carousel && surface === 'desktop'
      ? '\n  media={[shotA, shotB, shotC]}'
      : '\n  media={shot}';
  const code = `<TikTok
  surface="${surface}"
  ratio="${ratio}"${mediaCode}
  name="${surface === 'desktop' ? NAME : HANDLE}"
  ${surface === 'desktop' ? `location="${PLACE}"` : `music="${MUSIC}"\n  sound="${SOUND}"`}
  caption="..."
  likes={3149}
  comments={201}
  shares={789}
/>`;

  return (
    <Playground
      code={code}
      stage="plate"
      layout="under"
      expandTitle={surface === 'desktop' ? 'TikTok - 1584px web player' : 'TikTok - 452px mobile web'}
      note={
        surface === 'desktop'
          ? 'The 1584px web player, scaled down to fit this column - open it at full size for the real metrics. Drag the carousel, page with the chevrons or the arrow keys.'
          : 'The 452x822 mobile-web viewport at native size.'
      }
      rail={
        <>
          <KnobSegment label="surface" value={surface} onChange={pickSurface} options={['desktop', 'mobile']} />
          <KnobSegment label="ratio" value={ratio} onChange={setRatio} options={RATIOS[surface]} />
          {surface === 'desktop' ? <KnobSwitch label="carousel" checked={carousel} onChange={setCarousel} /> : null}
          <KnobSwitch label="media" checked={media} onChange={setMedia} />
        </>
      }
    >
      <FitStage width={SURFACE_WIDTH[surface]}>
        {surface === 'desktop' ? (
          <TikTok
            surface="desktop"
            ratio={ratio}
            name={NAME}
            location={PLACE}
            caption={STORY}
            media={media ? (carousel ? CAROUSEL_MEDIA : SHOT_A) : undefined}
            avatar={media ? AVATAR : undefined}
            sticker={media ? DISC : undefined}
            likes={3149}
            comments={201}
            saves={480}
            shares={789}
          />
        ) : (
          <TikTok
            surface="mobile"
            ratio={ratio}
            name={HANDLE}
            caption={MOBILE_STORY}
            music={MUSIC}
            sound={SOUND}
            media={media ? SHOT_B : undefined}
            avatar={media ? AVATAR : undefined}
            sticker={media ? DISC : undefined}
            likes={619}
            comments={11}
            shares={18}
          />
        )}
      </FitStage>
    </Playground>
  );
}

export function TikTokControlledDemo() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <FitStage width={SURFACE_WIDTH.desktop}>
      <TikTok
        surface="desktop"
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
        liked={liked}
        onLikedChange={setLiked}
        saved={saved}
        onSavedChange={setSaved}
      />
    </FitStage>
  );
}
