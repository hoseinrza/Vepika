import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { AdminUser } from '../../types';
import { api } from '../../utils/api';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/profile')
      .then((data: AdminUser) => {
        setProfile(data);
        setDisplayName(data.displayName || '');
        setJobTitle(data.jobTitle || '');
        setAvatar(data.avatar || '');
        setBio(data.bio || '');
      })
      .catch((err) => setError(err.message || 'خطا در بارگذاری پروفایل'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      await api.put('/profile', { displayName, jobTitle, avatar, bio });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'ذخیره پروفایل ناموفق بود.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-stone-400 py-16 text-sm">در حال بارگذاری پروفایل...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="font-lalezar text-2xl text-stone-900 leading-tight">پروفایل من</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            این اطلاعات به‌عنوان نویسنده مقالاتی که از این پس می‌نویسید نمایش داده می‌شود
            {profile && (
              <span className="dir-ltr inline-block mr-1">
                ({profile.username} · {profile.role === 'admin' ? 'مدیر کل' : 'نویسنده'})
              </span>
            )}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره پروفایل'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>پروفایل با موفقیت ذخیره شد.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
          <User className="w-5 h-5 text-amber-600" />
          <span>اطلاعات نمایشی نویسنده</span>
        </h3>

        <div className="flex items-center gap-4">
          <img
            src={avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(profile?.username || 'user')}
            alt=""
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0 bg-stone-100"
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-stone-700 mb-1">آدرس آواتار</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">نام نمایشی</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={profile?.username}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">عنوان و سمت</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="مثلاً: نویسنده فنی، توسعه‌دهنده وردپرس"
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">بیوگرافی و تخصص</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
          ></textarea>
        </div>
      </form>
    </div>
  );
};
