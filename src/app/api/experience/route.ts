// app/api/experience/route.ts
// Fetches images for all 6 experience categories from separate Google Drive folders.
// Each category has its own env var for the folder ID.
// All folders must be shared publicly ("Anyone with the link can view").
import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_DRIVE_API_KEY ?? '';

async function fetchFolder(folderId: string): Promise<{ id: string; name: string; url: string }[]> {
  if (!folderId || !API_KEY) return [];

  const query = encodeURIComponent(
    `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`
  );
  const fields = encodeURIComponent('files(id,name)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}&fields=${fields}&orderBy=name&pageSize=100`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`Drive folder fetch failed (${folderId}):`, res.status);
    return [];
  }

  const data = await res.json();
  return (data.files ?? []).map((f: { id: string; name: string }) => ({
    id: f.id,
    name: f.name,
    url: `https://lh3.googleusercontent.com/d/${f.id}`,
  }));
}

export async function GET() {
  const definitions = [
    { key: 'night-energy',           label: 'Night Energy',           folderId: process.env.GOOGLE_DRIVE_FOLDER_NIGHT_ENERGY ?? '' },
    { key: 'the-vibes',              label: 'The Vibes',              folderId: process.env.GOOGLE_DRIVE_FOLDER_THE_VIBES ?? '' },
    { key: 'unforgettable-moments',  label: 'Unforgettable Moments',  folderId: process.env.GOOGLE_DRIVE_FOLDER_UNFORGETTABLE_MOMENTS ?? '' },
    { key: 'premium-service',        label: 'Premium Service',        folderId: process.env.GOOGLE_DRIVE_FOLDER_PREMIUM_SERVICE ?? '' },
    { key: 'the-crowd',              label: 'The Crowd',              folderId: process.env.GOOGLE_DRIVE_FOLDER_THE_CROWD ?? '' },
    { key: 'premium-drinks',         label: 'Premium Drinks',         folderId: process.env.GOOGLE_DRIVE_FOLDER_PREMIUM_DRINKS ?? '' },
  ];

  const results = await Promise.all(
    definitions.map(async (def) => ({
      key: def.key,
      label: def.label,
      images: await fetchFolder(def.folderId),
    }))
  );

  return NextResponse.json({ categories: results });
}
