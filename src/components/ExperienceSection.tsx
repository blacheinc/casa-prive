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
  const isEven = index % 2 === 0;

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
      <div className="aspect-[16/9] md:aspect-[21/9] bg-emerald-950/20 flex items-center justify-center rounded-lg"
        style={{ border: '1px solid rgba(16,185,129,0.08)' }}>
        <p className="text-white/20 text-xs tracking-widest uppercase">No images</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 rounded-lg overflow-hidden`}
      style={{ background: '#080f0e', border: '1px solid rgba(16,185,129,0.08)' }}
    >
      {/* Image slideshow */}
      <div className="relative overflow-hidden group md:w-[65%] flex-shrink-0" style={{ aspectRatio: '16/10' }}>
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.id}
            src={img.url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === idx ? 1 : 0,
              transition: 'opacity 1s ease',
              transform: i === idx ? 'scale(1)' : 'scale(1.05)',
              ...(Math.abs(i - idx) <= 1 ? {} : { loading: 'lazy' as const }),
            }}
          />
        ))}

        {/* Subtle vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />

        {/* Side arrows — appear on hover */}
        <button
          onClick={prev}
          className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)' }}
        >
          <ChevronLeft size={20} className="text-white/80" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)' }}
        >
          <ChevronRight size={20} className="text-white/80" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white/50 text-xs tabular-nums px-2 py-1 rounded"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            {idx + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Info panel */}
      <div className="flex flex-col justify-between p-6 md:p-8 md:w-[35%]">
        <div>
          <span className="text-emerald-500/40 text-5xl md:text-6xl font-extralight leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="mt-3 mb-4">
            <div className="w-8 h-px bg-emerald-500/30 mb-4" />
            <h3 className="text-white font-light tracking-[0.2em] text-lg md:text-xl">
              {category.label.toUpperCase()}
            </h3>
          </div>
        </div>
        <button
          onClick={onMore}
          className="self-start flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.2em] uppercase rounded-sm transition-all duration-300 hover:gap-3"
          style={{
            background: 'transparent',
            border: '1px solid rgba(16,185,129,0.3)',
            color: 'rgba(16,185,129,0.8)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(16,185,129,0.1)';
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.color = '#10b981';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
            e.currentTarget.style.color = 'rgba(16,185,129,0.8)';
          }}
        >
          <LayoutGrid size={12} />
          View Gallery
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return <div className="loading-shimmer rounded-lg" style={{ aspectRatio: '21/9' }} />;
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
    <section className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg,#022522 0%,#010f0e 100%)' }}>

      {/* Header */}
      <div className="text-center mb-14 px-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg,transparent,#10b981)' }} />
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg,#10b981,transparent)' }} />
        </div>
        <h2 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-white mb-3">
          THE{' '}
          <span style={{
            background: 'linear-gradient(135deg,#10b981,#d4af37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>EXPERIENCE</span>
        </h2>
        <p className="text-gray-400 font-light text-sm tracking-widest max-w-md mx-auto">
          Stunning beachside vibes and unforgettable nights
        </p>
      </div>

      {/* Cards */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)
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
