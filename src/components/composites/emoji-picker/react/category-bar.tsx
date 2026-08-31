'use client';

import { useId, useRef } from 'react';

import { Motion } from '../../../../motion/element';
import { GlidePill, useGlide, type GlideApi } from '../../../../motion/glide';
import { UIMotion as SM } from '../../../../tokens/motion-tokens';
import { activationProps, type ActivateOn } from '../../../internal/utils/activation';
import { CATEGORY_ICON_ATTRS, CATEGORY_ICONS } from '../category-icons';
import { useCategories, useIsActiveCategory, type EmojiPickerStore } from './useEmojiPicker';

const RAIL_GLIDE = { timing: { duration: SM.dur.base, ease: SM.ease.standard } };

interface CategoryProps {
  store: EmojiPickerStore;
  categoryKey: string;
  railId: string;
  glide: GlideApi;
  activateOn?: ActivateOn;
}

function Category({ store, categoryKey, railId, glide, activateOn }: CategoryProps) {
  const isActive = useIsActiveCategory(store, categoryKey);

  return (
    <button
      type="button"
      className={isActive ? 'on-emoji-cat on-emoji-cat--active' : 'on-emoji-cat'}
      aria-label={categoryKey.replace(/-/g, ' ')}
      aria-current={isActive ? true : undefined}
      onPointerEnter={(e) => glide.enter(e.currentTarget)}
      {...activationProps<HTMLButtonElement>(() => store.scrollToCategory(categoryKey), {
        on: activateOn,
        holdFocus: true,
      })}
    >
      <svg
        {...CATEGORY_ICON_ATTRS}
        dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[categoryKey] ?? CATEGORY_ICONS.symbols }}
      />
      {isActive && (
        <Motion
          as="span"
          layoutId={railId}
          layoutTransition={RAIL_GLIDE}
          className="on-emoji-cat-rail"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export function CategoryBar({ store, activateOn }: { store: EmojiPickerStore; activateOn?: ActivateOn }) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const glide = useGlide(barRef);
  const railId = useId();
  const categories = useCategories(store);

  if (!categories.length) return null;

  return (
    <div
      ref={barRef}
      className="on-emoji-bar"
      onPointerLeave={glide.leave}
      onMouseDown={(e) => e.preventDefault()}
      role="group"
      aria-label="Emoji categories"
    >
      <GlidePill className="on-emoji-bar-marker" glide={glide} />
      {categories.map((key) => (
        <Category key={key} store={store} categoryKey={key} railId={railId} glide={glide} activateOn={activateOn} />
      ))}
    </div>
  );
}
