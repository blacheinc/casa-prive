// app/api/drive-image/[fileId]/route.ts
// Proxies a publicly-shared Google Drive image using the Drive API v3 (alt=media).
// Compresses and resizes with sharp for fast loading.
// Requires GOOGLE_DRIVE_API_KEY and the file to be shared "Anyone with the link".
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_WIDTH = 1400;
const QUALITY = 75;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  if (!fileId || !/^[\w-]+$/.test(fileId)) {
    return new NextResponse('Invalid file ID', { status: 400 });
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    return new NextResponse('Not configured', { status: 500 });
  }

  // Optional query params for size control
  const { searchParams } = req.nextUrl;
  const reqWidth = Math.min(Number(searchParams.get('w')) || MAX_WIDTH, 2400);
  const reqQuality = Math.min(Number(searchParams.get('q')) || QUALITY, 95);

  // Drive API v3 alt=media — downloads file content directly.
  // Works for any file shared as "Anyone with the link" using an API key.
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error(`drive-image fetch failed ${fileId}:`, res.status, text.slice(0, 200));
      return new NextResponse('Image not found', { status: res.status });
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';

    // Only proxy actual image responses — reject HTML (e.g. login redirects)
    if (contentType.includes('text/html')) {
      console.error(`drive-image got HTML for ${fileId} — file may not be publicly shared`);
      return new NextResponse('Image not accessible', { status: 403 });
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // Resize and compress to WebP
    const optimized = await sharp(buffer)
      .resize({ width: reqWidth, withoutEnlargement: true })
      .webp({ quality: reqQuality })
      .toBuffer();

    return new NextResponse(new Uint8Array(optimized), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('drive-image proxy error:', err);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
