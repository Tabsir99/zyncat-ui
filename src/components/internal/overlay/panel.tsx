'use client';

/* panel - the floating-panel element renderer shared by Popover and the modal shell. */
import { Children, type ReactElement, type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';

/* Render the panel: a motion.div wrapper, or with asChild the child's own tag (host element required - component children can't take a ref here). */
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
  /* A className riding motionProps (an overlay's forwarded htmlProps) merges onto the panel
     base class rather than being clobbered by it. */
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
    console.warn('[premium-ds] asChild requires a DOM-element child - falling back to a wrapper');
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
