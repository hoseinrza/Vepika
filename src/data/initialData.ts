import { Article, Category, Comment, SiteSettings, ToolkitChecklistItem, ToolkitSnippet } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-wordpress',
    slug: 'wordpress',
    name: 'وردپرس',
    description: 'آموزش‌های پایه تا پیشرفته هسته وردپرس، شخصی‌سازی، ساختار فایل‌ها و بهترین راهکارها',
    color: '#2563EB',
    accentColor: '#3B82F6',
    iconName: 'Globe',
    postCount: 4,
    featured: true,
  },
  {
    id: 'cat-elementor',
    slug: 'elementor',
    name: 'المنتور',
    description: 'طراحی پیشرفته صفحات وب با المنتور پرو، کانتینرهای فلکس‌باکس و لوپ‌بیلدر',
    color: '#8B5CF6',
    accentColor: '#A78BFA',
    iconName: 'Layout',
    postCount: 3,
    featured: true,
  },
  {
    id: 'cat-woocommerce',
    slug: 'woocommerce',
    name: 'ووکامرس',
    description: 'راه‌اندازی و مدیریت فروشگاه آنلاین، درگاه‌های پرداخت، روش‌های ارسال و بهبود نرخ تبدیل',
    color: '#7C3AED',
    accentColor: '#C4B5FD',
    iconName: 'ShoppingCart',
    postCount: 3,
    featured: true,
  },
  {
    id: 'cat-web-design',
    slug: 'website-design',
    name: 'طراحی وب‌سایت',
    description: 'اصول UI/UX مدرن، تایپوگرافی فارسی در وب، سیستم رنگ‌ها و بهینه‌سازی تجربه کاربری',
    color: '#0EA5E9',
    accentColor: '#38BDF8',
    iconName: 'Palette',
    postCount: 2,
    featured: true,
  },
  {
    id: 'cat-web-dev',
    slug: 'web-development',
    name: 'توسعه وب',
    description: 'کدنویسی PHP، جاوااسکریپت، استایل‌نویسی CSS و معماری مدرن فرانت‌اند و بک‌اند',
    color: '#10B981',
    accentColor: '#34D399',
    iconName: 'Code',
    postCount: 3,
    featured: true,
  },
  {
    id: 'cat-seo',
    slug: 'seo',
    name: 'سئو و بهینه‌سازی',
    description: 'سئو تکنیکال، رنک‌مث، اسکیماگذاری خودکار، بهینه‌سازی سرعت و کرکره رتبه گوگل',
    color: '#F59E0B',
    accentColor: '#FBBF24',
    iconName: 'TrendingUp',
    postCount: 3,
    featured: true,
  },
  {
    id: 'cat-plugins',
    slug: 'plugins',
    name: 'افزونه‌ها',
    description: 'نقد، بررسی، مقایسه تخصصی و تنظیمات حرفه‌ای برترین پلاگین‌های کاربردی وردپرس',
    color: '#6366F1',
    accentColor: '#818CF8',
    iconName: 'Layers',
    postCount: 2,
    featured: false,
  },
  {
    id: 'cat-themes',
    slug: 'themes',
    name: 'قالب‌ها',
    description: 'انتخاب بهترین قالب‌های سبک، ساخت چایلدتم (Child Theme) و بهینه‌سازی کدهای قالب',
    color: '#EC4899',
    accentColor: '#F472B6',
    iconName: 'Sparkles',
    postCount: 2,
    featured: false,
  },
  {
    id: 'cat-troubleshooting',
    slug: 'troubleshooting',
    name: 'عیب‌یابی و رفع خطا',
    description: 'راهنمای رفع خطاهای متداول ۵۰۰، صفحه سفید مرگ (WSOD)، خطای دیتابیس و مشکلات کش',
    color: '#EF4444',
    accentColor: '#F87171',
    iconName: 'AlertTriangle',
    postCount: 2,
    featured: false,
  },
  {
    id: 'cat-tools',
    slug: 'tools',
    name: 'ابزارها و اسنیپت‌ها',
    description: 'کدهای بدون افزونه functions.php، چک‌لیست‌های انتشار و ابزارهای آنلاین توسعه‌دهندگان',
    color: '#0D9488',
    accentColor: '#2DD4BF',
    iconName: 'Wrench',
    postCount: 2,
    featured: true,
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'post-1',
    slug: 'complete-wordpress-speed-optimization-guide',
    title: 'راهنمای جامع افزایش سرعت و لود زیر ۱ ثانیه در وردپرس (Core Web Vitals)',
    excerpt: 'چگونه امتیاز شاخص‌های لایت‌هاوس و Core Web Vitals سایت را سبز کنیم؟ بررسی تنظیمات لایت‌اسپید کش، ردیس (Redis)، فشرده‌سازی WebP و بهینه‌سازی بارگذاری فونت‌های فارسی.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    coverImageAlt: 'بهینه‌سازی سرعت و معیارهای Core Web Vitals در وردپرس',
    categoryId: 'cat-wordpress',
    tags: ['سرعت وردپرس', 'Core Web Vitals', 'LiteSpeed Cache', 'Redis', 'سئو تکنیکال', 'TTFB'],
    readingTimeMinutes: 9,
    publishDate: '2026-08-14T08:30:00Z',
    updatedAt: '2026-08-14T12:00:00Z',
    status: 'published',
    viewsCount: 3840,
    likesCount: 420,
    featured: true,
    contentType: 'tutorial',
    difficulty: 'intermediate',
    prerequisites: ['دسترسی به هاست سی‌پنل یا دایرکت‌ادمین', 'نصب وردپرس نسخه ۶.۰ به بالا', 'آشنایی با مبانی کشینگ'],
    wpLevel: 'متوسط',
    wpPlugin: 'LiteSpeed Cache + Object Cache Redis',
    wpVersion: 'WordPress 6.7+',
    author: {
      id: 'author-1',
      name: 'آریا رادمنش',
      role: 'معمار ارشد سیستم و توسعه‌دهنده وب',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'بیش از یک دهه فعالیت در توسعه وب مدرن، بهینه‌سازی دیتابیس‌های پرترافیک و معماری سایت‌های بدون لگ.',
    },
    tutorialSteps: [
      {
        stepNumber: 1,
        title: 'فعال‌سازی کش شیء (Object Cache) با Redis',
        description: 'کش شیء کوئری‌های تکراری دیتابیس را در حافظه RAM ذخیره می‌کند تا زمان پاسخ سرور (TTFB) به شدت کاهش یابد.',
        codeSnippet: `// اضافه کردن به فایل wp-config.php\ndefine('WP_CACHE', true);\ndefine('WP_REDIS_HOST', '127.0.0.1');\ndefine('WP_REDIS_PORT', 6379);\ndefine('WP_REDIS_TIMEOUT', 1);`,
        language: 'php',
        tip: 'قبل از فعال‌سازی، از پشتیبانی هاست خود از اکستنشن Redis در PHP اطمینان حاصل کنید.',
      },
      {
        stepNumber: 2,
        title: 'تنظیمات بهینه‌سازی CSS و کدهای جاوااسکریپت',
        description: 'کدهای مسدودکننده رندر (Render-blocking resources) را با روش Defer و فشرده‌سازی Minify برطرف کنید.',
        codeSnippet: `// کدهای هوک برای تاخیر در بارگذاری جاوااسکریپت‌های غیرضروری\nfunction redwebs_defer_scripts($tag, $handle, $src) {\n    $defer_scripts = array('custom-analytics', 'chat-widget');\n    if (in_array($handle, $defer_scripts)) {\n        return '<script src="' . esc_url($src) . '" defer="defer"></script>';\n    }\n    return $tag;\n}\nadd_filter('script_loader_tag', 'redwebs_defer_scripts', 10, 3);`,
        language: 'php',
        tip: 'جی‌کوئری اصلی وردپرس (jquery-core) را هرگز Defer نکنید تا تداخلی در اسکریپت‌های پوسته ایجاد نشود.',
      },
      {
        stepNumber: 3,
        title: 'بهینه‌سازی بارگذاری فونت‌های وب فارسی',
        description: 'استفاده از خاصیت font-display: swap و پیش‌بارگذاری (Preload) برای جلوگیری از پرش چیدمان (CLS).',
        codeSnippet: `@font-face {\n  font-family: 'Vazirmatn';\n  src: url('/fonts/Vazirmatn.woff2') format('woff2');\n  font-weight: 400 700;\n  font-display: swap;\n}`,
        language: 'css',
      },
      {
        stepNumber: 4,
        title: 'تست نهایی با ابزارهای استاندارد PageSpeed Insights',
        description: 'بررسی شاخص‌های LCP، INP و CLS در دستگاه‌های موبایل و دسکتاپ پس از پاکسازی کامل کش سرور.',
      }
    ],
    seo: {
      metaTitle: 'راهنمای جامع افزایش سرعت وردپرس و Core Web Vitals | ردوبز',
      metaDescription: 'آموزش گام‌به‌گام افزایش سرعت وردپرس و رساندن امتیاز PageSpeed به ۱۰۰ با کانفیگ کش لایت‌اسپید، کش ردیس و بهینه‌سازی کدهای فرانت‌اند.',
      focusKeyword: 'افزایش سرعت وردپرس',
      canonicalUrl: 'https://redwebs.ir/article/complete-wordpress-speed-optimization-guide',
      robotsIndex: true,
      schemaType: 'TechArticle',
      faqItems: [
        {
          id: 'faq-1',
          question: 'تفاوت کش مرورگر با کش سرور در وردپرس چیست؟',
          answer: 'کش سرور نسخه‌ای از HTML تولید شده را در حافظه هاست نگه می‌دارد تا پردازش PHP برای هر کاربر تکرار نشود، در حالی که کش مرورگر فایل‌های ثابت (CSS, JS, عکس‌ها) را در دستگاه کاربر ذخیره می‌کند.'
        },
        {
          id: 'faq-2',
          question: 'بهترین فرمت تصویر برای سایت‌های پرسرعت چیست؟',
          answer: 'فرمت WebP و AVIF با فشرده‌سازی بدون افت کیفیت محسوس، حجم عکس‌ها را تا ۷۰٪ نسبت به JPEG کاهش می‌دهند.'
        }
      ]
    },
    content: `
بهینه‌سازی سرعت سایت و پایداری تجربه کاربری (Core Web Vitals) از حیاتی‌ترین ارکان موفقیت هر رسانه و کسب‌وکار آنلاین است. طبق آخرین الگوریتم‌های گوگل، سایت‌هایی که زمان پاسخگویی بالای ۲.۵ ثانیه دارند، نه تنها با افت محسوس رتبه در موتورهای جستجو مواجه می‌شوند، بلکه تا ۵۳٪ از کاربران موبایل خود را قبل از لود کامل صفحه از دست می‌دهند.

در این مقاله تخصصی از **ردوبز**، نقشه راه کاملاً عملی و تست‌شده‌ای برای دستیابی به لود زیر ۱ ثانیه و کسب امتیاز سبز در ابزارهای Google PageSpeed Insights و GTmetrix ارائه می‌کنیم.

---

## ۱. چرا زمان پاسخ اولیه سرور (TTFB) اهمیت دارد؟

زمان رسیدن اولین بایت (**Time to First Byte**) معیاری است که نشان می‌دهد سرور هاست چقدر طول می‌کشد تا درخواست اولیه مرورگر را پردازش کرده و اولین بخش از محتوا را ارسال کند. اگر TTFB سایت شما بالای ۶۰۰ میلی‌ثانیه باشد، حتی بهترین بهینه‌سازی‌های ظاهری هم نمی‌تواند سرعت لود را به استاندارد ایده‌آل برساند.

> **نکته کلیدی ردوبز:** برای کاهش TTFB، استفاده از دیتابیس سریع MariaDB، فعال‌سازی کش شیء (Redis / Memcached) و استفاده از آخرین نسخه پایدار PHP 8.2+ توصیه اکید ماست.

---

## ۲. کانفیگ طلایی کش لایت‌اسپید (LiteSpeed Cache)

اگر از هاست لایت‌اسپید استفاده می‌کنید، افزونه LiteSpeed Cache قوی‌ترین ابزار یکپارچه‌سازی وب‌سرور با وردپرس است. مهم‌ترین بخش‌های تنظیمی عبارتند از:

* **Page Caching:** فعال کردن کش صفحات عمومی و صفحات محصولات.
* **Guest Mode:** ایجاد نسخه استاتیک فوق‌العاده سریع برای بازدیدکنندگانی که برای اولین بار به سایت مراجعه می‌کنند.
* **Image Optimization:** تبدیل دسته‌جمعی تصاویر به پسوند WebP و فعال‌سازی Lazy Load هوشمند.
* **ESI (Edge Side Includes):** امکان کش کردن صفحات عمومی در حالی که سبد خرید یا بخش ورود کاربر همچنان اختصاصی و بدون کش باقی می‌ماند.

\`\`\`apache
# فعال‌سازی Gzip و فشرده‌سازی کدهای متنی در فایل .htaccess
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
\`\`\`

---

## ۳. کاهش پرش ناگهانی چیدمان (Cumulative Layout Shift)

یکی از مشکلات رایج در سایت‌های فارسی، پرش فونت هنگام لود شدن صفحه است. با تعریف ابعاد عرض و ارتفاع دقیق (\`width\` و \`height\`) برای تمام تصاویر و استفاده از \`font-display: swap\` در استایل‌های CSS، نمره CLS سایت شما همیشه صفر خواهد ماند.

\`\`\`css
/* استایل پیش‌فرض ضد پرش چیدمان */
img, video {
  max-width: 100%;
  height: auto;
  aspect-ratio: attr(width) / attr(height);
}
\`\`\`

---

## ۴. پاکسازی منظم جداول دیتابیس (wp_options)

با گذشت زمان، داده‌های موقت موسوم به **Transient Options** حجم دیتابیس وردپرس را افزایش می‌دهند. بهینه‌سازی هفتگی کوئری‌های Autoload می‌تواند سرعت اجرای هر درخواست PHP را تا ۴۰٪ افزایش دهد.

با پیاده‌سازی این گام‌ها، سایت شما عملکردی پایدار، سریع و مطابق با استانداردهای مدرن وب جهانی تجربه خواهد کرد.
    `
  },
  {
    id: 'post-2',
    slug: 'elementor-pro-modern-flexbox-containers-mastery',
    title: 'مسترکلاس کانتینرهای فلکس‌باکس و گرید در المنتور پرو (کاهش DOM)',
    excerpt: 'آموزش خداحافظی با ساختار سنتی بخش و ستون در المنتور. چگونه با Flexbox Containers کدهای خروجی را تا ۷۰٪ سبک‌تر کرده و صفحات کاملاً ریسپانسیو بسازیم؟',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    coverImageAlt: 'آموزش کانتینرهای فلکس‌باکس در المنتور پرو',
    categoryId: 'cat-elementor',
    tags: ['المنتور', 'Flexbox', 'کانتینر', 'کاهش حجم DOM', 'طراحی ریسپانسیو', 'UI'],
    readingTimeMinutes: 7,
    publishDate: '2026-08-13T10:15:00Z',
    updatedAt: '2026-08-14T09:00:00Z',
    status: 'published',
    viewsCount: 2910,
    likesCount: 345,
    featured: false,
    contentType: 'tutorial',
    difficulty: 'intermediate',
    prerequisites: ['نصب افزونه Elementor Pro', 'آشنایی با اصول چیدمان ریسپانسیو'],
    wpLevel: 'متوسط',
    wpPlugin: 'Elementor Pro 3.24+',
    wpVersion: 'WordPress 6.6+',
    author: {
      id: 'author-2',
      name: 'نیلوفر مهرابی',
      role: 'طراح رابط کاربری و متخصص طراحی صفحات وب',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'علاقه‌مند به خلق تجربیات دیجیتال کاربرپسند، استانداردهای طراحی مینیمال و سیستم‌های دیزاین واکنش‌گرا.',
    },
    tutorialSteps: [
      {
        stepNumber: 1,
        title: 'فعال‌سازی ویژگی Flexbox Container در تنظیمات المنتور',
        description: 'به مسیر پیشخوان > المنتور > تنظیمات > امکانات رفته و گزینه Flexbox Container را روی حالت Active قرار دهید.',
      },
      {
        stepNumber: 2,
        title: 'تنظیم جهت چیدمان (Direction: Row vs Column)',
        description: 'انتخاب جهت افقی برای کارت‌ها در دسکتاپ و تغییر خودکار آن به عمودی در نمای موبایل تنها با یک کلیک.',
      },
      {
        stepNumber: 3,
        title: 'استفاده از Gap به جای Margin های منفی پیچیده',
        description: 'مدیریت فاصله بین المان‌ها به صورت یکپارچه با خاصیت استاندارد CSS Gap بدون شکستن ریسپانسیو.',
      }
    ],
    seo: {
      metaTitle: 'آموزش کامل کانتینر فلکس باکس در المنتور پرو | ردوبز',
      metaDescription: 'یادگیری کانتینرهای فلکس‌باکس در المنتور برای ساخت صفحات پرسرعت و ریسپانسیو با کمترین حجم کد HTML.',
      focusKeyword: 'کانتینر المنتور',
      canonicalUrl: 'https://redwebs.ir/article/elementor-pro-modern-flexbox-containers-mastery',
      robotsIndex: true,
      schemaType: 'HowTo',
    },
    content: `
کانتینرهای فلکس‌باکس (Flexbox Containers) بزرگ‌ترین تحول ساختاری در تاریخ المنتور محسوب می‌شوند. در ساختار قدیمی «بخش و ستون»، برای ساخت یک المان ساده گاهی بیش از ۱۰ لایه تگ \`<div>\` تو در تو تولید می‌شد که نمره عملکرد مرورگر را به دلیل پدیده **Excessive DOM Size** به شدت کاهش می‌داد.

---

## مزایای مهاجرت به کانتینرهای فلکس‌باکس

1. **کاهش چشمگیر حجم کدهای HTML:** صفحات تا ۵۰٪ سریع‌تر رندر می‌شوند.
2. **قدرت نامحدود در چیدمان ریسپانسیو:** تغییر ترتیب نمایش المان‌ها در موبایل (Order) بدون نیاز به دوبل کردن ویجت‌ها.
3. **امکان لینک‌دار کردن کل کانتینر (Wrapper Link):** تبدیل کل یک باکس با تصویر و متن به یک دکمه قابل کلیک بدون نیاز به اسکریپت اضافه.
4. **تراز کردن محوری آسان (Align Items & Justify Content):** کنترل دقیق بر قرارگیری المان‌ها در مرکز، ابتدا یا انتهای باکس.

\`\`\`css
/* معادل مدرن CSS کانتینرهای المنتور */
.redwebs-card-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .redwebs-card-container {
    flex-direction: column;
    align-items: stretch;
  }
}
\`\`\`

با به کارگیری صحیح این قابلیت، سایت‌های طراحی شده با المنتور سبک، تمیز و حرفه‌ای‌تر از همیشه خواهند بود.
    `
  },
  {
    id: 'post-3',
    slug: 'woocommerce-checkout-conversion-rate-optimization',
    title: 'بهینه‌سازی صفحه تسویه حساب ووکامرس (افزایش نرخ تبدیل فروشگاه)',
    excerpt: 'راهکارهای علمی برای کاهش رها شدن سبد خرید (Cart Abandonment). ساخت تسویه حساب تک‌مرحله‌ای، حذف فیلدهای اضافه و بهبود تجربه پرداخت موبایلی.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=1200&auto=format&fit=crop&q=80',
    coverImageAlt: 'بهینه‌سازی صفحه تسویه حساب ووکامرس و سبد خرید',
    categoryId: 'cat-woocommerce',
    tags: ['ووکامرس', 'فروشگاه اینترنتی', 'نرخ تبدیل', 'تسویه حساب', 'CRO', 'سبد خرید'],
    readingTimeMinutes: 8,
    publishDate: '2026-08-12T14:20:00Z',
    updatedAt: '2026-08-14T08:00:00Z',
    status: 'published',
    viewsCount: 2150,
    likesCount: 289,
    featured: false,
    contentType: 'guide',
    difficulty: 'all-levels',
    wpLevel: 'مقدماتی تا پیشرفته',
    wpPlugin: 'WooCommerce 9.0+',
    author: {
      id: 'author-3',
      name: 'سعید دانشیار',
      role: 'استراتژیست تجارت الکترونیک و متخصص ووکامرس',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'مشاور رشد بیش از ۵۰ فروشگاه آنلاین معتبر در زمینه بهینه‌سازی قیف فروش و تجربه مشتری.',
    },
    seo: {
      metaTitle: 'بهینه‌سازی صفحه تسویه حساب ووکامرس | ردوبز',
      metaDescription: 'چگونه نرخ تکمیل خرید ووکامرس را تا ۳۵٪ افزایش دهیم؟ آموزش حذف فیلدهای اضافه، تسویه تک مرحله‌ای و اعتمادسازی در فرآیند پرداخت.',
      focusKeyword: 'تسویه حساب ووکامرس',
      canonicalUrl: 'https://redwebs.ir/article/woocommerce-checkout-conversion-rate-optimization',
      robotsIndex: true,
      schemaType: 'Article',
    },
    content: `
بر اساس آمارهای جهانی تجارت الکترونیک، نزدیک به **۷۰٪ سبدهای خرید** قبل از پرداخت نهایی توسط مشتریان رها می‌شوند. یکی از دلایل اصلی این اتفاق، پیچیدگی و طولانی بودن فرم‌های صفحه تسویه حساب در ووکامرس است.

---

## ۱. حذف فیلدهای غیرضروری از فرم تسویه حساب

در حالت پیش‌فرض، ووکامرس فیلدهایی مثل «نام شرکت»، «آدرس خط دوم» و «کد پستی ۲» را درخواست می‌کند که برای بسیاری از فروشگاه‌های ایرانی نیازی به دریافت آن‌ها نیست.

با اضافه کردن کد سبک زیر به فایل \`functions.php\` قالب فرزند، فیلدهای غیرضروری را به راحتی حذف کنید:

\`\`\`php
/**
 * بهینه‌سازی و حذف فیلدهای اضافه تسویه حساب ووکامرس
 */
add_filter('woocommerce_checkout_fields', 'redwebs_optimize_checkout_fields');

function redwebs_optimize_checkout_fields($fields) {
    // حذف فیلدهای اختیاری که باعث سردرگمی مشتری می‌شوند
    unset($fields['billing']['billing_company']);
    unset($fields['billing']['billing_address_2']);
    unset($fields['billing']['billing_postcode']);
    
    // تغییر ترتیب و کلاس‌های استایل فیلدها
    $fields['billing']['billing_first_name']['class'] = array('form-row-first');
    $fields['billing']['billing_last_name']['class'] = array('form-row-last');
    
    return $fields;
}
\`\`\`

---

## ۲. اضافه کردن نشان‌های اعتماد و ضمانت بازگشت وجه

در کنار دکمه پرداخت نهایی، آیکون‌های نماد اعتماد، ضمانت اصالت کالا و پشتیبانی ۲۴ ساعته را قرار دهید تا تردیدهای خریدار در لحظه کلیک برطرف شود.
    `
  },
  {
    id: 'post-4',
    slug: 'technical-seo-schema-markup-rankmath-guide',
    title: 'سئو تکنیکال وردپرس: راهنمای عملی داده‌های ساختاریافته (Schema Markup)',
    excerpt: 'آموزش پیاده‌سازی اسکیماهای تخصصی HowTo، FAQPage، Article و Product با استفاده از Rank Math و کدهای دستی JSON-LD برای به دست آوردن Rich Snippets در نتایج گوگل.',
    coverImage: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=1200&auto=format&fit=crop&q=80',
    coverImageAlt: 'داده‌های ساختاریافته اسکیما و سئو تکنیکال در وردپرس',
    categoryId: 'cat-seo',
    tags: ['سئو تکنیکال', 'Schema Markup', 'JSON-LD', 'Rank Math', 'Rich Snippets', 'گوگل'],
    readingTimeMinutes: 10,
    publishDate: '2026-08-11T16:00:00Z',
    updatedAt: '2026-08-14T07:45:00Z',
    status: 'published',
    viewsCount: 3120,
    likesCount: 390,
    featured: false,
    contentType: 'tutorial',
    difficulty: 'advanced',
    wpLevel: 'پیشرفته',
    wpPlugin: 'Rank Math Pro',
    author: {
      id: 'author-1',
      name: 'آریا رادمنش',
      role: 'معمار ارشد سیستم و توسعه‌دهنده وب',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'بیش از یک دهه فعالیت در توسعه وب مدرن، بهینه‌سازی دیتابیس‌های پرترافیک و معماری سایت‌های بدون لگ.',
    },
    seo: {
      metaTitle: 'آموزش اسکیما مارک‌آپ و سئو تکنیکال وردپرس | ردوبز',
      metaDescription: 'راهنمای جامع پیاده‌سازی داده‌های ساختاریافته JSON-LD در وردپرس برای کسب ستاره‌ها و بخش‌های متمایز ریچ اسنیپت در نتایج جستجوی گوگل.',
      focusKeyword: 'اسکیما وردپرس',
      canonicalUrl: 'https://redwebs.ir/article/technical-seo-schema-markup-rankmath-guide',
      robotsIndex: true,
      schemaType: 'TechArticle',
    },
    content: `
داده‌های ساختاریافته (**Schema Markup**) زبان مشترک وب‌مسترها و ربات‌های هوش مصنوعی موتورهای جستجو است. با تعریف دقیق هویت مقاله، نویسنده، مراحل آموزش و سوالات متداول به صورت JSON-LD، موتور جستجوی گوگل می‌تواند محتوای شما را به عنوان پاسخ مستقیم و نتایج برجسته (Rich Results) به نمایش بگذارد.

---

## نمونه کد استاندارد Schema FAQPage به زبان JSON-LD

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "آیا اضافه کردن اسکیما مستقیماً رتبه سایت را افزایش می‌دهد؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "اسکیما عامل رتبه‌بندی مستقیم نیست، اما با افزایش چشمگیر نرخ کلیک (CTR) در نتایج، ترافیک ارگانیک و سیگنال‌های مثبت سایت را ارتقا می‌دهد."
      }
    }
  ]
}
\`\`\`

ردوبز این اسکیماها را به صورت خودکار برای تمامی مقالات و آموزش‌ها تولید کرده و در هدر صفحات تزریق می‌نماید.
    `
  },
  {
    id: 'post-5',
    slug: 'essential-wordpress-functions-php-snippets',
    title: '۱۰ اسنیپت طلایی و کاربردی functions.php (حذف نیاز به افزونه‌های سنگین)',
    excerpt: 'کدهای ناب PHP برای غیرفعال‌سازی XML-RPC، مخفی‌سازی نسخه وردپرس، خاموش کردن ایموجی‌های سنگین، بهبود امنیت و جلوگیری از حملات Brute Force.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    coverImageAlt: 'کدهای ضروری و کاربردی functions.php در وردپرس',
    categoryId: 'cat-web-dev',
    tags: ['PHP', 'functions.php', 'کدهای طلایی', 'توسعه وردپرس', 'امنیت', 'بهینه‌سازی'],
    readingTimeMinutes: 6,
    publishDate: '2026-08-10T11:00:00Z',
    updatedAt: '2026-08-13T18:00:00Z',
    status: 'published',
    viewsCount: 4200,
    likesCount: 512,
    featured: false,
    contentType: 'snippet',
    difficulty: 'intermediate',
    wpLevel: 'متوسط',
    author: {
      id: 'author-1',
      name: 'آریا رادمنش',
      role: 'معمار ارشد سیستم و توسعه‌دهنده وب',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'بیش از یک دهه فعالیت در توسعه وب مدرن، بهینه‌سازی دیتابیس‌های پرترافیک و معماری سایت‌های بدون لگ.',
    },
    seo: {
      metaTitle: '۱۰ اسنیپت کاربردی functions.php وردپرس | ردوبز',
      metaDescription: 'مجموعه کدهای آماده و بدون باگ برای فایل فانکشنز وردپرس جهت افزایش امنیت، سرعت و حذف افزونه‌های اضافه.',
      focusKeyword: 'اسنیپت functions.php',
      canonicalUrl: 'https://redwebs.ir/article/essential-wordpress-functions-php-snippets',
      robotsIndex: true,
      schemaType: 'TechArticle',
    },
    content: `
هر افزونه‌ای که روی وردپرس نصب می‌کنید، اسکریپت‌ها، استایل‌ها و کوئری‌های جدیدی به سایت اضافه می‌کند. در بسیاری از مواقع، می‌توان با قرار دادن چند خط کد ساده در فایل \`functions.php\` پوسته یا ساخت یک Must-Use Plugin، دقیقاً همان امکانات را بدون هیچ‌گونه افت سرعت پیاده‌سازی کرد.

---

### ۱. حذف متاتگ نسخه وردپرس جهت افزایش امنیت

\`\`\`php
// حذف نسخه وردپرس از سورس صفحه و فیدهای RSS
remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');
\`\`\`

### ۲. غیرفعال‌سازی اسکریپت‌های سنگین ایموجی

\`\`\`php
function redwebs_disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
}
add_action('init', 'redwebs_disable_emojis');
\`\`\`
    `
  },
  {
    id: 'post-6',
    slug: 'modern-persian-web-typography-system-guidelines',
    title: 'اصول تایپوگرافی فارسی در وب مدرن: انتخاب و بهینه‌سازی فونت‌ها',
    excerpt: 'راهنمای استاندارد انتخاب تایپ‌فیس‌های استاندارد فارسی، تنظیم خط پایه (Line-height)، بهینه‌سازی فرمت WOFF2 و بارگذاری زیر ۵۰ میلی‌ثانیه برای رابط کاربری خوانا و فاخر.',
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
    coverImageAlt: 'طراحی تایپوگرافی مدرن فارسی در وب‌سایت‌ها',
    categoryId: 'cat-web-design',
    tags: ['تایپوگرافی فارسی', 'UI/UX', 'طراحی وب', 'فونت وب', 'وزیرمتن', 'خوانایی'],
    readingTimeMinutes: 7,
    publishDate: '2026-08-09T09:30:00Z',
    updatedAt: '2026-08-14T06:00:00Z',
    status: 'published',
    viewsCount: 1890,
    likesCount: 230,
    featured: false,
    contentType: 'guide',
    difficulty: 'beginner',
    author: {
      id: 'author-2',
      name: 'نیلوفر مهرابی',
      role: 'طراح رابط کاربری و متخصص طراحی صفحات وب',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'علاقه‌مند به خلق تجربیات دیجیتال کاربرپسند، استانداردهای طراحی مینیمال و سیستم‌های دیزاین واکنش‌گرا.',
    },
    seo: {
      metaTitle: 'اصول تایپوگرافی فارسی در وب مدرن | ردوبز',
      metaDescription: 'آموزش جامع پیاده‌سازی تایپوگرافی استاندارد فارسی در طراحی سایت با فرمت WOFF2 و رعایت فواصل خوانایی.',
      focusKeyword: 'تایپوگرافی فارسی وب',
      canonicalUrl: 'https://redwebs.ir/article/modern-persian-web-typography-system-guidelines',
      robotsIndex: true,
      schemaType: 'Article',
    },
    content: `
تایپوگرافی بیش از ۹۰ درصد تجربه کاربری یک وب‌سایت محتوامحور را تشکیل می‌دهد. در زبان فارسی به دلیل تنوع کشیدگی حروف، اتصالات متنی و تفاوت‌های رندری در سیستم‌عامل‌های ویندوز، مک و اندروید، انتخاب دقیق فونت و نسبت خطوط اهمیت دوچندان پیدا می‌کند.

---

## فرمت WOFF2 و ساب‌ست‌سازی (Subsetting)

همیشه از فرمت مدرن **WOFF2** استفاده کنید که با الگوریتم فشرده‌سازی Brotli حجم فونت را تا ۳۰٪ نسبت به WOFF معمولی کاهش می‌دهد. همچنین با حذف گلیف‌های غیرضروری زبان‌های دیگر، فایل نهایی فونت معمولاً به کمتر از ۳۰ کیلوبایت می‌رسد.

\`\`\`css
/* استانداردهای طلایی تایپوگرافی ردوبز */
body {
  font-family: 'Vazirmatn', system-ui, sans-serif;
  line-height: 1.85;
  letter-spacing: -0.015em;
  font-feature-settings: "ss01", "ss02";
}
\`\`\`
    `
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    postId: 'post-1',
    authorName: 'محمدرضا کیانی',
    authorEmail: 'm.kiani@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    content: 'مقاله فوق‌العاده کاربردی و دقیقی بود! بعد از کانفیگ Redis طبق راهنمای ردوبز، لود صفحه محصول فروشگاهم از ۴ ثانیه به ۱.۱ ثانیه رسید. خسته نباشید به تیم پرتوان ردوبز.',
    createdAt: '2026-08-14T10:15:00Z',
    status: 'approved',
    likes: 18,
    replies: [
      {
        id: 'rep-1',
        authorName: 'آریا رادمنش',
        authorRole: 'مدیر محتوای ردوبز',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        content: 'بسیار خوشحالیم که این راهکار برای فروشگاه شما اثربخش بوده محمدرضا عزیز. موفق و پرفروش باشید!',
        createdAt: '2026-08-14T11:00:00Z',
      },
    ],
  },
  {
    id: 'comm-2',
    postId: 'post-2',
    authorName: 'الهام سلیمی',
    authorEmail: 'elham.salimi@yahoo.com',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    content: 'کانتینرهای فلکس باکس واقعاً المنتور رو نجات دادند. قبلا حجم کدهای خروجی خیلی سنگین بود اما الان با کانتینرها همه چیز مرتب و سبکه.',
    createdAt: '2026-08-13T16:40:00Z',
    status: 'approved',
    likes: 12,
  },
  {
    id: 'comm-3',
    postId: 'post-4',
    authorName: 'کامران عباسی',
    authorEmail: 'kamran.ab@outlook.com',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    content: 'سلام، آیا امکانش هست برای سایت‌های چندزبانه هم نمونه اسکیما بذارید؟ تشکر.',
    createdAt: '2026-08-14T13:20:00Z',
    status: 'pending',
    likes: 3,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteTitle: 'ردوبز | رسانه تخصصی آموزش وردپرس، توسعه و طراحی وب',
  siteTagline: 'یاد بگیرید. بسازید. رشد کنید.',
  siteDescription: 'ردوبز (Redwebs) — پلتفرم تخصصی و مستقل آموزش وردپرس، توسعه وب، المنتور، ووکامرس، سئو و ابزارهای کاربردی وب به زبان فارسی.',
  siteUrl: 'https://redwebs.ir',
  authorName: 'تیم مهندسی و تحریریه ردوبز',
  authorRole: 'رسانه تخصصی توسعه و مدیریت وب‌سایت',
  authorBio: 'هدف ردوبز ارتقای دانش فنی وب‌مسترها، طراحان و برنامه‌نویسان فارسی‌زبان با آموزش‌های کاربردی، عمیق و به‌روز است.',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  defaultOgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
  enableComments: true,
  autoApproveComments: false,
  postsPerPage: 9,
  headerLogoText: 'ردوبز',
  footerText: 'تمامی حقوق مادی و معنوی برای رسانه مستقل ردوبز (Redwebs) محفوظ است. تولید شده با اشتیاق برای جامعه وب فارسی.',
  contactEmail: 'hello@redwebs.ir',
  telegramUsername: 'redwebs_ir',
  githubUrl: 'https://github.com/redwebs',
  twitterUrl: 'https://twitter.com/redwebs_ir',
  instagramUrl: 'https://instagram.com/redwebs_ir',
  youtubeUrl: 'https://youtube.com/@redwebs_ir',
};

