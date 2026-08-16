import React, { useState } from 'react';
import { Article, Category, SiteSettings } from '../types';
import { ArticleCard } from './ArticleCard';
import { toPersianDigits, formatPersianDate } from '../utils/seoAnalyzer';
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
  Check,
  Code2,
} from 'lucide-react';

interface HomeViewProps {
  articles: Article[];
  categories: Category[];
  settings: SiteSettings;
  bookmarks: string[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (catId: string) => void;
  onToggleBookmark: (articleId: string, e?: React.MouseEvent) => void;
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

  const scrollToCategories = () => {
    const el = document.getElementById('categories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFeaturedBookmarked = featuredArticle ? bookmarks.includes(featuredArticle.id) : false;

  return (
    <div className="space-y-16 pb-16" dir="rtl">
      {/* 1. Balanced 2-Column Clean Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800/80">
        {/* Subtle geometric glowing background accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right Column (Col 6/12): Punchy Brand Message & Action Buttons */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>رسانه تخصصی آموزش وردپرس و توسعه مدرن وب</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-lalezar text-3xl sm:text-5xl lg:text-5xl tracking-wide leading-tight text-white">
                  یاد بگیرید. بسازید. <span className="text-transparent bg-clip-text bg-gradient-to-l from-red-400 to-purple-400">ارتقا دهید.</span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed text-justify max-w-xl">
                  پایگاه تخصصی مقالات عمیق، آموزش‌های پروژه‌محور وردپرس، ووکامرس، المنتور، بهینه‌سازی سرعت، سئو تکنیکال و جعبه‌ابزار کدهای کاربردی برای مهندسان و طراحان وب فارسی.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={scrollToCategories}
                  className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/20 hover:scale-[1.02] transform-gpu"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>مرور سرفصل‌ها و آموزش‌ها</span>
                </button>

                <button
                  onClick={onOpenToolkit}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-700/80 shadow-md hover:border-red-500/50"
                >
                  <Code2 className="w-4 h-4 text-red-400" />
                  <span>جعبه‌ابزار کدهای وردپرس</span>
                  <span className="bg-red-500/20 text-red-300 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold">
                    PRO
                  </span>
                </button>
              </div>

              {/* Trust & Quality Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>۱۰۰٪ رایگان و کاربردی</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>سازگار با WP 6.7+ و PHP 8.x</span>
                </div>
              </div>
            </div>

            {/* Left Column (Col 6/12): Spotlight Featured Article Card */}
            {featuredArticle && (
              <div className="lg:col-span-6">
                <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 hover:border-red-500/50 transition-all duration-300 overflow-hidden shadow-2xl shadow-slate-950/50 group flex flex-col">
                  {/* Card Cover */}
                  <div
                    className="relative aspect-16/9 w-full bg-slate-950 overflow-hidden cursor-pointer"
                    onClick={() => onSelectArticle(featuredArticle)}
                  >
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Spotlight Badge */}
                    <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>آموزش ویژه ردوبز</span>
                      </span>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(featuredArticle.id, e);
                      }}
                      className={`absolute top-3.5 left-3.5 z-10 w-9 h-9 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md ${
                        isFeaturedBookmarked
                          ? 'bg-red-600 text-white scale-105'
                          : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700'
                      }`}
                      title={isFeaturedBookmarked ? 'حذف از نشان‌ها' : 'نشان کردن مقاله'}
                    >
                      <Bookmark className={`w-4 h-4 ${isFeaturedBookmarked ? 'fill-white' : ''}`} />
                    </button>

                    {/* Floating Meta on Image */}
                    <div className="absolute bottom-3.5 right-3.5 left-3.5 z-10 flex items-center justify-between text-xs text-slate-300">
                      <span className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 font-bold text-red-300">
                        {categories.find((c) => c.id === featuredArticle.categoryId)?.name || 'وردپرس'}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
                        <Clock className="w-3.5 h-3.5 text-red-400" />
                        <span>{toPersianDigits(featuredArticle.readingTimeMinutes)} دقیقه مطالعه</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <h2
                      onClick={() => onSelectArticle(featuredArticle)}
                      className="font-lalezar text-xl sm:text-2xl text-white group-hover:text-red-400 transition-colors cursor-pointer leading-snug tracking-wide line-clamp-2"
                    >
                      {featuredArticle.title}
                    </h2>

                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 text-justify">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={featuredArticle.author.avatar}
                          alt={featuredArticle.author.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:shadow-red-600/30"
                      >
                        <span>شروع مطالعه</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 2. Interactive 10 Categories Grid */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
              <Layers className="w-4 h-4" />
              <span>موضوعات تخصصی ردوبز</span>
            </div>
            <h2 className="font-lalezar text-2xl sm:text-4xl text-slate-900 tracking-wide">
              دسته‌بندی‌های جامع یادگیری
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            محتواهای ردوبز در ۱۰ دسته‌بندی موضوعی استاندارد برای یادگیری مهارت‌های واقعی توسعه وب تنظیم شده‌اند.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-red-500 hover:shadow-xl hover:shadow-red-600/10 hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 ease-out cursor-pointer group flex flex-col justify-between space-y-3 transform-gpu will-change-transform"
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
                <h3 className="font-lalezar text-base text-slate-900 group-hover:text-red-600 transition-colors tracking-wide">
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
              آموزش‌های نگارش شده توسط تیم فنی ردوبز بر اساس آخرین استانداردهای سال ۲۰۲۶
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
                    ? 'bg-red-600 text-white shadow-xs'
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
        <div className="bg-gradient-to-l from-slate-900 to-red-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                <Wrench className="w-3.5 h-3.5" />
                <span>جعبه ابزار رایگان وب‌مستر ردوبز</span>
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
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-red-600/30"
                >
                  <Wrench className="w-4 h-4" />
                  <span>ورود به جعبه ابزار و اسنیپت‌ها</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-red-300 space-y-2 dir-ltr text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-500">
                <span>functions.php</span>
                <span className="text-emerald-400">REDWEBS SNIPPET</span>
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
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="font-lalezar text-2xl sm:text-4xl text-slate-900 tracking-wide">
              به جمع بیش از ۲۰,۰۰۰ متخصص وب ردوبز بپیوندید
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              هفته‌ای یک‌بار، گزیده‌ای از ناب‌ترین نکات وردپرس، سئو تکنیکال، ترفندهای المنتور و کدهای کاربردی را مستقیماً در ایمیل خود دریافت کنید.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ایمیل شما با موفقیت در خبرنامه ردوبز ثبت شد! از همراهی شما سپاسگزاریم.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید (مثلاً: ali@gmail.com)"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-red-600 focus:bg-white transition-all dir-ltr text-left"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
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
