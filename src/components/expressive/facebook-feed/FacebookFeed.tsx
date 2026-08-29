'use client';

import './facebook-feed.css';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { useControllable } from '../../internal/hooks/use-controllable';
import type { FacebookFeedAction, FacebookMediaType, FacebookRatio } from './chrome';
import { FacebookPost, type FacebookPostWidth } from './post';
import { FacebookReel, type FacebookReelStage } from './reel';
import { FacebookStory } from './story';

export type { FacebookFeedAction, FacebookMediaType, FacebookRatio } from './chrome';
export type { FacebookPostWidth } from './post';
export type { FacebookReelStage } from './reel';

export type FacebookSurface = 'post' | 'reel' | 'story';

const DEFAULT_NAME = 'Swiss Nature';
const DEFAULT_CAPTION = 'This is Switzerland';
const DEFAULT_STAMP = '31m';
const DEFAULT_AUDIO = 'Original audio';
const DEFAULT_RATIO: FacebookRatio = '4:5';
const DEFAULT_LIKES = 267;
const DEFAULT_COMMENTS = 12;
const DEFAULT_SHARES = 4;
const DEFAULT_SEGMENTS = 2;
const DEFAULT_SEGMENT = 0;
const MUTED_BY_SURFACE: Record<FacebookSurface, boolean> = { post: true, reel: true, story: false };

export interface FacebookFeedOwnProps {
  /** Which Facebook surface to reproduce: the feed card, the reels stage, or the story stage. @default 'post' */
  surface?: FacebookSurface;
  /** Feed card width. `mobile` is the 390px square-cornered card, `web` the 680px rounded one. @default 'web' */
  width?: FacebookPostWidth;
  /** Reels stage. `narrow` is 557x878 around a 9:16 video, `wide` is 1601x886 around a 16:9 one. @default 'narrow' */
  stage?: FacebookReelStage;
  /** Whether `media` is a still or a clip. A still is echoed into the feed's blurred letterbox backdrop; a clip is not, so it is never fetched twice. @default 'image' */
  type?: FacebookMediaType;
  /** Poster or page name in the header. @default 'Swiss Nature' */
  name?: string;
  /** Post body. The feed cuts it at 250 characters with `See more`; reels take one ellipsised line. Hashtags and @mentions render in link blue. */
  caption?: string;
  /** Frame aspect for the feed card and the story card. Reels stages are fixed. @default '4:5' */
  ratio?: FacebookRatio;
  /** A URL string, or your own node (`<img>`, `<video>`, `next/image`). Omit for a CSS-only placeholder. Nothing is ever autoplayed and no request is ever made for you. */
  media?: ReactNode;
  /** A URL string, or your own node, for the header portrait. Omit for the platform's grey. */
  avatar?: ReactNode;
  /** Show the `· Follow` affordance. Blue in the feed, white on reels. @default true */
  follow?: boolean;
  /** Blue active-story ring around the feed avatar. @default true */
  ring?: boolean;
  /** Relative timestamp in the meta line. @default '31m' */
  stamp?: string;
  /** Blue verified badge after the reels name. @default true */
  verified?: boolean;
  /** Track name on the reels and story audio line. @default 'Original audio' */
  audio?: string;
  /** Reaction count. Exact below 1,000, then `1.2K` / `48K` / `1.4M`. @default 267 */
  likes?: number;
  /** Comment count, formatted like `likes`. @default 12 */
  comments?: number;
  /** Share count, formatted like `likes`. @default 4 */
  shares?: number;
  /** How many story progress segments to draw. @default 2 */
  segments?: number;
  /** Index of the newest filled story segment; every earlier one fills too. @default 0 */
  segment?: number;
  /** Controlled mute state for the reels and story sound button. */
  muted?: boolean;
  /** Uncontrolled initial mute state. @default true on reels, false on the story */
  defaultMuted?: boolean;
  /** Fires when the sound button is pressed. You own the actual `<video>`, so wire it to your own element. */
  onMutedChange?: (muted: boolean) => void;
  /** Controlled like state for the thumb on the feed card and the reels rail. The displayed reaction count adds one while this is on. */
  liked?: boolean;
  /** Uncontrolled initial like state. @default false */
  defaultLiked?: boolean;
  /** Fires when the thumb toggles the like. */
  onLikedChange?: (liked: boolean) => void;
  /** Fires for the actions that carry no state: comment, share, follow, menu, dismiss, more, search, play. */
  onAction?: (action: FacebookFeedAction) => void;
  /** Extra class(es) merged onto the surface root. */
  className?: string;
  /** Inline styles merged onto the surface root. */
  style?: CSSProperties;
}

export interface FacebookFeedProps extends FacebookFeedOwnProps {
  /** Standard element attributes (aria-*, data-*, title, ...) forwarded to the surface root. */
  htmlProps?: Omit<HTMLAttributes<HTMLElement>, keyof FacebookFeedOwnProps> & DataAttributes;
}

export function FacebookFeed({
  surface = 'post',
  width = 'web',
  stage = 'narrow',
  type = 'image',
  name = DEFAULT_NAME,
  caption = DEFAULT_CAPTION,
  ratio = DEFAULT_RATIO,
  media,
  avatar,
  follow = true,
  ring = true,
  stamp = DEFAULT_STAMP,
  verified = true,
  audio = DEFAULT_AUDIO,
  likes = DEFAULT_LIKES,
  comments = DEFAULT_COMMENTS,
  shares = DEFAULT_SHARES,
  segments = DEFAULT_SEGMENTS,
  segment = DEFAULT_SEGMENT,
  muted,
  defaultMuted,
  onMutedChange,
  liked,
  defaultLiked = false,
  onLikedChange,
  onAction,
  className = '',
  style,
  htmlProps,
}: FacebookFeedProps) {
  const [sound, setSound] = useControllable(muted, defaultMuted ?? MUTED_BY_SURFACE[surface], onMutedChange);
  const [reacted, setReacted] = useControllable(liked, defaultLiked, onLikedChange);

  if (surface === 'reel')
    return (
      <FacebookReel
        name={name}
        caption={caption}
        stage={stage}
        follow={follow}
        verified={verified}
        audio={audio}
        media={media}
        avatar={avatar}
        type={type}
        likes={likes}
        comments={comments}
        shares={shares}
        muted={sound}
        onMutedChange={setSound}
        liked={reacted}
        onLikedChange={setReacted}
        onAction={onAction}
        className={className}
        style={style}
        htmlProps={htmlProps}
      />
    );

  if (surface === 'story')
    return (
      <FacebookStory
        name={name}
        stamp={stamp}
        audio={audio}
        ratio={ratio}
        media={media}
        avatar={avatar}
        type={type}
        segments={segments}
        segment={segment}
        muted={sound}
        onMutedChange={setSound}
        onAction={onAction}
        className={className}
        style={style}
        htmlProps={htmlProps}
      />
    );

  return (
    <FacebookPost
      name={name}
      caption={caption}
      stamp={stamp}
      follow={follow}
      ring={ring}
      ratio={ratio}
      media={media}
      avatar={avatar}
      type={type}
      likes={likes}
      comments={comments}
      shares={shares}
      width={width}
      liked={reacted}
      onLikedChange={setReacted}
      onAction={onAction}
      className={className}
      style={style}
      htmlProps={htmlProps}
    />
  );
}
