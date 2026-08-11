'use client';

import { Fragment, useMemo, type ReactNode } from 'react';
import { Icon } from '../../../internal/icon/Icon';
import { IconSlot } from '../../../internal/icon/IconSlot';
import { Collapse } from '../../../../motion/Collapse';
import { GlidePill } from '../../../../motion/glide';
import { SelectMenu } from './menu';
import type { ListboxState } from './use-listbox';
import type { DisableableAnimation } from '../../../../motion/timing';
import type { ButtonProps } from '../../../primitives/button/Button';

export interface ListboxPanelProps {
  lb: ListboxState;
  loading: boolean;
  searchable: boolean;
  searchPlaceholder?: string;
  ariaLabel?: string;
  multiple?: boolean;
  /** Menu open/close timing - motion tokens only, or `null` to disable. */
  animation?: DisableableAnimation;
  check?: (selected: boolean) => ReactNode;
  size?: ButtonProps['size'];
}

const defaultCheck = (selected: boolean) => (selected ? <Icon key="on" name="check" size="sm" weight="bold" /> : null);

function LoadingRows() {
  return (
    <div className="select__loading" aria-busy="true" aria-live="polite">
      {[0, 1, 2].map((i) => (
        <div className="select__skeleton" key={i}>
          <span className="select__skeleton-dot" data-pulse></span>
          <span className="select__skeleton-bar" data-pulse></span>
        </div>
      ))}
    </div>
  );
}

function EmptyRow({ query }: { query: string }) {
  return <div className="select__empty">{query ? 'No matches for "' + query + '"' : 'No options available'}</div>;
}

export function ListboxPanel({
  lb,
  loading,
  searchable,
  searchPlaceholder,
  ariaLabel,
  multiple,
  animation,
  size = 'md',
  check = defaultCheck,
}: ListboxPanelProps) {
  const navIndex = useMemo(() => new Map(lb.navItems.map((o, i) => [o.value, i] as const)), [lb.navItems]);
  return (
    <SelectMenu
      open={lb.open}
      menuId={lb.menuId}
      close={lb.hide}
      triggerRef={lb.triggerRef}
      multiple={multiple}
      animation={animation}
    >
      {searchable && !loading && (
        <div className="select__search">
          <Icon name="magnifying-glass" size="sm" />
          <input
            ref={lb.searchRef}
            className="select__search-input"
            type="text"
            value={lb.query}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-controls={lb.listId}
            aria-activedescendant={lb.adId}
            onChange={(e) => lb.setQuery(e.target.value)}
            onKeyDown={lb.onMenuKeyDown}
          />
        </div>
      )}

      <div
        className="select__list"
        ref={lb.listRef}
        id={lb.listId}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        tabIndex={-1}
        aria-label={ariaLabel}
        onKeyDown={searchable ? undefined : lb.onMenuKeyDown}
      >
        <GlidePill className="select__glide" glide={lb.glide} />
        {loading ? (
          <LoadingRows />
        ) : (
          <Fragment>
            {lb.groups.map((g, gi) => (
              <div className="select__group" role="group" aria-label={g.label || undefined} key={gi}>
                {g.label && g.options.some((o) => navIndex.has(o.value)) && (
                  <div className="select__group-label">{g.label}</div>
                )}
                {g.options.map((opt) => {
                  const i = navIndex.get(opt.value) ?? -1;
                  const visible = i !== -1;
                  const isSel = lb.isSelected(opt.value);
                  const row = (
                    <div
                      key={opt.value}
                      id={visible ? lb.optId(opt.value) : undefined}
                      data-idx={visible ? i : undefined}
                      className="select__option"
                      role="option"
                      aria-selected={isSel}
                      aria-hidden={!visible || undefined}
                      aria-disabled={opt.disabled || undefined}
                      data-selected={isSel ? 'true' : undefined}
                      data-active={visible && i === lb.activeIdx ? 'true' : undefined}
                      data-disabled={opt.disabled ? 'true' : undefined}
                      onMouseEnter={() => visible && !opt.disabled && lb.setActiveIdx(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => visible && lb.commit(opt)}
                      data-size={size}
                    >
                      {opt.icon && (
                        <span className="select__option-icon">
                          <IconSlot size="sm">{opt.icon}</IconSlot>
                        </span>
                      )}
                      <span className="select__option-text">
                        <span className="select__option-label">{opt.label}</span>
                        {opt.description && <span className="select__option-desc">{opt.description}</span>}
                      </span>
                      {check(isSel) ? <span className="select__option-check">{check(isSel)}</span> : null}
                    </div>
                  );
                  return searchable ? (
                    <Collapse key={opt.value} open={visible} fade>
                      {row}
                    </Collapse>
                  ) : (
                    row
                  );
                })}
              </div>
            ))}
            {lb.navItems.length === 0 && <EmptyRow query={lb.query} />}
          </Fragment>
        )}
      </div>
    </SelectMenu>
  );
}
