import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { commentFromRow } from '../mappers';
import { requireAuth, getSessionUsername } from '../auth';
import { Comment, CommentStatus } from '../../src/types';

export const commentsRouter = Router();

const repliesStmt = db.prepare('SELECT * FROM comment_replies WHERE commentId = ? ORDER BY createdAt ASC');

function withReplies(row: any): Comment {
  return commentFromRow(row, repliesStmt.all(row.id) as any[]);
}

// Public: approved comments only (optionally filtered to one article).
// Authenticated admin: every comment regardless of status, for moderation.
commentsRouter.get('/', (req, res) => {
  const isAdmin = !!getSessionUsername(req);
  const postId = req.query.postId as string | undefined;

  let sql = 'SELECT * FROM comments';
  const conditions: string[] = [];
  const params: any[] = [];

  if (postId) {
    conditions.push('postId = ?');
    params.push(postId);
  }
  if (!isAdmin) {
    conditions.push("status = 'approved'");
  }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY createdAt DESC';

  const rows = db.prepare(sql).all(...params) as any[];
  res.json(rows.map(withReplies));
});

commentsRouter.post('/', (req, res) => {
  const body = req.body as Pick<Comment, 'postId' | 'authorName' | 'authorEmail' | 'authorAvatar' | 'content'>;
  if (!body?.postId || !body?.authorName || !body?.authorEmail || !body?.content) {
    return res.status(400).json({ error: 'تمامی فیلدهای دیدگاه الزامی است' });
  }

  const article = db.prepare('SELECT id FROM articles WHERE id = ?').get(body.postId);
  if (!article) return res.status(404).json({ error: 'مقاله یافت نشد' });

  const settings = db.prepare('SELECT autoApproveComments FROM settings WHERE id = 1').get() as
    | { autoApproveComments: number }
    | undefined;
  const status: CommentStatus = settings?.autoApproveComments ? 'approved' : 'pending';

  const comment: Comment = {
    id: crypto.randomUUID(),
    postId: body.postId,
    authorName: body.authorName,
    authorEmail: body.authorEmail,
    authorAvatar: body.authorAvatar,
    content: body.content,
    createdAt: new Date().toISOString(),
    status,
    likes: 0,
  };

  db.prepare(`
    INSERT INTO comments (id, postId, authorName, authorEmail, authorAvatar, content, createdAt, status, likes)
    VALUES (@id, @postId, @authorName, @authorEmail, @authorAvatar, @content, @createdAt, @status, @likes)
  `).run({ ...comment, authorAvatar: comment.authorAvatar || null });

  res.status(201).json(comment);
});

commentsRouter.patch('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body as { status: CommentStatus };
  if (!['approved', 'pending', 'spam', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'وضعیت نامعتبر است' });
  }
  const result = db.prepare('UPDATE comments SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'دیدگاه یافت نشد' });
  res.json({ status });
});

commentsRouter.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'دیدگاه یافت نشد' });
  res.status(204).end();
});

commentsRouter.post('/:id/reply', requireAuth, (req, res) => {
  const { content } = req.body as { content: string };
  if (!content) return res.status(400).json({ error: 'متن پاسخ الزامی است' });

  const comment = db.prepare('SELECT id FROM comments WHERE id = ?').get(req.params.id);
  if (!comment) return res.status(404).json({ error: 'دیدگاه یافت نشد' });

  const settings = db.prepare('SELECT authorName FROM settings WHERE id = 1').get() as
    | { authorName: string }
    | undefined;

  const reply = {
    id: crypto.randomUUID(),
    commentId: req.params.id,
    authorName: settings?.authorName || 'تحریریه ردوبز',
    authorRole: 'مدیر محتوا',
    authorAvatar: null as string | null,
    content,
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO comment_replies (id, commentId, authorName, authorRole, authorAvatar, content, createdAt)
    VALUES (@id, @commentId, @authorName, @authorRole, @authorAvatar, @content, @createdAt)
  `).run(reply);

  const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
  res.status(201).json(withReplies(row));
});

commentsRouter.post('/:id/like', (req, res) => {
  const result = db.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'دیدگاه یافت نشد' });
  const row = db.prepare('SELECT likes FROM comments WHERE id = ?').get(req.params.id) as { likes: number };
  res.json({ likes: row.likes });
});
