import { Router } from 'express';
import {
  verifyCredentials,
  updatePassword,
  signSessionToken,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  getSessionUser,
} from '../auth';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
  }
  const user = verifyCredentials(username, password);
  if (!user) {
    return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
  }
  const token = signSessionToken(user);
  setSessionCookie(res, token);
  res.json({ username: user.username, role: user.role });
});

authRouter.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

authRouter.get('/me', (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, username: user.username, role: user.role });
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
