import React, { useState } from 'react';
import { Category, ViewMode, SiteSettings } from '../types';
import { VepikaLogo } from './VepikaLogo';
import {
  Search,
  Bookmark,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  BookOpen,
  Wrench,
  Sliders,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onNavigate: (mode: ViewMode, data?: any) => void;
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (catId: string | null) => void;
  onOpenSearch: () => void;
  bookmarkedCount: number;
  onToggleBookmarksDrawer: () => void;
  pendingCommentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onNavigate,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenSearch,
  bookmarkedCount,
  onToggleBookmarksDrawer,
  pendingCommentsCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" dir="rtl">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-medium text-slate-200">
              وپیکا — رسانه تخصصی آموزش وردپرس، المنتور، توسعه وب و سئو
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => onNavigate('toolkit')}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Wrench className="w-3 h-3 text-blue-400" />
              <span>جعبه ابزار وب‌مستر</span>
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('design-system')}
              className="hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3 text-purple-400" />
              <span>سیستم دیزاین</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                onSelectCategory(null);
                onNavigate('home');
              }}
              className="cursor-pointer group focus:outline-hidden"
            >
              <VepikaLogo size="md" showTagline />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => {
                  onSelectCategory(null);
                  onNavigate('home');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'home' || viewMode === 'blog'
                    ? 'text-blue-600 bg-blue-50/80 font-extrabold'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                صفحه اصلی
              </button>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCategoriesDropdownOpen(false), 200)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedCategoryId || isCategoriesDropdownOpen
                      ? 'text-blue-600 bg-blue-50/80'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>دسته‌بندی‌های تخصصی</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCategoriesDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">۱۰ موضوع آموزشی وپیکا</span>
                      <button
                        onClick={() => {
                          onNavigate('categories-index');
                          setIsCategoriesDropdownOpen(false);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        مشاهده همه
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-1 max-h-72 overflow-y-auto">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onNavigate('category');
                            setIsCategoriesDropdownOpen(false);
                          }}
                          className={`p-2 text-right rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                            selectedCategoryId === cat.id
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: selectedCategoryId === cat.id ? '#ffffff' : cat.color }}
                          />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step-by-step Tutorials */}
              <button
                onClick={() => {
                  onSelectCategory('cat-wordpress');
                  onNavigate('category');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                آموزش‌های گام‌به‌گام
              </button>

              {/* Developer & WordPress Toolkit */}
              <button
                onClick={() => onNavigate('toolkit')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'toolkit' || viewMode === 'tools'
                    ? 'text-blue-600 bg-blue-50/80 font-extrabold'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                <span>ابزارها و اسنیپت‌ها</span>
              </button>

              {/* Design System */}
              <button
                onClick={() => onNavigate('design-system')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'design-system'
                    ? 'text-purple-600 bg-purple-50/80 font-extrabold'
                    : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                <span>سیستم دیزاین</span>
              </button>
            </nav>
          </div>

          {/* Right Action Tools (Search, Bookmarks, Admin) */}
          <div className="flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium transition-all cursor-pointer border border-slate-200/80 shadow-2xs"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">جستجو در مقالات و آموزش‌ها...</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white rounded-md border border-slate-300 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Bookmark Drawer Button */}
            <button
              onClick={onToggleBookmarksDrawer}
              className="relative p-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-100"
              title="نشان‌شده‌ها و مقالات ذخیره‌شده"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Admin CMS Button */}
            <button
              onClick={() => onNavigate('admin')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>پیشخوان ادمین</span>
              {pendingCommentsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {pendingCommentsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <button
              onClick={() => {
                onSelectCategory(null);
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              صفحه اصلی
            </button>

            <button
              onClick={() => {
                onNavigate('categories-index');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>دسته‌بندی‌های تخصصی</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">۱۰ موضوع</span>
            </button>

            <button
              onClick={() => {
                onNavigate('toolkit');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>جعبه ابزار و اسنیپت‌های وب‌مستر</span>
            </button>

            <button
              onClick={() => {
                onNavigate('design-system');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span>سیستم دیزاین و هویت بصری</span>
            </button>

            <button
              onClick={() => {
                onNavigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors flex items-center justify-between mt-3"
            >
              <span>ورود به پنل مدیریت محتوا</span>
              {pendingCommentsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md text-[10px]">
                  {pendingCommentsCount} دیدگاه
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