export const INITIAL_TOOLKIT_SNIPPETS: ToolkitSnippet[] = [
  {
    id: 'hide-version',
    title: 'پنهان‌سازی شماره نسخه وردپرس (جلوگیری از اسکن‌های امنیتی)',
    category: 'security',
    targetFile: 'functions.php',
    description: 'حذف متاتگ generator در هدر سایت برای جلوگیری از شناسایی آسیب‌پذیری‌های نسخه توسط ربات‌ها.',
    code: `// پنهان کردن شماره نسخه وردپرس از سورس کدهای هدر
remove_action('wp_head', 'wp_generator');

// حذف نسخه وردپرس از آدرس فایل‌های CSS و JS لود شده
function redwebs_remove_ver_css_js( $src ) {
    if ( strpos( $src, 'ver=' ) )
        $src = remove_query_arg( 'ver', $src );
    return $src;
}
add_filter( 'style_loader_src', 'redwebs_remove_ver_css_js', 9999 );
add_filter( 'script_loader_src', 'redwebs_remove_ver_css_js', 9999 );`,
    explanation: 'این کد را در انتهای فایل functions.php قالب فعال خود (ترجیحاً چایلدتم) قرار دهید.',
    sortOrder: 0,
  },
  {
    id: 'disable-xmlrpc',
    title: 'مسدودسازی کامل درخواست‌های فایل xmlrpc.php',
    category: 'security',
    targetFile: '.htaccess',
    description: 'جلوگیری از حملات Brute Force و DDoS از طریق پروتکل قدیمی XML-RPC.',
    code: `# مسدودسازی دسترسی به فایل xmlrpc.php
<Files xmlrpc.php>
Order Deny,Allow
Deny from all
</Files>`,
    explanation: 'این کد را در بالاترین سطر فایل .htaccess در روت اصلی هاست (public_html) قرار دهید.',
    sortOrder: 1,
  },
  {
    id: 'disable-file-edit',
    title: 'غیرفعال‌سازی ویرایشگر فایل‌های پوسته و افزونه از پیشخوان',
    category: 'security',
    targetFile: 'wp-config.php',
    description: 'جلوگیری از تزریق مستقیم کدهای شل و بدافزار در صورت نفوذ به حساب ادمین.',
    code: `// غیرفعال کردن ویرایشگر فایل‌ها در پیشخوان وردپرس
define('DISALLOW_FILE_EDIT', true);`,
    explanation: 'این خط را قبل از عبارت "That\'s all, stop editing! Happy publishing" در wp-config.php درج کنید.',
    sortOrder: 2,
  },
  {
    id: 'disable-emojis',
    title: 'حذف اسکریپت‌های سنگین ایموجی پیش‌فرض وردپرس',
    category: 'speed',
    targetFile: 'functions.php',
    description: 'کاهش ۲ ریکوئست اضافه به سرور و کم کردن حجم خروجی HTML برای افزایش چشمگیر سرعت.',
    code: `// حذف کدهای ایموجی وردپرس برای کاهش ریکوئست و بهینه‌سازی سرعت
function redwebs_cleanup_wp_emojis() {
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' );
    remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
    remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
}
add_action( 'init', 'redwebs_cleanup_wp_emojis' );`,
    explanation: 'با قرار دادن این کد در functions.php دیگر فایل‌های سنگین wp-emoji-release.min.js لود نمی‌شوند.',
    sortOrder: 3,
  },
  {
    id: 'increase-limits',
    title: 'افزایش سقف مموری لیمیت و زمان اجرای اسکریپت در وردپرس',
    category: 'speed',
    targetFile: 'wp-config.php',
    description: 'رفع خطای Fatal error: Allowed memory size of xxx bytes exhausted هنگام کار با المنتور و ووکامرس.',
    code: `// افزایش حافظه مجاز اجرایی PHP برای وردپرس و المنتور
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '1024M');`,
    explanation: 'این مقادیر به وردپرس اجازه می‌دهند تا سقف ۵۱۲ مگابایت از رم هاست برای پردازش‌های سنگین استفاده کند.',
    sortOrder: 4,
  },
  {
    id: 'custom-admin-login',
    title: 'تغییر آدرس و تایتل صفحه ورود پیشخوان (wp-login.php)',
    category: 'admin',
    targetFile: 'functions.php',
    description: 'برندسازی صفحه ورود به سایت با لینک وب‌سایت خودتان به جای لوگوی پیش‌فرض وردپرس.',
    code: `// تغییر لینک لوگوی صفحه ورود به آدرس صفحه اصلی سایت
add_filter( 'login_headerurl', function() {
    return home_url();
} );

// تغییر عنوان هاور لوگوی صفحه ورود
add_filter( 'login_headertext', function() {
    return get_bloginfo('name');
} );`,
    explanation: 'با این فیلترها، لینک صفحه لاگین به آدرس سایت شما تغییر خواهد یافت.',
    sortOrder: 5,
  },
  {
    id: 'redirect-https',
    title: 'ریدایرکت اجباری تمامی صفحات به HTTPS با کد امنیتی .htaccess',
    category: 'security',
    targetFile: '.htaccess',
    description: 'انتقال خودکار کاربران از پروتکل ناامن http به پروتکل امن دارای گواهینامه SSL.',
    code: `# ریدایرکت خودکار به پروتکل امن HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`,
    explanation: 'این کد را در ابتدای فایل .htaccess هاست قرار دهید.',
    sortOrder: 6,
  },
  {
    id: 'persian-woo-currency',
    title: 'تغییر متن دکمه خرید در محصولات ناموجود ووکامرس',
    category: 'woocommerce',
    targetFile: 'functions.php',
    description: 'نمایش پیام اطلاع‌رسانی دلخواه روی دکمه محصولات ناموجود در ووکامرس.',
    code: `// تغییر متن دکمه محصولات ناموجود در ووکامرس
add_filter( 'woocommerce_product_add_to_cart_text', function( $text, $product ) {
    if ( ! $product->is_in_stock() ) {
        return __( 'اطلاع به من هنگام موجودی', 'woocommerce' );
    }
    return $text;
}, 10, 2 );`,
    explanation: 'این قطعه کد تجربه کاربری مشتریان را هنگام مشاهده محصولات ناموجود بهبود می‌بخشد.',
    sortOrder: 7,
  },
];

