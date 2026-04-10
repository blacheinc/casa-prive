'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DriveImage { id: string; name: string; url: string; }
interface Category   { key: string; label: string; images: DriveImage[]; }
interface Lightbox   { catIdx: number; imgIdx: number; }

// ─── Lightbox ────────────────────────────────────────────────────────────────

function LightboxModal({
  categories,
  lightbox,
  onClose,
  onNav,
}: {
  categories: Category[];
  lightbox: Lightbox;
  onClose: () => void;
  onNav: (catIdx: number, imgIdx: number) => void;
}) {
  const cat = categories[lightbox.catIdx];
  const img = cat?.images[lightbox.imgIdx];

  const prev = useCallback(() => {
    const newIdx = (lightbox.imgIdx - 1 + cat.images.length) % cat.images.length;
    onNav(lightbox.catIdx, newIdx);
  }, [lightbox, cat, onNav]);

  const next = useCallback(() => {
    const newIdx = (lightbox.imgIdx + 1) % cat.images.length;
    onNav(lightbox.catIdx, newIdx);
  }, [lightbox, cat, onNav]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10 p-2"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* Counter + label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-xs tracking-widest text-emerald-400 uppercase">{cat.label}</p>
        <p className="text-white/40 text-xs mt-0.5">{lightbox.imgIdx + 1} / {cat.images.length}</p>
      </div>

      {/* Prev */}
      <button
        className="absolute left-2 md:left-6 text-white/60 hover:text-white transition-colors z-10 p-2"
        onClick={e => { e.stopPropagation(); prev(); }}
      >
        <ChevronLeft size={36} />
      </button>

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.url}
          alt={img.name}
          className="max-w-[90vw] max-h-[85vh] object-contain"
          style={{ boxShadow: '0 0 60px rgba(16,185,129,0.15)' }}
        />
        {/* Neon corner accents */}
        {[['top-0 left-0','border-t border-l'],['top-0 right-0','border-t border-r'],
          ['bottom-0 left-0','border-b border-l'],['bottom-0 right-0','border-b border-r']].map(([pos, border]) => (
          <div key={pos} className={`absolute ${pos} w-5 h-5 ${border} border-emerald-500/60`} />
        ))}
      </div>

      {/* Next */}
      <button
        className="absolute right-2 md:right-6 text-white/60 hover:text-white transition-colors z-10 p-2"
        onClick={e => { e.stopPropagation(); next(); }}
      >
        <ChevronRight size={36} />
      </button>
    </div>
  );
}

// ─── Category row ─────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  index,
  onImageClick,
}: {
  category: Category;
  index: number;
  onImageClick: (imgIdx: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 600 : -600, behavior: 'smooth' });
  };

  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="mb-14">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 px-4 md:px-8">
        <span className="text-4xl font-light select-none" style={{ color: 'rgba(16,185,129,0.15)' }}>
          {number}
        </span>
        <div>
          <p className="text-xs tracking-[0.3em] text-emerald-500 uppercase mb-0.5">The Experience</p>
          <h3 className="text-lg md:text-xl font-light tracking-widest text-white">
            {category.label.toUpperCase()}
          </h3>
        </div>
        <div className="flex-1 h-px ml-2" style={{
          background: 'linear-gradient(90deg,rgba(16,185,129,0.4),transparent)',
        }} />
        {/* Arrows */}
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 flex items-center justify-center border border-emerald-800 text-emerald-500 hover:border-emerald-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 flex items-center justify-center border border-emerald-800 text-emerald-500 hover:border-emerald-500 hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll strip */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-8"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {category.images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => onImageClick(i)}
            className="flex-shrink-0 overflow-hidden group focus:outline-none"
            style={{ width: 280, height: 200, scrollSnapAlign: 'start' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </button>
        ))}

        {/* Spacer so last card isn't flush against the edge */}
        <div className="flex-shrink-0 w-4 md:w-8" />
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-4 mb-4 px-4 md:px-8">
        <div className="w-10 h-8 loading-shimmer" />
        <div className="space-y-1.5">
          <div className="h-2 w-16 loading-shimmer" />
          <div className="h-4 w-36 loading-shimmer" />
        </div>
      </div>
      <div className="flex gap-2 px-4 md:px-8 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 loading-shimmer" style={{ width: 280, height: 200, opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [lightbox, setLightbox]     = useState<Lightbox | null>(null);

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(data => setCategories(data.categories ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openLightbox  = (catIdx: number, imgIdx: number) => setLightbox({ catIdx, imgIdx });
  const closeLightbox = () => setLightbox(null);
  const navLightbox   = (catIdx: number, imgIdx: number) => setLightbox({ catIdx, imgIdx });

  return (
    <section
      className="py-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#022522 0%,#010f0e 100%)' }}
    >
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg,transparent,#10b981)' }} />
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg,#10b981,transparent)' }} />
        </div>
        <h2 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-white mb-3">
          THE{' '}
          <span style={{
            background: 'linear-gradient(135deg,#10b981,#d4af37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            EXPERIENCE
          </span>
        </h2>
        <p className="text-gray-400 font-light text-sm tracking-widest">
          Premium drinks, stunning beachside vibes, and unforgettable nights
        </p>
      </div>

      {/* Rows */}
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
        : categories.map((cat, i) => (
            <CategoryRow
              key={cat.key}
              category={cat}
              index={i}
              onImageClick={imgIdx => openLightbox(i, imgIdx)}
            />
          ))
      }

      {/* Lightbox */}
      {lightbox && (
        <LightboxModal
          categories={categories}
          lightbox={lightbox}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </section>
  );
}
