import { Article, Category, SiteSettings } from '../types';

// Collects whichever social/profile URLs are actually configured in Settings into
// a schema.org sameAs array — never fabricates a profile that wasn't entered.
function collectSameAs(settings?: Partial<SiteSettings>): string[] {
  if (!settings) return [];
  return [settings.githubUrl, settings.twitterUrl, settings.instagramUrl, settings.youtubeUrl]
    .filter((url): url is string => !!url && url.trim().length > 0);
}

/**
 * Generates JSON-LD Schema data for an Article based on schema.org standards
 */
export function generateArticleSchema(article: Article, category?: Category, settings?: Partial<SiteSettings>) {
  const siteUrl = settings?.siteUrl || 'https://redwebs.ir';
  const articleUrl = `${siteUrl}/article/${article.slug}`;
  const authorName = article.author?.name || settings?.authorName || 'تحریریه ردوبز';
  const authorBio = article.author?.bio || settings?.authorBio || 'نویسنده و پژوهشگر حوزه فناوری و آموزش';
  const publisherName = settings?.siteTitle || 'ردوبز';
  const orgSameAs = collectSameAs(settings);

  // Base Article / BlogPosting Schema
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': article.seo.schemaType || 'BlogPosting',
    '@id': `${articleUrl}#article`,
    'isPartOf': {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      'name': publisherName,
      'url': siteUrl,
    },
    'headline': article.seo.metaTitle || article.title,
    'description': article.seo.metaDescription || article.excerpt,
    'inLanguage': 'fa-IR',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    'url': articleUrl,
    'datePublished': article.publishDate || new Date().toISOString(),
    'dateModified': article.updatedAt || article.publishDate || new Date().toISOString(),
    'image': {
      '@type': 'ImageObject',
      'url': article.coverImage || settings?.defaultOgImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      'width': 1200,
      'height': 630,
    },
    'author': {
      '@type': 'Person',
      'name': authorName,
      'description': authorBio,
      'image': article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    'publisher': {
      '@type': 'Organization',
      'name': publisherName,
      'url': siteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`,
      },
      ...(orgSameAs.length > 0 ? { sameAs: orgSameAs } : {}),
    },
    'articleSection': category?.name || 'آموزش',
    'keywords': (article.tags || []).join(', '),
    'wordCount': (article.content || '').split(/\s+/).filter(Boolean).length,
    'timeRequired': `PT${article.readingTimeMinutes || 5}M`,
  };

  // Add FAQPage structure if FAQs exist
  if (article.seo.faqItems && article.seo.faqItems.length > 0) {
    schema['mainEntity'] = article.seo.faqItems.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    }));
  }

  return schema;
}

/**
 * Generates BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(article: Article, category?: Category, siteUrl: string = 'https://redwebs.ir') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'صفحه اصلی',
        'item': siteUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': category?.name || 'مقالات',
        'item': `${siteUrl}/category/${category?.slug || 'all'}`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': article.title,
        'item': `${siteUrl}/article/${article.slug}`,
      },
    ],
  };
}

/**
 * Generates Website Schema
 */
export function generateWebsiteSchema(settings: SiteSettings) {
  const orgSameAs = collectSameAs(settings);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${settings.siteUrl}#website`,
    'url': settings.siteUrl,
    'name': settings.siteTitle,
    'description': settings.siteDescription,
    'inLanguage': 'fa-IR',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${settings.siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    'publisher': {
      '@type': 'Organization',
      '@id': `${settings.siteUrl}#organization`,
      'name': settings.siteTitle,
      'url': settings.siteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': `${settings.siteUrl}/logo.png`,
      },
      ...(orgSameAs.length > 0 ? { sameAs: orgSameAs } : {}),
    },
  };
}

/**
 * Generates CollectionPage Schema for a category/topic listing page
 */
export function generateCategorySchema(
  category: Category,
  articleCount: number,
  settings?: Partial<SiteSettings>
) {
  const siteUrl = settings?.siteUrl || 'https://redwebs.ir';
  const categoryUrl = `${siteUrl}/category/${category.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${categoryUrl}#collectionpage`,
    'url': categoryUrl,
    'name': category.name,
    'description': category.description || `مجموعه آموزش‌های ${category.name} در ${settings?.siteTitle || 'ردوبز'}`,
    'inLanguage': 'fa-IR',
    'isPartOf': {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
    },
    'about': {
      '@type': 'Thing',
      'name': category.name,
    },
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': articleCount,
    },
  };
}

/**
 * Generates a two-level BreadcrumbList (Home > Category) for category pages
 */
export function generateCategoryBreadcrumbSchema(category: Category, siteUrl: string = 'https://redwebs.ir') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'صفحه اصلی',
        'item': siteUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': category.name,
        'item': `${siteUrl}/category/${category.slug}`,
      },
    ],
  };
}

/**
 * Live updater for document head metadata tags and JSON-LD scripts
 */
