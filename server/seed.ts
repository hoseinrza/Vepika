import { db } from './db';
import { articleToRow } from './mappers';
import {
  INITIAL_ARTICLES,
  INITIAL_CATEGORIES,
  INITIAL_COMMENTS,
  INITIAL_SETTINGS,
} from '../src/data/initialData';

export function seedIfEmpty() {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number };
  if (count > 0) return;

  const insertCategory = db.prepare(`
    INSERT INTO categories (id, slug, name, description, color, accentColor, iconName, featured)
    VALUES (@id, @slug, @name, @description, @color, @accentColor, @iconName, @featured)
  `);

  const insertArticle = db.prepare(`
    INSERT INTO articles (
      id, slug, title, content, excerpt, coverImage, coverImageAlt, author, categoryId,
      tags, readingTimeMinutes, publishDate, updatedAt, status, viewsCount, likesCount,
      featured, contentType, difficulty, prerequisites, tutorialSteps, seo, wpLevel, wpPlugin, wpVersion
    ) VALUES (
      @id, @slug, @title, @content, @excerpt, @coverImage, @coverImageAlt, @author, @categoryId,
      @tags, @readingTimeMinutes, @publishDate, @updatedAt, @status, @viewsCount, @likesCount,
      @featured, @contentType, @difficulty, @prerequisites, @tutorialSteps, @seo, @wpLevel, @wpPlugin, @wpVersion
    )
  `);

  const insertComment = db.prepare(`
    INSERT INTO comments (id, postId, authorName, authorEmail, authorAvatar, content, createdAt, status, likes)
    VALUES (@id, @postId, @authorName, @authorEmail, @authorAvatar, @content, @createdAt, @status, @likes)
  `);

  const insertReply = db.prepare(`
    INSERT INTO comment_replies (id, commentId, authorName, authorRole, authorAvatar, content, createdAt)
    VALUES (@id, @commentId, @authorName, @authorRole, @authorAvatar, @content, @createdAt)
  `);

  const insertSettings = db.prepare(`
    INSERT INTO settings (
      id, siteTitle, siteTagline, siteDescription, siteUrl, authorName, authorRole, authorBio,
      authorAvatar, defaultOgImage, enableComments, autoApproveComments, postsPerPage,
      headerLogoText, footerText, contactEmail, telegramUsername, githubUrl, twitterUrl,
      instagramUrl, youtubeUrl, googleSiteVerification
    ) VALUES (
      1, @siteTitle, @siteTagline, @siteDescription, @siteUrl, @authorName, @authorRole, @authorBio,
      @authorAvatar, @defaultOgImage, @enableComments, @autoApproveComments, @postsPerPage,
      @headerLogoText, @footerText, @contactEmail, @telegramUsername, @githubUrl, @twitterUrl,
      @instagramUrl, @youtubeUrl, @googleSiteVerification
    )
  `);

  const seedAll = db.transaction(() => {
    for (const cat of INITIAL_CATEGORIES) {
      insertCategory.run({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        color: cat.color,
        accentColor: cat.accentColor || null,
        iconName: cat.iconName || null,
        featured: cat.featured ? 1 : 0,
      });
    }

    for (const article of INITIAL_ARTICLES) {
      insertArticle.run(articleToRow(article));
    }

    for (const comment of INITIAL_COMMENTS) {
      insertComment.run({
        id: comment.id,
        postId: comment.postId,
        authorName: comment.authorName,
        authorEmail: comment.authorEmail,
        authorAvatar: comment.authorAvatar || null,
        content: comment.content,
        createdAt: comment.createdAt,
        status: comment.status,
        likes: comment.likes,
      });
      for (const reply of comment.replies || []) {
        insertReply.run({
          id: reply.id,
          commentId: comment.id,
          authorName: reply.authorName,
          authorRole: reply.authorRole || null,
          authorAvatar: reply.authorAvatar || null,
          content: reply.content,
          createdAt: reply.createdAt,
        });
      }
    }

    insertSettings.run({
      siteTitle: INITIAL_SETTINGS.siteTitle,
      siteTagline: INITIAL_SETTINGS.siteTagline,
      siteDescription: INITIAL_SETTINGS.siteDescription,
      siteUrl: INITIAL_SETTINGS.siteUrl,
      authorName: INITIAL_SETTINGS.authorName,
      authorRole: INITIAL_SETTINGS.authorRole,
      authorBio: INITIAL_SETTINGS.authorBio,
      authorAvatar: INITIAL_SETTINGS.authorAvatar,
      defaultOgImage: INITIAL_SETTINGS.defaultOgImage,
      enableComments: INITIAL_SETTINGS.enableComments ? 1 : 0,
      autoApproveComments: INITIAL_SETTINGS.autoApproveComments ? 1 : 0,
      postsPerPage: INITIAL_SETTINGS.postsPerPage,
      headerLogoText: INITIAL_SETTINGS.headerLogoText,
      footerText: INITIAL_SETTINGS.footerText,
      contactEmail: INITIAL_SETTINGS.contactEmail,
      telegramUsername: INITIAL_SETTINGS.telegramUsername || null,
      githubUrl: INITIAL_SETTINGS.githubUrl || null,
      twitterUrl: INITIAL_SETTINGS.twitterUrl || null,
      instagramUrl: INITIAL_SETTINGS.instagramUrl || null,
      youtubeUrl: INITIAL_SETTINGS.youtubeUrl || null,
      googleSiteVerification: INITIAL_SETTINGS.googleSiteVerification || null,
    });
  });

  seedAll();
  console.log('پایگاه داده با محتوای اولیه ردوبز مقداردهی شد.');
}
