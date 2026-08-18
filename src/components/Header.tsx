import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Category, ViewMode } from '../types';
import { RedwebsLogo } from './RedwebsLogo';
import {
  Search,
  Bookmark,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowLeft,
  Flame,
  Code2,
  LayoutGrid,
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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Detect scroll to adjust blur and padding dynamically
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    if (isMegaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMegaMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md shadow-slate-900/5'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-xs'
      }`}
      dir="rtl"
    >
      {/* Single-Line Sleek Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* Right: Brand Logo + Primary Nav in Single Line */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2.5 focus:outline-hidden cursor-pointer whitespace-nowrap"
              title="صفحه اصلی ردوبز"
            >
              <RedwebsLogo size="sm" showTagline={false} />
            </Link>

            {/* Vertical Separator */}
            <div className="hidden lg:block w-px h-6 bg-slate-200" />

            {/* Desktop Navigation Items (Single Line) */}
            <nav className="hidden lg:flex items-center gap-1 whitespace-nowrap" ref={megaMenuRef}>
              {/* Home */}
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  viewMode === 'home' && !selectedCategoryId
                    ? 'text-red-600 bg-red-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-100/70'
                }`}
              >
                <span>صفحه اصلی</span>
                {viewMode === 'home' && !selectedCategoryId && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                )}
              </Link>

              {/* Categories Mega Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    selectedCategoryId || isMegaMenuOpen || viewMode === 'category' || viewMode === 'categories-index'
                      ? 'text-red-600 bg-red-50/90 shadow-2xs'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-100/70'
                  }`}
                  aria-expanded={isMegaMenuOpen}
                >
                  <Layers className="w-3.5 h-3.5 text-red-600" />
                  <span>دسته‌بندی‌ها</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-250 ${
                      isMegaMenuOpen ? 'rotate-180 text-red-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Mega Menu Dropdown */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full right-0 mt-2.5 w-[520px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-900/15 p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-200 origin-top-right">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                          <LayoutGrid className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-lalezar text-base text-slate-900 tracking-wide leading-none">
                            موضوعات آموزشی ردوبز
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">
                            ۱۰ شاخه تخصصی مهندسی وردپرس و طراحی وب
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/categories"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <span>همه دسته‌ها</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
                      {categories.map((cat) => {
                        const isSelected = selectedCategoryId === cat.id;
                        return (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className={`p-2 text-right rounded-2xl transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer group/item whitespace-nowrap ${
                              isSelected
                                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                                : 'hover:bg-slate-50 border border-transparent hover:border-slate-200/80 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-md shrink-0 shadow-2xs group-hover/item:scale-110 transition-transform"
                                style={{
                                  backgroundColor: isSelected ? '#ffffff' : cat.color,
                                }}
                              />
                              <span className={`text-xs font-bold truncate ${
                                isSelected ? 'text-white' : 'group-hover/item:text-red-600'
                              }`}>
                                {cat.name}
                              </span>
                            </div>
                            <span className={`text-[10px] shrink-0 font-medium ${
                              isSelected ? 'text-red-100' : 'text-slate-400'
                            }`}>
                              {cat.postCount || 0}
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 bg-gradient-to-l from-red-50/70 to-purple-50/50 p-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                          دوره‌های پروژه‌محور و تست‌شده
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200/70 shadow-2xs whitespace-nowrap">
                        ۱۰۰٪ رایگان
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* WordPress Toolkit */}
              <Link
                to="/toolkit"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  viewMode === 'toolkit' || viewMode === 'tools'
                    ? 'text-red-600 bg-red-50/90 font-extrabold shadow-2xs'
                    : 'text-slate-700 hover:text-red-600 hover:bg-slate-100/70'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-red-600" />
                <span>جعبه ابزار کدهای وردپرس</span>
                <span className="bg-red-100/80 text-red-700 text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold">
                  PRO
                </span>
              </Link>
            </nav>
          </div>

          {/* Left: Quick Search + Bookmark + Admin CTA in Single Line */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Live Search Button */}
            <button
              onClick={onOpenSearch}
              className="group flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 hover:border-red-500/50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-all duration-200 cursor-pointer border border-slate-200/90 shadow-2xs whitespace-nowrap"
              title="جستجوی هوشمند (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-medium">جستجو...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-white rounded-md border border-slate-300/80 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Bookmark Drawer Button */}
            <button
              onClick={onToggleBookmarksDrawer}
              className="relative p-2 text-slate-700 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200/70 hover:border-red-200 shadow-2xs group whitespace-nowrap"
              title="آموزش‌های نشان‌شده"
            >
              <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/80 shadow-2xs"
              aria-label="منوی موبایل"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-250">
          <Link
            to="/"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between whitespace-nowrap"
          >
            <span>صفحه اصلی</span>
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" />
              <span>دسته‌بندی‌های تخصصی ردوبز</span>
            </div>
            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
              ۱۰ شاخه
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-right rounded-lg text-[11px] font-bold text-slate-700 hover:bg-white hover:text-red-600 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>

          <Link
            to="/toolkit"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-between whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-red-600" />
              <span>جعبه ابزار کدهای وردپرس</span>
            </div>
            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-mono">
              WP
            </span>
          </Link>
        </div>
      )}
    </header>
  );
};
