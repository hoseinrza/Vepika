import { db } from './db';

export function slugify(text: string): string {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/[^؀-ۿa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export function ensureUniqueSlug(table: 'articles' | 'categories', base: string, excludeId?: string): string {
  let candidate = base || 'item';
  let suffix = 1;
  const check = db.prepare(`SELECT id FROM ${table} WHERE slug = ?`);
  while (true) {
    const row = check.get(candidate) as { id: string } | undefined;
    if (!row || row.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}
