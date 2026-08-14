import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Article, Category } from '../types';
import { formatPersianDate, toPersianDigits } from '../utils/seoAnalyzer';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  categories,
  onSelectArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Global Esc & Ctrl+K shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = searchTerm.trim().toLowerCase();

  const filteredArticles = query
    ? articles.filter((a) => {
        const cat = categories.find((c) => c.id === a.categoryId);
        return (
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query)) ||
          cat?.name.toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در عنوان، محتوا، برچسب‌ها یا دسته‌بندی..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {query ? (
            filteredArticles.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-semibold mb-2">
                  نتایج جستجو ({toPersianDigits(filteredArticles.length)} مقاله یافت شد):
                </div>
                {filteredArticles.map((article) => {
                  const cat = categories.find((c) => c.id === article.categoryId);
                  return (
                    <div
                      key={article.id}
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="p-3.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className="font-bold px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: `${cat?.color || '#2563EB'}15`, color: cat?.color || '#2563EB' }}
                          >
                            {cat?.name || 'آموزش'}
                          </span>
                          <span className="text-slate-400">
                            {formatPersianDate(article.publishDate)}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {article.excerpt}
                        </p>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:-translate-x-1 shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm">
                <p>هیچ مقاله‌ای با عبارت «{searchTerm}» یافت نشد.</p>
                <p className="text-xs text-slate-400 mt-1">
                  کلمات کلیدی کوتاه‌تر یا نام دسته‌بندی را امتحان کنید.
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4 py-2">
              <div className="text-xs text-slate-500 font-semibold">
                پیشنهادهای پربازدید آموزشی وپیکا:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {articles.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onSelectArticle(a);
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-right text-xs transition-colors border border-slate-100 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-800 line-clamp-1">{a.title}</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
