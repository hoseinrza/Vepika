import React, { useState } from 'react';
import { VepikaLogo } from './VepikaLogo';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Search,
  ArrowLeft,
  ArrowRight,
  Code,
  Layers,
  Shield,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface DesignSystemViewProps {
  onBack: () => void;
}

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({ onBack }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'buttons' | 'cards' | 'badges' | 'code'>('colors');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" dir="rtl">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <VepikaLogo theme="dark" size="lg" showTagline />
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به سایت</span>
            </button>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              سیستم دیزاین و هویت بصری وپیکا (Vepika Design System)
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              راهنمای جامع هویت بصری، پالت رنگ‌های روانشناختی، تایپوگرافی استاندارد فارسی و کامپوننت‌های رابط کاربری پلتفرم آموزشی وپیکا.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-800 pb-1">
            {[
              { id: 'colors', label: 'پالت رنگی (Colors)' },
              { id: 'typography', label: 'تایپوگرافی (Typography)' },
              { id: 'buttons', label: 'دکمه‌ها و تعاملات (Buttons)' },
              { id: 'badges', label: 'نشان‌ها و برچسب‌ها (Badges)' },
              { id: 'cards', label: 'کارت‌ها و کانتینرها (Cards)' },
              { id: 'code', label: 'بلاک‌های کد و اسنیپت (Code Blocks)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Colors Section */}
      {activeTab === 'colors' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>پالت رنگ‌های اصلی و روانشناسی برند</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              رنگ‌های پایدار و استاندارد انتخاب شده برای حس اعتماد، تخصص فنی و خلاقیت مدرن.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Primary Blue */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="h-28 rounded-xl bg-[#2563EB] flex items-end p-3 text-white shadow-inner">
                <span className="font-mono text-xs font-bold">#2563EB</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Vepika Blue (اصلی)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  رنگ هویت اصلی، دکمه‌های اقدام، پیوندها و المان‌های تعاملی. نماد اعتماد، فناوری و قدرت اجرایی.
                </p>
              </div>
            </div>

            {/* Dark Slate */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="h-28 rounded-xl bg-[#0F172A] flex items-end p-3 text-white shadow-inner">
                <span className="font-mono text-xs font-bold">#0F172A</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Vepika Dark (تاریک)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  تیترهای اصلی، هدرها، فوتر و کنتراست‌های عمیق. نماد استحکام، پرستیژ فنی و ثبات رسانه‌ای.
                </p>
              </div>
            </div>

            {/* Accent Purple */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="h-28 rounded-xl bg-[#8B5CF6] flex items-end p-3 text-white shadow-inner">
                <span className="font-mono text-xs font-bold">#8B5CF6</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Vepika Purple (اکسنت فرعی)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  استفاده به جا برای برچسب‌های ویژه، نشان‌های نوآوری و طراحی UI/UX. نماد خلاقیت و دانش نوین.
                </p>
              </div>
            </div>

            {/* Background & Slate */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="h-28 rounded-xl bg-[#F8FAFC] border border-slate-300 flex items-end p-3 text-slate-700 shadow-inner">
                <span className="font-mono text-xs font-bold">#F8FAFC / #FFFFFF</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Background & Surface</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  پس‌زمینه مات و آرامش‌بخش برای مطالعه مقالات طولانی بدون خستگی چشم کاربر.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Typography Section */}
      {activeTab === 'typography' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <h2 className="font-lalezar text-2xl sm:text-3xl text-slate-900 flex items-center gap-2.5 tracking-wide">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>ترکیب تایپوگرافی وپیکا (لاله‌زار + وزیرمتن + جت‌برینز مونو)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ترکیب فونت اصیل و پرانرژی لاله‌زار برای تیترها و عناوین اصلی، فونت وزیرمتن با خوانایی عالی برای متون بدنه و جت‌برینز مونو برای کدهای برنامه‌نویسی.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-6 border-b border-slate-100 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600">Display / H1 - Lalezar Font (عناوین و برندینگ)</span>
              <h1 className="font-lalezar text-3xl sm:text-5xl text-slate-900 tracking-wide">
                مرجع تخصصی آموزش وردپرس، توسعه و معماری وب
              </h1>
            </div>

            <div className="pb-6 border-b border-slate-100 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600">Display / H2 - Lalezar Font (عناوین بخش‌ها و کارت‌ها)</span>
              <h2 className="font-lalezar text-2xl sm:text-3xl text-slate-900 tracking-wide">
                چگونه سرعت لود وردپرس را با لایت‌اسپید کش به زیر یک ثانیه برسانیم؟
              </h2>
            </div>

            <div className="pb-6 border-b border-slate-100 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600">H3 - Vazirmatn 18px / 1.125rem - Font Weight 700 (Bold)</span>
              <h3 className="text-lg font-bold text-slate-900">
                تنظیمات بهینه‌سازی دیتابیس و کش اشیاء (Redis Object Cache)
              </h3>
            </div>

            <div className="pb-6 border-b border-slate-100 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600">Body Text - Vazirmatn 16px / 1rem - Line Height 2.0</span>
              <p className="text-slate-700 text-base leading-loose max-w-4xl text-justify">
                تایپوگرافی اصولی یکی از اساسی‌ترین فاکتورهای افزایش زمان حضور کاربر در صفحه (Dwell Time) است. در رسانه وپیکا، تمامی پاراگراف‌ها با فاصله خطوط محاسبه‌شده و کنتراست رنگی متناسب با استانداردهای WCAG AA رندر می‌شوند تا چشم خواننده در مقالات طولانی خسته نشود.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600">Code & Monospace - JetBrains Mono / 14px</span>
              <div className="font-mono text-sm bg-slate-950 text-blue-300 p-4 rounded-xl dir-ltr text-left">
                const vepika = {'{'} brand: 'Vepika', mission: 'Learn. Build. Grow.', language: 'Persian' {'}'};
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Buttons & Interactions */}
      {activeTab === 'buttons' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>دکمه‌ها و عناصر تعاملی (Buttons & Controls)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              دکمه‌های با پدینگ استاندارد ۲x افقی، گوشه‌های منحنی ۱۲ پیکسل و انیمیشن‌های روان هاور.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2">
                <span>دکمه اصلی (Primary)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2">
                <span>دکمه تیره (Dark Action)</span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </button>

              <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2">
                <span>دکمه اکستنشن (Accent)</span>
                <Zap className="w-4 h-4" />
              </button>

              <button className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-all cursor-pointer">
                دکمه خطی (Outline)
              </button>

              <button className="px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all cursor-pointer">
                دکمه متنی (Ghost)
              </button>

              <button className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                دکمه هشدار (Danger)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. Badges & Chips */}
      {activeTab === 'badges' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>نشان‌ها و برچسب‌های اطلاعاتی (Badges & Chips)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              دسته‌بندی‌ها، سطوح مهارت، وضعیت‌ها و پلاگین‌های سازگار در یک نگاه.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">سطوح یادگیری (Difficulty)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>مقدماتی (Beginner)</span>
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>متوسط (Intermediate)</span>
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>پیشرفته (Advanced)</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">نوع محتوا (Content Types)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">
                  آموزش گام‌به‌گام
                </span>
                <span className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-bold">
                  مقاله تخصصی
                </span>
                <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold">
                  اسنیپت و کد سریع
                </span>
                <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold">
                  راهنمای جامع
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Cards & Containers */}
      {activeTab === 'cards' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>کارت‌ها و جعبه‌های محتوایی (Cards & Callouts)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              چیدمان‌های مسطح با حاشیه‌های دقیق ۱ پیکسل، سایه‌های ملایم و فواصل درونی استاندارد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Info Callout */}
            <div className="bg-blue-50/80 border border-blue-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <Info className="w-4 h-4 text-blue-600" />
                <span>نکته آموزشی وپیکا</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                همیشه قبل از ایجاد تغییر در فایل functions.php از وب‌سایت خود بکاپ تهیه نمایید.
              </p>
            </div>

            {/* Success Callout */}
            <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>نتیجه بهینه‌سازی</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                امتیاز لایت‌هاوس پس از کانفیگ ردیس به ۱۰۰ و زمان پاسخگویی به ۸۰ میلی‌ثانیه رسید.
              </p>
            </div>

            {/* Warning Callout */}
            <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>هشدار امنیتی</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                دسترسی به فایل wp-config.php را از طریق وب‌سرور برای عموم مسدود نگه دارید.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. Code Blocks */}
      {activeTab === 'code' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>بلاک‌های نمایش کد و کپی اسنیپت (Code Blocks)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              جعبه‌های کد با دارک تم #0F172A، فونت مونوپیس JetBrains Mono و امکان کپی تک‌کلیک.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
            <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 mr-3">functions.php</span>
              </div>
              <button
                onClick={() => handleCopy(`// کدهای بهینه‌سازی وپیکا\nadd_action('init', 'vepika_speed_booster');`, 'snippet-demo')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode === 'snippet-demo' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی کد</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-5 text-sm font-mono text-slate-200 overflow-x-auto dir-ltr text-left leading-relaxed">
              <code>{`// کدهای بهینه‌سازی سرعت و امنیت وپیکا
add_action('init', function() {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
});`}</code>
            </pre>
          </div>
        </section>
      )}
    </div>
  );
};
