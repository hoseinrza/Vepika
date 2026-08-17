import { Router } from 'express';
import { requireAdmin, listUsers, createUser, deleteUser, countAdmins, AdminRole } from '../auth';

export const usersRouter = Router();

usersRouter.get('/', requireAdmin, (_req, res) => {
  res.json(listUsers());
});

usersRouter.post('/', requireAdmin, (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'رمز عبور باید حداقل ۶ کاراکتر باشد' });
  }
  const finalRole: AdminRole = role === 'author' ? 'author' : 'admin';

  try {
    const user = createUser(username, password, finalRole);
    res.status(201).json(user);
  } catch (err: any) {
    if (err?.code === 'SQLITE_CONSTRAINT_UNIQUE' || err?.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'این نام کاربری قبلاً استفاده شده است' });
    }
    throw err;
  }
});

usersRouter.delete('/:id', requireAdmin, (req, res) => {
  if (req.params.id === req.admin!.id) {
    return res.status(400).json({ error: 'نمی‌توانید حساب خودتان را حذف کنید' });
  }

  const target = listUsers().find((u) => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'کاربر یافت نشد' });

  if (target.role === 'admin' && countAdmins() <= 1) {
    return res.status(400).json({ error: 'حداقل یک مدیر کل باید باقی بماند' });
  }

  deleteUser(req.params.id);
  res.status(204).end();
});
