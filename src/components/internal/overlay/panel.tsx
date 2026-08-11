'use client';

import { Children, cloneElement, type ReactElement, type ReactNode, type RefObject } from 'react';

export function ovPanelElement({
  asChild,
  children,
  prepend = null,
  nodeRef,
  className,
  panelProps,
}: {
  asChild: boolean;
  children: ReactNode;
  prepend?: ReactNode;
  nodeRef: RefObject<HTMLElement>;
  className: string;
  panelProps: Record<string, any>;
}): ReactElement {
  const merged = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');
  if (asChild) {
    const child = Children.only(children) as ReactElement<any>;
    if (typeof child.type === 'string') {
      const childRef = child.props.ref ?? (child as any).ref;
      const composedRef = (node: HTMLElement | null) => {
        nodeRef.current = node;
        if (typeof childRef === 'function') childRef(node);
        else if (childRef) childRef.current = node;
      };
      return cloneElement(
        child,
        {
          ...panelProps,
          ref: composedRef,
          className: merged(className, panelProps.className, child.props.className),
          style: { ...panelProps.style, ...child.props.style },
        },
        prepend,
        child.props.children,
      );
    }
    console.warn('[zyncat-ui] asChild requires a DOM-element child - falling back to a wrapper');
  }
  return (
    <div {...panelProps} ref={nodeRef as RefObject<HTMLDivElement>} className={merged(className, panelProps.className)}>
      {prepend}
      {children}
    </div>
  );
}
