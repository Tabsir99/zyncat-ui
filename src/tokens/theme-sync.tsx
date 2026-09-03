'use client';

import { useEffect } from 'react';

import { refreshMotionTokens } from './motion-tokens';

export function ThemeSync({ css }: { css: string }): null {
  useEffect(() => {
    refreshMotionTokens();
    return () => {
      refreshMotionTokens();
    };
  }, [css]);
  return null;
}
