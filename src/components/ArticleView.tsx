import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Code,
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  ThumbsUp,
  CornerDownLeft,
  ListOrdered,
  Layers,
  Wrench,
  AlertTriangle,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { Article, Category, Comment, SiteSettings } from '../types';
import { formatPersianDate, toPersianDigits } from '../utils/seoAnalyzer';
import { SchemaInspectorModal } from './SchemaInspectorModal';
import { CoverImage } from './CoverImage';

interface ArticleViewProps {
  article: Article;
  category?: Category;
  relatedArticles: Article[];
  comments: Comment[];
  isBookmarked: boolean;
  settings: SiteSettings;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onLikeArticle: (id: string) => void;
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeComment: (commentId: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  category,
  relatedArticles,
  comments,
  isBookmarked,
  settings,
  onBack,
  onSelectArticle,
  onToggleBookmark,
  onLikeArticle,
  onAddComment,
  onLikeComment,
}) => {
  // Reading Progress Bar
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isLiked, setIsLiked] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Tutorial Steps Checkpoints state
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Comment Form state
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLiked(false);
    setCommentSubmitted(false);
    setCompletedSteps([]);
  }, [article.id]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLikeArticle(article.id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim()) return;

    onAddComment({
      postId: article.id,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
      content: commentContent.trim(),
      status: settings.autoApproveComments ? 'approved' : 'pending',
    });

    setCommentSubmitted(true);
    setCommentContent('');
  };

  // Filter approved comments for this post
  const postComments = comments.filter((c) => c.postId === article.id && c.status === 'approved');

  // Extract table of contents from markdown headings
  const extractHeadings = (content: string) => {
    const lines = content.split('\n');
    const headings: Array<{ text: string; id: string; level: number }> = [];
    lines.forEach((line) => {
      const matchH2 = line.match(/^##\s+(.+)$/);
      const matchH3 = line.match(/^###\s+(.+)$/);
      if (matchH2) {
        const text = matchH2[1].replace(/[*_`]/g, '').trim();
        headings.push({ text, id: encodeURIComponent(text), level: 2 });
      } else if (matchH3) {
        const text = matchH3[1].replace(/[*_`]/g, '').trim();
        headings.push({ text, id: encodeURIComponent(text), level: 3 });
      }
    });
    return headings;
  };

  const headings = extractHeadings(article.content);

  // Render markdown with custom Vepika typography
  const renderMarkdown = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2 Heading
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        const id = encodeURIComponent(text.replace(/[*_`]/g, '').trim());
        return (
          <h2 key={index} id={id} className="scroll-mt-24 text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2 pt-6 pb-2 border-b border-slate-100">
            <span className="w-2.5 h-6 rounded-md bg-blue-600 inline-block"></span>
            <span>{text}</span>
          </h2>
        );
      }

      // H3 Heading
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        const id = encodeURIComponent(text.replace(/[*_`]/g, '').trim());
        return (
          <h3 key={index} id={id} className="scroll-mt-24 text-lg font-bold text-slate-900 pt-4">
            {text}
          </h3>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-r-4 border-blue-600 pr-4 py-3 my-5 bg-blue-50/80 rounded-l-xl text-blue-950">
            <p className="font-medium text-sm leading-relaxed">{trimmed.replace('> ', '')}</p>
          </blockquote>
        );
      }

      // Code block
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const firstLine = lines[0].replace('```', '').trim() || 'code';
        const code = lines.slice(1, -1).join('\n');
        const codeId = `code-block-${index}`;

        return (
          <div key={index} className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">{firstLine}</span>
              <button
                onClick={() => handleCopyCode(code, codeId)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCodeId === codeId ? (
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
            <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto dir-ltr text-left leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Unordered list
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map((li) => li.replace(/^[-*]\s+/, ''));
        return (
          <ul key={index} className="list-disc pr-6 my-4 space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }

      // Ordered list
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map((li) => li.replace(/^\d+\.\s+/, ''));
        return (
          <ol key={index} className="list-decimal pr-6 my-4 space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );
      }

      // Horizontal rule
      if (trimmed === '---') {
        return <hr key={index} className="my-8 border-slate-200" />;
      }

      // Standard Paragraph
      return (
        <p key={index} className="text-slate-700 text-base sm:text-[17px] leading-loose text-justify my-4">
          {trimmed}
        </p>
      );
    });
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-lg';
    if (fontSize === 'xlarge') return 'text-xl';
    return 'text-base';
  };

  return (
    <div className="min-h-screen pb-16" dir="rtl">
      {/* Sticky Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pb-6 text-xs sm:text-sm text-slate-500 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onBack}
              className="text-slate-700 hover:text-blue-600 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>خانه</span>
            </button>
            <span>/</span>
            <span className="text-blue-600 font-bold">{category?.name || 'آموزش'}</span>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Schema Inspector Modal Trigger */}
            <button
              onClick={() => setShowSchemaModal(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              title="مشاهده کدهای اسکیما JSON-LD گوگل"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">اسکیما ({article.seo.schemaType})</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={(e) => onToggleBookmark(article.id, e)}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isBookmarked
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:text-blue-600 border-slate-200'
              }`}
              title={isBookmarked ? 'حذف از نشان‌ها' : 'نشان کردن مقاله'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Article Header & Typography */}
        <header className="py-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: category?.color || '#2563EB' }}
            >
              {category?.name || 'آموزش تخصصی'}
            </span>

            {article.difficulty && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                سطح: {article.difficulty === 'intermediate' ? 'متوسط' : article.difficulty === 'beginner' ? 'مقدماتی' : 'پیشرفته'}
              </span>
            )}

            {article.wpPlugin && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {article.wpPlugin}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify bg-slate-50 p-4 rounded-2xl border-r-4 border-blue-600 border-y border-l border-slate-200">
            {article.excerpt}
          </p>

          {/* Author Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm">{article.author.name}</span>
                <span className="text-[11px] text-slate-500">{article.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{toPersianDigits(article.readingTimeMinutes)} دقیقه مطالعه</span>
              </span>
              <span>•</span>
              <span>انتشار: {formatPersianDate(article.publishDate)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{toPersianDigits(article.viewsCount)} بازدید</span>
              </span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="aspect-16/9 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-lg mb-10 bg-slate-100">
          <CoverImage
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Table of Contents & Prerequisites Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          {/* Prerequisites (if available) */}
          {article.prerequisites && article.prerequisites.length > 0 && (
            <div className="md:col-span-5 bg-blue-50/80 p-5 rounded-2xl border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs sm:text-sm">
                <Info className="w-4 h-4 text-blue-600" />
                <span>پیش‌نیازهای این آموزش</span>
              </div>
              <ul className="space-y-1.5 text-xs text-blue-950">
                {article.prerequisites.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Table of contents */}
          {headings.length > 0 && (
            <div className={`${article.prerequisites ? 'md:col-span-7' : 'md:col-span-12'} bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3`}>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                <ListOrdered className="w-4 h-4 text-blue-600" />
                <span>سرفصل‌ها و عناوین مقاله</span>
              </div>
              <ul className="space-y-1.5 text-xs">
                {headings.map((h, idx) => (
                  <li key={idx} className={h.level === 3 ? 'pr-4' : ''}>
                    <a
                      href={`#${h.id}`}
                      className="text-slate-700 hover:text-blue-600 hover:underline transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{h.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Step-by-Step Interactive Stepper (For Tutorials) */}
        {article.tutorialSteps && article.tutorialSteps.length > 0 && (
          <div className="my-10 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span>مراحل گام‌به‌گام پیاده‌سازی</span>
                </h3>
                <p className="text-xs text-slate-500">
                  پیشرفت خود را با زدن تیک هر مرحله ذخیره کنید.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {toPersianDigits(completedSteps.length)} از {toPersianDigits(article.tutorialSteps.length)} مرحله
              </span>
            </div>

            <div className="space-y-4">
              {article.tutorialSteps.map((step) => {
                const isCompleted = completedSteps.includes(step.stepNumber);
                return (
                  <div
                    key={step.stepNumber}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCompleted ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                          }`}
                        >
                          {toPersianDigits(step.stepNumber)}
                        </span>
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900">{step.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
                          {step.tip && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>{step.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleStep(step.stepNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {isCompleted ? 'انجام شد ✓' : 'علامت انجام'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Article Body Markdown */}
        <div className={`prose-vepika ${getFontSizeClass()}`}>
          {renderMarkdown(article.content)}
        </div>

        {/* FAQ Section (If Defined in SEO Schema) */}
        {article.seo.faqItems && article.seo.faqItems.length > 0 && (
          <section className="my-12 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>پرسش‌های متداول (FAQ)</span>
            </h3>
            <div className="space-y-3">
              {article.seo.faqItems.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full p-4 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Engagement Actions (Like, Share, Copy Link) */}
        <div className="py-8 border-y border-slate-200 flex flex-wrap items-center justify-between gap-4 my-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{toPersianDigits(article.likesCount + (isLiked ? 1 : 0))} نفر پسندیدند</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">لینک کپی شد!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>اشتراک‌گذاری</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">اندازه متن:</span>
            {(['normal', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSize === size ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>

        {/* Author Bio Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 my-10">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
          />
          <div className="space-y-2 text-center sm:text-right">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-extrabold text-base text-slate-900">{article.author.name}</h3>
              <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                {article.author.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{article.author.bio}</p>
          </div>
        </div>

        {/* Related Articles Carousel/Grid */}
        {relatedArticles.length > 0 && (
          <section className="my-14 space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>آموزش‌های مرتبط با این مبحث</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.slice(0, 2).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer flex gap-4 group shadow-2xs"
                >
                  <CoverImage
                    src={rel.coverImage}
                    alt={rel.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{toPersianDigits(rel.readingTimeMinutes)} دقیقه</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <section className="my-14 space-y-8" id="comments">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>دیدگاه‌ها و پرسش‌های کاربران ({toPersianDigits(postComments.length)})</span>
            </h3>
          </div>

          {/* Comment Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900">دیدگاه یا سوال خود را مطرح کنید</h4>

            {commentSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {settings.autoApproveComments
                    ? 'دیدگاه شما با موفقیت منتشر گردید.'
                    : 'دیدگاه شما با موفقیت ثبت شد و پس از بازبینی تیم فنی وپیکا منتشر خواهد شد.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="نام و نام خانوادگی *"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                  />
                  <input
                    type="email"
                    required
                    placeholder="ایمیل شما (محفوظ می‌ماند) *"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all dir-ltr text-left"
                  />
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="دیدگاه، پرسش فنی یا تجربه خود از پیاده‌سازی این آموزش را بنویسید..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ارسال دیدگاه</span>
                </button>
              </form>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {postComments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                هنوز دیدگاهی برای این مطلب ثبت نشده است. اولین نفری باشید که نظر خود را به اشتراک می‌گذارد!
              </p>
            ) : (
              postComments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(comment.authorName)}`}
                        alt={comment.authorName}
                        className="w-8 h-8 rounded-full border border-slate-200"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{comment.authorName}</span>
                        <span className="text-[10px] text-slate-400">{formatPersianDate(comment.createdAt)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onLikeComment(comment.id)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{toPersianDigits(comment.likes)}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{comment.content}</p>

                  {/* Replies if any */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mr-6 pr-4 border-r-2 border-blue-500 space-y-3 pt-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-slate-50 p-3.5 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-blue-700">{reply.authorName}</span>
                            {reply.authorRole && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md font-bold">
                                {reply.authorRole}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Schema Inspector Modal */}
      {showSchemaModal && (
        <SchemaInspectorModal
          article={article}
          settings={settings}
          onClose={() => setShowSchemaModal(false)}
        />
      )}
    </div>
  );
};
