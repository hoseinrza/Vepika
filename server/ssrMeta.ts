import { Article, Category, SiteSettings } from '../src/types';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateCategorySchema,
  generateCategoryBreadcrumbSchema,
  generateWebsiteSchema,
} from '../src/utils/schemaGenerator';

// Renders the correct <title>/meta description/canonical/OG/JSON-LD directly into
// the HTML shell server-side, so crawlers that don't execute JS (and the first,
// un-rendered fetch any crawler makes) see real per-page metadata instead of the
// same static homepage tags on every route. The client-side applyHeadMetadata()
// call re-applies the same data after hydration, so nothing here changes what a
// JS-capable visitor sees — it only makes it available before JS runs.

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLdScript(id: string, obj: object): string {
  const json = JSON.stringify(obj).replace(/</g, '\\u003c');
  return `<script id="${id}" type="application/ld+json">${json}</script>`;
}

interface HeadData {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: string;
  ogImage: string;
  jsonLdScripts: string[];
  articleMeta?: { publishedTime: string; modifiedTime: string; authorName: string; section: string };
}

function buildOgTwitterTags(head: HeadData, siteTitle: string): string {
  const tags = [
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(head.ogType)}" />`,
    `<meta property="og:url" content="${escapeHtml(head.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(head.ogImage)}" />`,
    `<meta property="og:locale" content="fa_IR" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteTitle)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(head.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(head.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(head.ogImage)}" />`,
  ];
  if (head.articleMeta) {
    tags.push(
      `<meta property="article:published_time" content="${escapeHtml(head.articleMeta.publishedTime)}" />`,
      `<meta property="article:modified_time" content="${escapeHtml(head.articleMeta.modifiedTime)}" />`,
      `<meta property="article:author" content="${escapeHtml(head.articleMeta.authorName)}" />`,
      `<meta property="article:section" content="${escapeHtml(head.articleMeta.section)}" />`
    );
  }
  return tags.join('\n    ');
}

export function headForArticle(article: Article, category: Category | undefined, settings: SiteSettings): HeadData {
  const siteUrl = settings.siteUrl;
  const title = article.seo.metaTitle || `${article.title} | ${settings.siteTitle}`;
  const description = article.seo.metaDescription || article.excerpt;
  const canonical = article.seo.canonicalUrl || `${siteUrl}/article/${article.slug}`;
  const ogImage = article.seo.ogImage || article.coverImage || settings.defaultOgImage || '';

  return {
    title,
    description,
    canonical,
    robots: article.seo.robotsIndex ? 'index, follow' : 'noindex, nofollow',
    ogType: 'article',
    ogImage,
    jsonLdScripts: [
      jsonLdScript('article-schema', generateArticleSchema(article, category, settings)),
      jsonLdScript('breadcrumb-schema', generateBreadcrumbSchema(article, category, siteUrl)),
    ],
    articleMeta: {
      publishedTime: article.publishDate,
      modifiedTime: article.updatedAt,
      authorName: article.author.name,
      section: category?.name || 'آموزش',
    },
  };
}

export function headForCategory(category: Category, articleCount: number, settings: SiteSettings): HeadData {
  const siteUrl = settings.siteUrl;
  const title = `${category.name} | ${settings.siteTitle}`;
  const description = category.description || `مجموعه آموزش‌های ${category.name} در ${settings.siteTitle}`;
  const canonical = `${siteUrl}/category/${category.slug}`;

  return {
    title,
    description,
    canonical,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: settings.defaultOgImage || '',
    jsonLdScripts: [
      jsonLdScript('article-schema', generateCategorySchema(category, articleCount, settings)),
      jsonLdScript('breadcrumb-schema', generateCategoryBreadcrumbSchema(category, siteUrl)),
    ],
  };
}

export function headForHome(settings: SiteSettings): HeadData {
  return {
    title: `${settings.siteTitle} | ${settings.siteTagline || 'مرجع تخصصی مقالات آموزشی'}`,
    description: settings.siteDescription,
    canonical: settings.siteUrl,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: settings.defaultOgImage || '',
    jsonLdScripts: [jsonLdScript('website-schema', generateWebsiteSchema(settings))],
  };
}

// Replaces the template's static <title>/description and appends canonical,
// robots, OpenGraph/Twitter tags and JSON-LD before </head>. Never touches
// anything outside <head> so app mounting/hydration is unaffected.
export function applyHeadToHtml(html: string, head: HeadData, siteTitle: string): string {
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(head.title)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(head.description)}" />`
  );

  const extraTags = [
    `<meta name="robots" content="${escapeHtml(head.robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(head.canonical)}" />`,
    buildOgTwitterTags(head, siteTitle),
    ...head.jsonLdScripts,
  ].join('\n    ');

  return out.replace('</head>', `    ${extraTags}\n  </head>`);
}
