import type { MetadataRoute } from 'next';

import { GROUPS } from '@/content/registry';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const PRIORITY: Record<string, number> = {
  'getting-started': 0.9,
  primitives: 0.8,
  forms: 0.8,
  overlays: 0.8,
  expressive: 0.8,
  data: 0.7,
  datetime: 0.7,
  compound: 0.7,
  replicas: 0.7,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...GROUPS.flatMap((group) =>
      group.docs.map((doc) => ({
        url: `${SITE_URL}/${doc.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: PRIORITY[group.id] ?? 0.7,
      })),
    ),
  ];
}
