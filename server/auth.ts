import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'redwebs-dev-secret-change-me';
const COOKIE_NAME = 'redwebs_session';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

declare global {
  namespace Express {
    interface Request {
      admin?: { username: string };
    }
  }
}

export function bootstrapAdmin() {
  const existing = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (existing.count > 0) return;

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'change-me-now';
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(
    'INSERT INTO admin_users (id, username, passwordHash, createdAt) VALUES (1, ?, ?, ?)'
  ).run(username, passwordHash, new Date().toISOString());

  console.log(`حساب ادمین با نام کاربری «${username}» ایجاد شد.`);
}

export function verifyCredentials(username: string, password: string): boolean {
  const row = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as
    | { username: string; passwordHash: string }
    | undefined;
  if (!row) return false;
  return bcrypt.compareSync(password, row.passwordHash);
}

export function updatePassword(username: string, newPassword: string) {
  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET passwordHash = ? WHERE username = ?').run(passwordHash, username);
}

export function signSessionToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'احراز هویت لازم است' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { username: string };
    req.admin = { username: payload.username };
    next();
  } catch {
    return res.status(401).json({ error: 'نشست شما منقضی شده است، دوباره وارد شوید' });
  }
}

export function getSessionUsername(req: Request): string | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { username: string };
    return payload.username;
  } catch {
    return null;
  }
}
