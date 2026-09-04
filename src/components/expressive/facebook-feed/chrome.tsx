import type { CSSProperties, ReactNode } from 'react';

export type FacebookRatio = '4:5' | '1.1:1' | '1:1' | '3:4' | '16:9';
export type FacebookMediaType = 'image' | 'video';

/** The actions a surface reports that carry no state of their own. */
export type FacebookFeedAction = 'comment' | 'share' | 'follow' | 'menu' | 'dismiss' | 'more' | 'search' | 'play';

const THOUSAND = 1e3;
const TEN_THOUSAND = 1e4;
const MILLION = 1e6;
const COMPACT_DECIMALS = 1;
const TRAILING_ZERO = /\.0$/;
const THOUSAND_SUFFIX = 'K';
const MILLION_SUFFIX = 'M';

const CAPTION_LIMIT = 250;
const WORD_BREAK_FLOOR = 0.65;
const TRAILING_PUNCTUATION = /[\s,.;:—-]+$/;
const TAG_SPLIT = /([#@][^\s#@]+)/g;
const TAG_LEADERS = '#@';
const QUOTE = /"/g;
const ENCODED_QUOTE = '%22';

export function countValue(value: number): number {
  return Math.max(0, Math.round(Number(value) || 0));
}

export function compactCount(value: number): string {
  const n = countValue(value);
  if (n >= MILLION) return (n / MILLION).toFixed(COMPACT_DECIMALS).replace(TRAILING_ZERO, '') + MILLION_SUFFIX;
  if (n >= TEN_THOUSAND) return Math.round(n / THOUSAND) + THOUSAND_SUFFIX;
  if (n >= THOUSAND) return (n / THOUSAND).toFixed(COMPACT_DECIMALS).replace(TRAILING_ZERO, '') + THOUSAND_SUFFIX;
  return String(n);
}

export interface CaptionCut {
  head: string;
  cut: boolean;
}

export function cutCaption(text: string): CaptionCut {
  if (text.length <= CAPTION_LIMIT) return { head: text, cut: false };
  let index = text.lastIndexOf(' ', CAPTION_LIMIT);
  if (index < CAPTION_LIMIT * WORD_BREAK_FLOOR) index = CAPTION_LIMIT;
  return { head: text.slice(0, index).replace(TRAILING_PUNCTUATION, ''), cut: true };
}

export interface CaptionRun {
  text: string;
  link: boolean;
}

export function splitCaption(text: string): CaptionRun[] {
  const runs: CaptionRun[] = [];
  for (const segment of text.split(TAG_SPLIT)) {
    if (!segment) continue;
    runs.push({ text: segment, link: TAG_LEADERS.includes(segment.charAt(0)) });
  }
  return runs.length ? runs : [{ text, link: false }];
}

function sourceUrl(media: ReactNode): string {
  return typeof media === 'string' ? media.trim() : '';
}

function sourceNode(media: ReactNode): ReactNode {
  return typeof media === 'string' ? null : media;
}

function backgroundOf(url: string): CSSProperties | undefined {
  return url ? { backgroundImage: `url("${url.replace(QUOTE, ENCODED_QUOTE)}")` } : undefined;
}

function isFilled(media: ReactNode): boolean {
  if (typeof media === 'string') return media.trim().length > 0;
  return media !== null && media !== undefined && media !== false && media !== true;
}

export interface MediaSurfaceProps {
  media?: ReactNode;
  type: FacebookMediaType;
  frontClassName: string;
  backClassName?: string;
  frontRatio?: FacebookRatio;
}

export function MediaSurface({ media, type, frontClassName, backClassName, frontRatio }: MediaSurfaceProps) {
  const style = backgroundOf(sourceUrl(media));
  const node = sourceNode(media);
  const filled = isFilled(media);
  const echo = type === 'image' ? node : null;
  return (
    <>
      {backClassName ? (
        <div className={backClassName} style={style} aria-hidden="true">
          {echo}
          {filled ? null : <span className="zc-facebook-feed-media__fill" />}
        </div>
      ) : null}
      <div className={frontClassName} style={style} data-ratio={frontRatio}>
        {node}
        {filled ? null : <span className="zc-facebook-feed-media__fill" />}
      </div>
    </>
  );
}

export interface PortraitProps {
  avatar?: ReactNode;
  className: string;
}

export function Portrait({ avatar, className }: PortraitProps) {
  return (
    <div className={className} style={backgroundOf(sourceUrl(avatar))}>
      {sourceNode(avatar)}
    </div>
  );
}
