'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface DriveImage { id: string; name: string; url: string; }
interface Category   { key: string; label: string; images: DriveImage[]; }

// ─── Fullscreen lightbox ──────────────────────────────────────────────────────

function Lightbox({ images, idx, onClose, onNav }: {
  images: DriveImage[]; idx: number;
  onClose: () => void; onNav: (i: number) => void;
}) {
  const prev = useCallback(() => onNav((idx - 1 + images.length) % images.length), [idx, images.length, onNav]);
  const next = useCallback(() => onNav((idx + 1) % images.length), [idx, images.length, onNav]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 z-10 p-2 text-white/50 hover:text-white" onClick={onClose}>
        <X size={22} />
      </button>
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest pointer-events-none">
        {idx + 1} / {images.length}
      </p>
      <button
        className="absolute left-3 p-3 text-white/50 hover:text-white z-10"
        onClick={e => { e.stopPropagation(); prev(); }}
      ><ChevronLeft size={28} /></button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[idx].url} alt={images[idx].name}
        className="max-w-[88vw] max-h-[88vh] object-contain"
        onClick={e => e.stopPropagation()}
      />

      <button
        className="absolute right-3 p-3 text-white/50 hover:text-white z-10"
        onClick={e => { e.stopPropagation(); next(); }}
      ><ChevronRight size={28} /></button>
    </div>
  );
}

// ─── More modal ───────────────────────────────────────────────────────────────

function MoreModal({ category, onClose }: { category: Category; onClose: () => void }) {
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (lbIdx !== null) return; // let lightbox handle ESC
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lbIdx, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#050f0e' }}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
        <div>
          <p className="text-emerald-500 text-xs tracking-[0.3em] uppercase mb-0.5">The Experience</p>
          <h2 className="text-white font-light tracking-widest text-lg">{category.label.toUpperCase()}</h2>
          <p className="text-white/30 text-xs mt-0.5">{category.images.length} photos</p>
        </div>
        <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
          <X size={22} />
        </button>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {category.images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLbIdx(i)}
              className="relative block overflow-hidden focus:outline-none"
              style={{ aspectRatio: '4/3' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url} alt={img.name} loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      </div>

      {lbIdx !== null && (
        <Lightbox images={category.images} idx={lbIdx} onClose={() => setLbIdx(null)} onNav={setLbIdx} />
      )}
    </div>
  );
}

// ─── Category slideshow card ──────────────────────────────────────────────────

function CategoryCard({ category, index, onMore }: {
  category: Category; index: number; onMore: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const images = category.images;

  // Auto-advance — simple interval, no state nesting
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % images.length), 10000);
    return () => clearInterval(id);
  }, [images.length]);

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-emerald-950/20 flex items-center justify-center"
        style={{ border: '1px solid rgba(16,185,129,0.1)' }}>
        <p className="text-white/20 text-xs tracking-widest uppercase">No images</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden group" style={{ aspectRatio: '4/3', background: '#000' }}>

      {/* Stack all images — CSS opacity handles the crossfade, no JS animation state */}
      {images.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.id}
          src={img.url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 0.8s ease',
            // Only load current + neighbours eagerly
            ...(Math.abs(i - idx) <= 1 ? {} : { loading: 'lazy' as const }),
          }}
        />
      ))}

      {/* Dark gradient — pointer-events-none so it doesn't block clicks */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(0,0,0,0.25) 100%)' }} />

      {/* Top bar: counter + MORE */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3">
        <span className="text-white/40 text-xs tabular-nums"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          {idx + 1} / {images.length}
        </span>
        <button
          onClick={onMore}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs tracking-widest border transition-all duration-200"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.7)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#10b981';
            (e.currentTarget as HTMLButtonElement).style.color = '#10b981';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
          }}
        >
          <LayoutGrid size={11} />
          VIEW ALL
        </button>
      </div>

      {/* Side arrows — appear on hover */}
      <button
        onClick={prev}
        className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' }}
      >
        <ChevronLeft size={22} className="text-white drop-shadow" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.4), transparent)' }}
      >
        <ChevronRight size={22} className="text-white drop-shadow" />
      </button>

      {/* Bottom: number, label, dots */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-emerald-400 text-xs tracking-[0.3em] uppercase mb-0.5">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="text-white font-light tracking-widest text-sm mb-2">
          {category.label.toUpperCase()}
        </h3>
        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex items-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  height: 2,
                  width: i === idx ? 20 : 6,
                  background: i === idx ? '#10b981' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return <div className="loading-shimmer" style={{ aspectRatio: '4/3' }} />;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [openCat, setOpenCat]       = useState<Category | null>(null);

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []))
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
          }}>EXPERIENCE</span>
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
                <CategoryCard key={cat.key} category={cat} index={i} onMore={() => setOpenCat(cat)} />
              ))
          }
        </div>
      </div>

      {openCat && <MoreModal category={openCat} onClose={() => setOpenCat(null)} />}
    </section>
  );
}
