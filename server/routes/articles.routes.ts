import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { articleFromRow, articleToRow } from '../mappers';
import { requireAuth, getSessionUsername } from '../auth';
import { slugify, ensureUniqueSlug } from '../slugify';
import { Article } from '../../src/types';

export const articlesRouter = Router();

articlesRouter.get('/', (req, res) => {
  const wantsAll = req.query.all === '1' && !!getSessionUsername(req);
  const rows = wantsAll
    ? db.prepare('SELECT * FROM articles ORDER BY publishDate DESC').all()
    : db.prepare("SELECT * FROM articles WHERE status = 'published' ORDER BY publishDate DESC").all();
  res.json((rows as any[]).map(articleFromRow));
});

articlesRouter.get('/:id', (req, res) => {
  const row = db
    .prepare('SELECT * FROM articles WHERE id = ? OR slug = ?')
    .get(req.params.id, req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'مقاله یافت نشد' });
  if (row.status !== 'published' && !getSessionUsername(req)) {
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

  db.prepare(`
    INSERT INTO articles (
      id, slug, title, content, excerpt, coverImage, coverImageAlt, author, categoryId,
      tags, readingTimeMinutes, publishDate, updatedAt, status, viewsCount, likesCount,
      featured, contentType, difficulty, prerequisites, tutorialSteps, seo, wpLevel, wpPlugin, wpVersion
    ) VALUES (
      @id, @slug, @title, @content, @excerpt, @coverImage, @coverImageAlt, @author, @categoryId,
      @tags, @readingTimeMinutes, @publishDate, @updatedAt, @status, @viewsCount, @likesCount,
      @featured, @contentType, @difficulty, @prerequisites, @tutorialSteps, @seo, @wpLevel, @wpPlugin, @wpVersion
    )
  `).run(articleToRow(article));

  res.status(201).json(article);
});

articlesRouter.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });

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

  db.prepare(`
    UPDATE articles SET
      slug=@slug, title=@title, content=@content, excerpt=@excerpt, coverImage=@coverImage,
      coverImageAlt=@coverImageAlt, author=@author, categoryId=@categoryId, tags=@tags,
      readingTimeMinutes=@readingTimeMinutes, publishDate=@publishDate, updatedAt=@updatedAt,
      status=@status, viewsCount=@viewsCount, likesCount=@likesCount, featured=@featured,
      contentType=@contentType, difficulty=@difficulty, prerequisites=@prerequisites,
      tutorialSteps=@tutorialSteps, seo=@seo, wpLevel=@wpLevel, wpPlugin=@wpPlugin, wpVersion=@wpVersion
    WHERE id=@id
  `).run(articleToRow(article));

  res.json(article);
});

articlesRouter.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'مقاله یافت نشد' });
  res.status(204).end();
});

articlesRouter.post('/:id/duplicate', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });

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
  };

  db.prepare(`
    INSERT INTO articles (
      id, slug, title, content, excerpt, coverImage, coverImageAlt, author, categoryId,
      tags, readingTimeMinutes, publishDate, updatedAt, status, viewsCount, likesCount,
      featured, contentType, difficulty, prerequisites, tutorialSteps, seo, wpLevel, wpPlugin, wpVersion
    ) VALUES (
      @id, @slug, @title, @content, @excerpt, @coverImage, @coverImageAlt, @author, @categoryId,
      @tags, @readingTimeMinutes, @publishDate, @updatedAt, @status, @viewsCount, @likesCount,
      @featured, @contentType, @difficulty, @prerequisites, @tutorialSteps, @seo, @wpLevel, @wpPlugin, @wpVersion
    )
  `).run(articleToRow(duplicate));

  res.status(201).json(duplicate);
});

articlesRouter.patch('/:id/status', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT status FROM articles WHERE id = ?').get(req.params.id) as
    | { status: string }
    | undefined;
  if (!existing) return res.status(404).json({ error: 'مقاله یافت نشد' });

  const nextStatus = existing.status === 'published' ? 'draft' : 'published';
  db.prepare('UPDATE articles SET status = ?, updatedAt = ? WHERE id = ?').run(
    nextStatus,
    new Date().toISOString(),
    req.params.id
  );
  res.json({ status: nextStatus });
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
