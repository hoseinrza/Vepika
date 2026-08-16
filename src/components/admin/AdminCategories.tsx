import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Category, Article } from '../../types';
import { toPersianDigits } from '../../utils/seoAnalyzer';

interface AdminCategoriesProps {
  categories: Category[];
  articles: Article[];
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  articles,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#f59e0b');

  const startCreate = () => {
    setName('');
    setSlug('');
    setDescription('');
    setColor('#f59e0b');
    setIsCreating(true);
    setEditingId(null);
  };

  const startEdit = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setColor(cat.color || '#f59e0b');
    setEditingId(cat.id);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug =
      slug.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const catToSave: Category = {
      id: isCreating ? `cat-${Date.now()}` : editingId!,
      name: name.trim(),
      slug: generatedSlug,
      description: description.trim(),
      color,
    };

    setIsSaving(true);
    try {
      await onSaveCategory(catToSave);
      setIsCreating(false);
      setEditingId(null);
    } catch (err: any) {
      alert(err?.message || '\u0630\u062E\u06CC\u0631\u0647 \u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F.');
    } finally {
      setIsSaving(false);
    }
  };

  const colorPresets = [
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#64748b', // Slate
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="font-lalezar text-2xl text-stone-900 leading-tight">
            دسته‌بندی موضوعی مقالات ({toPersianDigits(categories.length)})
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            ایجاد موضوعات، تنظیم رنگ برچسب‌ها و ساختاردهی منوی وبلاگ
          </p>
        </div>

        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>افزودن دسته‌بندی جدید</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingId) && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-600" />
              <span>{isCreating ? 'ایجاد دسته‌بندی جدید' : 'ویرایش دسته‌بندی'}</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نام دسته‌بندی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (isCreating) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                    );
                  }
                }}
                placeholder="مثال: طراحی رابط و تجربه کاربری"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:border-amber-500 focus:outline-hidden font-lalezar text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نامک یکتا (Slug URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ui-ux-design"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              رنگ اختصاصی نشان دسته
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                    color === preset ? 'scale-125 border-stone-900 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: preset }}
                ></button>
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300"
                title="انتخاب رنگ دلخواه"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              توضیحات دسته‌بندی (برای سئو و صفحات آرشیو)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیح مختصر در مورد موضوعات این دسته..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-stone-950 rounded-xl font-lalezar text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره دسته‌بندی'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = articles.filter((a) => a.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block"
                    style={{ backgroundColor: cat.color || '#f59e0b' }}
                  ></span>
                  <span className="text-xs text-stone-400 font-mono dir-ltr">
                    /{cat.slug}
                  </span>
                </div>

                <h3 className="font-lalezar text-xl text-stone-900">{cat.name}</h3>

                <p className="text-xs text-stone-500 line-clamp-2">
                  {cat.description || 'بدون توضیحات تکمیلی'}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span>{toPersianDigits(count)} مقاله</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={async () => {
                      if (categories.length <= 1) {
                        alert('حداقل یک دسته‌بندی باید در سایت وجود داشته باشد.');
                        return;
                      }
                      if (
                        confirm(
                          `آیا از حذف دسته‌بندی «${cat.name}» مطمئن هستید؟ مقالات این دسته به دسته اول منتقل می‌شوند.`
                        )
                      ) {
                        try {
                          await onDeleteCategory(cat.id);
                        } catch (err: any) {
                          alert(err?.message || 'حذف دسته‌بندی ناموفق بود.');
                        }
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
