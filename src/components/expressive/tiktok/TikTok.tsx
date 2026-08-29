'use client';

import './tiktok.css';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import type { DataAttributes } from '../../../dom-props';
import { animate, set, startDrag, type PanInfo } from '../../../engine';
import { UIMotion } from '../../../tokens/motion-tokens';
import { useControllable } from '../../internal/hooks/use-controllable';
import { cx } from '../../internal/utils/cx';
import {
  AudibleGlyph,
  BookmarkGlyph,
  CommentGlyph,
  HeartGlyph,
  MenuGlyph,
  MutedGlyph,
  NextGlyph,
  NoteGlyph,
  PinGlyph,
  PlusGlyph,
  PreviousGlyph,
  SearchGlyph,
  ShareGlyph,
} from './glyphs';

const FIRST_SLIDE = 1;
const MAX_SLIDES = 10;
const SINGLE_SLIDE = 1;
const THOUSAND = 1000;
const ABBREVIATE_FROM = 10000;
const MILLION = 1000000;
const ABBREVIATED_DECIMALS = 1;
const DRAG_RESISTANCE = 0.32;
const PAGE_FRACTION = 0.28;
const FLING_SPEED = 420;
const PREVIOUS_STEP = -1;
const NEXT_STEP = 1;

const LIKES_LABEL = 'Likes';
const COMMENTS_LABEL = 'Comments';
const SAVES_LABEL = 'Saves';
const SHARES_LABEL = 'Shares';
const PREVIOUS_LABEL = 'Previous photo';
const NEXT_LABEL = 'Next photo';
const MUTE_LABEL = 'Mute';
const CAROUSEL_ROLE_DESCRIPTION = 'carousel';
const SLIDE_ROLE_DESCRIPTION = 'slide';
const TRANSLATION_LABEL = 'See translation';
const MORE_LABEL = 'more';

const DESKTOP_RATIO: TikTokRatio = '3:2';
const MOBILE_RATIO: TikTokRatio = '4:3';

const clamp = (value: number, min: number, max: number) => (value < min ? min : value > max ? max : value);

const pageTiming = () => ({ duration: UIMotion.dur.slow, ease: UIMotion.ease.glide });

function abbreviate(value: number): string {
  const total = Math.max(0, Math.round(value));
  const short = (divisor: number) => (total / divisor).toFixed(ABBREVIATED_DECIMALS).replace(/\.0$/, '');
  if (total >= MILLION) return `${short(MILLION)}M`;
  if (total >= ABBREVIATE_FROM) return `${short(THOUSAND)}K`;
  return String(total);
}

function slideCount(media: ReactNode, slides: number | undefined): number {
  const supplied = Array.isArray(media) ? media.length : 0;
  const asked = slides ? Math.round(slides) : SINGLE_SLIDE;
  return clamp(Math.max(supplied, asked), SINGLE_SLIDE, MAX_SLIDES);
}

function slideMedia(media: ReactNode, at: number): ReactNode {
  if (!Array.isArray(media)) return at === 0 ? media : undefined;
  return media[at];
}

function renderMedia(media: ReactNode): ReactNode {
  if (media === undefined || media === null || media === false) return <span className="tiktok__blank" />;
  if (typeof media === 'string') return <img src={media} alt="" />;
  return media;
}

function limitOffset(offset: number, from: number, count: number, width: number): number {
  const min = -(count - 1 - from) * width;
  const max = from * width;
  if (offset < min) return min + (offset - min) * DRAG_RESISTANCE;
  if (offset > max) return max + (offset - max) * DRAG_RESISTANCE;
  return offset;
}

function landingIndex(from: number, info: PanInfo, width: number, count: number): number {
  const travelled = info.offset.x / width;
  const flung = Math.abs(info.velocity.x) > FLING_SPEED;
  if (!flung && Math.abs(travelled) < PAGE_FRACTION) return from;
  const step = info.offset.x < 0 ? NEXT_STEP : PREVIOUS_STEP;
  return clamp(from + step, 0, count - 1);
}

/** The surface of the platform being reproduced. */
export type TikTokSurface = 'desktop' | 'mobile';

/** Aspect ratio of the post media inside the stage. */
export type TikTokRatio = '3:2' | '4:3' | '1:1' | '16:9' | '9:16' | '3:4';

