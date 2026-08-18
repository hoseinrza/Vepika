import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { toolkitChecklistItemFromRow, toolkitSnippetFromRow } from '../mappers';
import { requireAdmin } from '../auth';
import { ToolkitChecklistItem, ToolkitSnippet } from '../../src/types';

export const toolkitRouter = Router();

function nextSortOrder(table: string): number {
  const { max } = db.prepare(`SELECT MAX(sortOrder) as max FROM ${table}`).get() as { max: number | null };
  return (max ?? -1) + 1;
}

// --- Snippets ---------------------------------------------------------

toolkitRouter.get('/snippets', (_req, res) => {
  const rows = db.prepare('SELECT * FROM toolkit_snippets ORDER BY sortOrder ASC').all() as any[];
  res.json(rows.map(toolkitSnippetFromRow));
});

toolkitRouter.post('/snippets', requireAdmin, (req, res) => {
  const body = req.body as ToolkitSnippet;
  if (!body?.title || !body?.code) {
    return res.status(400).json({ error: 'عنوان و کد اسنیپت الزامی است' });
  }

  const snippet: ToolkitSnippet = {
    id: crypto.randomUUID(),
    title: body.title,
    category: body.category || 'security',
    targetFile: body.targetFile || 'functions.php',
    description: body.description || '',
    code: body.code,
    explanation: body.explanation || '',
    sortOrder: nextSortOrder('toolkit_snippets'),
  };

  db.prepare(`
    INSERT INTO toolkit_snippets (id, title, category, targetFile, description, code, explanation, sortOrder)
    VALUES (@id, @title, @category, @targetFile, @description, @code, @explanation, @sortOrder)
  `).run(snippet);

  res.status(201).json(snippet);
});

toolkitRouter.put('/snippets/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM toolkit_snippets WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'اسنیپت یافت نشد' });

  const body = req.body as ToolkitSnippet;
  db.prepare(`
    UPDATE toolkit_snippets SET title=@title, category=@category, targetFile=@targetFile,
      description=@description, code=@code, explanation=@explanation
    WHERE id=@id
  `).run({
    id: existing.id,
    title: body.title ?? existing.title,
    category: body.category ?? existing.category,
    targetFile: body.targetFile ?? existing.targetFile,
    description: body.description ?? existing.description,
    code: body.code ?? existing.code,
    explanation: body.explanation ?? existing.explanation,
  });

  res.json(toolkitSnippetFromRow(db.prepare('SELECT * FROM toolkit_snippets WHERE id = ?').get(existing.id)));
});

toolkitRouter.delete('/snippets/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT id FROM toolkit_snippets WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'اسنیپت یافت نشد' });

  db.prepare('DELETE FROM toolkit_snippets WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

// --- Checklist items ----------------------------------------------------

toolkitRouter.get('/checklist', (_req, res) => {
  const rows = db.prepare('SELECT * FROM toolkit_checklist_items ORDER BY sortOrder ASC').all() as any[];
  res.json(rows.map(toolkitChecklistItemFromRow));
});

toolkitRouter.post('/checklist', requireAdmin, (req, res) => {
  const body = req.body as ToolkitChecklistItem;
  if (!body?.title) return res.status(400).json({ error: 'عنوان گام الزامی است' });

  const item: ToolkitChecklistItem = {
    id: crypto.randomUUID(),
    category: body.category || 'عمومی',
    title: body.title,
    description: body.description || '',
    sortOrder: nextSortOrder('toolkit_checklist_items'),
  };

  db.prepare(`
    INSERT INTO toolkit_checklist_items (id, category, title, description, sortOrder)
    VALUES (@id, @category, @title, @description, @sortOrder)
  `).run(item);

  res.status(201).json(item);
});

toolkitRouter.put('/checklist/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM toolkit_checklist_items WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'گام چک‌لیست یافت نشد' });

  const body = req.body as ToolkitChecklistItem;
  db.prepare(`
    UPDATE toolkit_checklist_items SET category=@category, title=@title, description=@description
    WHERE id=@id
  `).run({
    id: existing.id,
    category: body.category ?? existing.category,
    title: body.title ?? existing.title,
    description: body.description ?? existing.description,
  });

  res.json(
    toolkitChecklistItemFromRow(db.prepare('SELECT * FROM toolkit_checklist_items WHERE id = ?').get(existing.id))
  );
});

toolkitRouter.delete('/checklist/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT id FROM toolkit_checklist_items WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'گام چک‌لیست یافت نشد' });

  db.prepare('DELETE FROM toolkit_checklist_items WHERE id = ?').run(req.params.id);
  res.status(204).end();
});