export const INITIAL_TOOLKIT_CHECKLIST: ToolkitChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'سئو و پیکربندی',
    title: 'غیرفعال کردن تیک "نمایش به موتورهای جستجو" در بخش تنظیمات > خواندن',
    description: 'مطمئن شوید که تیک noindex از روی سایت برداشته شده تا گوگل بتواند صفحات را ایندکس کند.',
    sortOrder: 0,
  },
  {
    id: 'chk-2',
    category: 'سئو و پیکربندی',
    title: 'تنظیم ساختار پیوندهای یکتا روی نام نوشته (Post Name)',
    description: 'در بخش تنظیمات > پیوندهای یکتا، گزینه /%postname%/ را برای آدرس‌های سئوبیس انتخاب کنید.',
    sortOrder: 1,
  },
  {
    id: 'chk-3',
    category: 'سرعت و عملکرد',
    title: 'فعال‌سازی فشرده‌سازی Gzip و کش سمت مرورگر در .htaccess یا لایت‌اسپید',
    description: 'فشرده‌سازی کدهای CSS و JS تا ۷۰٪ حجم انتقالی فایل‌ها را کاهش می‌دهد.',
    sortOrder: 2,
  },
  {
    id: 'chk-4',
    category: 'سرعت و عملکرد',
    title: 'تبدیل و بهینه‌سازی فرمت تمامی تصاویر سایت به WebP یا AVIF',
    description: 'استفاده از فرمت‌های نسل جدید تصاویر برای دستیابی به امتیاز سبز در Google PageSpeed.',
    sortOrder: 3,
  },
  {
    id: 'chk-5',
    category: 'امنیت و پشتیبان',
    title: 'تغییر نام کاربری admin و فعال‌سازی تایید دو مرحله‌ای (2FA)',
    description: 'جلوگیری از ۹۹٪ حملات جستجوی فراگیر (Brute-force) روی صفحه ورود پیشخوان.',
    sortOrder: 4,
  },
  {
    id: 'chk-6',
    category: 'امنیت و پشتیبان',
    title: 'تنظیم مجوزهای دسترسی امن (Permissions 644 برای فایل‌ها و 755 برای پوشه‌ها)',
    description: 'تنظیم پرمیشن‌های فایل wp-config.php روی 400 یا 440 جهت جلوگیری از خواندن محتوا.',
    sortOrder: 5,
  },
  {
    id: 'chk-7',
    category: 'ابزارها و آمار',
    title: 'اتصال سایت به Google Search Console و Google Analytics 4',
    description: 'ثبت سایت‌مپ XML ایجاد شده توسط افزونه سئو در سرچ کنسول گوگل.',
    sortOrder: 6,
  },
  {
    id: 'chk-8',
    category: 'امنیت و پشتیبان',
    title: 'راه‌اندازی پشتیبان‌گیری خودکار هفتگی در فضای ابری (UpdraftPlus یا سرور)',
    description: 'ارسال خودکار بک‌آپ فایل‌ها و پایگاه داده به Google Drive یا S3 Storage.',
    sortOrder: 7,
  },
];
