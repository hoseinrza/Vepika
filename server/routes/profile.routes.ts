import { Router } from 'express';
import { db } from '../db';
import { requireAuth, getProfile, updateProfile } from '../auth';

export const profileRouter = Router();

// Articles store a snapshot of their author (name/role/avatar/bio) rather than
// joining live against admin_users, so profile edits must be pushed out to every
// article owned by this user for the byline/author box to reflect the change.
function syncAuthorSnapshotOnOwnedArticles(userId: string, profile: { id: string; displayName: string | null; username: string; jobTitle: string | null; avatar: string | null; bio: string | null }) {
  const rows = db.prepare('SELECT id, author FROM articles WHERE ownerUserId = ?').all(userId) as {
    id: string;
    author: string;
  }[];
  const update = db.prepare('UPDATE articles SET author = ? WHERE id = ?');
  const syncAll = db.transaction(() => {
    for (const row of rows) {
      const author = JSON.parse(row.author);
      const nextAuthor = {
        ...author,
        id: profile.id,
        name: profile.displayName || profile.username,
        role: profile.jobTitle || author.role,
        avatar: profile.avatar || author.avatar,
        bio: profile.bio || author.bio,
      };
      update.run(JSON.stringify(nextAuthor), row.id);
    }
  });
  syncAll();
}

profileRouter.get('/', requireAuth, (req, res) => {
  const profile = getProfile(req.admin!.id);
  if (!profile) return res.status(404).json({ error: 'کاربر یافت نشد' });
  res.json(profile);
});

profileRouter.put('/', requireAuth, (req, res) => {
  const { displayName, jobTitle, avatar, bio } = req.body || {};
  const profile = updateProfile(req.admin!.id, { displayName, jobTitle, avatar, bio });
  if (!profile) return res.status(404).json({ error: 'کاربر یافت نشد' });
  syncAuthorSnapshotOnOwnedArticles(req.admin!.id, profile);
  res.json(profile);
});
