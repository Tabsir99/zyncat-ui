import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DocJsonLd } from '@/components/JsonLd';
import { PageView } from '@/components/PageView';
import { DOCS, GROUPS } from '@/content/registry';
import { SEO } from '@/content/seo';
import { canonical, OG_IMAGE, SITE_NAME } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }));
}

function resolve(slug: string) {
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) return null;
  const seo = SEO[slug];
  const group = GROUPS.find((g) => g.docs.some((d) => d.slug === slug));

  return {
    doc,
    seo,
    groupTitle: group?.title ?? 'Components',
    title: seo?.title ?? doc.label,
    description: seo?.description ?? doc.blurb,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = resolve(slug);
  if (!page) return {};

  const { seo, title, description } = page;
  const url = canonical(slug);
  const socialTitle = `${title} - ${SITE_NAME}`;

  return {
    title,
    description,
    ...(seo?.keywords.length ? { keywords: seo.keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [OG_IMAGE] },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const page = resolve(slug);
  if (!page) notFound();

  const { doc, seo, groupTitle, title, description } = page;

  return (
    <>
      <DocJsonLd
        slug={slug}
        label={doc.label}
        title={title}
        description={description}
        keywords={seo?.keywords}
        groupTitle={groupTitle}
        isComponent={!doc.Content}
        faq={seo?.faq}
      />
      <PageView doc={doc} seo={seo} />
    </>
  );
}
