import React, { useState } from 'react';
import {
  Code,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Settings,
  Scale,
  Flame,
  Info,
  Wrench,
} from 'lucide-react';
import { toPersianDigits } from '../utils/seoAnalyzer';
import { ToolkitChecklistItem, ToolkitSnippet } from '../types';

interface WordPressToolkitProps {
  snippets: ToolkitSnippet[];
  checklistItems: ToolkitChecklistItem[];
  onBack: () => void;
}

export const WordPressToolkit: React.FC<WordPressToolkitProps> = ({ snippets, checklistItems, onBack }) => {
  const [activeTab, setActiveTab] = useState<'snippets' | 'checklist' | 'comparison'>('snippets');
  const [snippetCategory, setSnippetCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Checklist state in LocalStorage
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('redwebs_wp_checklist');
    return saved ? JSON.parse(saved) : ['chk-1', 'chk-2', 'chk-7'];
  });

  const toggleChecklist = (id: string) => {
    const updated = checkedIds.includes(id)
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];
    setCheckedIds(updated);
    localStorage.setItem('redwebs_wp_checklist', JSON.stringify(updated));
  };

  const handleCopyCode = (id: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredSnippets = snippetCategory === 'all'
    ? snippets
    : snippets.filter((s) => s.category === snippetCategory);

  const progressPercent = checklistItems.length
    ? Math.round((checkedIds.filter((id) => checklistItems.some((item) => item.id === id)).length / checklistItems.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>جعبه ابزار و اسنیپت‌های مهندسی وب‌مستر</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              کدهای آماده، چک‌لیست انتشار و مقایسه ابزارهای وب
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              با استفاده از این کدهای استاندارد و ایمن، بدون نیاز به نصب پلاگین‌های مخرب، سرعت، امنیت و سئوی وب‌سایت وردپرسی خود را به اوج برسانید.
            </p>
          </div>

          <button
            onClick={onBack}
            className="self-start md:self-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-red-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-slate-700 shadow-xs"
          >
            <span>بازگشت به سایت</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('snippets')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'snippets'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>کدهای طلایی functions.php و .htaccess ({toPersianDigits(snippets.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'checklist'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>چک‌لیست راه‌اندازی سایت وردپرسی ({toPersianDigits(progressPercent)}٪ تکمیل)</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>مقایسه تخصصی افزونه‌ها و ابزارها</span>
        </button>
      </div>

      {/* TAB 1: SNIPPETS */}
      {activeTab === 'snippets' && (
        <div className="space-y-6">
          {/* Sub-Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 ml-2">دسته‌بندی کدها:</span>
            {[
              { id: 'all', label: 'همه کدها' },
              { id: 'security', label: 'امنیت و ضد هک' },
              { id: 'speed', label: 'سرعت و بهینه‌سازی' },
              { id: 'admin', label: 'شخصی‌سازی پیشخوان' },
              { id: 'woocommerce', label: 'ووکامرس' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSnippetCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  snippetCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Snippets List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredSnippets.map((snippet) => {
              const isCopied = copiedId === snippet.id;

              return (
                <div
                  key={snippet.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:border-red-500 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-md">
                          محل قرارگیری: {snippet.targetFile}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {snippet.category === 'security' && 'امنیت'}
                          {snippet.category === 'speed' && 'سرعت'}
                          {snippet.category === 'admin' && 'پیشخوان'}
                          {snippet.category === 'woocommerce' && 'ووکامرس'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{snippet.title}</h3>
                    </div>

                    <button
                      onClick={() => handleCopyCode(snippet.id, snippet.code)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>کد کپی شد!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>کپی کد اسنیپت</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{snippet.description}</p>

                  {/* Code Box */}
                  <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 text-left font-mono text-xs text-slate-200 overflow-x-auto dir-ltr">
                    <pre className="whitespace-pre">{snippet.code}</pre>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <Info className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{snippet.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LAUNCH CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">وضعیت آماده‌سازی سایت برای انتشار</h3>
                <p className="text-xs text-slate-500">
                  {toPersianDigits(checkedIds.filter((id) => checklistItems.some((item) => item.id === id)).length)} مورد از {toPersianDigits(checklistItems.length)} گام اساسی انجام شده است.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-red-600">
                  {toPersianDigits(progressPercent)}٪
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map((item) => {
              const isChecked = checkedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                    <h4
                      className={`text-xs sm:text-sm font-bold transition-colors ${
                        isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PLUGINS COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Comparison 1: Rank Math vs Yoast */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-xs border border-red-100">
                SEO
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">رنک مث (Rank Math) یا یواست (Yoast)؟</h3>
                <span className="text-xs text-slate-500">انتخاب برترین افزونه سئوی وردپرس</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed text-justify">
              <p>
                <strong>چرا رنک مث برنده است؟</strong> رنک مث بیش از ۱۵ ماژول کاربردی مانند مانیتورینگ ارورهای ۴۰۴، اسکیما ساز قدرتمند برای انواع مختلف مقالات و محصولات، و پشتیبانی از پروتکل ایندکس آنی (IndexNow) را به صورت رایگان ارائه می‌دهد که در یواست نیازمند خرید افزونه‌های مجزا است.
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-900">پیشنهاد فنی ردوبز:</span> برای سایت‌های تازه‌تاسیس و فروشگاهی، نصب <strong>Rank Math SEO</strong> به دلیل سرعت بالاتر و تولید خودکار ساختار اسکیما توصیه می‌شود.
              </div>
            </div>
          </div>

          {/* Comparison 2: LiteSpeed Cache vs WP Rocket */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-100">
                SPEED
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">لایت‌اسپید کش (LSCache) یا راکت؟</h3>
                <span className="text-xs text-slate-500">بررسی عملکرد افزونه‌های افزایش سرعت</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed text-justify">
              <p>
                اگر هاست شما دارای وب‌سرور <strong>LiteSpeed</strong> است، پلاگین رسمی LiteSpeed Cache به دلیل هماهنگی در سطح سرور، کش سمت وب‌سرور و اتصال به CDN ابری بسیار سریع‌تر و کاملاً رایگان است. اما اگر هاست شما Nginx یا Apache است، <strong>WP Rocket</strong> بهترین گزینه است.
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-900">پیشنهاد فنی ردوبز:</span> تهیه هاست‌های لایت‌اسپید همراه با فعال‌سازی کش اشیاء Redis بالاترین امتیاز Core Web Vitals را به ارمغان می‌آورد.
              </div>
            </div>
          </div>

          {/* Comparison 3: Elementor vs Gutenberg */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-100">
                BUILDER
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">المنتور پرو کانتینری یا گوتنبرگ (FSE)؟</h3>
                <span className="text-xs text-slate-500">صفحه‌ساز ویژوال در برابر بلوک‌های پیش‌فرض</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed text-justify">
              <p>
                المنتور با معماری جدید Flexbox Container دست طراح را برای ساخت صفحات فرود (Landing Pages)، هدر و فوترهای داینامیک و انیمیشن‌های تعاملی کاملاً باز می‌گذارد. ویرایشگر بلوکی گوتنبرگ نیز برای نگارش مقالات متنی سرعت و تمیزی کد فوق‌العاده‌ای دارد.
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-900">پیشنهاد فنی ردوبز:</span> ترکیب طراحی لندینگ‌ها با کانتینرهای المنتور و انتشار پست‌های بلاگ با گوتنبرگ استاندارد بهترین راندمان را می‌دهد.
              </div>
            </div>
          </div>

          {/* Comparison 4: WooCommerce vs EDD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100">
                SHOP
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">ووکامرس یا ایزی دیجیتال دانلودز (EDD)؟</h3>
                <span className="text-xs text-slate-500">فروشگاه کالای فیزیکی در برابر فایل دانلودی</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed text-justify">
              <p>
                اگر محصول فیزیکی (پوشاک، تجهیزات، کتاب چاپی) می‌فروشید، ووکامرس به دلیل مدیریت انبار، روش‌های ارسال پستی و تنوع درگاه‌های بانکی الزامی است. اما اگر صرفاً فایل‌های دانلودی، پادکست و دوره آموزشی می‌فروشید، EDD بسیار سبک‌تر است.
              </p>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-900">پیشنهاد فنی ردوبز:</span> برای فروشگاه‌های جامع، ووکامرس را با تسویه حساب تک‌مرحله‌ای و غیرفعال‌سازی اسکریپت‌های غیرضروری راه‌اندازی نمایید.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