export function applyHeadMetadata(
  article?: Article,
  category?: Category,
  settings?: SiteSettings,
  categoryArticleCount: number = 0
) {
  if (typeof document === 'undefined') return;

  const siteTitle = settings?.siteTitle || 'ردوبز';
  const siteUrl = settings?.siteUrl || 'https://redwebs.ir';

  // Category listing page (no specific article selected)
  if (!article && category) {
    const title = `${category.name} | ${siteTitle}`;
    const description = category.description || `مجموعه آموزش‌های ${category.name} در ${siteTitle}`;
    const canonical = `${siteUrl}/category/${category.slug}`;

    document.title = title;
    setMeta('description', description);
    setMeta('robots', 'index, follow');
    setCanonical(canonical);
    setOgMeta('og:title', title);
    setOgMeta('og:description', description);
    setOgMeta('og:type', 'website');
    setOgMeta('og:url', canonical);
    setOgMeta('og:image', settings?.defaultOgImage || '');
    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', title);
    setTwitterMeta('twitter:description', description);
    setTwitterMeta('twitter:image', settings?.defaultOgImage || '');

    injectJsonLd('article-schema', generateCategorySchema(category, categoryArticleCount, settings));
    injectJsonLd('breadcrumb-schema', generateCategoryBreadcrumbSchema(category, siteUrl));
    removeJsonLd('website-schema');
    return;
  }

  if (!article) {
    // Default homepage meta
    document.title = `${siteTitle} | ${settings?.siteTagline || 'مرجع تخصصی مقالات آموزشی'}`;
    setMeta('description', settings?.siteDescription || 'وبلاگ آموزشی مینیمال با فونت لاله‌زار');
    setMeta('robots', 'index, follow');
    setCanonical(siteUrl);
    setOgMeta('og:title', document.title);
    setOgMeta('og:description', settings?.siteDescription || '');
    setOgMeta('og:type', 'website');
    setOgMeta('og:url', siteUrl);
    setOgMeta('og:image', settings?.defaultOgImage || '');
    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', document.title);
    setTwitterMeta('twitter:description', settings?.siteDescription || '');
    setTwitterMeta('twitter:image', settings?.defaultOgImage || '');

    // Website JSON-LD
    if (settings) {
      injectJsonLd('website-schema', generateWebsiteSchema(settings));
    }
    removeJsonLd('article-schema');
    removeJsonLd('breadcrumb-schema');
    return;
  }

  // Article page meta
  const title = article.seo.metaTitle || `${article.title} | ${siteTitle}`;
  const description = article.seo.metaDescription || article.excerpt;
  const canonical = article.seo.canonicalUrl || `${siteUrl}/article/${article.slug}`;
  const ogImg = article.seo.ogImage || article.coverImage || settings?.defaultOgImage || '';

  document.title = title;
  setMeta('description', description);
  setMeta('robots', article.seo.robotsIndex ? 'index, follow' : 'noindex, nofollow');
  setMeta('keywords', article.tags.join(', '));
  setCanonical(canonical);

  // OpenGraph
  setOgMeta('og:title', title);
  setOgMeta('og:description', description);
  setOgMeta('og:type', 'article');
  setOgMeta('og:url', canonical);
  setOgMeta('og:image', ogImg);
  setOgMeta('og:locale', 'fa_IR');
  setOgMeta('og:site_name', siteTitle);

  // Article specific OG tags
  setOgMeta('article:published_time', article.publishDate);
  setOgMeta('article:modified_time', article.updatedAt);
  setOgMeta('article:author', article.author.name);
  setOgMeta('article:section', category?.name || 'آموزش');

  // Twitter
  setTwitterMeta('twitter:card', 'summary_large_image');
  setTwitterMeta('twitter:title', title);
  setTwitterMeta('twitter:description', description);
  setTwitterMeta('twitter:image', ogImg);

  // Inject JSON-LD Schema
  injectJsonLd('article-schema', generateArticleSchema(article, category, settings));
  injectJsonLd('breadcrumb-schema', generateBreadcrumbSchema(article, category, siteUrl));
  removeJsonLd('website-schema');
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOgMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setTwitterMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

function injectJsonLd(id: string, schemaObj: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schemaObj, null, 2);
}

function removeJsonLd(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.remove();
  }
}

/**
 * Generates dynamic sitemap.xml string for all articles and categories
 */
export function generateSitemapXml(articles: Article[], categories: Category[], siteUrl: string = 'https://redwebs.ir'): string {
  const published = articles.filter((a) => a.status === 'published');
  
  const articleUrls = published.map((a) => `  <url>
    <loc>${siteUrl}/article/${a.slug}</loc>
    <lastmod>${(a.updatedAt || a.publishDate || new Date().toISOString()).slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  const categoryUrls = categories.map((c) => `  <url>
    <loc>${siteUrl}/category/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${articleUrls}
${categoryUrls}
</urlset>`;
}

/**
 * Generates standard robots.txt
 */
export function generateRobotsTxt(siteUrl: string = 'https://redwebs.ir'): string {
  return `User-agent: *
Allow: /
Disallow: /panel-rw2026

Sitemap: ${siteUrl}/sitemap.xml`;
}

