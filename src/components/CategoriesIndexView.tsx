import React from 'react';
import { Category, Article } from '../types';
import { toPersianDigits } from '../utils/seoAnalyzer';
import {
  Layers,
  Zap,
  Layout,
  ShoppingCart,
  Palette,
  Code,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Wrench,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface CategoriesIndexViewProps {
  categories: Category[];
  articles: Article[];
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
}

export const CategoriesIndexView: React.FC<CategoriesIndexViewProps> = ({
  categories,
  articles,
  onSelectCategory,
  onBack,
}) => {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>راهنمای موضوعی ردوبز</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            دسته‌بندی‌های تخصصی آموزش وب و وردپرس
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            محتواهای ردوبز در ۱۰ شاخه تخصصی دسته‌بندی شده‌اند تا بتوانید مسیر یادگیری خود را متمرکز و منظم پیش ببرید.
          </p>
        </div>

        <button
          onClick={onBack}
          className="self-start md:self-center px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به صفحه اصلی</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryArticles = articles.filter(
            (a) => a.categoryId === cat.id && a.status === 'published'
          );
          const postCount = categoryArticles.length || cat.postCount || 1;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                    style={{ backgroundColor: cat.color }}
                  >
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {toPersianDigits(postCount)} مطلب
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>مشاهده مقالات و آموزش‌ها</span>
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
