import { Router } from 'express';
import { db } from '../db';
import { articleFromRow, articleToRow, categoryFromRow, commentFromRow, settingsFromRow } from '../mappers';
import { requireAuth } from '../auth';
import { backupImportSchema } from '../schemas/backup.schema';

export const backupRouter = Router();

backupRouter.get('/export', requireAuth, (_req, res) => {
  const categoryRows = db.prepare('SELECT * FROM categories').all() as any[];
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM articles WHERE categoryId = ?');
  const categories = categoryRows.map((row) => categoryFromRow(row, (countStmt.get(row.id) as any).count));

  const articleRows = db.prepare('SELECT * FROM articles').all() as any[];
  const articles = articleRows.map(articleFromRow);

  const commentRows = db.prepare('SELECT * FROM comments').all() as any[];
  const repliesStmt = db.prepare('SELECT * FROM comment_replies WHERE commentId = ?');
  const comments = commentRows.map((row) => commentFromRow(row, repliesStmt.all(row.id) as any[]));

  const settingsRow = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  const settings = settingsRow ? settingsFromRow(settingsRow) : undefined;

  res.setHeader('Content-Disposition', `attachment; filename="redwebs-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json({ version: '1.0.0', exportedAt: new Date().toISOString(), settings, categories, articles, comments });
});

backupRouter.post('/import', requireAuth, (req, res) => {
  const parsed = backupImportSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'فرمت فایل پشتیبان معتبر نیست', details: parsed.error.issues });
  }
  const data = parsed.data;

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

  const runImport = db.transaction(() => {
    if (data.categories) {
      db.prepare('DELETE FROM categories').run();
      for (const cat of data.categories) {
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
    }

    if (data.articles) {
      db.prepare('DELETE FROM articles').run();
      for (const article of data.articles) {
        insertArticle.run(articleToRow(article as any));
      }
    }

    if (data.comments) {
      // foreign_keys is OFF during this transaction (see below), so ON DELETE CASCADE
      // won't fire — clear the child table explicitly before deleting comments.
      db.prepare('DELETE FROM comment_replies').run();
      db.prepare('DELETE FROM comments').run();
      for (const comment of data.comments) {
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
    }

    if (data.settings) {
      const s = data.settings;
      db.prepare(`
        UPDATE settings SET
          siteTitle=@siteTitle, siteTagline=@siteTagline, siteDescription=@siteDescription, siteUrl=@siteUrl,
          authorName=@authorName, authorRole=@authorRole, authorBio=@authorBio, authorAvatar=@authorAvatar,
          defaultOgImage=@defaultOgImage, enableComments=@enableComments, autoApproveComments=@autoApproveComments,
          postsPerPage=@postsPerPage, headerLogoText=@headerLogoText, footerText=@footerText, contactEmail=@contactEmail,
          telegramUsername=@telegramUsername, githubUrl=@githubUrl, twitterUrl=@twitterUrl,
          instagramUrl=@instagramUrl, youtubeUrl=@youtubeUrl, googleSiteVerification=@googleSiteVerification
        WHERE id = 1
      `).run({
        siteTitle: s.siteTitle,
        siteTagline: s.siteTagline,
        siteDescription: s.siteDescription,
        siteUrl: s.siteUrl,
        authorName: s.authorName,
        authorRole: s.authorRole,
        authorBio: s.authorBio,
        authorAvatar: s.authorAvatar,
        defaultOgImage: s.defaultOgImage,
        enableComments: s.enableComments ? 1 : 0,
        autoApproveComments: s.autoApproveComments ? 1 : 0,
        postsPerPage: s.postsPerPage,
        headerLogoText: s.headerLogoText,
        footerText: s.footerText,
        contactEmail: s.contactEmail,
        telegramUsername: s.telegramUsername || null,
        githubUrl: s.githubUrl || null,
        twitterUrl: s.twitterUrl || null,
        instagramUrl: s.instagramUrl || null,
        youtubeUrl: s.youtubeUrl || null,
        googleSiteVerification: s.googleSiteVerification || null,
      });
    }
  });

  db.pragma('foreign_keys = OFF');
  try {
    runImport();
  } finally {
    db.pragma('foreign_keys = ON');
  }

  res.status(204).end();
});
