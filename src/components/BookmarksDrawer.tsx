import React, { useEffect } from 'react';
import { X, Bookmark, Trash2, ArrowLeft, Clock, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import { Article, Category } from '../types';
import { formatPersianDate, toPersianDigits } from '../utils/seoAnalyzer';

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
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      {/* Smooth Animated Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300 cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer Container with Smooth Slide-in Animation */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-300 ease-out z-10">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/20">
                <Bookmark className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="font-lalezar text-lg text-slate-900 leading-tight tracking-wide">
                  آموزش‌های نشان‌شده شما
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {toPersianDigits(bookmarkedArticles.length)} مقاله ذخیره‌شده برای مطالعه
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-all cursor-pointer"
              title="بستن پنجره (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookmarks List Content */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
            {bookmarkedArticles.length === 0 ? (
              <div className="text-center py-20 px-4 text-slate-400 space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                  <Bookmark className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-lalezar text-lg text-slate-800 tracking-wide">
                    هنوز مقاله‌ای را نشان نکرده‌اید!
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    با کلیک بر روی آیکون بوک‌مارک در هر مقاله، آموزش‌های مورد نظر خود را ذخیره کنید تا در هر زمان به راحتی به آن‌ها دسترسی داشته باشید.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/20 hover:scale-105 transform-gpu"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>مرور مقالات و آموزش‌ها</span>
                </button>
              </div>
            ) : (
              bookmarkedArticles.map((article, idx) => {
                const cat = categories.find((c) => c.id === article.categoryId);
                return (
                  <div
                    key={article.id}
                    className="p-3 bg-white hover:bg-red-50/40 rounded-2xl border border-slate-200/90 hover:border-red-400 hover:shadow-lg transition-all duration-200 flex gap-3 group shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div
                      className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                    >
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat?.color || '#DC2626' }}
                          />
                          <span className="text-[10px] font-bold text-slate-500 truncate">
                            {cat?.name || 'آموزش'}
                          </span>
                        </div>

                        <h4 className="font-lalezar text-sm text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight tracking-wide">
                          {article.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{toPersianDigits(article.readingTimeMinutes)} دقیقه</span>
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBookmark(article.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg p-1.5 transition-colors cursor-pointer"
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

          {/* Drawer Footer Status Bar */}
          {bookmarkedArticles.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>ذخیره‌شده در حافظه مرورگر شما</span>
              </span>
              <button
                onClick={onClose}
                className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <span>ادامه مطالعه</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
};
