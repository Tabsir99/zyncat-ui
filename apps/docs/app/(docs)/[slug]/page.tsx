import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageView } from '@/components/PageView';
import { DOCS } from '@/content/registry';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) return {};

  return {
    title: doc.label,
    description: doc.blurb,
    alternates: { canonical: `https://ui.zyncat.app/${doc.slug}` },
    openGraph: { title: `${doc.label} - Zyncat UI`, description: doc.blurb, url: `https://ui.zyncat.app/${doc.slug}` },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) notFound();

  return <PageView doc={doc} />;
}
