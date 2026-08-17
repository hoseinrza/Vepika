import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { categoryFromRow } from '../mappers';
import { requireAdmin } from '../auth';
import { slugify, ensureUniqueSlug } from '../slugify';
import { Category } from '../../src/types';

export const categoriesRouter = Router();

function listCategories(): Category[] {
  const rows = db.prepare('SELECT * FROM categories').all() as any[];
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM articles WHERE categoryId = ?');
  return rows.map((row) => {
    const { count } = countStmt.get(row.id) as { count: number };
    return categoryFromRow(row, count);
  });
}

categoriesRouter.get('/', (_req, res) => {
  res.json(listCategories());
});

categoriesRouter.post('/', requireAdmin, (req, res) => {
  const body = req.body as Category;
  if (!body?.name) return res.status(400).json({ error: 'نام دسته‌بندی الزامی است' });

  const slug = ensureUniqueSlug('categories', body.slug ? slugify(body.slug) : slugify(body.name));
  const category: Category = {
    id: crypto.randomUUID(),
    slug,
    name: body.name,
    description: body.description || '',
    color: body.color || '#2563EB',
    accentColor: body.accentColor,
    iconName: body.iconName,
    featured: body.featured,
  };

  db.prepare(`
    INSERT INTO categories (id, slug, name, description, color, accentColor, iconName, featured)
    VALUES (@id, @slug, @name, @description, @color, @accentColor, @iconName, @featured)
  `).run({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    color: category.color,
    accentColor: category.accentColor || null,
    iconName: category.iconName || null,
    featured: category.featured ? 1 : 0,
  });

  res.status(201).json({ ...category, postCount: 0 });
});

categoriesRouter.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'دسته‌بندی یافت نشد' });

  const body = req.body as Category;
  const newSlug =
    body.slug && slugify(body.slug) !== existing.slug
      ? ensureUniqueSlug('categories', slugify(body.slug), existing.id)
      : existing.slug;

  db.prepare(`
    UPDATE categories SET slug=@slug, name=@name, description=@description, color=@color,
      accentColor=@accentColor, iconName=@iconName, featured=@featured
    WHERE id=@id
  `).run({
    id: existing.id,
    slug: newSlug,
    name: body.name ?? existing.name,
    description: body.description ?? existing.description,
    color: body.color ?? existing.color,
    accentColor: body.accentColor ?? existing.accentColor ?? null,
    iconName: body.iconName ?? existing.iconName ?? null,
    featured: (body.featured ?? !!existing.featured) ? 1 : 0,
  });

  const { count } = db.prepare('SELECT COUNT(*) as count FROM articles WHERE categoryId = ?').get(existing.id) as {
    count: number;
  };
  res.json(categoryFromRow(db.prepare('SELECT * FROM categories WHERE id = ?').get(existing.id), count));
});

categoriesRouter.delete('/:id', requireAdmin, (req, res) => {
  const { count: totalCategories } = db.prepare('SELECT COUNT(*) as count FROM categories').get() as {
    count: number;
  };
  if (totalCategories <= 1) {
    return res.status(400).json({ error: 'حداقل یک دسته‌بندی باید باقی بماند' });
  }

  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(req.params.id) as
    | { id: string }
    | undefined;
  if (!existing) return res.status(404).json({ error: 'دسته‌بندی یافت نشد' });

  const fallback = db
    .prepare('SELECT id FROM categories WHERE id != ? LIMIT 1')
    .get(req.params.id) as { id: string };

  const deleteWithReassign = db.transaction(() => {
    db.prepare('UPDATE articles SET categoryId = ? WHERE categoryId = ?').run(fallback.id, req.params.id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  });
  deleteWithReassign();

  res.status(204).end();
});
