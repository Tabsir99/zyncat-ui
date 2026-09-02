export interface SeoFaq {
  q: string;
  a: string;
}

export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
  lede?: string;
  faq?: SeoFaq[];
}
