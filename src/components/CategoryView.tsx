import React, { useState } from 'react';
import { Category, Article, DifficultyLevel, ContentType } from '../types';
import { ArticleCard } from './ArticleCard';
import { toPersianDigits } from '../utils/seoAnalyzer';
import {
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Layout,
  ShoppingCart,
  Palette,
  Code,
  TrendingUp,
  AlertTriangle,
  Wrench,
  BookOpen,
} from 'lucide-react';

interface CategoryViewProps {
  category: Category;
  articles: Article[];
  categories: Category[];
  bookmarks: string[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (categoryId: string) => void;
  onToggleBookmark: (articleId: string) => void;
  onBack: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  articles,
  categories,
  bookmarks,
  onSelectArticle,
  onSelectCategory,
  onToggleBookmark,
  onBack,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [selectedType, setSelectedType] = useState<'all' | ContentType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'likes'>('newest');

  // Filter articles belonging to this category
  const categoryArticles = articles.filter(
    (a) => a.categoryId === category.id && a.status === 'published'
  );

  // Apply sub-filters
  const filteredArticles = categoryArticles
    .filter((a) => {
      if (selectedDifficulty !== 'all' && a.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all' && a.contentType !== selectedType) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'views') return b.viewsCount - a.viewsCount;
      if (sortBy === 'likes') return b.likesCount - a.likesCount;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'wordpress':
        return <Zap className="w-6 h-6" />;
      case 'elementor':
        return <Layout className="w-6 h-6" />;
      case 'woocommerce':
        return <ShoppingCart className="w-6 h-6" />;
      case 'website-design':
        return <Palette className="w-6 h-6" />;
      case 'web-development':
        return <Code className="w-6 h-6" />;
      case 'seo':
        return <TrendingUp className="w-6 h-6" />;
      case 'plugins':
        return <Layers className="w-6 h-6" />;
      case 'themes':
        return <Sparkles className="w-6 h-6" />;
      case 'troubleshooting':
        return <AlertTriangle className="w-6 h-6" />;
      case 'tools':
      default:
        return <Wrench className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" dir="rtl">
      {/* Category Header Banner */}
      <div
        className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-slate-800"
        style={{
          background: `linear-gradient(135deg, #0F172A 0%, ${category.color}33 100%), #0F172A`,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <button
                onClick={onBack}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>خانه</span>
              </button>
              <span>/</span>
              <span className="text-white">دسته‌بندی‌ها</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: category.color }}
              >
                {getCategoryIcon(category.slug)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white">{category.name}</h1>
                <span className="text-xs text-slate-300">
                  {toPersianDigits(categoryArticles.length)} مقاله و آموزش تخصصی
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
              {category.description}
            </p>
          </div>

          <button
            onClick={onBack}
            className="self-start md:self-center px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به خانه</span>
          </button>
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Difficulty Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 ml-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>سطح:</span>
          </span>
          {[
            { id: 'all', label: 'همه سطوح' },
            { id: 'beginner', label: 'مقدماتی' },
            { id: 'intermediate', label: 'متوسط' },
            { id: 'advanced', label: 'پیشرفته' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDifficulty(d.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedDifficulty === d.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Content Type Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 ml-1">نوع:</span>
          {[
            { id: 'all', label: 'همه' },
            { id: 'tutorial', label: 'آموزش گام‌به‌گام' },
            { id: 'article', label: 'مقاله' },
            { id: 'snippet', label: 'اسنیپت' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedType === t.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <span className="font-bold text-slate-500">مرتب‌سازی:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
          >
            <option value="newest">جدیدترین انتشار</option>
            <option value="views">پربازدیدترین</option>
            <option value="likes">محبوب‌ترین</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">مطلبی با این فیلترها یافت نشد</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            لطفاً فیلترهای انتخابی سطح یا نوع محتوا را تغییر دهید تا مطالب دیگر این دسته‌بندی نمایش داده شوند.
          </p>
          <button
            onClick={() => {
              setSelectedDifficulty('all');
              setSelectedType('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            حذف فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarks.includes(article.id);
            return (
              <ArticleCard
                key={article.id}
                article={article}
                category={category}
                isBookmarked={isBookmarked}
                onSelectArticle={onSelectArticle}
                onToggleBookmark={onToggleBookmark}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
