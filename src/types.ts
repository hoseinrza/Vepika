export type ArticleStatus = 'published' | 'draft' | 'archived';

export type SchemaType = 'BlogPosting' | 'Article' | 'TechArticle' | 'NewsArticle' | 'FAQPage' | 'HowTo';

export type ContentType = 'article' | 'tutorial' | 'guide' | 'snippet' | 'tool';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

export interface TutorialStep {
  stepNumber: number;
  title: string;
  description: string;
  codeSnippet?: string;
  language?: string;
  tip?: string;
  warning?: string;
  image?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ArticleSEO {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl?: string;
  ogImage?: string;
  robotsIndex: boolean;
  schemaType: SchemaType;
  faqItems?: FAQItem[];
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  author: Author;
  categoryId: string;
  tags: string[];
  readingTimeMinutes: number;
  publishDate: string; // ISO date string or Persian formatted
  updatedAt: string;
  status: ArticleStatus;
  viewsCount: number;
  likesCount: number;
  featured?: boolean;
  contentType?: ContentType;
  difficulty?: DifficultyLevel;
  prerequisites?: string[];
  tutorialSteps?: TutorialStep[];
  seo: ArticleSEO;
  wpLevel?: 'مقدماتی' | 'متوسط' | 'پیشرفته' | 'مقدماتی تا پیشرفته' | string;
  wpPlugin?: string;
  wpVersion?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  accentColor?: string;
  iconName?: string;
  postCount?: number;
  featured?: boolean;
}

export type CommentStatus = 'approved' | 'pending' | 'spam' | 'rejected';

export interface CommentReply {
  id: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  status: CommentStatus;
  likes: number;
  replies?: CommentReply[];
}

export interface SiteSettings {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  siteUrl: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  defaultOgImage: string;
  enableComments: boolean;
  autoApproveComments: boolean;
  postsPerPage: number;
  headerLogoText: string;
  footerText: string;
  contactEmail: string;
  telegramUsername?: string;
  githubUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  googleSiteVerification?: string;
}

export interface SeoCheckItem {
  id: string;
  label: string;
  passed: boolean;
  score: number; // 0 to 100
  advice: string;
  detail?: string;
}

export interface SeoAnalysisResult {
  score: number;
  grade: 'عالی' | 'خوب' | 'نیاز به بهبود' | 'ضعیف';
  color: string;
  checks: SeoCheckItem[];
}

export type ViewMode =
  | 'home'
  | 'article'
  | 'tutorial'
  | 'category'
  | 'categories-index'
  | 'tools'
  | 'admin'
  | 'blog'
  | 'toolkit';

export type AdminTab =
  | 'dashboard'
  | 'articles'
  | 'editor'
  | 'comments'
  | 'categories'
  | 'seo-settings'
  | 'users'
  | 'profile';

export type AdminRole = 'admin' | 'author';

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  displayName: string | null;
  jobTitle: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

