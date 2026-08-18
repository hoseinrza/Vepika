import { Article, Category, Comment, SiteSettings, ToolkitChecklistItem, ToolkitSnippet } from '../src/types';

export function categoryFromRow(row: any, postCount: number): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    color: row.color,
    accentColor: row.accentColor || undefined,
    iconName: row.iconName || undefined,
    postCount,
    featured: !!row.featured,
  };
}

export function articleFromRow(row: any): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    coverImage: row.coverImage,
    coverImageAlt: row.coverImageAlt || undefined,
    author: JSON.parse(row.author),
    categoryId: row.categoryId,
    tags: JSON.parse(row.tags || '[]'),
    readingTimeMinutes: row.readingTimeMinutes,
    publishDate: row.publishDate,
    updatedAt: row.updatedAt,
    status: row.status,
    viewsCount: row.viewsCount,
    likesCount: row.likesCount,
    featured: !!row.featured,
    contentType: row.contentType || undefined,
    difficulty: row.difficulty || undefined,
    prerequisites: row.prerequisites ? JSON.parse(row.prerequisites) : undefined,
    tutorialSteps: row.tutorialSteps ? JSON.parse(row.tutorialSteps) : undefined,
    seo: JSON.parse(row.seo),
    wpLevel: row.wpLevel || undefined,
    wpPlugin: row.wpPlugin || undefined,
    wpVersion: row.wpVersion || undefined,
  };
}

export function articleToRow(article: Article) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    coverImageAlt: article.coverImageAlt || null,
    author: JSON.stringify(article.author),
    categoryId: article.categoryId,
    tags: JSON.stringify(article.tags || []),
    readingTimeMinutes: article.readingTimeMinutes,
    publishDate: article.publishDate,
    updatedAt: article.updatedAt,
    status: article.status,
    viewsCount: article.viewsCount,
    likesCount: article.likesCount,
    featured: article.featured ? 1 : 0,
    contentType: article.contentType || null,
    difficulty: article.difficulty || null,
    prerequisites: JSON.stringify(article.prerequisites || []),
    tutorialSteps: JSON.stringify(article.tutorialSteps || []),
    seo: JSON.stringify(article.seo),
    wpLevel: article.wpLevel || null,
    wpPlugin: article.wpPlugin || null,
    wpVersion: article.wpVersion || null,
  };
}

export function commentFromRow(row: any, replies: any[]): Comment {
  return {
    id: row.id,
    postId: row.postId,
    authorName: row.authorName,
    authorEmail: row.authorEmail,
    authorAvatar: row.authorAvatar || undefined,
    content: row.content,
    createdAt: row.createdAt,
    status: row.status,
    likes: row.likes,
    replies: replies.length
      ? replies.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          authorRole: r.authorRole || undefined,
          authorAvatar: r.authorAvatar || undefined,
          content: r.content,
          createdAt: r.createdAt,
        }))
      : undefined,
  };
}

export function toolkitSnippetFromRow(row: any): ToolkitSnippet {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    targetFile: row.targetFile,
    description: row.description,
    code: row.code,
    explanation: row.explanation,
    sortOrder: row.sortOrder,
  };
}

export function toolkitChecklistItemFromRow(row: any): ToolkitChecklistItem {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    sortOrder: row.sortOrder,
  };
}

export function settingsFromRow(row: any): SiteSettings {
  return {
    siteTitle: row.siteTitle,
    siteTagline: row.siteTagline,
    siteDescription: row.siteDescription,
    siteUrl: row.siteUrl,
    authorName: row.authorName,
    authorRole: row.authorRole,
    authorBio: row.authorBio,
    authorAvatar: row.authorAvatar,
    defaultOgImage: row.defaultOgImage,
    enableComments: !!row.enableComments,
    autoApproveComments: !!row.autoApproveComments,
    postsPerPage: row.postsPerPage,
    headerLogoText: row.headerLogoText,
    footerText: row.footerText,
    contactEmail: row.contactEmail,
    telegramUsername: row.telegramUsername || undefined,
    githubUrl: row.githubUrl || undefined,
    twitterUrl: row.twitterUrl || undefined,
    instagramUrl: row.instagramUrl || undefined,
    youtubeUrl: row.youtubeUrl || undefined,
    googleSiteVerification: row.googleSiteVerification || undefined,
  };
}
