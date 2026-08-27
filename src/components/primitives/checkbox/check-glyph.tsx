'use client';

import './checkbox.css';

import { Fragment, useEffect, useRef, type InputHTMLAttributes } from 'react';

export interface CheckGlyphProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  indeterminate?: boolean;
}

export function CheckGlyph({ indeterminate = false, ...inputProps }: CheckGlyphProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate, inputProps.checked]);

  return (
    <Fragment>
      <input ref={ref} type="checkbox" className="cbx__input" {...inputProps} />
      <span className="cbx__box" aria-hidden="true">
        <svg className="cbx__mark" viewBox="0 0 16 16" fill="none">
          <path className="cbx__tick" d="M3.5 8.5 L6.75 11.5 L12.5 4.75" />
        </svg>
        <span className="cbx__dash" />
      </span>
    </Fragment>
  );
}
