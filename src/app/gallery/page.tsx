'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Images, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        if (data.error && data.images?.length === 0) {
          setError(data.error);
        }
        setImages(data.images ?? []);
      })
      .catch(() => setError('Failed to load gallery'))
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const prev = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + images.length) % images.length);
  }, [lightboxIdx, images.length]);

  const next = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % images.length);
  }, [lightboxIdx, images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  return (
    <div className="min-h-screen bg-emerald-950 pt-24 pb-16 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <Images className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-light tracking-widest text-white mb-3">
          GALLERY
        </h1>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-4" />
        <p className="text-gray-300 font-light text-sm max-w-xl mx-auto">
          Moments from Casa Privé × Alora Beach Resort
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-gray-400 font-light text-sm">Loading gallery…</p>
        </div>
      )}

      {/* Error / not configured */}
      {!loading && (error === 'Gallery not configured' || images.length === 0) && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Images className="w-16 h-16 text-emerald-800" />
          <p className="text-gray-400 font-light">No images to display yet.</p>
          <p className="text-gray-600 text-sm font-light max-w-sm text-center">
            Set{' '}
            <code className="text-emerald-400">GOOGLE_DRIVE_FOLDER_ID</code> and{' '}
            <code className="text-emerald-400">GOOGLE_DRIVE_API_KEY</code> in your environment
            variables to enable the gallery.
          </p>
        </div>
      )}

      {/* Masonry grid */}
      {!loading && images.length > 0 && (
        <div className="max-w-7xl mx-auto columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid block w-full overflow-hidden group relative focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/30 transition-colors duration-300" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-light">
            {lightboxIdx + 1} / {images.length}
          </span>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors z-10 p-2"
          >
            <ChevronLeft size={36} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIdx].url}
              alt={images[lightboxIdx].name}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors z-10 p-2"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}
