import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  CheckCircle2,
  Send,
  Code2,
  ArrowUp,
  Wrench,
  Sliders,
  Layers,
  Cpu,
  Terminal,
  BookOpen,
  Check,
  Flame,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Category, SiteSettings } from '../types';
import { RedwebsLogo } from './RedwebsLogo';
import { toPersianDigits } from '../utils/seoAnalyzer';

interface FooterProps {
  categories: Category[];
  settings: SiteSettings;
  onSelectCategory: (id: string | null) => void;
  onOpenToolkit?: () => void;
  onOpenDesignSystem?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  settings,
  onSelectCategory,
  onOpenToolkit,
  onOpenDesignSystem,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="bg-slate-950 text-slate-300 border-t border-slate-800/80 mt-20 relative overflow-hidden"
      dir="rtl"
      id="main-footer"
    >
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-32 bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Top Value Banner */}
      <div className="border-b border-slate-900 bg-slate-900/60 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-300">
              <strong className="text-white font-lalezar text-sm tracking-wide ml-1.5">ردوبز؛</strong>
              پایگاه تخصصی یادگیری، توسعه افزونه و قالب وردپرس، ارتقای سرعت و سئو تکنیکال
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/70 px-3 py-1 rounded-full">
              <Code2 className="w-3.5 h-3.5 text-red-400" />
              <span>سازگار با PHP 8.x و WP 6.7+</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/70 px-3 py-1 rounded-full text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>محتوای کاملاً رایگان</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <RedwebsLogo theme="dark" size="md" showTagline />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-justify max-w-sm font-normal">
              ردوبز رسانه مستقل و مرجع تخصصی آموزش وردپرس، توسعه و معماری وب، سئو تکنیکال و ابزارهای کاربردی کدنویسی است. هدف ما پرورش نسل نوین متخصصان و مهندسان وب فارسی با محتوای استاندارد و تست‌شده است.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>اسکیما استاندارد JSON-LD گوگل</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>طراحی اختصاصی RTL</span>
              </div>
            </div>
          </div>

          {/* Column 2: Specialist Topics (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-lalezar text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>دسته‌بندی‌های تخصصی</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      scrollToTop();
                    }}
                    className="hover:text-red-400 transition-colors flex items-center justify-between w-full group text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full group-hover:scale-125 transition-transform shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="group-hover:translate-x-[-2px] transition-transform">
                        {cat.name}
                      </span>
                    </div>
                    {cat.postCount && (
                      <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        {toPersianDigits(cat.postCount)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Portals & Tools (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-lalezar text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-400" />
              <span>ابزارها و میانبرها</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory(null);
                    scrollToTop();
                  }}
                  className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>صفحه اصلی رسانه</span>
                </button>
              </li>
              {onOpenToolkit && (
                <li>
                  <button
                    onClick={onOpenToolkit}
                    className="hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer group"
                  >
                    <Wrench className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>جعبه ابزار کدهای وردپرس</span>
                  </button>
                </li>
              )}
              {onOpenDesignSystem && (
                <li>
                  <button
                    onClick={onOpenDesignSystem}
                    className="hover:text-purple-400 transition-colors flex items-center gap-2 cursor-pointer group"
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>سیستم دیزاین برند</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter & Community (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-lalezar text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
              <Send className="w-4 h-4 text-red-400" />
              <span>خبرنامه مهندسی ردوبز</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              جدیدترین مقالات آموزشی، نکات سئو تکنیکال و تکه کدهای کاربردی را هر هفته در ایمیل خود دریافت کنید.
            </p>

            {subscribed ? (
              <div className="bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-200">ایمیل شما با موفقیت ثبت شد!</p>
                  <p className="text-[11px] text-emerald-400/90 mt-0.5">آموزش‌های جدید برایتان ارسال خواهد شد.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-900 text-slate-100 text-xs px-3.5 py-3 rounded-2xl border border-slate-800 focus:border-red-500 focus:outline-hidden placeholder:text-slate-500 text-left dir-ltr transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute left-1.5 top-1.5 bottom-1.5 px-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-[1.02] transform-gpu"
                  >
                    <span>عضویت</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  ما به حریم خصوصی شما احترام می‌گذاریم؛ بدون ارسال هرزنامه.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <p>
              {settings.footerText || '© تمامی حقوق مادی و معنوی برای رسانه تخصصی ردوبز (Redwebs) محفوظ است.'}
            </p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-[11px] text-slate-600 font-mono">v2.4 LTS</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer shadow-2xs group"
            title="بازگشت به بالای صفحه"
          >
            <span className="text-xs font-medium">بازگشت به بالا</span>
            <ArrowUp className="w-3.5 h-3.5 text-red-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
