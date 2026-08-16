import { Router } from 'express';
import {
  verifyCredentials,
  updatePassword,
  signSessionToken,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  getSessionUsername,
} from '../auth';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
  }
  if (!verifyCredentials(username, password)) {
    return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
  }
  const token = signSessionToken(username);
  setSessionCookie(res, token);
  res.json({ username });
});

authRouter.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

authRouter.get('/me', (req, res) => {
  const username = getSessionUsername(req);
  if (!username) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, username });
});

authRouter.patch('/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'رمز عبور فعلی و جدید الزامی است' });
  }
  if (!verifyCredentials(req.admin!.username, currentPassword)) {
    return res.status(401).json({ error: 'رمز عبور فعلی اشتباه است' });
  }
  updatePassword(req.admin!.username, newPassword);
  res.status(204).end();
});
