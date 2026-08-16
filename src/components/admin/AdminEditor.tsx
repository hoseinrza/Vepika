import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowRight,
  Eye,
  Sparkles,
  Search,
  Code,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Globe,
  FileText,
  Clock,
  Layers,
  Wand2,
  RefreshCw,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { Article, Category, FAQItem, SchemaType, SiteSettings } from '../../types';
import { analyzeArticleSeo, toPersianDigits } from '../../utils/seoAnalyzer';
import { generateArticleSchema } from '../../utils/schemaGenerator';

interface AdminEditorProps {
  article: Article | null;
  categories: Category[];
  settings: SiteSettings;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

export const AdminEditor: React.FC<AdminEditorProps> = ({
  article,
  categories,
  settings,
  onSave,
  onCancel,
}) => {
  const isNew = !article || article.id === 'new';

  // Editor Tabs: 'content' | 'seo' | 'schema' | 'preview'
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'schema' | 'preview'>('content');

  // Form State
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [coverImage, setCoverImage] = useState(
    article?.coverImage ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80'
  );
  const [coverImageAlt, setCoverImageAlt] = useState(article?.coverImageAlt || '');
  const [categoryId, setCategoryId] = useState(
    article?.categoryId || (categories[0] ? categories[0].id : '')
  );
  const [tagsInput, setTagsInput] = useState((article?.tags || []).join('، '));
  const [readingTime, setReadingTime] = useState(article?.readingTimeMinutes || 5);
  const [status, setStatus] = useState<'published' | 'draft'>(article?.status || 'published');
  const [featured, setFeatured] = useState(article?.featured || false);
  const [wpLevel, setWpLevel] = useState(article?.wpLevel || 'مقدماتی تا پیشرفته');
  const [wpPlugin, setWpPlugin] = useState(article?.wpPlugin || '');
  const [wpVersion, setWpVersion] = useState(article?.wpVersion || '6.5+');

  // SEO & Schema State
  const [metaTitle, setMetaTitle] = useState(article?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(article?.seo?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(article?.seo?.focusKeyword || '');
  const [canonicalUrl, setCanonicalUrl] = useState(article?.seo?.canonicalUrl || '');
  const [robotsIndex, setRobotsIndex] = useState(article?.seo?.robotsIndex !== false);
  const [schemaType, setSchemaType] = useState<SchemaType>(article?.seo?.schemaType || 'BlogPosting');
  const [faqItems, setFaqItems] = useState<FAQItem[]>(
    article?.seo?.faqItems || [
      {
        id: 'faq-1',
        question: 'مهم‌ترین دستاورد این آموزش برای مخاطب چیست؟',
        answer: 'یادگیری اصول استاندارد و پیاده‌سازی گام‌به‌گام در پروژه‌های عملی.',
      },
    ]
  );

  // AI Loading state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Auto-calculate reading time based on Persian word count
  useEffect(() => {
    const words = content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    setReadingTime(minutes);
  }, [content]);

  // Auto generate slug from title if empty
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug || isNew) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);
      setSlug(generated);
    }
  };

  // Construct temporary article object for real-time SEO scoring
  const currentArticleData: Partial<Article> = {
    title,
    slug,
    content,
    excerpt,
    categoryId,
    tags: tagsInput.split(/[,،]/).map((t) => t.trim()).filter(Boolean),
    readingTimeMinutes: readingTime,
    seo: {
      metaTitle: metaTitle || `${title} | ${settings.siteTitle}`,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      canonicalUrl,
      robotsIndex,
      schemaType,
      faqItems,
    },
  };

  const seoScoreResult = analyzeArticleSeo(currentArticleData);

  // AI SEO Auto-Generator
  const handleGenerateAiSeo = async () => {
    setAiGenerating(true);
    setAiMessage(null);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId)?.name || 'آموزش';
      const res = await fetch('/api/gemini/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category: selectedCategory,
          focusKeyword,
        }),
      });

      const data = await res.json();
      if (data.metaTitle) setMetaTitle(data.metaTitle);
      if (data.metaDescription) setMetaDescription(data.metaDescription);
      if (data.focusKeyword && !focusKeyword) setFocusKeyword(data.focusKeyword);
      if (data.slug && (!slug || isNew)) setSlug(data.slug);
      if (data.tags && data.tags.length > 0) setTagsInput(data.tags.join('، '));
      if (data.faqs && Array.isArray(data.faqs)) {
        setFaqItems(
          data.faqs.map((f: any, i: number) => ({
            id: `faq-${Date.now()}-${i}`,
            question: f.question,
            answer: f.answer,
          }))
        );
      }

      setAiMessage(
        data.aiEnhanced
          ? '✨ سئو و اسکیما با هوش مصنوعی جمینای با موفقیت تحلیل و تولید شد!'
          : '⚡ اطلاعات سئو و اسکیما بر اساس تحلیل محتوا تنظیم شد.'
      );
      setTimeout(() => setAiMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setAiMessage('خطا در تولید سئو خودکار');
    } finally {
      setAiGenerating(false);
    }
  };

  // AI Outline generator
  const handleGenerateAiOutline = async () => {
    if (!title.trim()) {
      alert('لطفاً ابتدا عنوان مقاله را وارد کنید.');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/assist-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: title,
          action: 'generate-outline',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setContent((prev) => (prev ? `${prev}\n\n${data.result}` : data.result));
        setAiMessage('سرفصل‌های پیشنهادی به متن اضافه شد.');
        setTimeout(() => setAiMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Insert markdown tag helper
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = before + (selectedText || 'متن نمونه') + after;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + replacement.length - after.length);
    }, 50);
  };

  // FAQ management
  const addFaqItem = () => {
    setFaqItems([
      ...faqItems,
      {
        id: `faq-${Date.now()}`,
        question: 'عنوان سوال متداول جدید...',
        answer: 'پاسخ دقیق و خلاصه به این سوال...',
      },
    ]);
  };

  const updateFaqItem = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqItems(
      faqItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteFaqItem = (id: string) => {
    setFaqItems(faqItems.filter((item) => item.id !== id));
  };

  // Save handler
  const handleSaveArticle = () => {
    if (!title.trim()) {
      alert('لطفاً عنوان مقاله را وارد کنید.');
      return;
    }

    const tags = tagsInput
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const savedArticle: Article = {
      id: isNew ? `post-${Date.now()}` : article!.id,
      slug: slug.trim() || `article-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.slice(0, 150),
      coverImage: coverImage.trim(),
      coverImageAlt: coverImageAlt.trim() || title,
      categoryId,
      tags,
      readingTimeMinutes: readingTime,
      publishDate: article?.publishDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
      viewsCount: article?.viewsCount || 0,
      likesCount: article?.likesCount || 0,
      featured,
      wpLevel: wpLevel.trim(),
      wpPlugin: wpPlugin.trim(),
      wpVersion: wpVersion.trim(),
      author: article?.author || {
        id: 'author-admin',
        name: settings.authorName,
        role: settings.authorRole,
        avatar: settings.authorAvatar,
        bio: settings.authorBio,
      },
      seo: {
        metaTitle: metaTitle.trim() || `${title} | ${settings.siteTitle}`,
        metaDescription: metaDescription.trim() || excerpt.trim() || content.slice(0, 150),
        focusKeyword: focusKeyword.trim(),
        canonicalUrl: canonicalUrl.trim(),
        robotsIndex,
        schemaType,
        faqItems,
      },
    };

    onSave(savedArticle);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="بازگشت بدون ذخیره"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-lalezar text-2xl text-stone-900 leading-none">
              {isNew ? 'نگارش و انتشار مقاله جدید' : 'ویرایش مقاله و بهینه‌سازی سئو'}
            </h2>
            <span className="text-xs text-stone-500 mt-1 block">
              {title ? title : 'عنوان هنوز وارد نشده است'}
            </span>
          </div>
        </div>

        {/* Right Actions: Status & Save */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Status Select */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-3 py-2 bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-hidden cursor-pointer"
          >
            <option value="published">وضعیت: انتشار عمومی</option>
            <option value="draft">وضعیت: پیش‌نویس خصوصی</option>
          </select>

          {/* Save Button */}
          <button
            onClick={handleSaveArticle}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            id="admin-save-article-btn"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره و انتشار</span>
          </button>
        </div>
      </div>

      {/* AI Notification Banner if any */}
      {aiMessage && (
        <div className="p-3.5 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{aiMessage}</span>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 sm:px-6 gap-2 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'content'
                ? 'bg-white border-t-2 border-amber-500 text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>۱. محتوا و نگارش مقاله</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-white border-t-2 border-amber-500 text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-4 h-4 text-purple-600" />
            <span>۲. تنظیمات سئو و متاتگ‌ها</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                seoScoreResult.score >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {toPersianDigits(seoScoreResult.score)}٪
            </span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-white border-t-2 border-amber-500 text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code className="w-4 h-4 text-red-600" />
            <span>۳. اسکیما خودکار و سوالات FAQ</span>
            {faqItems.length > 0 && (
              <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full font-bold">
                {toPersianDigits(faqItems.length)} سوال
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white border-t-2 border-amber-500 text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>۴. پیش‌نمایش زنده لاله‌زار</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6">
          {/* TAB 1: CONTENT & WRITING */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    عنوان اصلی مقاله (با فونت لاله‌زار نمایش داده می‌شود) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="مثال: راهنمای گام‌به‌گام طراحی سیستم‌های نوین فرانت‌اند..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:border-amber-500 focus:outline-hidden font-lalezar text-lg"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    نامک یکتا (Slug URL)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="frontend-architecture-guide"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
                  />
                </div>
              </div>

              {/* Category, Tags, Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    دسته‌بندی موضوعی
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:border-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    برچسب‌ها (با ویرگول یا کاما جدا کنید)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="وردپرس، سرعت، ووکامرس"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    تخمین زمان مطالعه (دقیقه)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={readingTime}
                      onChange={(e) => setReadingTime(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:border-amber-500 focus:outline-hidden"
                    />
                    <span className="text-xs text-stone-500 shrink-0">دقیقه</span>
                  </div>
                </div>
              </div>

              {/* WordPress Tutorial Attributes */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-amber-950 mb-1">
                    سطح دوره / آموزش وردپرس
                  </label>
                  <select
                    value={wpLevel}
                    onChange={(e) => setWpLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-stone-800 focus:border-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="مقدماتی">مقدماتی (شروع از صفر)</option>
                    <option value="متوسط">متوسط (کاربردی)</option>
                    <option value="پیشرفته">پیشرفته (کدنویسی و مهندسی)</option>
                    <option value="مقدماتی تا پیشرفته">مقدماتی تا پیشرفته (جامع)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-950 mb-1">
                    پلاگین / ابزار مرتبط (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={wpPlugin}
                    onChange={(e) => setWpPlugin(e.target.value)}
                    placeholder="مثال: Rank Math Pro, LiteSpeed Cache"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-stone-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-950 mb-1">
                    حداقل نسخه وردپرس
                  </label>
                  <input
                    type="text"
                    value={wpVersion}
                    onChange={(e) => setWpVersion(e.target.value)}
                    placeholder="مثال: 6.5+"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-stone-800 focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
                  />
                </div>
              </div>

              {/* Cover Image URL & Featured Check */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    آدرس تصویر شاخص (Cover Image URL)
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
                  />
                </div>

                <div className="md:col-span-4 flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded border-stone-300 focus:ring-amber-400"
                    />
                    <span>نمایش به عنوان مقاله ویژه صفحه نخست</span>
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  چکیده کوتاه مقاله (برای کارت‌ها و توضیحات اولیه)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="خلاصه‌ای دو یا سه خطی و جذاب از مهم‌ترین دستاوردهای این مطلب آموزشی..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                ></textarea>
              </div>

              {/* Markdown Content Editor with Persian Toolbar */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <label className="text-xs font-bold text-stone-800">
                    متن اصلی مقاله (فرمت استاندارد مارک‌داون) <span className="text-red-500">*</span>
                  </label>

                  {/* AI Writing Assistant Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={aiGenerating}
                      onClick={handleGenerateAiOutline}
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
                    >
                      {aiGenerating ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      <span>پیشنهاد سرفصل با هوش مصنوعی</span>
                    </button>
                  </div>
                </div>

                {/* Toolbar Buttons */}
                <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1.5 rounded-xl text-xs text-stone-700">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ')}
                    className="px-2.5 py-1 hover:bg-white rounded font-bold cursor-pointer"
                    title="تیتر اصلی H2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('### ')}
                    className="px-2.5 py-1 hover:bg-white rounded font-bold cursor-pointer"
                    title="زیرعنوان H3"
                  >
                    H3
                  </button>
                  <span className="w-px h-4 bg-stone-300 mx-1"></span>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="متن ضخیم (Bold)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="متن مورب (Italic)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('> ')}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="نقل‌قول (Quote)"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-stone-300 mx-1"></span>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ')}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="لیست بالت‌دار"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('```typescript\n', '\n```')}
                    className="px-2 py-1 hover:bg-white rounded font-mono text-[11px] cursor-pointer"
                    title="بلاک کد (Code Block)"
                  >
                    &lt;/&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('[عنوان لینک](', 'https://...)')}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="درج پیوند"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('![توضیح تصویر](', 'https://...)')}
                    className="p-1 hover:bg-white rounded cursor-pointer"
                    title="درج تصویر"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  id="article-content-textarea"
                  rows={14}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="متن مقاله آموزشی را با رعایت سرفصل‌های H2 و H3 و کدهای نمونه اینجا بنویسید..."
                  className="w-full p-4 bg-stone-50 border border-stone-300 rounded-xl text-sm leading-relaxed focus:border-amber-500 focus:outline-hidden font-sans"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 2: SEO SETTINGS & ANALYSIS */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* AI SEO Generator Bar */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="font-lalezar text-lg text-purple-950">
                      تولید و بهینه‌سازی هوشمند سئو با هوش مصنوعی (Gemini)
                    </span>
                  </div>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    با یک کلیک، عنوان جذاب سئو، توضیحات متای استاندارد گوگل، کلمات کلیدی و سوالات متداول تولید می‌شود.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleGenerateAiSeo}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  {aiGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  <span>تولید خودکار سئو و متاتگ‌ها</span>
                </button>
              </div>

              {/* SEO Score & Actionable Checklist */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-lalezar text-xl text-stone-900">آنالیز زنده وضعیت سئو</h3>
                    <span className="text-xs text-stone-500">(ارزیابی بر اساس الگوریتم‌های رتبه‌بندی محتوا)</span>
                  </div>
                  <div
                    className={`text-base font-bold px-3 py-1 rounded-xl ${
                      seoScoreResult.score >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : seoScoreResult.score >= 60
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    امتیاز: {toPersianDigits(seoScoreResult.score)} از ۱۰۰ ({seoScoreResult.grade})
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      seoScoreResult.score >= 80
                        ? 'bg-emerald-500'
                        : seoScoreResult.score >= 60
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${seoScoreResult.score}%` }}
                  ></div>
                </div>

                {/* Check list items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                  {seoScoreResult.checks.map((check) => (
                    <div
                      key={check.id}
                      className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-start gap-2.5 text-xs"
                    >
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{check.label}</span>
                          {check.detail && (
                            <span className="text-[10px] text-stone-400 font-normal">
                              ({check.detail})
                            </span>
                          )}
                        </div>
                        <p className="text-stone-500 leading-relaxed">{check.advice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Inputs Form */}
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200">
                {/* Focus Keyword */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    کلمه کلیدی کانونی (Focus Keyword)
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="مثال: طراحی رابط کاربری مینیمال"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                {/* Meta Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      عنوان سئو (Meta Title)
                    </label>
                    <span
                      className={`text-[11px] font-bold ${
                        (metaTitle || title).length >= 35 && (metaTitle || title).length <= 65
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {toPersianDigits((metaTitle || title).length)} از ۶۵ کاراکتر
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title ? `${title} | ${settings.siteTitle}` : 'عنوان جذاب سئو برای نمایش در گوگل...'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      توضیحات متا (Meta Description)
                    </label>
                    <span
                      className={`text-[11px] font-bold ${
                        (metaDescription || excerpt).length >= 120 && (metaDescription || excerpt).length <= 165
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {toPersianDigits((metaDescription || excerpt).length)} از ۱۶۵ کاراکتر
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder={excerpt || 'توضیحات جامع و دعوت‌کننده به کلیک در نتایج گوگل (بین ۱۲۰ تا ۱۶۰ کاراکتر)...'}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
                  ></textarea>
                </div>

                {/* Canonical & Robots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      آدرس کانونیکال (Canonical URL اختیاری)
                    </label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder={`${settings.siteUrl}/article/${slug || 'slug'}`}
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={robotsIndex}
                        onChange={(e) => setRobotsIndex(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                      />
                      <span>اجازه به ربات‌های جستجو برای ایندکس صفحه (index, follow)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Google SERP Snippet Preview */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-700 mb-2">
                  پیش‌نمایش بصری نتایج جستجوی گوگل (Google SERP Preview):
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-1 text-right">
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[9px] font-bold">
                      ل
                    </div>
                    <span>{settings.siteTitle}</span>
                    <span className="text-stone-400">› article › {slug || 'article-slug'}</span>
                  </div>
                  <h4 className="text-base text-red-800 font-medium hover:underline cursor-pointer">
                    {metaTitle || (title ? `${title} | ${settings.siteTitle}` : 'عنوان سئو مقاله')}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {metaDescription || excerpt || 'توضیحات متای مقاله در این بخش نمایش داده می‌شود...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA & FAQ */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              {/* Schema Type Selector */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="font-lalezar text-xl text-stone-900">
                  انتخاب ساختار اسکیما استراکچردیتا (Schema.org Type)
                </h3>
                <p className="text-xs text-stone-500">
                  موتور جستجوی گوگل نوع محتوای صفحه را با این تگ تشخیص می‌دهد.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {(['BlogPosting', 'Article', 'TechArticle', 'FAQPage'] as SchemaType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSchemaType(type)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        schemaType === type
                          ? 'bg-amber-500 border-amber-600 text-stone-950 shadow-xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic FAQ Builder */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-lalezar text-xl text-stone-900">
                      سوالات متداول مقاله (FAQ Schema Builder)
                    </h3>
                    <p className="text-xs text-stone-500">
                      این سوالات به صورت خودکار به اسکیما FAQPage تبدیل شده و در نتایج گوگل ریچ اسنیپت آکاردئونی ایجاد می‌کنند.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن سوال جدید</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {faqItems.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800">
                          سوال {toPersianDigits(index + 1)}:
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteFaqItem(faq.id)}
                          className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                          title="حذف سوال"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaqItem(faq.id, 'question', e.target.value)}
                        placeholder="متن پرسش..."
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold focus:border-amber-500 focus:outline-hidden"
                      />

                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaqItem(faq.id, 'answer', e.target.value)}
                        placeholder="پاسخ کوتاه و مفید..."
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:border-amber-500 focus:outline-hidden"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON-LD Preview Box */}
              <div className="p-4 bg-stone-900 rounded-2xl space-y-2">
                <div className="text-xs text-amber-400 font-bold flex items-center justify-between">
                  <span>پیش‌نمایش کدهای خودکار JSON-LD:</span>
                  <span className="text-[10px] text-stone-400 font-mono">schema.org / {schemaType}</span>
                </div>
                <pre className="text-amber-200 text-xs font-mono max-h-56 overflow-y-auto text-left dir-ltr p-2 bg-stone-950 rounded-xl">
                  {JSON.stringify(
                    generateArticleSchema(
                      currentArticleData as Article,
                      categories.find((c) => c.id === categoryId),
                      settings
                    ),
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-700" />
                <span>
                  این پیش‌نمایش نحوه رندر شدن مقاله با فونت لاله‌زار، پاراگراف‌ها و استایل‌های وب فارسی را شبیه‌سازی می‌کند.
                </span>
              </div>

              {/* Simulated Article Header */}
              <div className="space-y-4 border-b border-stone-200 pb-6">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                    {categories.find((c) => c.id === categoryId)?.name || 'آموزش'}
                  </span>
                  <span>•</span>
                  <span>{toPersianDigits(readingTime)} دقیقه مطالعه</span>
                </div>

                <h1 className="font-lalezar text-3xl sm:text-4xl text-stone-900">
                  {title || 'عنوان مقاله'}
                </h1>

                {excerpt && (
                  <p className="text-stone-600 text-sm leading-relaxed p-3 bg-stone-100 rounded-xl border-r-4 border-amber-500">
                    {excerpt}
                  </p>
                )}

                {coverImage && (
                  <div className="rounded-xl overflow-hidden max-h-72 bg-stone-100">
                    <img
                      src={coverImage}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="prose-persian text-stone-800">
                {content ? (
                  content.split('\n\n').map((para, i) => {
                    if (para.startsWith('## ')) {
                      return (
                        <h2 key={i}>
                          <span className="w-2.5 h-6 rounded-xs bg-amber-500 inline-block"></span>
                          <span>{para.replace('## ', '')}</span>
                        </h2>
                      );
                    }
                    if (para.startsWith('### ')) {
                      return <h3 key={i}>{para.replace('### ', '')}</h3>;
                    }
                    if (para.startsWith('> ')) {
                      return <blockquote key={i}>{para.replace('> ', '')}</blockquote>;
                    }
                    return <p key={i}>{para}</p>;
                  })
                ) : (
                  <p className="text-stone-400 text-sm">متن مقاله هنوز نوشته نشده است.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
