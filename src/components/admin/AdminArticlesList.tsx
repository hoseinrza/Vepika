import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
  Eye,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Article, Category } from '../../types';
import { analyzeArticleSeo, formatPersianDate, toPersianDigits } from '../../utils/seoAnalyzer';

interface AdminArticlesListProps {
  articles: Article[];
  categories: Category[];
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onDuplicateArticle: (article: Article) => void;
  onToggleStatus: (id: string) => void;
  onViewLive: (article: Article) => void;
}

export const AdminArticlesList: React.FC<AdminArticlesListProps> = ({
  articles,
  categories,
  onNewArticle,
  onEditArticle,
  onDeleteArticle,
  onDuplicateArticle,
  onToggleStatus,
  onViewLive,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      a.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : a.status === statusFilter;
    const matchesCat =
      selectedCatId === 'all' ? true : a.categoryId === selectedCatId;

    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="font-lalezar text-2xl text-stone-900 leading-tight">
            مدیریت و ویرایش مقالات ({toPersianDigits(articles.length)})
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            دسترسی سریع به ویرایش، تغییر وضعیت انتشار، بررسی امتیاز سئو و پیش‌نمایش زنده
          </p>
        </div>

        <button
          onClick={onNewArticle}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          id="admin-new-article-top-btn"
        >
          <Plus className="w-5 h-5" />
          <span>ایجاد مقاله جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در عنوان، برچسب‌ها، اسلاگ..."
            className="w-full pl-3 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            همه ({toPersianDigits(articles.length)})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            منتشر شده ({toPersianDigits(articles.filter((a) => a.status === 'published').length)})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            پیش‌نویس ({toPersianDigits(articles.filter((a) => a.status === 'draft').length)})
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCatId}
          onChange={(e) => setSelectedCatId(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
        >
          <option value="all">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
              <tr>
                <th className="py-3.5 px-4">عنوان مقاله</th>
                <th className="py-3.5 px-4 hidden md:table-cell">دسته‌بندی</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">امتیاز سئو</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">آمار</th>
                <th className="py-3.5 px-4 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    مقاله‌ای با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filtered.map((art) => {
                  const cat = categories.find((c) => c.id === art.categoryId);
                  const seo = analyzeArticleSeo(art);
                  return (
                    <tr key={art.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Title & Date */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.coverImage}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block border border-stone-200"
                          />
                          <div>
                            <span
                              onClick={() => onEditArticle(art)}
                              className="font-lalezar text-base text-stone-900 hover:text-amber-600 transition-colors cursor-pointer block line-clamp-1"
                            >
                              {art.title}
                            </span>
                            <span className="text-[11px] text-stone-400 block mt-0.5">
                              {formatPersianDate(art.publishDate)} • {art.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span
                          className="font-semibold text-xs px-2.5 py-1 rounded-md inline-block"
                          style={{
                            backgroundColor: `${cat?.color || '#f59e0b'}15`,
                            color: cat?.color || '#f59e0b',
                          }}
                        >
                          {cat?.name || 'تعیین‌نشده'}
                        </span>
                      </td>

                      {/* SEO Score */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            seo.score >= 80
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{toPersianDigits(seo.score)}٪ ({seo.grade})</span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onToggleStatus(art.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-transform hover:scale-105 ${
                            art.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                          title="کلیک برای تغییر وضعیت"
                        >
                          {art.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                        </button>
                      </td>

                      {/* Stats */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-stone-500">
                        <div>بازدید: {toPersianDigits(art.viewsCount)}</div>
                        <div className="text-[11px] text-rose-500">
                          پسند: {toPersianDigits(art.likesCount)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live View */}
                          <button
                            onClick={() => onViewLive(art)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="مشاهده زنده در سایت"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => onDuplicateArticle(art)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="تکثیر و کپی مقاله"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditArticle(art)}
                            className="p-1.5 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="ویرایش محتوا و سئو"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(art.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="حذف مقاله"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 text-right">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-lalezar text-xl text-stone-900 text-center">
              آیا از حذف این مقاله اطمینان دارید؟
            </h3>
            <p className="text-xs text-stone-500 text-center leading-relaxed">
              این عملیات غیرقابل بازگشت است و مقاله به طور کامل حذف خواهد شد.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onDeleteArticle(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
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
