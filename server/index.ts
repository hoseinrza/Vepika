import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { seedIfEmpty } from './seed';
import { bootstrapAdmin } from './auth';
import { db } from './db';
import { articleFromRow, categoryFromRow, settingsFromRow } from './mappers';
import { headForArticle, headForCategory, headForHome, applyHeadToHtml } from './ssrMeta';
import { authRouter } from './routes/auth.routes';
import { usersRouter } from './routes/users.routes';
import { profileRouter } from './routes/profile.routes';
import { articlesRouter } from './routes/articles.routes';
import { categoriesRouter } from './routes/categories.routes';
import { commentsRouter } from './routes/comments.routes';
import { settingsRouter } from './routes/settings.routes';
import { backupRouter } from './routes/backup.routes';
import { seoRouter } from './routes/seo.routes';
import { geminiRouter } from './routes/gemini.routes';

async function startServer() {
  seedIfEmpty();
  bootstrapAdmin();

  const app = express();
  const PORT = 3000;

  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/articles', articlesRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/backup', backupRouter);
  app.use('/api/gemini', geminiRouter);
  app.use('/', seoRouter);

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    const indexHtmlTemplate = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    const countArticlesInCategory = db.prepare('SELECT COUNT(*) as count FROM articles WHERE categoryId = ?');

    // Serves the SPA shell for every non-API route, but for /, /article/:slug and
    // /category/:slug it also renders the real title/description/canonical/OG/
    // JSON-LD into <head> server-side, and returns a genuine 404 status for
    // unknown article/category slugs instead of always answering 200 ("soft 404").
    // The client still re-applies the same metadata after hydration (see
    // applyHeadMetadata in src/utils/schemaGenerator.ts) — this only makes it
    // available to crawlers that fetch the raw HTML without executing JS.
    app.get('*', (req, res) => {
      const settingsRow = db.prepare('SELECT * FROM settings WHERE id = 1').get();
      if (!settingsRow) return res.send(indexHtmlTemplate);
      const settings = settingsFromRow(settingsRow);

      const articleMatch = req.path.match(/^\/article\/([^/]+)\/?$/);
      if (articleMatch) {
        const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(articleMatch[1]) as any;
        if (!row || row.status !== 'published') {
          return res.status(404).send(indexHtmlTemplate);
        }
        const article = articleFromRow(row);
        const categoryRow = db.prepare('SELECT * FROM categories WHERE id = ?').get(article.categoryId) as any;
        const category = categoryRow
          ? categoryFromRow(categoryRow, (countArticlesInCategory.get(categoryRow.id) as { count: number }).count)
          : undefined;
        return res.send(applyHeadToHtml(indexHtmlTemplate, headForArticle(article, category, settings), settings.siteTitle));
      }

      const categoryMatch = req.path.match(/^\/category\/([^/]+)\/?$/);
      if (categoryMatch) {
        const categoryRow = db.prepare('SELECT * FROM categories WHERE slug = ?').get(categoryMatch[1]) as any;
        if (!categoryRow) return res.status(404).send(indexHtmlTemplate);
        const category = categoryFromRow(
          categoryRow,
          (countArticlesInCategory.get(categoryRow.id) as { count: number }).count
        );
        return res.send(
          applyHeadToHtml(indexHtmlTemplate, headForCategory(category, category.postCount || 0, settings), settings.siteTitle)
        );
      }

      if (req.path === '/') {
        return res.send(applyHeadToHtml(indexHtmlTemplate, headForHome(settings), settings.siteTitle));
      }

      res.send(indexHtmlTemplate);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`وب‌سرور وبلاگ آموزشی در پورت ${PORT} با موفقیت اجرا شد.`);
  });
}

startServer();
