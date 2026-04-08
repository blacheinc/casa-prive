// app/api/gallery/route.ts
// Reads gallery images from a Google Drive folder.
// The folder must be shared publicly ("Anyone with the link can view").
import { NextResponse } from 'next/server';

export async function GET() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!folderId || !apiKey) {
    return NextResponse.json({ error: 'Gallery not configured', images: [] }, { status: 200 });
  }

  try {
    const query = encodeURIComponent(
      `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`
    );
    const fields = encodeURIComponent('files(id,name,createdTime)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&fields=${fields}&orderBy=createdTime+desc&pageSize=200`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Google Drive API error:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch gallery', images: [] }, { status: 500 });
    }

    const data = await res.json();

    const images = (data.files ?? []).map((file: { id: string; name: string }) => ({
      id: file.id,
      name: file.name,
      // Direct CDN URL — works for files in a publicly shared folder
      url: `https://lh3.googleusercontent.com/d/${file.id}`,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery', images: [] }, { status: 500 });
  }
}
