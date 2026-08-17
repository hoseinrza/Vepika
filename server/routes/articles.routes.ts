import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { articleFromRow, articleToRow } from '../mappers';
import { requireAuth, requireAdmin, getSessionUser } from '../auth';
import { slugify, ensureUniqueSlug } from '../slugify';
import { Article } from '../../src/types';

export const articlesRouter = Router();

const clearOtherFeatured = db.prepare('UPDATE articles SET featured = 0 WHERE id != ?');
const setOwner = db.prepare('UPDATE articles SET ownerUserId = ? WHERE id = ?');
const insertArticleStmt = db.prepare(`
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
const updateArticleStmt = db.prepare(`
  UPDATE articles SET
    slug=@slug, title=@title, content=@content, excerpt=@excerpt, coverImage=@coverImage,
    coverImageAlt=@coverImageAlt, author=@author, categoryId=@categoryId, tags=@tags,
    readingTimeMinutes=@readingTimeMinutes, publishDate=@publishDate, updatedAt=@updatedAt,
    status=@status, viewsCount=@viewsCount, likesCount=@likesCount, featured=@featured,
    contentType=@contentType, difficulty=@difficulty, prerequisites=@prerequisites,
    tutorialSteps=@tutorialSteps, seo=@seo, wpLevel=@wpLevel, wpPlugin=@wpPlugin, wpVersion=@wpVersion
  WHERE id=@id
`);

// Only one article can be "the" hero/featured article at a time.
const insertArticle = db.transaction((article: Article, ownerUserId: string) => {
  insertArticleStmt.run(articleToRow(article));
  setOwner.run(ownerUserId, article.id);
  if (article.featured) clearOtherFeatured.run(article.id);
});
const updateArticle = db.transaction((article: Article) => {
  updateArticleStmt.run(articleToRow(article));
  if (article.featured) clearOtherFeatured.run(article.id);
});

// Authors may only touch their own articles; admins may touch any.
function canModify(req: import('express').Request, row: { ownerUserId: string | null }): boolean {
  if (req.admin!.role === 'admin') return true;
  return row.ownerUserId === req.admin!.id;
}

articlesRouter.get('/', (req, res) => {
  const user = getSessionUser(req);
  const wantsAll = req.query.all === '1' && !!user;

  if (!wantsAll) {
    const rows = db.prepare("SELECT * FROM articles WHERE status = 'published' ORDER BY publishDate DESC").all();
    return res.json((rows as any[]).map(articleFromRow));
  }

  const rows =
    user!.role === 'author'
      ? db.prepare('SELECT * FROM articles WHERE ownerUserId = ? ORDER BY publishDate DESC').all(user!.id)
      : db.prepare('SELECT * FROM articles ORDER BY publishDate DESC').all();

  res.json((rows as any[]).map(articleFromRow));
});

articlesRouter.get('/:id', (req, res) => {
  const row = db
    .prepare('SELECT * FROM articles WHERE id = ? OR slug = ?')
    .get(req.params.id, req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'مقاله یافت نشد' });
  if (row.status !== 'published' && !getSessionUser(req)) {
    return res.status(404).json({ error: 'مقاله یافت نشد' });
  }
  res.json(articleFromRow(row));
});

articlesRouter.post('/', requireAuth, (req, res) => {
  const body = req.body as Article;
  if (!body?.title || !body?.content || !body?.categoryId) {
    return res.status(400).json({ error: 'عنوان، محتوا و دسته‌بندی الزامی است' });
  }
  const now = new Date().toISOString();
  const slug = ensureUniqueSlug('articles', body.slug ? slugify(body.slug) : slugify(body.title));

  const article: Article = {
    ...body,
    id: crypto.randomUUID(),
    slug,
    publishDate: body.publishDate || now,
    updatedAt: now,
    viewsCount: 0,
    likesCount: 0,
  };

  insertArticle(article, req.admin!.id);

  res.status(201).json(article);
});

articlesRouter.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });
  if (!canModify(req, existing)) {
    return res.status(403).json({ error: 'فقط نویسنده این مقاله یا مدیر کل می‌تواند آن را ویرایش کند' });
  }

  const body = req.body as Article;
  const newSlug =
    body.slug && slugify(body.slug) !== existing.slug
      ? ensureUniqueSlug('articles', slugify(body.slug), existing.id)
      : existing.slug;

  const article: Article = {
    ...articleFromRow(existing),
    ...body,
    id: existing.id,
    slug: newSlug,
    updatedAt: new Date().toISOString(),
  };

  updateArticle(article);

  res.json(article);
});

articlesRouter.delete('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT ownerUserId FROM articles WHERE id = ?').get(req.params.id) as
    | { ownerUserId: string | null }
    | undefined;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });
  if (!canModify(req, existing)) {
    return res.status(403).json({ error: 'فقط نویسنده این مقاله یا مدیر کل می‌تواند آن را حذف کند' });
  }

  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

articlesRouter.post('/:id/duplicate', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });
  if (!canModify(req, existing)) {
    return res.status(403).json({ error: 'فقط نویسنده این مقاله یا مدیر کل می‌تواند آن را تکثیر کند' });
  }

  const source = articleFromRow(existing);
  const now = new Date().toISOString();
  const slug = ensureUniqueSlug('articles', `${source.slug}-copy`);

  const duplicate: Article = {
    ...source,
    id: crypto.randomUUID(),
    slug,
    title: `${source.title} (نسخه رونوشت)`,
    status: 'draft',
    publishDate: now,
    updatedAt: now,
    viewsCount: 0,
    likesCount: 0,
    featured: false, // a draft copy should never silently take over the hero slot
  };

  insertArticleStmt.run(articleToRow(duplicate));
  setOwner.run(req.admin!.id, duplicate.id);

  res.status(201).json(duplicate);
});

articlesRouter.patch('/:id/status', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT status, ownerUserId FROM articles WHERE id = ?').get(req.params.id) as
    | { status: string; ownerUserId: string | null }
    | undefined;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });
  if (!canModify(req, existing)) {
    return res.status(403).json({ error: 'فقط نویسنده این مقاله یا مدیر کل می‌تواند وضعیت آن را تغییر دهد' });
  }

  const nextStatus = existing.status === 'published' ? 'draft' : 'published';
  db.prepare('UPDATE articles SET status = ?, updatedAt = ? WHERE id = ?').run(
    nextStatus,
    new Date().toISOString(),
    req.params.id
  );
  res.json({ status: nextStatus });
});

// Sets/unsets this article as THE hero article shown in the homepage spotlight.
// Site-wide decision, so it's an admin-only action regardless of article ownership.
articlesRouter.patch('/:id/feature', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT id, featured FROM articles WHERE id = ?').get(req.params.id) as
    | { id: string; featured: number }
    | undefined;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });

  const nextFeatured = existing.featured ? 0 : 1;
  const setFeatured = db.transaction(() => {
    if (nextFeatured) clearOtherFeatured.run(req.params.id);
    db.prepare('UPDATE articles SET featured = ? WHERE id = ?').run(nextFeatured, req.params.id);
  });
  setFeatured();

  res.json({ featured: !!nextFeatured });
});

articlesRouter.post('/:id/view', (req, res) => {
  const result = db.prepare('UPDATE articles SET viewsCount = viewsCount + 1 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'مقاله یافت نشد' });
  res.status(204).end();
});

articlesRouter.post('/:id/like', (req, res) => {
  const result = db.prepare('UPDATE articles SET likesCount = likesCount + 1 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'مقاله یافت نشد' });
  const row = db.prepare('SELECT likesCount FROM articles WHERE id = ?').get(req.params.id) as {
    likesCount: number;
  };
  res.json({ likesCount: row.likesCount });
});
