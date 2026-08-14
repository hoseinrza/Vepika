import { Article, SeoAnalysisResult, SeoCheckItem } from '../types';

/**
 * Real-time SEO analysis engine for Persian content
 */
export function analyzeArticleSeo(article: Partial<Article>): SeoAnalysisResult {
  const checks: SeoCheckItem[] = [];
  const keyword = (article.seo?.focusKeyword || '').trim().toLowerCase();
  const title = (article.title || '').trim();
  const metaTitle = (article.seo?.metaTitle || title).trim();
  const metaDesc = (article.seo?.metaDescription || article.excerpt || '').trim();
  const content = (article.content || '').trim();
  const contentLower = content.toLowerCase();

  // 1. Meta Title Length
  const titleLen = metaTitle.length;
  if (titleLen >= 35 && titleLen <= 65) {
    checks.push({
      id: 'title-length',
      label: 'طول عنوان سئو (Meta Title)',
      passed: true,
      score: 100,
      advice: `طول عنوان (${titleLen} کاراکتر) استاندارد و ایده‌آل است.`,
      detail: `${titleLen} کاراکتر (محدوده مناسب: ۳۵ تا ۶۵)`,
    });
  } else if (titleLen > 0 && titleLen < 35) {
    checks.push({
      id: 'title-length',
      label: 'طول عنوان سئو (Meta Title)',
      passed: false,
      score: 50,
      advice: `عنوان سئو کوتاه است (${titleLen} کاراکتر). سعی کنید حداقل به ۳۵ کاراکتر برسانید.`,
      detail: `${titleLen} کاراکتر`,
    });
  } else {
    checks.push({
      id: 'title-length',
      label: 'طول عنوان سئو (Meta Title)',
      passed: false,
      score: 40,
      advice: `عنوان سئو خیلی بلند است (${titleLen} کاراکتر) و ممکن است در گوگل بریده شود.`,
      detail: `${titleLen} کاراکتر`,
    });
  }

  // 2. Meta Description Length
  const descLen = metaDesc.length;
  if (descLen >= 120 && descLen <= 165) {
    checks.push({
      id: 'desc-length',
      label: 'طول توضیحات متا (Meta Description)',
      passed: true,
      score: 100,
      advice: `طول توضیحات متا (${descLen} کاراکتر) در بازه بهینه گوگل قرار دارد.`,
      detail: `${descLen} کاراکتر (محدوده مناسب: ۱۲۰ تا ۱۶۵)`,
    });
  } else if (descLen > 0 && descLen < 120) {
    checks.push({
      id: 'desc-length',
      label: 'طول توضیحات متا (Meta Description)',
      passed: false,
      score: 60,
      advice: `توضیحات متا کوتاه است (${descLen} کاراکتر). توضیحات جامع‌تر بنویسید تا نرخ کلیک افزایش یابد.`,
      detail: `${descLen} کاراکتر`,
    });
  } else if (descLen > 165) {
    checks.push({
      id: 'desc-length',
      label: 'طول توضیحات متا (Meta Description)',
      passed: false,
      score: 55,
      advice: `توضیحات متا بیش از حد مجاز است (${descLen} کاراکتر) و انتهای آن در نتایج جستجو سه نقطه می‌شود.`,
      detail: `${descLen} کاراکتر`,
    });
  } else {
    checks.push({
      id: 'desc-length',
      label: 'طول توضیحات متا (Meta Description)',
      passed: false,
      score: 0,
      advice: 'توضیحات متا خالی است! حتماً یک چکیده جذاب برای جلب توجه کاربران بنویسید.',
      detail: '۰ کاراکتر',
    });
  }

  // 3. Focus Keyword Defined
  if (!keyword) {
    checks.push({
      id: 'keyword-defined',
      label: 'کلمه کلیدی کانونی',
      passed: false,
      score: 0,
      advice: 'کلمه کلیدی کانونی را در بخش سئو مشخص کنید تا بررسی دقیق‌تری انجام شود.',
      detail: 'مشخص نشده',
    });
  } else {
    checks.push({
      id: 'keyword-defined',
      label: 'کلمه کلیدی کانونی',
      passed: true,
      score: 100,
      advice: `کلمه کلیدی کانونی «${keyword}» تنظیم شده است.`,
      detail: keyword,
    });

    // 4. Keyword in Title
    const keywordInTitle = metaTitle.toLowerCase().includes(keyword) || title.toLowerCase().includes(keyword);
    checks.push({
      id: 'keyword-in-title',
      label: 'کلمه کلیدی در عنوان اصلی و سئو',
      passed: keywordInTitle,
      score: keywordInTitle ? 100 : 0,
      advice: keywordInTitle
        ? 'کلمه کلیدی در عنوان مقاله وجود دارد.'
        : `حتماً کلمه کلیدی «${keyword}» را در ابتدای عنوان مقاله بگنجانید.`,
      detail: keywordInTitle ? 'موجود' : 'یافت نشد',
    });

    // 5. Keyword in Meta Description
    const keywordInDesc = metaDesc.toLowerCase().includes(keyword);
    checks.push({
      id: 'keyword-in-desc',
      label: 'کلمه کلیدی در توضیحات متا',
      passed: keywordInDesc,
      score: keywordInDesc ? 100 : 20,
      advice: keywordInDesc
        ? 'کلمه کلیدی در توضیحات متا قرار دارد.'
        : `توصیه می‌شود کلمه کلیدی «${keyword}» را در توضیحات متا به کار ببرید.`,
      detail: keywordInDesc ? 'موجود' : 'یافت نشد',
    });

    // 6. Keyword Density in Content
    const words = content.split(/\s+/).filter(Boolean);
    const totalWords = words.length;
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = (contentLower.match(regex) || []).length;
    const density = totalWords > 0 ? (matches / totalWords) * 100 : 0;

    if (matches > 0 && density >= 0.8 && density <= 3.5) {
      checks.push({
        id: 'keyword-density',
        label: 'تراکم کلمه کلیدی در محتوا',
        passed: true,
        score: 100,
        advice: `تراکم کلمه کلیدی مناسب است (${matches} بار تکرار - ${density.toFixed(1)}٪)`,
        detail: `${density.toFixed(1)}٪ (${matches} بار)`,
      });
    } else if (matches === 0) {
      checks.push({
        id: 'keyword-density',
        label: 'تراکم کلمه کلیدی در محتوا',
        passed: false,
        score: 10,
        advice: `کلمه کلیدی «${keyword}» در متن مقاله یافت نشد!`,
        detail: '۰ بار',
      });
    } else {
      checks.push({
        id: 'keyword-density',
        label: 'تراکم کلمه کلیدی در محتوا',
        passed: density <= 4,
        score: 60,
        advice: density > 3.5 ? 'تراکم کلمه کلیدی بالاست (خطر Keyword Stuffing)' : 'تعداد تکرار کلمه کلیدی اندکی کم است.',
        detail: `${density.toFixed(1)}٪ (${matches} بار)`,
      });
    }
  }

  // 7. Content Word Count
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  if (wordCount >= 600) {
    checks.push({
      id: 'word-count',
      label: 'حجم محتوای آموزشی',
      passed: true,
      score: 100,
      advice: `حجم مقاله عالی است (${wordCount} کلمه). مقالات جامع شانس رتبه بهتری در گوگل دارند.`,
      detail: `${wordCount} کلمه`,
    });
  } else if (wordCount >= 250) {
    checks.push({
      id: 'word-count',
      label: 'حجم محتوای آموزشی',
      passed: true,
      score: 75,
      advice: `حجم مقاله قابل قبول است (${wordCount} کلمه). برای تبدیل به مقاله جامع، بخش‌های بیشتری اضافه کنید.`,
      detail: `${wordCount} کلمه`,
    });
  } else {
    checks.push({
      id: 'word-count',
      label: 'حجم محتوای آموزشی',
      passed: false,
      score: 30,
      advice: `محتوا بسیار کوتاه است (${wordCount} کلمه). حداقل ۳۰۰ تا ۵۰۰ کلمه محتوای آموزشی بنویسید.`,
      detail: `${wordCount} کلمه`,
    });
  }

  // 8. Headings (H2 / H3)
  const hasH2 = /^##\s+/m.test(content) || /<h2/i.test(content);
  const hasH3 = /^###\s+/m.test(content) || /<h3/i.test(content);
  if (hasH2 && hasH3) {
    checks.push({
      id: 'headings-hierarchy',
      label: 'ساختار تیترها (H2 و H3)',
      passed: true,
      score: 100,
      advice: 'ساختار سرفصل‌ها و تیترها به درستی تفکیک شده است.',
      detail: 'H2 و H3 موجود است',
    });
  } else if (hasH2) {
    checks.push({
      id: 'headings-hierarchy',
      label: 'ساختار تیترها (H2)',
      passed: true,
      score: 80,
      advice: 'تیترهای اصلی H2 دارید؛ پیشنهاد می‌شود زیرعنوان‌های H3 نیز اضافه کنید.',
      detail: 'فقط H2 موجود است',
    });
  } else {
    checks.push({
      id: 'headings-hierarchy',
      label: 'ساختار تیترها',
      passed: false,
      score: 20,
      advice: 'در متن مقاله از تیترهای H2 (با ##) برای دسته‌بندی موضوعات استفاده کنید.',
      detail: 'تیتر یافت نشد',
    });
  }

  // 9. Schema Markup & FAQ
  const hasSchema = Boolean(article.seo?.schemaType);
  const hasFaq = Boolean(article.seo?.faqItems && article.seo.faqItems.length > 0);
  if (hasSchema && hasFaq) {
    checks.push({
      id: 'schema-faq',
      label: 'اسکیما و سوالات متداول (FAQ Schema)',
      passed: true,
      score: 100,
      advice: `نوع اسکیما (${article.seo?.schemaType}) همراه با سوالات متداول برای نمایش ریچ اسنیپت تنظیم شده است.`,
      detail: `${article.seo?.faqItems?.length} سوال متداول`,
    });
  } else if (hasSchema) {
    checks.push({
      id: 'schema-faq',
      label: 'اسکیما داده‌های ساختاریافته',
      passed: true,
      score: 85,
      advice: `اسکیما ${article.seo?.schemaType} فعال است. افزودن بخش FAQ رتبه را جذاب‌تر می‌کند.`,
      detail: article.seo?.schemaType,
    });
  } else {
    checks.push({
      id: 'schema-faq',
      label: 'اسکیما استراکچر دیتای گوگل',
      passed: false,
      score: 0,
      advice: 'نوع اسکیما مشخص نشده است.',
      detail: 'غیرفعال',
    });
  }

  // Calculate Weighted Score
  const totalScore = Math.round(checks.reduce((acc, curr) => acc + curr.score, 0) / checks.length);

  let grade: 'عالی' | 'خوب' | 'نیاز به بهبود' | 'ضعیف' = 'ضعیف';
  let color = 'text-red-500';

  if (totalScore >= 85) {
    grade = 'عالی';
    color = 'text-emerald-600';
  } else if (totalScore >= 70) {
    grade = 'خوب';
    color = 'text-amber-600';
  } else if (totalScore >= 50) {
    grade = 'نیاز به بهبود';
    color = 'text-orange-500';
  }

  return {
    score: totalScore,
    grade,
    color,
    checks,
  };
}

/**
 * Persian Date Formatter
 */
export function formatPersianDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch (e) {
    return dateString;
  }
}

/**
 * Persian Number Formatter
 */
export function toPersianDigits(num: number | string): string {
  if (num === undefined || num === null) return '';
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => faDigits[+w]);
}
