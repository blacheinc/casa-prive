'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface DriveImage {
  id: string;
  name: string;
  url: string;
}

interface Category {
  key: string;
  label: string;
  images: DriveImage[];
}

// Skeleton shimmer row shown while loading
function SkeletonRow() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-72 h-52 loading-shimmer"
          style={{ opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  );
}

function CategoryRow({ category, index }: { category: Category; index: number }) {
  const reverse = index % 2 === 1;
  const { images, label } = category;

  // Pad so we always have at least a few images for the marquee to look good
  const filled = images.length === 0
    ? []
    : images.length < 4
      ? [...images, ...images, ...images, ...images].slice(0, 12)
      : images;

  // Duplicate for seamless loop
  const track = [...filled, ...filled];

  // ~80px per second
  const duration = Math.max(20, Math.round((filled.length * 320) / 80));

  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="mb-16">
      {/* Row header */}
      <div className="flex items-center gap-4 mb-5 px-6 md:px-10">
        <span
          className="text-5xl font-light select-none"
          style={{ color: 'rgba(16,185,129,0.15)' }}
        >
          {number}
        </span>
        <div>
          <p className="text-xs tracking-[0.35em] text-emerald-500 uppercase mb-1">
            The Experience
          </p>
          <h3 className="text-xl md:text-2xl font-light tracking-widest text-white">
            {label.toUpperCase()}
          </h3>
        </div>
        {/* Neon rule */}
        <div className="flex-1 h-px" style={{
          background: 'linear-gradient(90deg, rgba(16,185,129,0.5), rgba(16,185,129,0.05) 70%, transparent)',
        }} />
        <div
          className="w-2 h-2 rotate-45 flex-shrink-0"
          style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }}
        />
      </div>

      {/* Marquee strip */}
      {images.length === 0 ? (
        <SkeletonRow />
      ) : (
        <div
          className="overflow-hidden marquee-wrap"
          style={{ maskImage: 'linear-gradient(90deg,transparent,black 6%,black 94%,transparent)' }}
        >
          <div
            className={`marquee-track ${reverse ? 'marquee-right' : 'marquee-left'}`}
            style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
          >
            {track.map((img, i) => (
              <div
                key={`${img.id}-${i}`}
                className="flex-shrink-0 w-72 h-52 mx-1.5 overflow-hidden relative group cursor-pointer"
                style={{
                  border: '1px solid rgba(16,185,129,0.1)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Scan-line overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
                  }}
                />
                {/* Neon glow border on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.7), inset 0 0 20px rgba(16,185,129,0.12)',
                  }}
                />
                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ borderTop: '1px solid #10b981', borderLeft: '1px solid #10b981' }} />
                <div className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ borderTop: '1px solid #10b981', borderRight: '1px solid #10b981' }} />
                <div className="absolute bottom-2 left-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ borderBottom: '1px solid #10b981', borderLeft: '1px solid #10b981' }} />
                <div className="absolute bottom-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ borderBottom: '1px solid #10b981', borderRight: '1px solid #10b981' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExperienceSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className="py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #022522 0%, #010f0e 40%, #011413 100%)',
        backgroundImage: `
          linear-gradient(180deg, #022522 0%, #010f0e 40%, #011413 100%),
          linear-gradient(rgba(16,185,129,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.025) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 60px 60px, 60px 60px',
      }}
    >
      {/* Section header */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, #10b981)' }} />
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, #10b981, transparent)' }} />
        </div>
        <h2 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-white mb-3">
          THE{' '}
          <span style={{
            background: 'linear-gradient(135deg, #10b981, #d4af37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            EXPERIENCE
          </span>
        </h2>
        <p className="text-gray-400 font-light text-sm tracking-widest max-w-xl mx-auto">
          Premium drinks, stunning beachside vibes, and unforgettable nights
        </p>
        {/* Animated rule */}
        <div className="relative h-px w-48 mx-auto mt-6 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'rgba(16,185,129,0.2)' }} />
          <div
            className="absolute top-0 h-full w-12"
            style={{
              background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
              animation: 'marquee-left 3s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Category rows */}
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="mb-16 px-6 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-10 loading-shimmer" />
                <div className="space-y-2">
                  <div className="h-2 w-20 loading-shimmer" />
                  <div className="h-4 w-40 loading-shimmer" />
                </div>
              </div>
              <SkeletonRow />
            </div>
          ))
        : categories.map((cat, i) => (
            <CategoryRow key={cat.key} category={cat} index={i} />
          ))
      }
    </section>
  );
}
