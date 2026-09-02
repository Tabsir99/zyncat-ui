import { AUTHOR_NAME, canonical, OG_IMAGE, PACKAGE_NAME, REPO_URL, SITE_NAME, SITE_URL } from '@/lib/site';

import type { PageSeo } from '../content/seo/types';

type Node = Record<string, unknown>;

const serialize = (graph: Node[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');

function Script({ graph }: { graph: Node[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(graph) }} />;
}

const organization: Node = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  founder: { '@type': 'Person', name: AUTHOR_NAME },
};

const website: Node = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
};

const softwareApplication: Node = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#software`,
  name: SITE_NAME,
  alternateName: PACKAGE_NAME,
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'React component library',
  operatingSystem: 'Web',
  softwareRequirements: 'React 19',
  programmingLanguage: ['TypeScript', 'JavaScript', 'CSS'],
  runtimePlatform: 'React 19',
  url: SITE_URL,
  downloadUrl: `https://www.npmjs.com/package/${PACKAGE_NAME}`,
  codeRepository: REPO_URL,
  license: 'https://opensource.org/licenses/MIT',
  author: { '@type': 'Person', name: AUTHOR_NAME },
  publisher: { '@id': `${SITE_URL}/#organization` },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

function breadcrumb(trail: { name: string; url?: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url ? { item: crumb.url } : {}),
    })),
  };
}

function faqPage(url: string, faq: NonNullable<PageSeo['faq']>): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  };
}

export interface DocJsonLdProps {
  slug: string;
  label: string;
  title: string;
  description: string;
  keywords?: string[];
  groupTitle: string;
  isComponent: boolean;
  faq?: PageSeo['faq'];
}

export function DocJsonLd({ slug, label, title, description, keywords, groupTitle, isComponent, faq }: DocJsonLdProps) {
  const url = canonical(slug);

  const article: Node = {
    '@type': isComponent ? 'APIReference' : 'TechArticle',
    '@id': `${url}#article`,
    headline: title,
    name: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#software` },
    author: { '@type': 'Person', name: AUTHOR_NAME },
    publisher: { '@id': `${SITE_URL}/#organization` },
    image: OG_IMAGE,
    articleSection: groupTitle,
    proficiencyLevel: 'Beginner',
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
    ...(isComponent
      ? {
          assemblyVersion: PACKAGE_NAME,
          programmingModel: 'React component',
          targetPlatform: 'React 19',
          executableLibraryName: `${PACKAGE_NAME}/${slug}`,
        }
      : {}),
  };

  const graph: Node[] = [
    article,
    breadcrumb([{ name: 'Docs', url: `${SITE_URL}/introduction` }, { name: groupTitle }, { name: label, url }]),
  ];

  if (faq?.length) graph.push(faqPage(url, faq));

  return <Script graph={graph} />;
}

export function SiteJsonLd() {
  return <Script graph={[organization, website, softwareApplication]} />;
}
