import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface CoverImageProps {
  src?: string;
  alt: string;
  className?: string;
  onClick?: React.MouseEventHandler;
}

const GRADIENTS = [
  'from-blue-500 via-indigo-500 to-purple-600',
  'from-emerald-500 via-teal-500 to-cyan-600',
  'from-rose-500 via-pink-500 to-fuchsia-600',
  'from-amber-500 via-orange-500 to-red-600',
  'from-sky-500 via-blue-500 to-indigo-600',
];

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

// Shows the cover image when a valid URL is set; falls back to a gradient
// placeholder when no image was provided yet or the URL fails to load.
export const CoverImage: React.FC<CoverImageProps> = ({ src, alt, className, onClick }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        onClick={onClick}
        className={`bg-gradient-to-br ${gradientFor(alt || 'وپیکا')} flex items-center justify-center ${className || ''}`}
      >
        <ImageIcon className="w-1/4 h-1/4 min-w-4 min-h-4 text-white/50" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={className}
      onClick={onClick}
      onError={() => setFailed(true)}
    />
  );
};