export interface TikTokProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>, DataAttributes {
  /** Which platform surface to reproduce. Desktop is the 1584x912 web player with the photo carousel; mobile is the 452x822 mobile-web viewport. */
  surface?: TikTokSurface;
  /** Aspect ratio of the media inside the frame. Defaults to 3:2 on desktop and 4:3 on mobile. */
  ratio?: TikTokRatio;
  /** Creator name shown over the media. */
  name?: string;
  /** Post caption. Ellipsised to one line on desktop and two on mobile until "more" is pressed. */
  caption?: string;
  /** Desktop only. Place name in the pin chip above the creator name. */
  location?: string;
  /** Mobile only. Music attribution shown first on the sound line. */
  music?: string;
  /** Mobile only. Sound title shown after the music attribution. */
  sound?: string;
  /** Like count. Printed exactly below 10,000, then abbreviated as the platform does. */
  likes?: number;
  /** Comment count. */
  comments?: number;
  /** Desktop only. Save count - the mobile rail has no save action. */
  saves?: number;
  /** Share count. */
  shares?: number;
  /** Post media: a URL string rendered as a decorative image, or a node you render yourself. On desktop an array supplies one entry per carousel slide. */
  media?: ReactNode;
  /** Creator avatar: a URL string, or a node you render yourself. */
  avatar?: ReactNode;
  /** Sound artwork on the disc at the foot of the rail: a URL string, or a node you render yourself. */
  sticker?: ReactNode;
  /** Desktop only. Number of carousel slides. Raised to the length of `media` when that is an array. */
  slides?: number;
  /** Desktop only. Controlled 1-based carousel position. */
  slide?: number;
  /** Desktop only. Uncontrolled starting carousel position. */
  defaultSlide?: number;
  /** Desktop only. Fires with the new 1-based position when the carousel pages. */
  onSlideChange?: (slide: number) => void;
  /** Desktop only. Controlled state of the mute control. The component never plays or pauses media - wire this to your own player. */
  muted?: boolean;
  /** Desktop only. Uncontrolled starting state of the mute control. */
  defaultMuted?: boolean;
  /** Desktop only. Fires when the mute control is pressed. */
  onMutedChange?: (muted: boolean) => void;
  /** Desktop only. Renders the platform's "See translation" line under the frame. */
  translation?: boolean;
}

