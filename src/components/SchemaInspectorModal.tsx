import React, { useState } from 'react';
import { X, Copy, Check, Code, Search, Globe, ShieldCheck, Share2 } from 'lucide-react';
import { Article, Category, SiteSettings } from '../types';
import { generateArticleSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { toPersianDigits } from '../utils/seoAnalyzer';

interface SchemaInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  category?: Category;
  settings: SiteSettings;
}

export const SchemaInspectorModal: React.FC<SchemaInspectorModalProps> = ({
  isOpen,
  onClose,
  article,
  category,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'jsonld' | 'meta' | 'serp'>('serp');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const articleSchema = generateArticleSchema(article, category, settings);
  const breadcrumbSchema = generateBreadcrumbSchema(article, category, settings.siteUrl);
  const jsonLdString = JSON.stringify(
    {
      '@graph': [articleSchema, breadcrumbSchema],
    },
    null,
    2
  );

  const metaTitle = article.seo.metaTitle || `${article.title} | ${settings.siteTitle}`;
  const metaDesc = article.seo.metaDescription || article.excerpt;
  const canonical = article.seo.canonicalUrl || `${settings.siteUrl}/article/${article.slug}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-lalezar text-xl text-stone-900 leading-none">
                بررسی اسکیما و متاتگ‌های سئو خودکار
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                تولیدشده بر اساس استانداردهای Schema.org و Google Rich Results
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-100/50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('serp')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'serp'
                ? 'bg-white border-t-2 border-amber-500 text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>پیش‌نمایش در گوگل (SERP)</span>
          </button>
          <button
            onClick={() => setActiveTab('jsonld')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'jsonld'
                ? 'bg-white border-t-2 border-amber-500 text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code className="w-4 h-4 text-purple-600" />
            <span>کد JSON-LD اسکیما</span>
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'meta'
                ? 'bg-white border-t-2 border-amber-500 text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Globe className="w-4 h-4 text-red-600" />
            <span>متاتگ‌های OpenGraph و Twitter</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'serp' && (
            <div className="space-y-6">
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="text-xs text-stone-500 mb-2 flex items-center justify-between">
                  <span>شبیه‌ساز نمایش در نتایج جستجوی گوگل (دسکتاپ و موبایل)</span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                    استاندارد و معتبر
                  </span>
                </div>

                {/* Google Snippet Simulation */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-1.5 text-right font-sans">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[9px] font-bold">
                      ل
                    </div>
                    <span className="text-stone-800 font-medium">{settings.siteTitle}</span>
                    <span className="text-stone-400">›</span>
                    <span className="text-stone-500">{category?.name || 'آموزش'}</span>
                  </div>

                  <h4 className="text-lg text-red-800 hover:underline font-medium cursor-pointer leading-snug">
                    {metaTitle}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed text-justify">
                    {metaDesc}
                  </p>

                  {/* FAQ Rich Snippet simulation if FAQs exist */}
                  {article.seo.faqItems && article.seo.faqItems.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-100 space-y-1.5">
                      <div className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                        <span>❓ پیش‌نمایش سوالات متداول (FAQ Rich Result):</span>
                      </div>
                      {article.seo.faqItems.map((faq, idx) => (
                        <div key={idx} className="text-xs bg-stone-50 p-2 rounded-lg text-stone-700">
                          <span className="font-semibold text-stone-900">س: {faq.question}</span>
                          <p className="text-stone-600 text-[11px] mt-0.5">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-stone-100 rounded-xl">
                  <span className="text-[11px] text-stone-500 block">طول عنوان سئو</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {toPersianDigits(metaTitle.length)} کاراکتر
                  </span>
                </div>
                <div className="p-3 bg-stone-100 rounded-xl">
                  <span className="text-[11px] text-stone-500 block">طول توضیحات متا</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {toPersianDigits(metaDesc.length)} کاراکتر
                  </span>
                </div>
                <div className="p-3 bg-stone-100 rounded-xl">
                  <span className="text-[11px] text-stone-500 block">نوع اسکیما</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {article.seo.schemaType}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jsonld' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>اسکریپت کامل JSON-LD تزریق‌شده در تگ &lt;head&gt; صفحه:</span>
                <button
                  onClick={() => copyToClipboard(jsonLdString)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-amber-400 hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'کپی شد!' : 'کپی کدهای اسکیما'}</span>
                </button>
              </div>

              <pre className="bg-stone-900 text-amber-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[340px] text-left dir-ltr">
                {jsonLdString}
              </pre>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>تگ‌های متا شبکه های اجتماعی و ربات‌ها:</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `<title>${metaTitle}</title>\n<meta name="description" content="${metaDesc}">\n<link rel="canonical" href="${canonical}">\n<meta property="og:title" content="${metaTitle}">\n<meta property="og:description" content="${metaDesc}">\n<meta property="og:image" content="${article.coverImage}">\n<meta name="twitter:card" content="summary_large_image">`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-amber-400 hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی متاتگ‌ها</span>
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono text-left dir-ltr bg-stone-900 text-stone-200 p-4 rounded-xl max-h-[340px] overflow-y-auto">
                <p className="text-emerald-400">&lt;!-- Primary Meta Tags --&gt;</p>
                <p>&lt;title&gt;{metaTitle}&lt;/title&gt;</p>
                <p>&lt;meta name="description" content="{metaDesc}" /&gt;</p>
                <p>&lt;meta name="robots" content="{article.seo.robotsIndex ? 'index, follow' : 'noindex, nofollow'}" /&gt;</p>
                <p>&lt;link rel="canonical" href="{canonical}" /&gt;</p>
                
                <p className="text-red-400 pt-2">&lt;!-- Open Graph / Facebook --&gt;</p>
                <p>&lt;meta property="og:type" content="article" /&gt;</p>
                <p>&lt;meta property="og:title" content="{metaTitle}" /&gt;</p>
                <p>&lt;meta property="og:description" content="{metaDesc}" /&gt;</p>
                <p>&lt;meta property="og:image" content="{article.coverImage}" /&gt;</p>
                <p>&lt;meta property="og:url" content="{canonical}" /&gt;</p>
                <p>&lt;meta property="article:published_time" content="{article.publishDate}" /&gt;</p>
                
                <p className="text-purple-400 pt-2">&lt;!-- Twitter Cards --&gt;</p>
                <p>&lt;meta name="twitter:card" content="summary_large_image" /&gt;</p>
                <p>&lt;meta name="twitter:title" content="{metaTitle}" /&gt;</p>
                <p>&lt;meta name="twitter:description" content="{metaDesc}" /&gt;</p>
                <p>&lt;meta name="twitter:image" content="{article.coverImage}" /&gt;</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>اسکیماها به طور داینامیک به تگ Head صفحه اضافه شده‌اند.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
