import { z } from 'zod';

const faqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

const tutorialStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().optional(),
  language: z.string().optional(),
  tip: z.string().optional(),
  warning: z.string().optional(),
  image: z.string().optional(),
});

const authorSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  bio: z.string(),
});

const seoSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  focusKeyword: z.string(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  robotsIndex: z.boolean(),
  schemaType: z.string(),
  faqItems: z.array(faqItemSchema).optional(),
});

const articleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  coverImage: z.string(),
  coverImageAlt: z.string().optional(),
  author: authorSchema,
  categoryId: z.string(),
  tags: z.array(z.string()),
  readingTimeMinutes: z.number(),
  publishDate: z.string(),
  updatedAt: z.string(),
  status: z.enum(['published', 'draft', 'archived']),
  viewsCount: z.number(),
  likesCount: z.number(),
  featured: z.boolean().optional(),
  contentType: z.string().optional(),
  difficulty: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  tutorialSteps: z.array(tutorialStepSchema).optional(),
  seo: seoSchema,
  wpLevel: z.string().optional(),
  wpPlugin: z.string().optional(),
  wpVersion: z.string().optional(),
});

const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  accentColor: z.string().optional(),
  iconName: z.string().optional(),
  postCount: z.number().optional(),
  featured: z.boolean().optional(),
});

const commentReplySchema = z.object({
  id: z.string(),
  authorName: z.string(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  content: z.string(),
  createdAt: z.string(),
});

const commentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  authorName: z.string(),
  authorEmail: z.string(),
  authorAvatar: z.string().optional(),
  content: z.string(),
  createdAt: z.string(),
  status: z.enum(['approved', 'pending', 'spam', 'rejected']),
  likes: z.number(),
  replies: z.array(commentReplySchema).optional(),
});

const settingsSchema = z.object({
  siteTitle: z.string(),
  siteTagline: z.string(),
  siteDescription: z.string(),
  siteUrl: z.string(),
  authorName: z.string(),
  authorRole: z.string(),
  authorBio: z.string(),
  authorAvatar: z.string(),
  defaultOgImage: z.string(),
  enableComments: z.boolean(),
  autoApproveComments: z.boolean(),
  postsPerPage: z.number(),
  headerLogoText: z.string(),
  footerText: z.string(),
  contactEmail: z.string(),
  telegramUsername: z.string().optional(),
  githubUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  googleSiteVerification: z.string().optional(),
});

export const backupImportSchema = z.object({
  version: z.string().optional(),
  exportedAt: z.string().optional(),
  articles: z.array(articleSchema).optional(),
  categories: z.array(categorySchema).optional(),
  comments: z.array(commentSchema).optional(),
  settings: settingsSchema.optional(),
});
