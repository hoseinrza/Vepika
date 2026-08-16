import React from 'react';
import {
  FileText,
  MessageSquare,
  Eye,
  Sparkles,
  TrendingUp,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FolderTree,
  ArrowLeft,
} from 'lucide-react';
import { Article, Category, Comment, AdminTab } from '../../types';
import { analyzeArticleSeo, formatPersianDate, toPersianDigits } from '../../utils/seoAnalyzer';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  comments: Comment[];
  onNavigateTab: (tab: AdminTab, params?: any) => void;
  onEditArticle: (article: Article) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  comments,
  onNavigateTab,
  onEditArticle,
}) => {
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const pendingComments = comments.filter((c) => c.status === 'pending');
  const totalViews = articles.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + (a.likesCount || 0), 0);

  // Calculate average SEO score
  const avgSeoScore =
    articles.length > 0
      ? Math.round(
          articles.reduce((acc, a) => acc + analyzeArticleSeo(a).score, 0) / articles.length
        )
      : 0;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Welcome Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs">
              مدیریت هوشمند وبلاگ
            </span>
            <span className="text-xs text-stone-400">تایپوگرافی لاله‌زار & اسکیما خودکار</span>
          </div>
          <h2 className="font-lalezar text-2xl sm:text-3xl text-white">
            خوش‌آمدید به پنل مدیریت سریع مقالات و سئو
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            از اینجا می‌توانید مقالات جدید بنویسید، دیدگاه‌های کاربران را مدیریت کنید، دسته‌بندی‌ها را سامان دهید و وضعیت سئو و اسکیما را بررسی نمایید.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('editor', { articleId: 'new' })}
            className="flex-1 md:flex-none px-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-lalezar text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            id="admin-dash-new-post-btn"
          >
            <PlusCircle className="w-5 h-5" />
            <span>نوشتن مقاله جدید</span>
          </button>
          <button
            onClick={() => onNavigateTab('comments')}
            className="flex-1 md:flex-none px-4 py-3 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>بررسی دیدگاه‌ها</span>
            {pendingComments.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {toPersianDigits(pendingComments.length)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>کل مقالات</span>
            <FileText className="w-4 h-4 text-stone-400" />
          </div>
          <div className="font-lalezar text-3xl text-stone-900">
            {toPersianDigits(articles.length)}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-2">
            <span className="text-emerald-700 font-bold">
              {toPersianDigits(publishedCount)} منتشرشده
            </span>
            <span>•</span>
            <span className="text-amber-700 font-bold">
              {toPersianDigits(draftCount)} پیش‌نویس
            </span>
          </div>
        </div>

        {/* Pending Comments */}
        <div
          onClick={() => onNavigateTab('comments')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>دیدگاه‌های در انتظار</span>
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-lalezar text-3xl text-stone-900">
            {toPersianDigits(pendingComments.length)}
          </div>
          <div className="text-[11px] text-stone-500">
            از مجموع {toPersianDigits(comments.length)} دیدگاه ثبت‌شده
          </div>
        </div>

        {/* SEO Health Average */}
        <div
          onClick={() => onNavigateTab('seo-settings')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>میانگین سلامت سئو</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-lalezar text-3xl text-emerald-600">
            {toPersianDigits(avgSeoScore)}٪
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>اسکیما JSON-LD فعال</span>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>مجموع بازدید مقالات</span>
            <Eye className="w-4 h-4 text-red-600" />
          </div>
          <div className="font-lalezar text-3xl text-stone-900">
            {toPersianDigits(totalViews)}
          </div>
          <div className="text-[11px] text-stone-500">
            و {toPersianDigits(totalLikes)} بار پسندیده شده
          </div>
        </div>
      </div>

      {/* Recent Articles & Quick Moderation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Articles Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>آخرین مقالات ایجادشده</span>
            </h3>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده همه مقالات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {articles.slice(0, 4).map((art) => {
              const cat = categories.find((c) => c.id === art.categoryId);
              const seoAnalysis = analyzeArticleSeo(art);
              return (
                <div
                  key={art.id}
                  className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          art.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {art.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: cat?.color || '#f59e0b' }}
                      >
                        {cat?.name || 'آموزش'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatPersianDate(art.publishDate)}
                      </span>
                    </div>
                    <h4
                      onClick={() => onEditArticle(art)}
                      className="font-lalezar text-base text-stone-900 hover:text-amber-700 cursor-pointer transition-colors"
                    >
                      {art.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* SEO Score Badge */}
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        seoAnalysis.score >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                      title={`امتیاز سئو: ${seoAnalysis.score} از ۱۰۰`}
                    >
                      سئو: {toPersianDigits(seoAnalysis.score)}٪
                    </div>

                    <button
                      onClick={() => onEditArticle(art)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      ویرایش
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comments Waiting for Review */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              <span>دیدگاه‌های جدید</span>
            </h3>
            <button
              onClick={() => onNavigateTab('comments')}
              className="text-xs text-stone-500 hover:text-stone-900 font-semibold cursor-pointer"
            >
              مدیریت دیدگاه‌ها
            </button>
          </div>

          <div className="space-y-3">
            {pendingComments.length === 0 ? (
              <div className="text-center py-8 text-stone-400 space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs">دیدگاه جدیدی در انتظار تایید نیست.</p>
              </div>
            ) : (
              pendingComments.slice(0, 3).map((comm) => (
                <div
                  key={comm.id}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{comm.authorName}</span>
                    <span className="text-[10px] text-stone-400">
                      {formatPersianDate(comm.createdAt)}
                    </span>
                  </div>
                  <p className="text-stone-600 line-clamp-2">{comm.content}</p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onNavigateTab('comments')}
                      className="text-amber-700 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      بررسی و تایید ›
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
