import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
  FolderTree,
  Settings,
  Globe,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Code,
  Sliders,
  LogOut,
  Users,
  UserCircle,
} from 'lucide-react';
import { AdminTab, Article, Category, Comment, SiteSettings } from '../../types';
import { toPersianDigits } from '../../utils/seoAnalyzer';
import { AdminDashboard } from './AdminDashboard';
import { AdminArticlesList } from './AdminArticlesList';
import { AdminEditor } from './AdminEditor';
import { AdminCommentsList } from './AdminCommentsList';
import { AdminCategories } from './AdminCategories';
import { AdminSeoSettings } from './AdminSeoSettings';
import { AdminUsers } from './AdminUsers';
import { AdminProfile } from './AdminProfile';
import { RedwebsLogo } from '../RedwebsLogo';

interface AdminLayoutProps {
  currentTab: AdminTab;
  tabParams?: any;
  articles: Article[];
  categories: Category[];
  comments: Comment[];
  settings: SiteSettings;
  currentUser: { username: string; role: 'admin' | 'author' };
  onNavigateTab: (tab: AdminTab, params?: any) => void;
  onExitAdmin: () => void;
  onLogout: () => void;
  onSaveArticle: (article: Article) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onDuplicateArticle: (article: Article) => Promise<void>;
  onToggleArticleStatus: (id: string) => Promise<void>;
  onSetFeaturedArticle: (id: string) => Promise<void>;
  onViewLiveArticle: (article: Article) => void;
  onUpdateCommentStatus: (commentId: string, status: any) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onReplyComment: (commentId: string, replyText: string) => Promise<void>;
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onSaveSettings: (settings: SiteSettings) => Promise<void>;
  onImportData: (data: any) => Promise<void>;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  tabParams,
  articles,
  categories,
  comments,
  settings,
  currentUser,
  onNavigateTab,
  onExitAdmin,
  onLogout,
  onSaveArticle,
  onDeleteArticle,
  onDuplicateArticle,
  onToggleArticleStatus,
  onSetFeaturedArticle,
  onViewLiveArticle,
  onUpdateCommentStatus,
  onDeleteComment,
  onReplyComment,
  onSaveCategory,
  onDeleteCategory,
  onSaveSettings,
  onImportData,
}) => {
  const pendingCommentsCount = comments.filter((c) => c.status === 'pending').length;

  // Selected article for editor
  const editingArticle = tabParams?.articleId
    ? articles.find((a) => a.id === tabParams.articleId) || null
    : null;

  const isAdmin = currentUser.role === 'admin';

  // Personal items: available to every logged-in user (admin or author).
  const personalNavItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'داشبورد و آمار',
      icon: LayoutDashboard,
    },
    {
      id: 'articles' as AdminTab,
      label: 'مدیریت مقالات و آموزش‌ها',
      icon: FileText,
      badge: toPersianDigits(articles.length),
    },
    {
      id: 'editor' as AdminTab,
      label: 'نگارش آموزش جدید',
      icon: PlusCircle,
      params: { articleId: 'new' },
    },
    {
      id: 'profile' as AdminTab,
      label: 'پروفایل من',
      icon: UserCircle,
    },
  ];

  // Site-management items: admin-only, kept in a visually separate group.
  const siteManagementNavItems = [
    {
      id: 'comments' as AdminTab,
      label: 'دیدگاه‌ها و نظرات',
      icon: MessageSquare,
      badge: pendingCommentsCount > 0 ? toPersianDigits(pendingCommentsCount) : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'categories' as AdminTab,
      label: 'دسته‌بندی موضوعی',
      icon: FolderTree,
      badge: toPersianDigits(categories.length),
    },
    {
      id: 'seo-settings' as AdminTab,
      label: 'تنظیمات سئو و سایت',
      icon: Settings,
    },
    {
      id: 'users' as AdminTab,
      label: 'کاربران پیشخوان',
      icon: Users,
    },
  ];

  interface NavItem {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
    params?: { articleId: string };
  }

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onNavigateTab(item.id, item.params)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          isActive
            ? 'bg-red-600 text-white shadow-xs'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4" />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              item.badgeColor || (isActive ? 'bg-slate-900 text-red-300' : 'bg-slate-800 text-slate-300')
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-right font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-slate-200 border-l border-slate-800 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <RedwebsLogo theme="dark" size="sm" />
            <span className="text-[11px] text-red-400 font-bold block pt-1">
              پیشخوان مدیریت آموزش‌ها
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {personalNavItems.map(renderNavButton)}

          {isAdmin && (
            <>
              <div className="pt-3 mt-2 border-t border-slate-800 px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  مدیریت سایت
                </span>
              </div>
              {siteManagementNavItems.map(renderNavButton)}
            </>
          )}
        </nav>

        {/* Sidebar Bottom: Back to Website */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onExitAdmin}
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-red-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
            id="admin-exit-to-site-btn"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مشاهده و بازگشت به وبسایت</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 bg-transparent hover:bg-rose-500/10 text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب کاربری</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {!isAdmin && (['comments', 'categories', 'seo-settings', 'users'] as AdminTab[]).includes(currentTab) ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-2">
            <h2 className="font-lalezar text-xl text-stone-900">این بخش فقط برای مدیر کل قابل دسترسی است</h2>
            <p className="text-xs text-stone-500">حساب کاربری شما به‌عنوان نویسنده، فقط دسترسی به مقالات خودتان دارد.</p>
          </div>
        ) : (
          <>
        {currentTab === 'dashboard' && (
          <AdminDashboard
            articles={articles}
            categories={categories}
            comments={comments}
            onNavigateTab={onNavigateTab}
            onEditArticle={(art) => onNavigateTab('editor', { articleId: art.id })}
          />
        )}

        {currentTab === 'articles' && (
          <AdminArticlesList
            articles={articles}
            categories={categories}
            canFeature={isAdmin}
            onNewArticle={() => onNavigateTab('editor', { articleId: 'new' })}
            onEditArticle={(art) => onNavigateTab('editor', { articleId: art.id })}
            onDeleteArticle={onDeleteArticle}
            onDuplicateArticle={onDuplicateArticle}
            onToggleStatus={onToggleArticleStatus}
            onSetFeatured={onSetFeaturedArticle}
            onViewLive={onViewLiveArticle}
          />
        )}

        {currentTab === 'editor' && (
          <AdminEditor
            article={editingArticle}
            categories={categories}
            settings={settings}
            onSave={async (saved: Article) => {
              await onSaveArticle(saved);
              onNavigateTab('articles');
            }}
            onCancel={() => onNavigateTab('articles')}
            onPreviewLive={(art) => onViewLiveArticle(art)}
          />
        )}

        {currentTab === 'comments' && (
          <AdminCommentsList
            comments={comments}
            articles={articles}
            onUpdateStatus={onUpdateCommentStatus}
            onDeleteComment={onDeleteComment}
            onReplyComment={onReplyComment}
            onViewArticle={onViewLiveArticle}
          />
        )}

        {currentTab === 'categories' && (
          <AdminCategories
            categories={categories}
            articles={articles}
            onSaveCategory={onSaveCategory}
            onDeleteCategory={onDeleteCategory}
          />
        )}

        {currentTab === 'seo-settings' && (
          <AdminSeoSettings
            settings={settings}
            categories={categories}
            articles={articles}
            comments={comments}
            onSaveSettings={onSaveSettings}
            onImportData={onImportData}
          />
        )}

        {currentTab === 'users' && <AdminUsers currentUsername={currentUser.username} />}

        {currentTab === 'profile' && <AdminProfile />}
          </>
        )}
      </main>
    </div>
  );
};
