import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { seedIfEmpty } from './seed';
import { bootstrapAdmin } from './auth';
import { authRouter } from './routes/auth.routes';
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

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.use('/api/auth', authRouter);
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`وب‌سرور وبلاگ آموزشی در پورت ${PORT} با موفقیت اجرا شد.`);
  });
}

startServer();
