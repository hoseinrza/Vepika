import React from 'react';
import { Clock, Eye, Heart, Bookmark, ArrowLeft, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Article, Category } from '../types';
import { formatPersianDate, toPersianDigits } from '../utils/seoAnalyzer';

interface ArticleCardProps {
  article: Article;
  category?: Category;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onSelectArticle?: (article: Article) => void;
  onReadArticle?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  category,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
  onReadArticle,
}) => {
  const handleClick = () => {
    if (onSelectArticle) onSelectArticle(article);
    else if (onReadArticle) onReadArticle(article);
  };

  const difficultyLabels = {
    beginner: 'مقدماتی',
    intermediate: 'متوسط',
    advanced: 'پیشرفته',
    'all-levels': 'عمومی',
  };

  const contentTypeLabels = {
    tutorial: 'آموزش گام‌به‌گام',
    article: 'مقاله تخصصی',
    snippet: 'اسنیپت کد',
    guide: 'راهنمای جامع',
    tool: 'ابزار وب',
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-red-500/80 hover:shadow-2xl hover:shadow-red-600/15 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col cursor-pointer transform-gpu will-change-transform"
      id={`article-card-${article.slug}`}
      dir="rtl"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.coverImageAlt || article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 group-hover:brightness-105 transition-all duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Pill Over Image */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-900 bg-white/95 backdrop-blur-md shadow-xs border border-slate-200/60">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: category?.color || '#DC2626' }}
            />
            <span>{category?.name || 'آموزش'}</span>
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id, e);
          }}
          className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
            isBookmarked
              ? 'bg-red-600 text-white shadow-md scale-105'
              : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-600'
          }`}
          title={isBookmarked ? 'حذف از نشان‌ها' : 'نشان کردن مقاله'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
        </button>

        {/* Badges on Image (Difficulty & Content Type) */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-wrap items-center gap-1.5">
          {article.contentType && (
            <div className="bg-slate-900/90 text-red-300 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-xs">
              {contentTypeLabels[article.contentType]}
            </div>
          )}
          {article.difficulty && (
            <div className="bg-red-600/90 text-white backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-xs">
              سطح: {difficultyLabels[article.difficulty]}
            </div>
          )}
          {article.wpLevel && !article.difficulty && (
            <div className="bg-slate-900/90 text-slate-200 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-xs">
              {article.wpLevel}
            </div>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadata Row: Date & Reading Time */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{toPersianDigits(article.readingTimeMinutes)} دقیقه مطالعه</span>
              </span>
              <span>•</span>
              <span>{formatPersianDate(article.publishDate)}</span>
            </div>

            {article.wpPlugin && (
              <span className="text-[10px] font-mono font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 max-w-[130px] truncate">
                {article.wpPlugin}
              </span>
            )}
          </div>

          {/* Article Title in Lalezar Font */}
          <h2 className="font-lalezar text-lg sm:text-xl text-slate-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2 tracking-wide">
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 text-justify">
            {article.excerpt}
          </p>
        </div>

        {/* Tags Row */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer: Author info & Engagement stats */}
        <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs text-slate-500">
          {/* Author avatar & name */}
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <span className="font-medium text-slate-700">{article.author.name}</span>
          </div>

          {/* Stats & Read more icon */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-500">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{toPersianDigits(article.viewsCount)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span>{toPersianDigits(article.likesCount)}</span>
            </div>
            <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 group-hover:-translate-x-0.5 group-hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-2xs">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