export function TikTok({
  surface = 'desktop',
  ratio,
  name = '',
  caption = '',
  location = '',
  music = '',
  sound = '',
  likes = 0,
  comments = 0,
  saves = 0,
  shares = 0,
  media,
  avatar,
  sticker,
  slides,
  slide,
  defaultSlide = FIRST_SLIDE,
  onSlideChange,
  muted,
  defaultMuted = true,
  onMutedChange,
  translation = true,
  className,
  ...rest
}: TikTokProps) {
  const desktop = surface === 'desktop';
  const count = desktop ? slideCount(media, slides) : SINGLE_SLIDE;
  const frameRatio = ratio ?? (desktop ? DESKTOP_RATIO : MOBILE_RATIO);

  const [position, setPosition] = useControllable(slide, defaultSlide, onSlideChange);
  const [quiet, setQuiet] = useControllable(muted, defaultMuted, onMutedChange);
  const [open, setOpen] = useState(false);

  const index = clamp(Math.round(position), FIRST_SLIDE, count) - FIRST_SLIDE;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const settled = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || settled.current === index) return;
    const first = settled.current === null;
    settled.current = index;
    const target = -index * viewport.clientWidth;
    if (first) {
      set(track, { x: [target] });
      return;
    }
    const playback = animate(track, { x: [target], timing: pageTiming() });
    return () => playback.stop();
  }, [index]);

  const goTo = useCallback(
    (next: number) => {
      const bounded = clamp(next, 0, count - 1);
      if (bounded !== index) setPosition(bounded + FIRST_SLIDE);
    },
    [count, index, setPosition],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (count < 2 || event.button !== 0 || !track || !viewport) return;
      const width = viewport.clientWidth;
      if (!width) return;
      const from = index;
      startDrag(event.nativeEvent, {
        onMove: (info) => {
          set(track, { x: [-from * width + limitOffset(info.offset.x, from, count, width)] });
        },
        onEnd: (info) => {
          const landed = landingIndex(from, info, width, count);
          settled.current = landed;
          animate(track, { x: [-landed * width], timing: pageTiming() });
          if (landed !== from) setPosition(landed + FIRST_SLIDE);
        },
      });
    },
    [count, index, setPosition],
  );

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      goTo(index + (event.key === 'ArrowLeft' ? PREVIOUS_STEP : NEXT_STEP));
    },
    [goTo, index],
  );

  const positions = Array.from({ length: count }, (_, at) => at);

  const rail = (
    <ul className="tiktok__rail">
      <li className="tiktok__creator" aria-hidden="true">
        <span className="tiktok__avatar">{renderMedia(avatar)}</span>
        <span className="tiktok__follow">
          <PlusGlyph className="tiktok__plus" />
        </span>
      </li>
      <RailAction surface={surface} label={LIKES_LABEL} count={likes}>
        <HeartGlyph className="tiktok__glyph" />
      </RailAction>
      <RailAction surface={surface} label={COMMENTS_LABEL} count={comments}>
        <CommentGlyph className="tiktok__glyph" holeClassName="tiktok__hole" />
      </RailAction>
      {desktop ? (
        <RailAction surface={surface} label={SAVES_LABEL} count={saves}>
          <BookmarkGlyph className="tiktok__glyph" />
        </RailAction>
      ) : null}
      <RailAction surface={surface} label={SHARES_LABEL} count={shares}>
        <ShareGlyph className="tiktok__glyph" />
      </RailAction>
      <li className="tiktok__disc" aria-hidden="true">
        {renderMedia(sticker)}
      </li>
    </ul>
  );

  const captionRow = caption ? (
    <p className="tiktok__captionrow">
      <span className={cx('tiktok__caption', open && 'tiktok__caption--open')}>{caption}</span>
      {open ? null : (
        <button type="button" className="tiktok__more" onClick={() => setOpen(true)}>
          {MORE_LABEL}
        </button>
      )}
    </p>
  ) : null;

  const frame = (
    <div className="tiktok__frame">
      <div
        className="tiktok__viewport"
        ref={viewportRef}
        role={count > 1 ? 'group' : undefined}
        aria-roledescription={count > 1 ? CAROUSEL_ROLE_DESCRIPTION : undefined}
        aria-label={count > 1 ? name || CAROUSEL_ROLE_DESCRIPTION : undefined}
        tabIndex={count > 1 ? 0 : undefined}
        onKeyDown={count > 1 ? onKeyDown : undefined}
        onPointerDown={count > 1 ? onPointerDown : undefined}
      >
        <div className="tiktok__track" ref={trackRef}>
          {positions.map((at) => (
            <div
              key={at}
              className="tiktok__slide"
              role={count > 1 ? 'group' : undefined}
              aria-roledescription={count > 1 ? SLIDE_ROLE_DESCRIPTION : undefined}
              aria-label={count > 1 ? `${at + FIRST_SLIDE} of ${count}` : undefined}
              aria-hidden={count > 1 && at !== index ? true : undefined}
            >
              <div className="tiktok__fill" aria-hidden="true">
                {renderMedia(slideMedia(media, at))}
              </div>
              <div className="tiktok__stack">
                <div className="tiktok__fit" data-ratio={frameRatio}>
                  {renderMedia(slideMedia(media, at))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {desktop && count > 1 ? (
        <div className="tiktok__pager">
          <button
            type="button"
            className="tiktok__arrow"
            aria-label={PREVIOUS_LABEL}
            disabled={index === 0}
            onClick={() => goTo(index + PREVIOUS_STEP)}
          >
            <PreviousGlyph className="tiktok__chevron" />
          </button>
          <span className="tiktok__dots" aria-hidden="true">
            {positions.map((at) => (
              <span key={at} className={cx('tiktok__dot', at === index && 'tiktok__dot--on')} />
            ))}
          </span>
          <button
            type="button"
            className="tiktok__arrow"
            aria-label={NEXT_LABEL}
            disabled={index === count - 1}
            onClick={() => goTo(index + NEXT_STEP)}
          >
            <NextGlyph className="tiktok__chevron" />
          </button>
        </div>
      ) : null}

      {desktop ? (
        <div className="tiktok__meta">
          {location ? (
            <p className="tiktok__place">
              <span className="tiktok__pin">
                <PinGlyph className="tiktok__pinmark" />
              </span>
              {location}
            </p>
          ) : null}
          {name ? <p className="tiktok__name">{name}</p> : null}
          {captionRow}
        </div>
      ) : null}
    </div>
  );

  const mobileMeta = (
    <div className="tiktok__meta">
      {name ? <p className="tiktok__name">{name}</p> : null}
      {captionRow}
      {music || sound ? (
        <p className="tiktok__music">
          <NoteGlyph className="tiktok__note" />
          {music ? <span>{music}</span> : null}
          {sound ? <span className="tiktok__sound">{sound}</span> : null}
        </p>
      ) : null}
    </div>
  );

  return (
    <div className={cx('tiktok', desktop ? 'tiktok--desktop' : 'tiktok--mobile', className)} {...rest}>
      <div className="tiktok__stage">
        {desktop ? (
          <button
            type="button"
            className="tiktok__mute"
            aria-label={MUTE_LABEL}
            aria-pressed={quiet}
            onClick={() => setQuiet(!quiet)}
          >
            {quiet ? <MutedGlyph className="tiktok__speaker" /> : <AudibleGlyph className="tiktok__speaker" />}
          </button>
        ) : null}
        {frame}
        {desktop ? null : (
          <>
            <span className="tiktok__scrim-top" aria-hidden="true" />
            <span className="tiktok__scrim-bottom" aria-hidden="true" />
            <div className="tiktok__header" aria-hidden="true">
              <MenuGlyph className="tiktok__nav" />
              <SearchGlyph className="tiktok__nav" />
            </div>
          </>
        )}
        {rail}
        {desktop ? null : mobileMeta}
        {desktop && translation ? (
          <p className="tiktok__translate" aria-hidden="true">
            {TRANSLATION_LABEL}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function RailAction({
  surface,
  label,
  count,
  children,
}: {
  surface: TikTokSurface;
  label: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <li className="tiktok__action">
      {surface === 'desktop' ? <span className="tiktok__puck">{children}</span> : children}
      <span className="tiktok__count">
        <span className="tiktok__sr">{`${label} `}</span>
        {abbreviate(count)}
      </span>
    </li>
  );
}

export default TikTok;
