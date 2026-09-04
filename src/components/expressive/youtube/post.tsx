'use client';

import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactElement } from 'react';

import { startDrag, type PanInfo } from '../../../engine';
import { compactCount, groupedCount } from './format';
import {
  BubbleGlyph,
  ChevronLeftGlyph,
  ChevronRightGlyph,
  KebabGlyph,
  ShareGlyph,
  StackGlyph,
  ThumbDownGlyph,
  ThumbUpGlyph,
} from './glyphs';
import { Media, type YouTubeAction, type YouTubeMedia } from './media';

const PAGE_PROPERTY = '--youtube-carousel-page';
const DRAG_PROPERTY = '--youtube-carousel-drag';
const DRAGGING_ATTRIBUTE = 'data-dragging';
const NO_DRAG = '0px';

const RUBBER_BAND_DIVISOR = 6;
const PAGE_COMMIT_RATIO = 0.25;
const FLICK_DISTANCE_PX = 8;
const FLICK_VELOCITY_PX_PER_S = 420;
const FIRST_PAGE = 0;
const ONE_PAGE = 1;
const PRIMARY_BUTTON = 0;

const CAROUSEL_LABEL = 'Post images';
const CAROUSEL_ROLE_DESCRIPTION = 'carousel';
const SLIDE_ROLE_DESCRIPTION = 'slide';
const PREVIOUS_LABEL = 'Previous image';
const NEXT_LABEL = 'Next image';
const LIKES_LABEL = 'Likes';
const COMMENTS_LABEL = 'Comments';
const LIKE_LABEL = 'Like';
const DISLIKE_LABEL = 'Dislike';
const COMMENT_LABEL = 'Comment';
const SHARE_LABEL = 'Share';
const MENU_LABEL = 'More options';
const PREVIOUS_KEY = 'ArrowLeft';
const NEXT_KEY = 'ArrowRight';

function slideLabel(index: number, total: number): string {
  return String(index + ONE_PAGE) + ' of ' + String(total);
}

function pageStyle(page: number): CSSProperties {
  return { [PAGE_PROPERTY]: page } as CSSProperties;
}

function bandedTravel(travel: number, page: number, lastPage: number): number {
  const pullsBeforeStart = travel > 0 && page === FIRST_PAGE;
  const pullsPastEnd = travel < 0 && page === lastPage;
  return pullsBeforeStart || pullsPastEnd ? travel / RUBBER_BAND_DIVISOR : travel;
}

function settledPage(page: number, lastPage: number, travel: number, velocity: number, span: number): number {
  const distance = Math.abs(travel);
  const flicked = distance >= FLICK_DISTANCE_PX && Math.abs(velocity) >= FLICK_VELOCITY_PX_PER_S;
  if (!flicked && distance < span * PAGE_COMMIT_RATIO) return page;
  const step = travel < 0 ? ONE_PAGE : -ONE_PAGE;
  return Math.min(lastPage, Math.max(FIRST_PAGE, page + step));
}

export interface PostSurfaceProps {
  channel: string;
  age: string;
  text: string;
  likes: number;
  comments: number;
  slides: YouTubeMedia[];
  avatar?: YouTubeMedia;
  page: number;
  onPage: (next: number) => void;
  liked: boolean;
  onLikedChange: (liked: boolean) => void;
  disliked: boolean;
  onDislikedChange: (disliked: boolean) => void;
  onAction?: (action: YouTubeAction) => void;
}

