'use client';

/* CheckGlyph - the .cbx input+box pair that checkbox.css's state machine paints.
   Render this from any module that needs the visual (Checkbox, Table cells,
   MultiSelect rows) - the import ships the CSS with it. Never paste the DOM:
   the class contract without the stylesheet is how a lone `@zyncat/ui/table`
   import ends up with naked native checkboxes. */
import './checkbox.css';
import { Fragment, useEffect, useRef, type InputHTMLAttributes } from 'react';

export interface CheckGlyphProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** The "some, not all" select-all state - a DOM property, not an attribute. */
  indeterminate?: boolean;
}

export function CheckGlyph({ indeterminate = false, ...inputProps }: CheckGlyphProps) {
  const ref = useRef<HTMLInputElement>(null);

  // `indeterminate` is not an HTML attribute - push it onto the node directly.
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
