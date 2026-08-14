import React, { useState } from 'react';
import { Article, Category, SiteSettings } from '../types';
import { ArticleCard } from './ArticleCard';
import { toPersianDigits } from '../utils/seoAnalyzer';
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  Clock,
  Zap,
  ShieldCheck,
  TrendingUp,
  Code,
  Layout,
  ShoppingCart,
  Layers,
  Palette,
  Wrench,
  AlertTriangle,
  Search,
  CheckCircle2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

interface HomeViewProps {
  articles: Article[];
  categories: Category[];
  settings: SiteSettings;
  bookmarks: string[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (catId: string) => void;
  onToggleBookmark: (articleId: string) => void;
  onOpenSearch: () => void;
  onOpenToolkit: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  categories,
  settings,
  bookmarks,
  onSelectArticle,
  onSelectCategory,
  onToggleBookmark,
  onOpenSearch,
  onOpenToolkit,
}) => {
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'tutorial' | 'article' | 'snippet'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter published articles
  const publishedArticles = articles.filter((a) => a.status === 'published');
  const featuredArticle = publishedArticles.find((a) => a.featured) || publishedArticles[0];

  // Filter by content type
  const filteredArticles = publishedArticles.filter((a) => {
    if (contentTypeFilter === 'all') return true;
    return a.contentType === contentTypeFilter;
  });

  // Popular articles (sorted by views/likes)
  const popularArticles = [...publishedArticles].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 4);

  // Category icon helper
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'wordpress':
        return <Zap className="w-5 h-5" />;
      case 'elementor':
        return <Layout className="w-5 h-5" />;
      case 'woocommerce':
        return <ShoppingCart className="w-5 h-5" />;
      case 'website-design':
        return <Palette className="w-5 h-5" />;
      case 'web-development':
        return <Code className="w-5 h-5" />;
      case 'seo':
        return <TrendingUp className="w-5 h-5" />;
      case 'plugins':
        return <Layers className="w-5 h-5" />;
      case 'themes':
        return <Sparkles className="w-5 h-5" />;
      case 'troubleshooting':
        return <AlertTriangle className="w-5 h-5" />;
      case 'tools':
      default:
        return <Wrench className="w-5 h-5" />;
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-16" dir="rtl">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        {/* Subtle geometric glowing background accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Header Typography */}
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پلتفرم تخصصی و مستقل آموزش وردپرس و توسعه وب</span>
            </div>

            <h1 className="font-lalezar text-3xl sm:text-5xl lg:text-6xl tracking-wide leading-tight sm:leading-none text-white">
              یاد بگیرید. بسازید. <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-purple-400">رشد کنید.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed text-justify sm:text-right">
              رسانه مستقل <strong className="text-white font-bold">وپیکا (Vepika)</strong>؛ مرجع انتشار مقالات عمیق، آموزش‌های گام‌به‌گام وردپرس، ووکامرس، المنتور، سئو تکنیکال، معماری وب و ابزارهای کاربردی کدنویسی.
            </p>

            {/* Quick search input trigger */}
            <div className="pt-2">
              <div
                onClick={onOpenSearch}
                className="flex items-center gap-3 p-3 sm:p-3.5 bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 shadow-xl cursor-pointer transition-all max-w-xl group"
              >
                <Search className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm text-slate-400 flex-1">
                  جستجو در بین مقالات، اسنیپت‌ها، رفع خطاها و افزونه‌ها...
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-mono bg-slate-900 text-slate-400 rounded-lg border border-slate-700">
                  Ctrl + K
                </span>
              </div>

              {/* Hot topic tags */}
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-400">
                <span className="font-bold text-slate-300">مباحث پرطرفدار:</span>
                {[
                  { label: 'افزایش سرعت وردپرس', catId: 'cat-wordpress' },
                  { label: 'کانتینر فلکس‌باکس المنتور', catId: 'cat-elementor' },
                  { label: 'سئو تکنیکال و اسکیما', catId: 'cat-seo' },
                  { label: 'اسنیپت‌های functions.php', catId: 'cat-web-dev' },
                  { label: 'تسویه حساب ووکامرس', catId: 'cat-woocommerce' },
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectCategory(tag.catId)}
                    className="hover:text-blue-400 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors cursor-pointer text-[11px]"
                  >
                    #{tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Spotlight Article Card */}
          {featuredArticle && (
            <div className="bg-slate-800/90 rounded-3xl border border-slate-700/90 overflow-hidden shadow-2xl hover:border-blue-500/50 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Media Column */}
                <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto min-h-[340px] relative overflow-hidden bg-slate-900 group">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>آموزش برگزیده وپیکا</span>
                  </div>
                  {featuredArticle.difficulty && (
                    <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md text-slate-200 px-3 py-1 rounded-xl text-xs font-bold border border-slate-700">
                      سطح: {featuredArticle.difficulty === 'intermediate' ? 'متوسط' : featuredArticle.difficulty === 'beginner' ? 'مقدماتی' : 'پیشرفته'}
                    </div>
                  )}
                </div>

                {/* Content Details Column */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg font-bold border border-blue-500/30">
                        {categories.find((c) => c.id === featuredArticle.categoryId)?.name || 'وردپرس'}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{toPersianDigits(featuredArticle.readingTimeMinutes)} دقیقه مطالعه</span>
                      </span>
                    </div>

                    <h2
                      onClick={() => onSelectArticle(featuredArticle)}
                      className="font-lalezar text-2xl sm:text-3xl lg:text-4xl text-white hover:text-blue-400 transition-colors cursor-pointer leading-snug tracking-wide"
                    >
                      {featuredArticle.title}
                    </h2>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 text-justify">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">
                          {featuredArticle.author.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {featuredArticle.author.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectArticle(featuredArticle)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-blue-600/30"
                    >
                      <span>شروع آموزش</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Interactive 10 Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
              <Layers className="w-4 h-4" />
              <span>موضوعات تخصصی وپیکا</span>
            </div>
            <h2 className="font-lalezar text-2xl sm:text-4xl text-slate-900 tracking-wide">
              دسته‌بندی‌های جامع یادگیری
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            محتواهای وپیکا در ۱۰ دسته‌بندی موضوعی استاندارد برای یادگیری مهارت‌های واقعی توسعه وب تنظیم شده‌اند.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  {getCategoryIcon(cat.slug)}
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {toPersianDigits(cat.postCount || 1)} مقاله
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-lalezar text-base text-slate-900 group-hover:text-blue-600 transition-colors tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Latest Articles & Content-Type Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <h2 className="font-lalezar text-2xl sm:text-4xl text-slate-900 tracking-wide">
              جدیدترین مقالات و آموزش‌ها
            </h2>
            <p className="text-xs text-slate-500">
              آموزش‌های نگارش شده توسط تیم فنی وپیکا بر اساس آخرین استانداردهای سال ۲۰۲۶
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'همه محتواها' },
              { id: 'tutorial', label: 'آموزش‌های گام‌به‌گام' },
              { id: 'article', label: 'مقالات تخصصی' },
              { id: 'snippet', label: 'اسنیپت و کد سریع' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setContentTypeFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  contentTypeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => {
            const category = categories.find((c) => c.id === article.categoryId);
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
      </section>

      {/* 4. Developer Tools Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-l from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                <Wrench className="w-3.5 h-3.5" />
                <span>جعبه ابزار رایگان وب‌مستر وپیکا</span>
              </div>
              <h2 className="font-lalezar text-2xl sm:text-4xl lg:text-5xl text-white tracking-wide leading-tight">
                اسنیپت‌های طلایی کدهای وردپرس بدون نیاز به افزونه
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                مجموعه کدهای آماده برای فایل‌های functions.php، .htaccess و wp-config.php، همراه با چک‌لیست راه‌اندازی و مقایسه جامع برترین افزونه‌ها برای سرعت و امنیت حداکثری سایت شما.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenToolkit}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-blue-600/30"
                >
                  <Wrench className="w-4 h-4" />
                  <span>ورود به جعبه ابزار و اسنیپت‌ها</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-blue-300 space-y-2 dir-ltr text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-500">
                <span>functions.php</span>
                <span className="text-emerald-400">VEPIKA SNIPPET</span>
              </div>
              <p className="text-slate-400">// بهینه‌سازی کوئری‌های وردپرس</p>
              <p className="text-white">add_filter('wp_lazy_loading_enabled', '__return_true');</p>
              <p className="text-purple-400">remove_action('wp_head', 'wp_generator');</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="font-lalezar text-2xl sm:text-4xl text-slate-900 tracking-wide">
              به جمع بیش از ۲۰,۰۰۰ متخصص وب وپیکا بپیوندید
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              هفته‌ای یک‌بار، گزیده‌ای از ناب‌ترین نکات وردپرس، سئو تکنیکال، ترفندهای المنتور و کدهای کاربردی را مستقیماً در ایمیل خود دریافت کنید.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ایمیل شما با موفقیت در خبرنامه وپیکا ثبت شد! از همراهی شما سپاسگزاریم.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید (مثلاً: ali@gmail.com)"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all dir-ltr text-left"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                عضویت رایگان
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