export function PostSurface({
  channel,
  age,
  text,
  likes,
  comments,
  slides,
  avatar,
  page,
  onPage,
  liked,
  onLikedChange,
  disliked,
  onDislikedChange,
  onAction,
}: PostSurfaceProps): ReactElement {
  const carouselRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const detach = useRef<(() => void) | null>(null);
  const lastPage = Math.max(FIRST_PAGE, slides.length - ONE_PAGE);
  const paged = slides.length > ONE_PAGE;

  useEffect(
    () => () => {
      detach.current?.();
      detach.current = null;
    },
    [],
  );

  const goTo = (next: number) => {
    const clamped = Math.min(lastPage, Math.max(FIRST_PAGE, next));
    if (clamped !== page) onPage(clamped);
  };

  const onGrab = (event: PointerEvent<HTMLDivElement>) => {
    const root = carouselRef.current;
    const viewport = viewportRef.current;
    if (!paged || !root || !viewport || event.button !== PRIMARY_BUTTON || !event.isPrimary) return;
    const span = viewport.clientWidth;
    detach.current?.();
    root.setAttribute(DRAGGING_ATTRIBUTE, '');
    detach.current = startDrag(event, {
      onMove: (info: PanInfo) =>
        root.style.setProperty(DRAG_PROPERTY, bandedTravel(info.offset.x, page, lastPage) + 'px'),
      onEnd: (info: PanInfo) => {
        detach.current = null;
        root.style.setProperty(DRAG_PROPERTY, NO_DRAG);
        root.removeAttribute(DRAGGING_ATTRIBUTE);
        goTo(settledPage(page, lastPage, info.offset.x, info.velocity.x, span));
      },
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!paged) return;
    if (event.key === PREVIOUS_KEY) {
      event.preventDefault();
      goTo(page - ONE_PAGE);
    } else if (event.key === NEXT_KEY) {
      event.preventDefault();
      goTo(page + ONE_PAGE);
    }
  };

  return (
    <>
      <div className="zc-youtube-post__avatar">
        <Media source={avatar} className="zc-youtube__avatar-media" />
      </div>

      <div className="zc-youtube-post__body">
        <p className="zc-youtube-post__head">
          <span className="zc-youtube-post__name">{channel}</span>
          <span className="zc-youtube-post__time">{age}</span>
        </p>

        <p className="zc-youtube-post__text">{text}</p>

        <div className="zc-youtube-post__carousel" ref={carouselRef} style={pageStyle(page)}>
          <div
            className="zc-youtube-post__viewport"
            ref={viewportRef}
            role="group"
            aria-roledescription={paged ? CAROUSEL_ROLE_DESCRIPTION : undefined}
            aria-label={CAROUSEL_LABEL}
            tabIndex={paged ? FIRST_PAGE : undefined}
            onPointerDown={onGrab}
            onKeyDown={onKeyDown}
          >
            <div className="zc-youtube-post__strip">
              {slides.map((slide, index) => (
                <div
                  className="zc-youtube-post__slide"
                  key={index}
                  role={paged ? 'group' : undefined}
                  aria-roledescription={paged ? SLIDE_ROLE_DESCRIPTION : undefined}
                  aria-label={paged ? slideLabel(index, slides.length) : undefined}
                >
                  <Media source={slide} />
                </div>
              ))}
            </div>
            {paged && (
              <span className="zc-youtube-post__stack" aria-hidden="true">
                <StackGlyph />
              </span>
            )}
          </div>

          {paged && page > FIRST_PAGE && (
            <button
              type="button"
              className="zc-youtube-post__arrow zc-youtube-post__arrow--prev"
              aria-label={PREVIOUS_LABEL}
              onClick={() => goTo(page - ONE_PAGE)}
            >
              <ChevronLeftGlyph />
            </button>
          )}
          {paged && page < lastPage && (
            <button
              type="button"
              className="zc-youtube-post__arrow zc-youtube-post__arrow--next"
              aria-label={NEXT_LABEL}
              onClick={() => goTo(page + ONE_PAGE)}
            >
              <ChevronRightGlyph />
            </button>
          )}
        </div>

        <p className="zc-youtube-post__actions">
          <span className="zc-youtube-post__action">
            <button
              type="button"
              className="zc-youtube-button zc-youtube-post__action-glyph zc-youtube-post__action-glyph--thumb"
              aria-label={LIKE_LABEL}
              aria-pressed={liked}
              onClick={() => onLikedChange(!liked)}
            >
              <ThumbUpGlyph />
            </button>
            <span className="zc-youtube-post__action-count">
              <span className="zc-youtube__sr">{LIKES_LABEL} </span>
              {compactCount(likes + (liked ? 1 : 0))}
            </span>
          </span>
          <span className="zc-youtube-post__action zc-youtube-post__action--dislike">
            <button
              type="button"
              className="zc-youtube-button zc-youtube-post__action-glyph zc-youtube-post__action-glyph--thumb"
              aria-label={DISLIKE_LABEL}
              aria-pressed={disliked}
              onClick={() => onDislikedChange(!disliked)}
            >
              <ThumbDownGlyph />
            </button>
          </span>
          <span className="zc-youtube-post__action zc-youtube-post__action--share">
            <button
              type="button"
              className="zc-youtube-button zc-youtube-post__action-glyph zc-youtube-post__action-glyph--share"
              aria-label={SHARE_LABEL}
              onClick={() => onAction?.('share')}
            >
              <ShareGlyph />
            </button>
          </span>
          <span className="zc-youtube-post__action zc-youtube-post__action--comment">
            <button
              type="button"
              className="zc-youtube-button zc-youtube-post__action-glyph zc-youtube-post__action-glyph--bubble"
              aria-label={COMMENT_LABEL}
              onClick={() => onAction?.('comment')}
            >
              <BubbleGlyph />
            </button>
            <span className="zc-youtube-post__action-count">
              <span className="zc-youtube__sr">{COMMENTS_LABEL} </span>
              {groupedCount(comments)}
            </span>
          </span>
        </p>
      </div>

      <button
        type="button"
        className="zc-youtube-button zc-youtube-post__more"
        aria-label={MENU_LABEL}
        onClick={() => onAction?.('menu')}
      >
        <KebabGlyph />
      </button>
    </>
  );
}
