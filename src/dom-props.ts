/* Arbitrary `data-*` attributes. React's *HTMLAttributes types don't declare a data-* index
   signature (JSX allows them through a separate intrinsic-element mechanism), so an object
   typed as HTMLAttributes rejects `{ 'data-x': ... }` in a literal. Every `htmlProps` type
   intersects this so data attributes pass through the nested prop as they would inline. */

export type DataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined };
