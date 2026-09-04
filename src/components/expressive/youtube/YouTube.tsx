'use client';

import './youtube.css';

import type { CSSProperties, HTMLAttributes, ReactElement } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { useControllable } from '../../internal/hooks/use-controllable';
import { cx } from '../../internal/utils/cx';
import type { YouTubeAction, YouTubeMedia } from './media';
import { PostSurface } from './post';
import { ShortSurface } from './short';
import { VideoSurface } from './video';

export type { YouTubeAction, YouTubeMedia } from './media';

export type YouTubeSurface = 'video' | 'short' | 'post';

const SURFACE_CLASS: Record<YouTubeSurface, string> = {
  video: 'zc-youtube--video',
  short: 'zc-youtube--short',
  post: 'zc-youtube--post',
};

const EMPTY_TEXT = '';
const NO_COUNT = 0;
const FIRST_PAGE = 0;
const ONE_PAGE = 1;
const NO_PROGRESS = 0;

export interface YouTubeOwnProps {
  /** Which YouTube surface to reproduce - a feed grid card, a Shorts player, or a community post. @default 'video' */
  surface?: YouTubeSurface;
  /** Video title on `video`, Shorts title on `short`. Clamps to two lines on `video`, one ellipsised line on `short`. */
  title?: string;
  /** The account's display name - channel name on `video`, `@handle` on `short`, author name on `post`. */
  channel?: string;
  /** View count line on `video`, already formatted by the consumer ("2m views"). */
  views?: string;
  /** Relative timestamp - "1 year ago" on `video`, "9 days ago" on `post`. */
  age?: string;
  /** Runtime shown in the thumbnail badge on `video` ("34:46"). Omit to drop the badge. */
  duration?: string;
  /** Renders the grey verified tick after the channel name on `video`. @default false */
  verified?: boolean;
  /** Like count. Abbreviated the way YouTube abbreviates it - 187000 renders as "187k". @default 0 */
  likes?: number;
  /** Comment count. Rendered exact with thousands separators - 3539 renders as "3,539". @default 0 */
  comments?: number;
  /** Remix count in the Shorts rail. @default 0 */
  remixes?: number;
  /** Whether the Shorts overlay shows the play glyph. Controlled; pair with `onPausedChange`. */
  paused?: boolean;
  /** Initial Shorts play state when `paused` is omitted. @default true */
  defaultPaused?: boolean;
  /** Fires when the Shorts play control is pressed. The component never touches the media element itself. */
  onPausedChange?: (paused: boolean) => void;
  /** Shorts playback position, 0-100. Consumer-driven: the bar renders where you put it. @default 0 */
  progress?: number;
  /** Community post body copy. */
  text?: string;
  /** Community post images. Two or more turn the frame into a paged, draggable, arrow-keyed carousel. */
  carousel?: YouTubeMedia[];
  /** Controlled carousel page index. Omit to stay uncontrolled. */
  page?: number;
  /** Initial carousel page when uncontrolled. @default 0 */
  defaultPage?: number;
  /** Fires whenever the carousel settles on a new page. */
  onPageChange?: (page: number) => void;
  /** Thumbnail on `video`, player content on `short`, single image on `post`. A URL string or your own node (`<img>`, `<video>`, `next/image`). Nothing renders a CSS-only placeholder. */
  media?: YouTubeMedia;
  /** Channel avatar. A URL string or your own node. Nothing renders a flat grey disc. */
  avatar?: YouTubeMedia;
  /** Controlled like state for the short's heart and the post's thumb-up. The displayed like count adds one while this is on. */
  liked?: boolean;
  /** Uncontrolled initial like state. @default false */
  defaultLiked?: boolean;
  /** Fires when the like toggles. */
  onLikedChange?: (liked: boolean) => void;
  /** Post only. Controlled dislike state for the thumb-down. */
  disliked?: boolean;
  /** Uncontrolled initial dislike state. @default false */
  defaultDisliked?: boolean;
  /** Fires when the dislike toggles. */
  onDislikedChange?: (disliked: boolean) => void;
  /** Fires for the actions that carry no state: comment, share, remix, menu, expand. */
  onAction?: (action: YouTubeAction) => void;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root. */
  style?: CSSProperties;
}

export interface YouTubeProps extends YouTubeOwnProps {
  /** Standard element attributes (aria-*, data-*, id, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLElement>, keyof YouTubeOwnProps> & DataAttributes;
}

export function YouTube({
  surface = 'video',
  title = EMPTY_TEXT,
  channel = EMPTY_TEXT,
  views = EMPTY_TEXT,
  age = EMPTY_TEXT,
  duration = EMPTY_TEXT,
  verified = false,
  likes = NO_COUNT,
  comments = NO_COUNT,
  remixes = NO_COUNT,
  paused: controlledPaused,
  defaultPaused = true,
  onPausedChange,
  progress = NO_PROGRESS,
  text = EMPTY_TEXT,
  carousel,
  page: controlledPage,
  defaultPage = FIRST_PAGE,
  onPageChange,
  media,
  avatar,
  liked: controlledLiked,
  defaultLiked = false,
  onLikedChange,
  disliked: controlledDisliked,
  defaultDisliked = false,
  onDislikedChange,
  onAction,
  className = EMPTY_TEXT,
  style,
  htmlProps,
}: YouTubeProps): ReactElement {
  const [paused, setPaused] = useControllable(controlledPaused, defaultPaused, onPausedChange);
  const [page, setPage] = useControllable(controlledPage, defaultPage, onPageChange);
  const [liked, setLiked] = useControllable(controlledLiked, defaultLiked, onLikedChange);
  const [disliked, setDisliked] = useControllable(controlledDisliked, defaultDisliked, onDislikedChange);
  const slides = carousel && carousel.length ? carousel : [media];

  return (
    <article className={cx('zc-youtube', SURFACE_CLASS[surface], className)} style={style} {...htmlProps}>
      {surface === 'video' && (
        <VideoSurface
          title={title}
          channel={channel}
          views={views}
          age={age}
          duration={duration}
          verified={verified}
          media={media}
          avatar={avatar}
          onAction={onAction}
        />
      )}

      {surface === 'short' && (
        <ShortSurface
          title={title}
          channel={channel}
          likes={likes}
          comments={comments}
          remixes={remixes}
          paused={paused}
          progress={progress}
          media={media}
          avatar={avatar}
          onTogglePaused={() => setPaused(!paused)}
          liked={liked}
          onLikedChange={setLiked}
          onAction={onAction}
        />
      )}

      {surface === 'post' && (
        <PostSurface
          channel={channel}
          age={age}
          text={text}
          likes={likes}
          comments={comments}
          slides={slides}
          avatar={avatar}
          page={Math.min(page, slides.length - ONE_PAGE)}
          onPage={setPage}
          liked={liked}
          onLikedChange={setLiked}
          disliked={disliked}
          onDislikedChange={setDisliked}
          onAction={onAction}
        />
      )}
    </article>
  );
}
