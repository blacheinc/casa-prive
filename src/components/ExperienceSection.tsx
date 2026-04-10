'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface DriveImage { id: string; name: string; url: string; }
interface Category   { key: string; label: string; images: DriveImage[]; }

// ─── Fullscreen lightbox (used inside the More modal) ────────────────────────

function Lightbox({
  images, idx, onClose, onNav,
}: {
  images: DriveImage[]; idx: number; onClose: () => void; onNav: (i: number) => void;
}) {
  const prev = useCallback(() => onNav((idx - 1 + images.length) % images.length), [idx, images.length, onNav]);
  const next = useCallback(() => onNav((idx + 1) % images.length),                 [idx, images.length, onNav]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-10" onClick={onClose}>
        <X size={22} />
      </button>
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">
        {idx + 1} / {images.length}
      </span>
      <button className="absolute left-3 p-2 text-white/60 hover:text-white z-10"
        onClick={e => { e.stopPropagation(); prev(); }}>
        <ChevronLeft size={32} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[idx].url} alt={images[idx].name}
        className="max-w-[88vw] max-h-[88vh] object-contain"
        onClick={e => e.stopPropagation()}
      />
      <button className="absolute right-3 p-2 text-white/60 hover:text-white z-10"
        onClick={e => { e.stopPropagation(); next(); }}>
        <ChevronRight size={32} />
      </button>
    </div>
  );
}

// ─── "More" modal — full grid of all images in a category ────────────────────

function MoreModal({ category, onClose }: { category: Category; onClose: () => void; }) {
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && lbIdx === null) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, lbIdx]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-emerald-900/40"
           style={{ background: 'rgba(1,15,14,0.95)', backdropFilter: 'blur(12px)' }}>
        <div>
          <p className="text-xs tracking-[0.3em] text-emerald-500 uppercase mb-0.5">The Experience</p>
          <h2 className="text-white font-light tracking-widest text-lg">{category.label.toUpperCase()}</h2>
          <p className="text-white/30 text-xs mt-0.5">{category.images.length} photos</p>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-2">
          <X size={22} />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {category.images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLbIdx(i)}
              className="relative overflow-hidden group aspect-[4/3] bg-emerald-950/50 focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url} alt={img.name} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox within modal */}
      {lbIdx !== null && (
        <Lightbox
          images={category.images}
          idx={lbIdx}
          onClose={() => setLbIdx(null)}
          onNav={setLbIdx}
        />
      )}
    </div>
  );
}

// ─── Category grid card with auto-advancing slideshow ────────────────────────

function CategoryCard({
  category, index, onMore,
}: {
  category: Category; index: number; onMore: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible]       = useState(true); // for cross-fade
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const images = category.images;

  const goTo = useCallback((next: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrentIdx(next);
      setVisible(true);
    }, 350);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIdx(prev => {
        const next = (prev + 1) % images.length;
        setVisible(false);
        setTimeout(() => { setCurrentIdx(next); setVisible(true); }, 350);
        return prev; // keep prev while fading
      });
    }, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length]);

  const manualNav = (dir: 'prev' | 'next') => {
    if (timerRef.current) clearInterval(timerRef.current); // reset timer
    const next = dir === 'next'
      ? (currentIdx + 1) % images.length
      : (currentIdx - 1 + images.length) % images.length;
    goTo(next);
  };

  const num = String(index + 1).padStart(2, '0');

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center">
        <p className="text-emerald-900 text-xs tracking-widest uppercase">No images</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden group bg-black">

      {/* Slideshow image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[currentIdx].url}
        alt={images[currentIdx].name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30 pointer-events-none" />

      {/* Top row: counter + MORE button */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <span className="text-white/40 text-xs tabular-nums">
          {currentIdx + 1}<span className="text-white/20"> / </span>{images.length}
        </span>
        <button
          onClick={onMore}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs tracking-widest text-white/70 border border-white/20 hover:border-emerald-400 hover:text-emerald-400 transition-all duration-200"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.4)' }}
        >
          <LayoutGrid size={11} />
          MORE
        </button>
      </div>

      {/* Prev / Next arrows — visible on hover */}
      <button
        onClick={() => manualNav('prev')}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => manualNav('next')}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>

      {/* Bottom: number, label, dot indicators */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-xs text-emerald-500 tracking-[0.3em] uppercase mb-0.5">{num}</p>
        <h3 className="text-white font-light tracking-widest text-base mb-2">
          {category.label.toUpperCase()}
        </h3>
        {/* Dot indicators */}
        <div className="flex items-center gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i); }}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === currentIdx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="aspect-[4/3] loading-shimmer" />
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [openCat, setOpenCat]       = useState<Category | null>(null);

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(data => setCategories(data.categories ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg,#022522 0%,#010f0e 100%)' }}>

      {/* Header */}
      <div className="text-center mb-10 px-4">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg,transparent,#10b981)' }} />
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg,#10b981,transparent)' }} />
        </div>
        <h2 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-white mb-2">
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

      {/* Grid */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
            : categories.map((cat, i) => (
                <CategoryCard
                  key={cat.key}
                  category={cat}
                  index={i}
                  onMore={() => setOpenCat(cat)}
                />
              ))
          }
        </div>
      </div>

      {/* More modal */}
      {openCat && (
        <MoreModal category={openCat} onClose={() => setOpenCat(null)} />
      )}
    </section>
  );
}
