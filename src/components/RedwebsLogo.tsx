import React from 'react';

interface RedwebsLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  theme?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const RedwebsLogo: React.FC<RedwebsLogoProps> = ({
  variant = 'full',
  theme = 'auto',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  // Size dimensions
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} dir="rtl">
      {/* Redwebs Geometric Emblem Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="redwebs-red-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DC2626" />
              <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="redwebs-accent-grad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCA5A5" />
              <stop offset="0.6" stopColor="#EF4444" />
              <stop offset="1" stopColor="#F97316" />
            </linearGradient>
          </defs>

          {/* Rounded Modern Squircle Container */}
          <rect width="48" height="48" rx="14" fill="url(#redwebs-red-grad)" />

          {/* Dynamic Faceted 'V' - Coding & Web Knowledge Monogram */}
          {/* Left Wing */}
          <path
            d="M13 14L24 35L20 35L10 16C9.44772 14.8954 10.3431 14 11.5 14H13Z"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Right Wing with Accent facet */}
          <path
            d="M35 14L24 35L28 35L38 16C38.5523 14.8954 37.6569 14 36.5 14H35Z"
            fill="url(#redwebs-accent-grad)"
          />
          {/* Central Knowledge Node / Code Spark */}
          <circle cx="24" cy="20" r="3.5" fill="#FFFFFF" />
          <path
            d="M24 16.5L25.2 19L27.5 20L25.2 21L24 23.5L22.8 21L20.5 20L22.8 19L24 16.5Z"
            fill="#F59E0B"
          />
        </svg>
      </div>

      {/* Wordmark (Persian & Brand) */}
      {variant !== 'icon' && (
        <div className="flex flex-col text-right leading-none">
          <div className="flex items-center gap-2">
            <span
              className={`font-lalezar tracking-wide leading-none ${textSizes[size]} ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              ردوبز
            </span>
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                isDark ? 'bg-slate-800 text-red-400 border border-slate-700' : 'bg-red-50 text-red-600 border border-red-100'
              }`}
            >
              REDWEBS
            </span>
          </div>

          {showTagline && (
            <span
              className={`text-[11px] font-medium mt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              یاد بگیرید. بسازید. رشد کنید.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
