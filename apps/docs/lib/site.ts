export const SITE_URL = 'https://ui.zyncat.app';
export const SITE_NAME = 'Zyncat UI';
export const REPO_URL = 'https://github.com/Tabsir99/zyncat-ui';
export const PACKAGE_NAME = '@zyncat/ui';
export const AUTHOR_NAME = 'Tabsir Ahammed';
export const OG_IMAGE = `${SITE_URL}/og.png`;

export const canonical = (slug?: string) => (slug ? `${SITE_URL}/${slug}` : SITE_URL);
