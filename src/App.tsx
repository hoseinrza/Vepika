import React, { useState, useEffect } from 'react';
import {
  INITIAL_ARTICLES,
  INITIAL_CATEGORIES,
  INITIAL_COMMENTS,
  INITIAL_SETTINGS,
} from './data/initialData';
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
import { generateArticleSchema, generateWebsiteSchema } from './utils/schemaGenerator';

const DATA_VERSION = 'vepika_v1_0';

export function App() {
  // Persistence state with auto-migration to Vepika branding
  const [articles, setArticles] = useState<Article[]>(() => {
    const version = localStorage.getItem('vepika_version');
    if (version !== DATA_VERSION) {
      localStorage.setItem('vepika_version', DATA_VERSION);
      localStorage.setItem('vepika_articles', JSON.stringify(INITIAL_ARTICLES));
      localStorage.setItem('vepika_categories', JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem('vepika_comments', JSON.stringify(INITIAL_COMMENTS));
      localStorage.setItem('vepika_settings', JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_ARTICLES;
    }
    const saved = localStorage.getItem('vepika_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('vepika_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('vepika_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('vepika_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('vepika_bookmarks');
    return saved ? JSON.parse(saved) : ['art-1', 'art-2'];
  });

  // Navigation & View state
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Admin state
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [adminTabParams, setAdminTabParams] = useState<any>(null);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vepika_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('vepika_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('vepika_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('vepika_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('vepika_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Inject Dynamic SEO & Schema JSON-LD into Document Head
  useEffect(() => {
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

        // Update Document Title
        document.title = currentArt.seo.metaTitle || `${currentArt.title} | ${settings.siteTitle}`;
        return;
      }
    }

    // Default WebSite Schema for Home/Admin
    const homeSchema = generateWebsiteSchema(settings);
    script.text = JSON.stringify(homeSchema);
    document.head.appendChild(script);

    if (viewMode === 'admin') {
      document.title = `پیشخوان مدیریت | ${settings.siteTitle}`;
    } else if (viewMode === 'toolkit') {
      document.title = `جعبه ابزار و اسنیپت‌های مهندسی وب | ${settings.siteTitle}`;
    } else if (viewMode === 'design-system') {
      document.title = `سیستم دیزاین برند وپیکا | ${settings.siteTitle}`;
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
  const handleLikeArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, likesCount: art.likesCount + 1 } : art))
    );
  };

  // Handler: Add Comment
  const handleAddComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
  };

  // Handler: Like Comment
  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Handler: Select Article for Reading
  const handleSelectArticle = (article: Article) => {
    // Increment view count
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, viewsCount: (a.viewsCount || 0) + 1 } : a))
    );
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
  const handleSaveArticle = (saved: Article) => {
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      if (exists) {
        return prev.map((a) => (a.id === saved.id ? saved : a));
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setComments((prev) => prev.filter((c) => c.postId !== id));
  };

  const handleDuplicateArticle = (article: Article) => {
    const duplicate: Article = {
      ...article,
      id: `post-${Date.now()}`,
      slug: `${article.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${article.title} (نسخه رونوشت)`,
      status: 'draft',
      publishDate: new Date().toISOString(),
      viewsCount: 0,
      likesCount: 0,
    };
    setArticles((prev) => [duplicate, ...prev]);
  };

  const handleToggleArticleStatus = (id: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'published' ? 'draft' : 'published' }
          : a
      )
    );
  };

  const handleUpdateCommentStatus = (commentId: string, status: any) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, status } : c))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleReplyComment = (commentId: string, replyText: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const replies = c.replies || [];
          return {
            ...c,
            replies: [
              ...replies,
              {
                id: `reply-${Date.now()}`,
                authorName: settings.authorName || 'تحریریه وپیکا',
                authorRole: 'مدیر محتوا',
                content: replyText,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return c;
      })
    );
  };

  const handleSaveCategory = (category: Category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      if (exists) {
        return prev.map((c) => (c.id === category.id ? category : c));
      }
      return [...prev, category];
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const fallbackCategory = categories.find((c) => c.id !== categoryId);
    if (!fallbackCategory) return;

    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    // Reassign orphaned articles to fallback
    setArticles((prev) =>
      prev.map((a) => (a.categoryId === categoryId ? { ...a, categoryId: fallbackCategory.id } : a))
    );
  };

  const handleImportData = (data: any) => {
    if (data.articles) setArticles(data.articles);
    if (data.categories) setCategories(data.categories);
    if (data.comments) setComments(data.comments);
    if (data.settings) setSettings(data.settings);
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
  const pendingCommentsCount = comments.filter((c) => c.status === 'pending').length;

  const selectedCategoryObj = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId) || null
    : null;

  // Render Admin View
  if (viewMode === 'admin') {
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
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        onDuplicateArticle={handleDuplicateArticle}
        onToggleArticleStatus={handleToggleArticleStatus}
        onViewLiveArticle={(art) => {
          setSelectedArticleId(art.id);
          setViewMode('article');
        }}
        onUpdateCommentStatus={handleUpdateCommentStatus}
        onDeleteComment={handleDeleteComment}
        onReplyComment={handleReplyComment}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onSaveSettings={setSettings}
        onImportData={handleImportData}
      />
    );
  }

  // Render Public Website views
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white">
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
        pendingCommentsCount={pendingCommentsCount}
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
        onOpenAdmin={() => {
          setAdminTab('dashboard');
          setViewMode('admin');
        }}
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
