import React, { useEffect, useState } from 'react';
import { UserPlus, Trash2, ShieldCheck, PenLine, AlertCircle } from 'lucide-react';
import { AdminUser } from '../../types';
import { api } from '../../utils/api';
import { formatPersianDate } from '../../utils/seoAnalyzer';

interface AdminUsersProps {
  currentUsername: string;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ currentUsername }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'author'>('author');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/users', { username, password, role });
      setUsername('');
      setPassword('');
      setRole('author');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'ایجاد کاربر ناموفق بود');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError('');
    try {
      await api.del(`/users/${id}`);
      setDeleteConfirmId(null);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'حذف کاربر ناموفق بود');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <h2 className="font-lalezar text-2xl text-stone-900 leading-tight">کاربران پیشخوان مدیریت</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          مدیر کل به همه بخش‌ها دسترسی دارد؛ نویسنده فقط می‌تواند مقالات خودش را بنویسد و ویرایش کند.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add user form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-end gap-3"
      >
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-stone-700 mb-1">نام کاربری</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-stone-700 mb-1">رمز عبور</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">نقش</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'author')}
            className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
          >
            <option value="author">نویسنده</option>
            <option value="admin">مدیر کل</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isSubmitting ? 'در حال ایجاد...' : 'افزودن کاربر'}</span>
        </button>
      </form>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
              <tr>
                <th className="py-3.5 px-4">نام کاربری</th>
                <th className="py-3.5 px-4">نقش</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">تاریخ ایجاد</th>
                <th className="py-3.5 px-4 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-400">
                    در حال بارگذاری...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-400">
                    کاربری یافت نشد.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900 dir-ltr text-right">
                      {u.username}
                      {u.username === currentUsername && (
                        <span className="text-[10px] text-stone-400 mr-1.5">(شما)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          u.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
                        <span>{u.role === 'admin' ? 'مدیر کل' : 'نویسنده'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-stone-500">
                      {formatPersianDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      {u.username !== currentUsername && (
                        <button
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="حذف کاربر"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 text-right">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-lalezar text-xl text-stone-900 text-center">آیا از حذف این کاربر اطمینان دارید؟</h3>
            <p className="text-xs text-stone-500 text-center leading-relaxed">
              مقالاتی که این کاربر ایجاد کرده حذف نمی‌شوند، اما فقط مدیر کل می‌تواند بعداً آن‌ها را ویرایش کند.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
              >
                بله، حذف کن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
