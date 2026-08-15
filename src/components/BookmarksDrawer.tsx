import React from 'react';
import { X, Bookmark, Trash2, ArrowLeft, Clock } from 'lucide-react';
import { Article, Category } from '../types';
import { formatPersianDate, toPersianDigits } from '../utils/seoAnalyzer';
import { CoverImage } from './CoverImage';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (id: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedArticles,
  categories,
  onSelectArticle,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Bookmark className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-none">
                  آموزش‌های نشان‌شده شما
                </h3>
                <span className="text-xs text-slate-500">
                  {toPersianDigits(bookmarkedArticles.length)} مقاله ذخیره‌شده
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {bookmarkedArticles.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <Bookmark className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                <p className="text-sm font-bold text-slate-600">هنوز آموزشی را ذخیره نکرده‌اید.</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  با کلیک روی آیکون بوک‌مارک هر مقاله یا آموزش، آن را برای مطالعه بعدی در این بخش نگهداری کنید.
                </p>
              </div>
            ) : (
              bookmarkedArticles.map((article) => {
                const cat = categories.find((c) => c.id === article.categoryId);
                return (
                  <div
                    key={article.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all flex gap-3 group shadow-2xs"
                  >
                    <CoverImage
                      src={article.coverImage}
                      alt={article.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="cursor-pointer"
                      >
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${cat?.color || '#2563EB'}15`,
                            color: cat?.color || '#2563EB',
                          }}
                        >
                          {cat?.name || 'آموزش'}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                          {article.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <span>{toPersianDigits(article.readingTimeMinutes)} دقیقه</span>
                        <button
                          onClick={() => onRemoveBookmark(article.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="حذف از نشان‌ها"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
