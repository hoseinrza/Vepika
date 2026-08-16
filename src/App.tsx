import React, { useState, useEffect } from 'react';
import { Article, Category, Comment, SiteSettings, ViewMode, AdminTab } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { CategoriesIndexView } from './components/CategoriesIndexView';
import { ArticleView } from './components/ArticleView';
import { WordPressToolkit } from './components/WordPressToolkit';
import { DesignSystemView } from './components/DesignSystemView';
import { SearchModal } from './components/SearchModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { api } from './utils/api';
import { generateArticleSchema, generateWebsiteSchema } from './utils/schemaGenerator';

type AuthState = 'checking' | 'authed' | 'anon';

// Admin panel has no visible link anywhere on the public site — this direct
// URL is the only way in. Keep it out of docs shared publicly.
const ADMIN_SECRET_PATH = '/panel-rw2026';

export function App() {
  // Server-backed content state
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Bookmarks stay client-side (per-visitor preference, no reader accounts)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('redwebs_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & View state
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== 'undefined' && window.location.pathname === ADMIN_SECRET_PATH ? 'admin' : 'home'
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Admin state
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [adminTabParams, setAdminTabParams] = useState<any>(null);
  const [authState, setAuthState] = useState<AuthState>('checking');

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Initial content load from the API
  const loadAllContent = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [articlesData, categoriesData, commentsData, settingsData] = await Promise.all([
        api.get('/articles?all=1'),
        api.get('/categories'),
        api.get('/comments'),
        api.get('/settings'),
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
      setComments(commentsData);
      setSettings(settingsData);
    } catch (err: any) {
      setLoadError(err.message || 'خطا در بارگذاری اطلاعات سایت');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  // Check admin session whenever the admin panel is opened
  useEffect(() => {
    if (viewMode !== 'admin' || authState === 'authed') return;
    setAuthState('checking');
    api
      .get('/auth/me')
      .then(() => setAuthState('authed'))
      .catch(() => setAuthState('anon'));
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('redwebs_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Inject Dynamic SEO & Schema JSON-LD into Document Head
  useEffect(() => {
    if (!settings) return;
    const existingScript = document.getElementById('dynamic-jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'dynamic-jsonld-schema';
    script.type = 'application/ld+json';

    if (viewMode === 'article' && selectedArticleId) {
      const currentArt = articles.find((a) => a.id === selectedArticleId);
      if (currentArt) {
        const cat = categories.find((c) => c.id === currentArt.categoryId);
        const schema = generateArticleSchema(currentArt, cat, settings);
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);

        document.title = currentArt.seo.metaTitle || `${currentArt.title} | ${settings.siteTitle}`;
        return;
      }
    }

    const homeSchema = generateWebsiteSchema(settings);
    script.text = JSON.stringify(homeSchema);
    document.head.appendChild(script);

    if (viewMode === 'admin') {
      document.title = `پیشخوان مدیریت | ${settings.siteTitle}`;
    } else if (viewMode === 'toolkit') {
      document.title = `جعبه ابزار و اسنیپت‌های مهندسی وب | ${settings.siteTitle}`;
    } else if (viewMode === 'design-system') {
      document.title = `سیستم دیزاین برند ردوبز | ${settings.siteTitle}`;
    } else if (viewMode === 'categories-index') {
      document.title = `دسته‌بندی‌های تخصصی آموزش وب و وردپرس | ${settings.siteTitle}`;
    } else if (viewMode === 'category' && selectedCategoryId) {
      const cat = categories.find((c) => c.id === selectedCategoryId);
      document.title = cat ? `${cat.name} | ${settings.siteTitle}` : settings.siteTitle;
    } else {
      document.title = `${settings.siteTitle} — ${settings.siteTagline}`;
    }
  }, [viewMode, selectedArticleId, selectedCategoryId, articles, categories, settings]);

  // Handler: Toggle Bookmark
  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handler: Like Article
  const handleLikeArticle = async (id: string) => {
    const { likesCount } = await api.post(`/articles/${id}/like`);
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, likesCount } : a)));
  };

  // Handler: Add Comment
  const handleAddComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment = await api.post('/comments', commentData);
    setComments((prev) => [newComment, ...prev]);
  };

  // Handler: Like Comment
  const handleLikeComment = async (commentId: string) => {
    const { likes } = await api.post(`/comments/${commentId}/like`);
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, likes } : c)));
  };

  // Handler: Select Article for Reading
  const handleSelectArticle = (article: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, viewsCount: (a.viewsCount || 0) + 1 } : a))
    );
    api.post(`/articles/${article.id}/view`).catch(() => {});
    setSelectedArticleId(article.id);
    setViewMode('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Select Category
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    if (categoryId) {
      setViewMode('category');
    } else {
      setViewMode('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Actions
  const handleSaveArticle = async (saved: Article) => {
    const exists = articles.some((a) => a.id === saved.id);
    if (exists) {
      const updated = await api.put(`/articles/${saved.id}`, saved);
      setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const created = await api.post('/articles', saved);
      setArticles((prev) => [created, ...prev]);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    await api.del(`/articles/${id}`);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setComments((prev) => prev.filter((c) => c.postId !== id));
  };

  const handleDuplicateArticle = async (article: Article) => {
    const duplicate = await api.post(`/articles/${article.id}/duplicate`);
    setArticles((prev) => [duplicate, ...prev]);
  };

  const handleToggleArticleStatus = async (id: string) => {
    const { status } = await api.patch(`/articles/${id}/status`);
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleSetFeaturedArticle = async (id: string) => {
    const { featured } = await api.patch(`/articles/${id}/feature`);
    setArticles((prev) => prev.map((a) => ({ ...a, featured: a.id === id ? featured : false })));
  };

  const handleUpdateCommentStatus = async (commentId: string, status: any) => {
    await api.patch(`/comments/${commentId}/status`, { status });
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, status } : c)));
  };

  const handleDeleteComment = async (commentId: string) => {
    await api.del(`/comments/${commentId}`);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleReplyComment = async (commentId: string, replyText: string) => {
    const updated = await api.post(`/comments/${commentId}/reply`, { content: replyText });
    setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
  };

  const handleSaveCategory = async (category: Category) => {
    const exists = categories.some((c) => c.id === category.id);
    if (exists) {
      const updated = await api.put(`/categories/${category.id}`, category);
      setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await api.post('/categories', category);
      setCategories((prev) => [...prev, created]);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await api.del(`/categories/${categoryId}`);
    const [freshArticles, freshCategories] = await Promise.all([
      api.get('/articles?all=1'),
      api.get('/categories'),
    ]);
    setArticles(freshArticles);
    setCategories(freshCategories);
  };

  const handleSaveSettings = async (updated: SiteSettings) => {
    const saved = await api.put('/settings', updated);
    setSettings(saved);
  };

  const handleImportData = async (data: any) => {
    await api.post('/backup/import', data);
    await loadAllContent();
  };

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {});
    setAuthState('anon');
    setViewMode('home');
  };

  // Selected article for reader view
  const currentArticle = selectedArticleId
    ? articles.find((a) => a.id === selectedArticleId) || null
    : null;

  const currentCategory = currentArticle
    ? categories.find((c) => c.id === currentArticle.categoryId)
    : undefined;

  const publishedArticles = articles.filter((a) => a.status === 'published');

  const relatedArticles = currentArticle
    ? publishedArticles.filter(
        (a) => a.id !== currentArticle.id && a.categoryId === currentArticle.categoryId
      )
    : [];

  const bookmarkedArticlesList = articles.filter((a) => bookmarks.includes(a.id));

  const selectedCategoryObj = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId) || null
    : null;

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]" dir="rtl">
        {loadError ? (
          <div className="text-center space-y-3 px-6">
            <p className="text-rose-600 font-bold text-sm">{loadError}</p>
            <button
              onClick={loadAllContent}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              تلاش مجدد
            </button>
          </div>
        ) : (
          <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
        )}
      </div>
    );
  }

  // Render Admin View
  if (viewMode === 'admin') {
    if (authState !== 'authed') {
      return (
        <AdminLogin
          onSuccess={() => setAuthState('authed')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        tabParams={adminTabParams}
        articles={articles}
        categories={categories}
        comments={comments}
        settings={settings}
        onNavigateTab={(tab, params) => {
          setAdminTab(tab);
          setAdminTabParams(params || null);
        }}
        onExitAdmin={() => setViewMode('home')}
        onLogout={handleLogout}
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        onDuplicateArticle={handleDuplicateArticle}
        onToggleArticleStatus={handleToggleArticleStatus}
        onSetFeaturedArticle={handleSetFeaturedArticle}
        onViewLiveArticle={(art) => {
          setSelectedArticleId(art.id);
          setViewMode('article');
        }}
        onUpdateCommentStatus={handleUpdateCommentStatus}
        onDeleteComment={handleDeleteComment}
        onReplyComment={handleReplyComment}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onSaveSettings={handleSaveSettings}
        onImportData={handleImportData}
      />
    );
  }

  // Render Public Website views
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-red-600 selection:text-white">
      {/* Global Header */}
      <Header
        viewMode={viewMode}
        onNavigate={(mode, data) => {
          if (mode === 'admin') {
            setAdminTab(data?.tab || 'dashboard');
            setAdminTabParams(data?.articleId ? { articleId: data.articleId } : null);
            setViewMode('admin');
          } else {
            setViewMode(mode);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarkedCount={bookmarks.length}
        onToggleBookmarksDrawer={() => setIsBookmarksOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'toolkit' && (
          <WordPressToolkit onBack={() => setViewMode('home')} />
        )}

        {viewMode === 'design-system' && (
          <DesignSystemView onBack={() => setViewMode('home')} />
        )}

        {viewMode === 'categories-index' && (
          <CategoriesIndexView
            categories={categories}
            articles={articles}
            onSelectCategory={handleSelectCategory}
            onBack={() => setViewMode('home')}
          />
        )}

        {viewMode === 'category' && selectedCategoryObj && (
          <CategoryView
            category={selectedCategoryObj}
            articles={articles}
            categories={categories}
            bookmarks={bookmarks}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onToggleBookmark={handleToggleBookmark}
            onBack={() => setViewMode('home')}
          />
        )}

        {viewMode === 'article' && currentArticle && (
          <ArticleView
            article={currentArticle}
            category={currentCategory}
            relatedArticles={relatedArticles}
            comments={comments}
            isBookmarked={bookmarks.includes(currentArticle.id)}
            settings={settings}
            onBack={() => setViewMode('home')}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onToggleBookmark={handleToggleBookmark}
            onLikeArticle={handleLikeArticle}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        )}

        {(viewMode === 'home' || (viewMode as any) === 'blog') && (
          <HomeView
            articles={articles}
            categories={categories}
            bookmarks={bookmarks}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onToggleBookmark={handleToggleBookmark}
            onOpenToolkit={() => setViewMode('toolkit')}
            onOpenCategoriesIndex={() => setViewMode('categories-index')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        categories={categories}
        settings={settings}
        onSelectCategory={handleSelectCategory}
        onOpenToolkit={() => {
          setViewMode('toolkit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDesignSystem={() => {
          setViewMode('design-system');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        categories={categories}
        onSelectArticle={handleSelectArticle}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedArticles={bookmarkedArticlesList}
        categories={categories}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={(id) => handleToggleBookmark(id)}
      />
    </div>
  );
}

export default App;
