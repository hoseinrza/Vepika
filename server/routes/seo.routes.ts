import { Router } from 'express';
import { db } from '../db';
import { articleFromRow, categoryFromRow } from '../mappers';
import { generateSitemapXml, generateRobotsTxt } from '../../src/utils/schemaGenerator';

export const seoRouter = Router();

seoRouter.get('/sitemap.xml', (_req, res) => {
  const articles = (db.prepare('SELECT * FROM articles').all() as any[]).map(articleFromRow);
  const categoryRows = db.prepare('SELECT * FROM categories').all() as any[];
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM articles WHERE categoryId = ?');
  const categories = categoryRows.map((row) => categoryFromRow(row, (countStmt.get(row.id) as any).count));
  const settings = db.prepare('SELECT siteUrl FROM settings WHERE id = 1').get() as { siteUrl: string } | undefined;

  res.type('application/xml').send(generateSitemapXml(articles, categories, settings?.siteUrl));
});

seoRouter.get('/robots.txt', (_req, res) => {
  const settings = db.prepare('SELECT siteUrl FROM settings WHERE id = 1').get() as { siteUrl: string } | undefined;
  res.type('text/plain').send(generateRobotsTxt(settings?.siteUrl));
});
