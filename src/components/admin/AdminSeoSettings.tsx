import React, { useState } from 'react';
import {
  Settings,
  Save,
  Globe,
  Search,
  Shield,
  FileCode,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  User,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { SiteSettings, Article, Category, Comment } from '../../types';
import { generateSitemapXml, generateRobotsTxt, generateWebsiteSchema } from '../../utils/schemaGenerator';

interface AdminSeoSettingsProps {
  settings: SiteSettings;
  articles: Article[];
  categories: Category[];
  comments: Comment[];
  onSaveSettings: (settings: SiteSettings) => void;
  onImportData: (data: { articles?: Article[]; categories?: Category[]; comments?: Comment[]; settings?: SiteSettings }) => Promise<void>;
}

export const AdminSeoSettings: React.FC<AdminSeoSettingsProps> = ({
  settings,
  articles,
  categories,
  comments,
  onSaveSettings,
  onImportData,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Export full JSON backup (server streams the current DB content)
  const handleExportData = () => {
    window.open('/api/backup/export', '_blank');
  };

  // Import JSON backup — server validates and restores it
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.articles && !parsed.categories && !parsed.settings) {
          alert('فرمت فایل پشتیبان معتبر نیست.');
          return;
        }
        await onImportData(parsed);
        alert('اطلاعات با موفقیت بازیابی شد!');
      } catch (err: any) {
        alert(err?.message || 'خطا در خواندن یا بازیابی فایل JSON.');
      }
    };
    reader.readAsText(file);
  };

  const sitemapXml = generateSitemapXml(articles, categories, formData.siteUrl);
  const robotsTxt = generateRobotsTxt(formData.siteUrl);
  const webSiteSchema = generateWebsiteSchema(formData);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="font-lalezar text-2xl text-stone-900 leading-tight">
            تنظیمات کلی وبلاگ، سئو و اسکیما
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            پیکربندی هویت سایت، متاتگ‌های سراسری، نقشه سایت (Sitemap.xml)، ربات‌ها و پشتیبان‌گیری
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-lalezar text-base flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>ذخیره تنظیمات</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>تنظیمات با موفقیت ذخیره شد و اعمال گردید.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General & SEO Identity */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <Globe className="w-5 h-5 text-amber-600" />
            <span>هویت سایت و اطلاعات پایه سئو</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نام وبلاگ / برند (با فونت لاله‌زار در هدر) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:border-amber-500 focus:outline-hidden font-lalezar text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                شعار وبلاگ (Tagline)
              </label>
              <input
                type="text"
                value={formData.siteTagline}
                onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                آدرس دامنه وبلاگ (Site URL)
              </label>
              <input
                type="url"
                value={formData.siteUrl}
                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                تصویر پیش‌فرض اشتراک‌گذاری (Default OG Image)
              </label>
              <input
                type="text"
                value={formData.defaultOgImage}
                onChange={(e) => setFormData({ ...formData, defaultOgImage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              توضیحات متای پیش‌فرض صفحه اصلی (Meta Description)
            </label>
            <textarea
              rows={2}
              value={formData.siteDescription}
              onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
            ></textarea>
          </div>

          {/* Verification & Comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                کد تایید Google Search Console
              </label>
              <input
                type="text"
                value={formData.googleSiteVerification || ''}
                onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
                placeholder="google-site-verification=abc123xyz"
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                <input
                  type="checkbox"
                  checked={formData.autoApproveComments}
                  onChange={(e) => setFormData({ ...formData, autoApproveComments: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-stone-300 focus:ring-amber-400"
                />
                <span>تایید خودکار دیدگاه‌های کاربران (بدون نیاز به تایید دستی)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Author Profile */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <User className="w-5 h-5 text-amber-600" />
            <span>پروفایل پیش‌فرض نویسنده و تحریریه</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نام نویسنده / مدیر
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                عنوان و سمت
              </label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                آدرس آواتار تصویر نویسنده
              </label>
              <input
                type="text"
                value={formData.authorAvatar}
                onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden dir-ltr text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              بیوگرافی و تخصص نویسنده
            </label>
            <textarea
              rows={2}
              value={formData.authorBio}
              onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-amber-500 focus:outline-hidden"
            ></textarea>
          </div>
        </div>

        {/* Section 3: Automatic Technical SEO (Sitemap & Robots & WebSite Schema) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <FileCode className="w-5 h-5 text-amber-600" />
            <span>اسکیما سراسری، نقشه سایت (Sitemap) و Robots.txt خودکار</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sitemap XML */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span>sitemap.xml خودکار</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(sitemapXml);
                    setCopiedSitemap(true);
                    setTimeout(() => setCopiedSitemap(false), 2000);
                  }}
                  className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSitemap ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSitemap ? 'کپی شد!' : 'کپی XML'}</span>
                </button>
              </div>
              <pre className="bg-stone-900 text-stone-200 text-[11px] font-mono p-3 rounded-lg max-h-40 overflow-y-auto text-left dir-ltr">
                {sitemapXml}
              </pre>
            </div>

            {/* Robots.txt */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span>robots.txt استاندارد</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(robotsTxt);
                    setCopiedRobots(true);
                    setTimeout(() => setCopiedRobots(false), 2000);
                  }}
                  className="text-[11px] text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedRobots ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRobots ? 'کپی شد!' : 'کپی Robots'}</span>
                </button>
              </div>
              <pre className="bg-stone-900 text-stone-200 text-[11px] font-mono p-3 rounded-lg max-h-40 overflow-y-auto text-left dir-ltr">
                {robotsTxt}
              </pre>
            </div>
          </div>
        </div>

        {/* Section 4: Backup & Restore */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-lalezar text-xl text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <Download className="w-5 h-5 text-amber-600" />
            <span>پشتیبان‌گیری و انتقال اطلاعات (Backup & Restore)</span>
          </h3>

          <p className="text-xs text-stone-500">
            شما می‌توانید کلیه مقالات، دسته‌بندی‌ها، نظرات و تنظیمات را در قالب یک فایل JSON خروجی بگیرید یا در سیستم دیگر بازیابی کنید.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل پشتیبان کامل (JSON)</span>
            </button>

            <label className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-stone-300">
              <Upload className="w-4 h-4" />
              <span>بازیابی از فایل پشتیبان</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
