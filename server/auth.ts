import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'redwebs-dev-secret-change-me';
const COOKIE_NAME = 'redwebs_session';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminRole = 'admin' | 'author';

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  displayName: string | null;
  jobTitle: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

interface AdminUserRow extends AdminUser {
  passwordHash: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: { id: string; username: string; role: AdminRole };
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
    'INSERT INTO admin_users (id, username, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)'
  ).run(crypto.randomUUID(), username, passwordHash, 'admin', new Date().toISOString());

  console.log(`حساب ادمین با نام کاربری «${username}» ایجاد شد.`);
}

const PROFILE_COLUMNS = 'id, username, role, displayName, jobTitle, avatar, bio, createdAt';

export function verifyCredentials(username: string, password: string): AdminUser | null {
  const row = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as AdminUserRow | undefined;
  if (!row) return null;
  if (!bcrypt.compareSync(password, row.passwordHash)) return null;
  const { passwordHash, ...user } = row;
  return user;
}

export function listUsers(): AdminUser[] {
  return db.prepare(`SELECT ${PROFILE_COLUMNS} FROM admin_users ORDER BY createdAt ASC`).all() as AdminUser[];
}

export function createUser(username: string, password: string, role: AdminRole): AdminUser {
  const id = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync(password, 10);
  const createdAt = new Date().toISOString();
  db.prepare(
    'INSERT INTO admin_users (id, username, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, passwordHash, role, createdAt);
  return { id, username, role, displayName: null, jobTitle: null, avatar: null, bio: null, createdAt };
}

export function deleteUser(id: string) {
  db.prepare('DELETE FROM admin_users WHERE id = ?').run(id);
}

export function getProfile(id: string): AdminUser | null {
  const row = db.prepare(`SELECT ${PROFILE_COLUMNS} FROM admin_users WHERE id = ?`).get(id) as AdminUser | undefined;
  return row ?? null;
}

export function updateProfile(
  id: string,
  profile: { displayName?: string; jobTitle?: string; avatar?: string; bio?: string }
): AdminUser | null {
  db.prepare('UPDATE admin_users SET displayName = ?, jobTitle = ?, avatar = ?, bio = ? WHERE id = ?').run(
    profile.displayName || null,
    profile.jobTitle || null,
    profile.avatar || null,
    profile.bio || null,
    id
  );
  return getProfile(id);
}

export function countAdmins(): number {
  const row = db.prepare("SELECT COUNT(*) as count FROM admin_users WHERE role = 'admin'").get() as { count: number };
  return row.count;
}

export function updatePassword(username: string, newPassword: string) {
  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET passwordHash = ? WHERE username = ?').run(passwordHash, username);
}

export function signSessionToken(user: AdminUser): string {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
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

// Resolves the live user record for the session's username rather than trusting
// the JWT payload's id/role directly — this way sessions signed before the
// multi-user/role fields existed (or a role changed after login) still work
// without forcing everyone to log out.
function readSessionToken(req: Request): { id: string; username: string; role: AdminRole } | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  let username: string | undefined;
  try {
    username = (jwt.verify(token, JWT_SECRET) as { username?: string }).username;
  } catch {
    return null;
  }
  if (!username) return null;

  const row = db.prepare('SELECT id, username, role FROM admin_users WHERE username = ?').get(username) as
    | { id: string; username: string; role: AdminRole }
    | undefined;
  return row ?? null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const payload = readSessionToken(req);
  if (!payload) {
    return res.status(401).json({ error: 'احراز هویت لازم است' });
  }
  req.admin = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.admin?.role !== 'admin') {
      return res.status(403).json({ error: 'این بخش فقط برای مدیر کل قابل دسترسی است' });
    }
    next();
  });
}

export function getSessionUsername(req: Request): string | null {
  return readSessionToken(req)?.username ?? null;
}

export function getSessionUser(req: Request): { id: string; username: string; role: AdminRole } | null {
  return readSessionToken(req);
}
