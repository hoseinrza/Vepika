import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, matchPath, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AdminTab, Article, Category, Comment, SiteSettings, ViewMode } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { CategoriesIndexView } from './components/CategoriesIndexView';
import { ArticleView } from './components/ArticleView';
import { WordPressToolkit } from './components/WordPressToolkit';
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

// Sets/restores the robots meta tag for pages that must never be indexed
// (404s, admin, etc). Restores "index, follow" on unmount so navigating
// away from a noindex route doesn't leak the tag onto the next page.
function useRobotsMeta(content: string) {
  useEffect(() => {
    let el = document.querySelector('meta[name="robots"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'robots');
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
    return () => {
      el?.setAttribute('content', 'index, follow');
    };
  }, [content]);
}

function NotFoundView() {
  useRobotsMeta('noindex, follow');
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center" dir="rtl">
      <p className="text-red-600 font-black text-sm mb-2">خطای ۴۰۴</p>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
      <p className="text-slate-500 text-sm mb-8">
        ممکن است آدرس اشتباه باشد یا این محتوا جابه‌جا شده باشد.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();

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

  // Admin auth
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [currentUser, setCurrentUser] = useState<{ username: string; role: 'admin' | 'author' } | null>(null);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const isAdminRoute = location.pathname === ADMIN_SECRET_PATH || location.pathname.startsWith(`${ADMIN_SECRET_PATH}/`);

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
    if (!isAdminRoute || authState === 'authed') return;
    setAuthState('checking');
    api
      .get('/auth/me')
      .then((me) => {
        setCurrentUser({ username: me.username, role: me.role });
        setAuthState('authed');
      })
      .catch(() => setAuthState('anon'));
  }, [isAdminRoute]);

  useEffect(() => {
    localStorage.setItem('redwebs_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Inject Dynamic SEO & Schema JSON-LD into Document Head, driven by the URL
  useEffect(() => {
    if (!settings) return;
    const existingScript = document.getElementById('dynamic-jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'dynamic-jsonld-schema';
    script.type = 'application/ld+json';

    const articleMatch = matchPath('/article/:slug', location.pathname);
    if (articleMatch) {
      const currentArt = articles.find((a) => a.slug === articleMatch.params.slug);
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

    if (isAdminRoute) {
      document.title = `پیشخوان مدیریت | ${settings.siteTitle}`;
    } else if (location.pathname === '/toolkit') {
      document.title = `جعبه ابزار و اسنیپت‌های مهندسی وب | ${settings.siteTitle}`;
    } else if (location.pathname === '/categories') {
      document.title = `دسته‌بندی‌های تخصصی آموزش وب و وردپرس | ${settings.siteTitle}`;
    } else {
      const categoryMatch = matchPath('/category/:slug', location.pathname);
      if (categoryMatch) {
        const cat = categories.find((c) => c.slug === categoryMatch.params.slug);
        document.title = cat ? `${cat.name} | ${settings.siteTitle}` : settings.siteTitle;
      } else {
        document.title = `${settings.siteTitle} — ${settings.siteTagline}`;
      }
    }
  }, [location.pathname, articles, categories, settings, isAdminRoute]);

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

  // Registers a view for an article — fires whenever someone lands on
  // /article/:slug, whether by clicking a link or opening the URL directly.
  const handleRegisterView = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, viewsCount: (a.viewsCount || 0) + 1 } : a))
    );
    api.post(`/articles/${id}/view`).catch(() => {});
  };

  // Handler: Navigate to an article's URL
  const handleSelectArticle = (article: Article) => {
    navigate(`/article/${article.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Navigate to a category's URL (or home when cleared)
  const handleSelectCategory = (categoryId: string | null) => {
    const category = categoryId ? categories.find((c) => c.id === categoryId) : null;
    navigate(category ? `/category/${category.slug}` : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: generic top-nav navigation (category is handled by onSelectCategory instead)
  const handleNavigate = (mode: ViewMode) => {
    switch (mode) {
      case 'home':
        navigate('/');
        break;
      case 'categories-index':
        navigate('/categories');
        break;
      case 'toolkit':
        navigate('/toolkit');
        break;
      default:
        break;
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
    await api.post('/backup', data);
    await loadAllContent();
  };

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {});
    setCurrentUser(null);
    setAuthState('anon');
    navigate('/');
  };

  const bookmarkedArticlesList = articles.filter((a) => bookmarks.includes(a.id));

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
  if (isAdminRoute) {
    if (authState !== 'authed') {
      return (
        <AdminLogin
          onSuccess={() => {
            api.get('/auth/me').then((me) => {
              setCurrentUser({ username: me.username, role: me.role });
              setAuthState('authed');
            });
          }}
        />
      );
    }

    const handleNavigateTab = (tab: AdminTab, params?: any) => {
      if (tab === 'dashboard') {
        navigate(ADMIN_SECRET_PATH);
      } else if (tab === 'editor') {
        navigate(`${ADMIN_SECRET_PATH}/editor/${params?.articleId || 'new'}`);
      } else {
        navigate(`${ADMIN_SECRET_PATH}/${tab}`);
      }
    };

    const adminLayoutSharedProps = {
      articles,
      categories,
      comments,
      settings,
      currentUser: currentUser!,
      onNavigateTab: handleNavigateTab,
      onExitAdmin: () => navigate('/'),
      onLogout: handleLogout,
      onSaveArticle: handleSaveArticle,
      onDeleteArticle: handleDeleteArticle,
      onDuplicateArticle: handleDuplicateArticle,
      onToggleArticleStatus: handleToggleArticleStatus,
      onSetFeaturedArticle: handleSetFeaturedArticle,
      onViewLiveArticle: (art: Article) => navigate(`/article/${art.slug}`),
      onUpdateCommentStatus: handleUpdateCommentStatus,
      onDeleteComment: handleDeleteComment,
      onReplyComment: handleReplyComment,
      onSaveCategory: handleSaveCategory,
      onDeleteCategory: handleDeleteCategory,
      onSaveSettings: handleSaveSettings,
      onImportData: handleImportData,
    };

    return (
      <Routes>
        <Route
          path={ADMIN_SECRET_PATH}
          element={<AdminLayout currentTab="dashboard" tabParams={null} {...adminLayoutSharedProps} />}
        />
        <Route
          path={`${ADMIN_SECRET_PATH}/articles`}
          element={<AdminLayout currentTab="articles" tabParams={null} {...adminLayoutSharedProps} />}
        />
        <Route
          path={`${ADMIN_SECRET_PATH}/editor/:id`}
          element={<AdminEditorRoute {...adminLayoutSharedProps} />}
        />
        <Route
          path={`${ADMIN_SECRET_PATH}/comments`}
          element={<AdminLayout currentTab="comments" tabParams={null} {...adminLayoutSharedProps} />}
        />
        <Route
          path={`${ADMIN_SECRET_PATH}/categories`}
          element={<AdminLayout currentTab="categories" tabParams={null} {...adminLayoutSharedProps} />}
        />
        <Route
          path={`${ADMIN_SECRET_PATH}/seo-settings`}
          element={<AdminLayout currentTab="seo-settings" tabParams={null} {...adminLayoutSharedProps} />}
        />
        <Route
          path={`${ADMIN_SECRET_PATH}/users`}
          element={<AdminLayout currentTab="users" tabParams={null} {...adminLayoutSharedProps} />}
        />
        <Route path={`${ADMIN_SECRET_PATH}/*`} element={<Navigate to={ADMIN_SECRET_PATH} replace />} />
      </Routes>
    );
  }

  // Render Public Website views
  const currentViewMode: ViewMode = location.pathname === '/toolkit'
    ? 'toolkit'
    : location.pathname === '/categories'
    ? 'categories-index'
    : matchPath('/category/:slug', location.pathname)
    ? 'category'
    : matchPath('/article/:slug', location.pathname)
    ? 'article'
    : 'home';

  const selectedCategoryId = (() => {
    const categoryMatch = matchPath('/category/:slug', location.pathname);
    if (!categoryMatch) return null;
    return categories.find((c) => c.slug === categoryMatch.params.slug)?.id || null;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-red-600 selection:text-white">
      {/* Global Header */}
      <Header
        viewMode={currentViewMode}
        onNavigate={handleNavigate}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarkedCount={bookmarks.length}
        onToggleBookmarksDrawer={() => setIsBookmarksOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                articles={articles}
                categories={categories}
                bookmarks={bookmarks}
                onSelectArticle={handleSelectArticle}
                onSelectCategory={handleSelectCategory}
                onToggleBookmark={handleToggleBookmark}
                onOpenToolkit={() => navigate('/toolkit')}
                onOpenCategoriesIndex={() => navigate('/categories')}
              />
            }
          />

          <Route
            path="/categories"
            element={
              <CategoriesIndexView
                categories={categories}
                articles={articles}
                onSelectCategory={handleSelectCategory}
                onBack={() => navigate('/')}
              />
            }
          />

          <Route
            path="/category/:slug"
            element={
              <CategoryRoute
                articles={articles}
                categories={categories}
                bookmarks={bookmarks}
                onSelectArticle={handleSelectArticle}
                onSelectCategory={handleSelectCategory}
                onToggleBookmark={handleToggleBookmark}
              />
            }
          />

          <Route
            path="/article/:slug"
            element={
              <ArticleRoute
                articles={articles}
                categories={categories}
                comments={comments}
                bookmarks={bookmarks}
                settings={settings}
                onRegisterView={handleRegisterView}
                onSelectArticle={handleSelectArticle}
                onSelectCategory={handleSelectCategory}
                onToggleBookmark={handleToggleBookmark}
                onLikeArticle={handleLikeArticle}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
              />
            }
          />

          <Route path="/toolkit" element={<WordPressToolkit onBack={() => navigate('/')} />} />

          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer
        categories={categories}
        settings={settings}
        onSelectCategory={handleSelectCategory}
        onOpenToolkit={() => {
          navigate('/toolkit');
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

// --- Route-param resolvers -------------------------------------------------
// Small wrapper components that read the slug out of the URL, resolve it
// against already-loaded data, and hand off to the existing view components.
// Keeping these thin means CategoryView/ArticleView never need to know
// routing exists at all.

function CategoryRoute({
  articles,
  categories,
  bookmarks,
  onSelectArticle,
  onSelectCategory,
  onToggleBookmark,
}: {
  articles: Article[];
  categories: Category[];
  bookmarks: string[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (id: string | null) => void;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const category = categories.find((c) => c.slug === slug);

  if (!category) return <NotFoundView />;

  return (
    <CategoryView
      category={category}
      articles={articles}
      categories={categories}
      bookmarks={bookmarks}
      onSelectArticle={onSelectArticle}
      onSelectCategory={onSelectCategory}
      onToggleBookmark={onToggleBookmark}
      onBack={() => navigate('/')}
    />
  );
}

function ArticleRoute({
  articles,
  categories,
  comments,
  bookmarks,
  settings,
  onRegisterView,
  onSelectArticle,
  onSelectCategory,
  onToggleBookmark,
  onLikeArticle,
  onAddComment,
  onLikeComment,
}: {
  articles: Article[];
  categories: Category[];
  comments: Comment[];
  bookmarks: string[];
  settings: SiteSettings;
  onRegisterView: (id: string) => void;
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (id: string | null) => void;
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onLikeArticle: (id: string) => Promise<void>;
  onAddComment: (data: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => Promise<void>;
  onLikeComment: (id: string) => Promise<void>;
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (article) onRegisterView(article.id);
    // Only re-register when the article being viewed actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  if (!article) return <NotFoundView />;

  const category = categories.find((c) => c.id === article.categoryId);
  const relatedArticles = articles.filter(
    (a) => a.status === 'published' && a.id !== article.id && a.categoryId === article.categoryId
  );

  return (
    <ArticleView
      article={article}
      category={category}
      relatedArticles={relatedArticles}
      comments={comments}
      isBookmarked={bookmarks.includes(article.id)}
      settings={settings}
      onBack={() => navigate('/')}
      onSelectArticle={onSelectArticle}
      onSelectCategory={onSelectCategory}
      onToggleBookmark={onToggleBookmark}
      onLikeArticle={onLikeArticle}
      onAddComment={onAddComment}
      onLikeComment={onLikeComment}
    />
  );
}

function AdminEditorRoute(props: any) {
  const { id } = useParams();
  return <AdminLayout currentTab="editor" tabParams={{ articleId: id }} {...props} />;
}

export default App;
