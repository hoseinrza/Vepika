import { Router } from 'express';
import { requireAuth, getProfile, updateProfile } from '../auth';

export const profileRouter = Router();

profileRouter.get('/', requireAuth, (req, res) => {
  const profile = getProfile(req.admin!.id);
  if (!profile) return res.status(404).json({ error: 'کاربر یافت نشد' });
  res.json(profile);
});

profileRouter.put('/', requireAuth, (req, res) => {
  const { displayName, jobTitle, avatar, bio } = req.body || {};
  const profile = updateProfile(req.admin!.id, { displayName, jobTitle, avatar, bio });
  if (!profile) return res.status(404).json({ error: 'کاربر یافت نشد' });
  res.json(profile);
});
