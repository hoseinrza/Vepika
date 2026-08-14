import React, { useState } from 'react';
import { Sparkles, Heart, CheckCircle2, Send, ShieldCheck, Code, ArrowUp, Wrench, Sliders, ExternalLink, Globe } from 'lucide-react';
import { Category, SiteSettings } from '../types';
import { VepikaLogo } from './VepikaLogo';

interface FooterProps {
  categories: Category[];
  settings: SiteSettings;
  onSelectCategory: (id: string | null) => void;
  onOpenAdmin: () => void;
  onOpenToolkit?: () => void;
  onOpenDesignSystem?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  settings,
  onSelectCategory,
  onOpenAdmin,
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
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 mt-20 transition-colors" dir="rtl">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Editorial Mission */}
          <div className="md:col-span-4 space-y-4">
            <VepikaLogo theme="dark" size="md" showTagline />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-justify max-w-sm">
              وپیکا (Vepika) رسانه مستقل تخصصی آموزش وردپرس، توسعه و معماری وب، سئو تکنیکال و ابزارهای کاربردی کدنویسی است. هدف ما پرورش نسل نوین متخصصان و مهندسان وب فارسی است.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>اسکیما JSON-LD گوگل فعال</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>طراحی استاندارد RTL</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-extrabold text-white">دسته‌بندی‌های تخصصی</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      scrollToTop();
                    }}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links & Developer Portals */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-extrabold text-white">بخش‌های دسترسی سریع</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory(null);
                    scrollToTop();
                  }}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  صفحه اصلی رسانه
                </button>
              </li>
              {onOpenToolkit && (
                <li>
                  <button
                    onClick={onOpenToolkit}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3 h-3 text-blue-400" />
                    <span>جعبه ابزار و اسنیپت‌ها</span>
                  </button>
                </li>
              )}
              {onOpenDesignSystem && (
                <li>
                  <button
                    onClick={onOpenDesignSystem}
                    className="hover:text-purple-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3 h-3 text-purple-400" />
                    <span>سیستم دیزاین برند</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  id="footer-admin-link"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>پیشخوان مدیریت وپیکا</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-extrabold text-white">خبرنامه هفتگی وپیکا</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              جدیدترین مقالات آموزشی، نکات سئو و کدهای کاربردی را در ایمیل خود دریافت کنید.
            </p>

            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ایمیل شما با موفقیت در خبرنامه ثبت شد!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ایمیل خود را وارد کنید..."
                    className="w-full bg-slate-800 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:outline-hidden placeholder:text-slate-500 text-left dir-ltr"
                  />
                  <button
                    type="submit"
                    className="absolute left-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>عضویت</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & scroll to top */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings.footerText || '© تمامی حقوق مادی و معنوی برای رسانه مستقل آموزشی وپیکا (Vepika) محفوظ است.'}</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
            title="بازگشت به بالا"
          >
            <span>بازگشت به بالا</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
