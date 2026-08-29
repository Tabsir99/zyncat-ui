'use client';

import './instagram-feed.css';

import { useId, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { animate } from '../../../engine';
import { UIMotion } from '../../../tokens/motion-tokens';
import { useControllable } from '../../internal/hooks/use-controllable';
import { cx } from '../../internal/utils/cx';

const CAPTION_LIMIT = 125;
const CAPTION_BREAK_RATIO = 0.65;
const THOUSAND = 1e3;
const MILLION = 1e6;
const COMPACT_DIGITS = 1;
const LIKE_POP_FROM = 0.8;
const SAVE_POP_FROM = 0.86;
const BURST_ENTER_FROM = 0.4;
const BURST_BOUNCE = 0.42;
const BURST_EXIT_SCALE = 1.25;
const DEFAULT_AUDIO = 'Original audio';
const SEPARATOR = '•';
const ELLIPSIS_MORE = '... more';

const CAPTION_SEGMENTS = /([#@][^\s#@]+)/g;
const TRAILING_PUNCTUATION = /[\s,.;:—-]+$/;
const TRAILING_ZERO = /\.0$/;

const HEART = [
  'M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l8.8 8.8 8.8-8.8a5.4 5.4 0 0 0 0-7.7z',
];
const SPEECH = [
  'M21 11.6a8.4 8.4 0 0 1-8.5 8.4 8.6 8.6 0 0 1-4-1L3 20.9l1.9-4.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.4 8.4 8.4 0 0 1 8.5 8.4z',
];
const REPOST = [
  'M7.5 4.5 4 8l3.5 3.5',
  'M4 8h12a4 4 0 0 1 4 4v1',
  'M16.5 19.5 20 16l-3.5-3.5',
  'M20 16H8a4 4 0 0 1-4-4v-1',
];
const PAPER_PLANE = ['M22 3 2 10.5l8 3.2 3.2 8L22 3z', 'M10 13.7 22 3'];
const BOOKMARK = ['M6 3h12a.9.9 0 0 1 .9.9V21L12 16.2 5.1 21V3.9A.9.9 0 0 1 6 3z'];
const SPEAKER_BODY = 'M11 5 6.5 9H3v6h3.5L11 19z';
const SPEAKER_MUTED = [SPEAKER_BODY, 'M16 9.5 21 15', 'M21 9.5 16 15'];
const SPEAKER_LOUD = [SPEAKER_BODY, 'M16 9.6a4 4 0 0 1 0 4.8', 'M18.6 7.2a7.6 7.6 0 0 1 0 9.6'];

function paths(list: readonly string[]) {
  return list.map((d) => <path key={d} d={d} />);
}

function compact(value: number): string {
  const rounded = Math.max(0, Math.round(Number(value) || 0));
  if (rounded >= MILLION) return `${(rounded / MILLION).toFixed(COMPACT_DIGITS).replace(TRAILING_ZERO, '')}M`;
  if (rounded >= THOUSAND) return `${(rounded / THOUSAND).toFixed(COMPACT_DIGITS).replace(TRAILING_ZERO, '')}K`;
  return String(rounded);
}

interface ClippedCaption {
  head: string;
  clipped: boolean;
}

function clipCaption(text: string): ClippedCaption {
  if (text.length <= CAPTION_LIMIT) return { head: text, clipped: false };
  let breakAt = text.lastIndexOf(' ', CAPTION_LIMIT);
  if (breakAt < CAPTION_LIMIT * CAPTION_BREAK_RATIO) breakAt = CAPTION_LIMIT;
  return { head: text.slice(0, breakAt).replace(TRAILING_PUNCTUATION, ''), clipped: true };
}

function captionSegments(text: string) {
  return text
    .split(CAPTION_SEGMENTS)
    .filter(Boolean)
    .map((segment, index) => ({ key: `${index}-${segment}`, text: segment, link: /^[#@]/.test(segment) }));
}

function slotted(source: ReactNode): ReactNode {
  if (typeof source !== 'string') return source;
  return source ? <img src={source} alt="" /> : null;
}

function pop(el: HTMLElement | null, from: number) {
  if (el) animate(el, { scale: [from, 1], timing: UIMotion.t.settle });
}

export type InstagramFeedAction = 'comment' | 'repost' | 'send' | 'menu' | 'follow';

export interface InstagramFeedOwnProps {
  /** Post kind. `video` runs the black media frame full-bleed and floats the header on it in white. @default 'image' */
  type?: 'image' | 'video';
  /** Which column to reproduce: the 390px mobile viewport, or the 470px web column that also carries Follow. @default 'web' */
  width?: 'mobile' | 'web';
  /** Account name shown in the header and again in front of the caption. */
  handle: string;
  /** Caption body. Clipped at 125 characters with a trailing "... more"; #tags and @mentions take the link colour. */
  caption?: string;
  /** Media frame proportion. @default '4:5' */
  ratio?: '4:5' | '1:1';
  /** Post media. A string is read as an image URL; a node (`<img>`, `<video>`, `next/image`) is rendered as given and gets `alt` from you. Empty leaves the platform's flat placeholder. */
  media?: ReactNode;
  /** Avatar inside the story ring. A string is read as an image URL; a node is rendered as given. */
  avatar?: ReactNode;
  /** Audio credit on the second header line, video posts only. @default 'Original audio' */
  audio?: string;
  /** Relative time in the header, e.g. `1d`. Omitted entirely when unset. */
  stamp?: string;
  /** Likes excluding you; the displayed count adds one while `liked` is on. @default 0 */
  likes?: number;
  /** Comment count beside the speech glyph. @default 0 */
  comments?: number;
  /** Repost count beside the repost glyph. @default 0 */
  reposts?: number;
  /** Controlled like state. */
  liked?: boolean;
  /** Uncontrolled initial like state. @default false */
  defaultLiked?: boolean;
  /** Fires when the heart or a double-tap on the media toggles the like. */
  onLikedChange?: (liked: boolean) => void;
  /** Controlled bookmark state. */
  saved?: boolean;
  /** Uncontrolled initial bookmark state. @default false */
  defaultSaved?: boolean;
  /** Fires when the bookmark toggles. */
  onSavedChange?: (saved: boolean) => void;
  /** Controlled mute state for the video mute chip. */
  muted?: boolean;
  /** Uncontrolled initial mute state. @default true */
  defaultMuted?: boolean;
  /** Fires when the mute chip toggles. The component never touches a media element you supplied. */
  onMutedChange?: (muted: boolean) => void;
  /** Fires for the actions that carry no state: comment, repost, send, menu, follow. */
  onAction?: (action: InstagramFeedAction) => void;
  /** Extra class(es) merged onto the card. */
  className?: string;
  /** Inline styles merged onto the card. */
  style?: CSSProperties;
}

export interface InstagramFeedProps extends InstagramFeedOwnProps {
  /** Standard <article> attributes (aria-*, data-*, title, ...) forwarded to the card. */
  htmlProps?: Omit<HTMLAttributes<HTMLElement>, keyof InstagramFeedOwnProps> & DataAttributes;
}

export function InstagramFeed({
  type = 'image',
  width = 'web',
  handle,
  caption = '',
  ratio = '4:5',
  media,
  avatar,
  audio = DEFAULT_AUDIO,
  stamp,
  likes = 0,
  comments = 0,
  reposts = 0,
  liked,
  defaultLiked = false,
  onLikedChange,
  saved,
  defaultSaved = false,
  onSavedChange,
  muted,
  defaultMuted = true,
  onMutedChange,
  onAction,
  className = '',
  style,
  htmlProps,
}: InstagramFeedProps) {
  const handleId = useId();
  const likeRef = useRef<HTMLButtonElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const burstRef = useRef<HTMLSpanElement>(null);
  const burstToken = useRef(0);

  const [isLiked, setLiked] = useControllable(liked, defaultLiked, onLikedChange);
  const [isSaved, setSaved] = useControllable(saved, defaultSaved, onSavedChange);
  const [isMuted, setMuted] = useControllable(muted, defaultMuted, onMutedChange);

  const isVideo = type === 'video';
  const clipped = clipCaption(caption);
  const segments = captionSegments(clipped.head);

  const toggleLike = () => {
    setLiked(!isLiked);
    pop(likeRef.current, LIKE_POP_FROM);
  };

  const toggleSave = () => {
    setSaved(!isSaved);
    pop(saveRef.current, SAVE_POP_FROM);
  };

  const burstLike = () => {
    if (!isLiked) {
      setLiked(true);
      pop(likeRef.current, LIKE_POP_FROM);
    }
    const el = burstRef.current;
    if (!el || UIMotion.reduced) return;
    const token = ++burstToken.current;
    void animate(el, {
      scale: [BURST_ENTER_FROM, 1],
      opacity: [0, 1],
      timing: { type: 'spring', visualDuration: UIMotion.dur.base, bounce: BURST_BOUNCE },
    }).finished.then(() => {
      if (token !== burstToken.current) return;
      animate(el, {
        scale: [BURST_EXIT_SCALE],
        opacity: [0],
        timing: { duration: UIMotion.dur.slow, ease: UIMotion.ease.exit, delay: UIMotion.dur.fast },
      });
    });
  };

  return (
    <article
      {...htmlProps}
      className={cx('instagram-feed', className)}
      style={style}
      aria-labelledby={handleId}
      data-type={type}
      data-width={width}
      data-ratio={ratio}
    >
      <div className="instagram-feed__frame">
        <div className="instagram-feed__header">
          <span className="instagram-feed__ring">
            <span className="instagram-feed__avatar">{slotted(avatar)}</span>
          </span>
          <div className="instagram-feed__identity">
            <div className="instagram-feed__line">
              <span className="instagram-feed__handle" id={handleId}>
                {handle}
              </span>
              {stamp ? (
                <>
                  <span className="instagram-feed__sep" aria-hidden="true">
                    {SEPARATOR}
                  </span>
                  <span className="instagram-feed__stamp">{stamp}</span>
                </>
              ) : null}
            </div>
            {isVideo ? <div className="instagram-feed__audio">{audio}</div> : null}
          </div>
          {width === 'web' ? (
            <button type="button" className="instagram-feed__follow" onClick={() => onAction?.('follow')}>
              Follow
            </button>
          ) : null}
          <button
            type="button"
            className="instagram-feed__menu"
            aria-label="More options"
            onClick={() => onAction?.('menu')}
          >
            <span className="instagram-feed__pip" />
            <span className="instagram-feed__pip" />
            <span className="instagram-feed__pip" />
          </button>
        </div>
        <div className="instagram-feed__media" onDoubleClick={burstLike}>
          <span className="instagram-feed__slot">{slotted(media)}</span>
          <span ref={burstRef} className="instagram-feed__burst" aria-hidden="true">
            <svg className="instagram-feed__burst-glyph" viewBox="0 0 24 24">
              {paths(HEART)}
            </svg>
          </span>
          {isVideo ? (
            <button
              type="button"
              className="instagram-feed__mute"
              aria-pressed={isMuted}
              aria-label="Mute"
              onClick={() => setMuted(!isMuted)}
            >
              <svg className="instagram-feed__mute-glyph" viewBox="0 0 24 24" aria-hidden="true">
                {paths(isMuted ? SPEAKER_MUTED : SPEAKER_LOUD)}
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      <div className="instagram-feed__actions">
        <div className="instagram-feed__group">
          <span className="instagram-feed__action">
            <button
              ref={likeRef}
              type="button"
              className="instagram-feed__glyph-button"
              aria-pressed={isLiked}
              aria-label="Like"
              onClick={toggleLike}
            >
              <svg className="instagram-feed__glyph instagram-feed__glyph--like" viewBox="0 0 24 24" aria-hidden="true">
                {paths(HEART)}
              </svg>
            </button>
            <span className="instagram-feed__count">{compact(likes + (isLiked ? 1 : 0))}</span>
          </span>
          <span className="instagram-feed__action">
            <button
              type="button"
              className="instagram-feed__glyph-button"
              aria-label="Comment"
              onClick={() => onAction?.('comment')}
            >
              <svg className="instagram-feed__glyph" viewBox="0 0 24 24" aria-hidden="true">
                {paths(SPEECH)}
              </svg>
            </button>
            <span className="instagram-feed__count">{compact(comments)}</span>
          </span>
          <span className="instagram-feed__action">
            <button
              type="button"
              className="instagram-feed__glyph-button"
              aria-label="Repost"
              onClick={() => onAction?.('repost')}
            >
              <svg className="instagram-feed__glyph" viewBox="0 0 24 24" aria-hidden="true">
                {paths(REPOST)}
              </svg>
            </button>
            <span className="instagram-feed__count">{compact(reposts)}</span>
          </span>
          <button
            type="button"
            className="instagram-feed__glyph-button"
            aria-label="Share"
            onClick={() => onAction?.('send')}
          >
            <svg className="instagram-feed__glyph" viewBox="0 0 24 24" aria-hidden="true">
              {paths(PAPER_PLANE)}
            </svg>
          </button>
        </div>
        <button
          ref={saveRef}
          type="button"
          className="instagram-feed__glyph-button"
          aria-pressed={isSaved}
          aria-label="Save"
          onClick={toggleSave}
        >
          <svg className="instagram-feed__glyph instagram-feed__glyph--save" viewBox="0 0 24 24" aria-hidden="true">
            {paths(BOOKMARK)}
          </svg>
        </button>
      </div>

      {caption ? (
        <p className="instagram-feed__caption">
          <span className="instagram-feed__author">{handle}</span>{' '}
          {segments.map((segment) =>
            segment.link ? (
              <span key={segment.key} className="instagram-feed__link">
                {segment.text}
              </span>
            ) : (
              <span key={segment.key}>{segment.text}</span>
            ),
          )}
          {clipped.clipped ? <span className="instagram-feed__more">{ELLIPSIS_MORE}</span> : null}
        </p>
      ) : null}
    </article>
  );
}
