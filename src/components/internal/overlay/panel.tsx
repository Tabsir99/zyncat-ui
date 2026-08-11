'use client';

import { Children, type ReactElement, type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';

export function ovPanelElement({
  asChild,
  children,
  prepend = null,
  nodeRef,
  className,
  motionProps,
}: {
  asChild: boolean;
  children: ReactNode;
  prepend?: ReactNode;
  nodeRef: RefObject<HTMLElement>;
  className: string;
  motionProps: Record<string, any>;
}): ReactElement {
  const merged = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');
  if (asChild) {
    const child = Children.only(children) as ReactElement<any>;
    if (typeof child.type === 'string') {
      const Tag = (motion as any)[child.type];
      const composedRef = (node: HTMLElement | null) => {
        nodeRef.current = node;
        const r = (child as any).ref;
        if (typeof r === 'function') r(node);
        else if (r) r.current = node;
      };
      return (
        <Tag
          {...child.props}
          {...motionProps}
          ref={composedRef}
          className={merged(className, motionProps.className, child.props.className)}
          style={{ ...motionProps.style, ...child.props.style }}
        >
          {prepend}
          {child.props.children}
        </Tag>
      );
    }
    console.warn('[zyncat-ui] asChild requires a DOM-element child - falling back to a wrapper');
  }
  return (
    <motion.div
      {...motionProps}
      ref={nodeRef as RefObject<HTMLDivElement>}
      className={merged(className, motionProps.className)}
    >
      {prepend}
      {children}
    </motion.div>
  );
}
