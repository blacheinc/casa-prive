// app/api/drive-image/[fileId]/route.ts
// Proxies a publicly-shared Google Drive image via the thumbnail endpoint.
// Returns the image with aggressive browser/CDN cache headers.
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  // Validate file ID is safe (alphanumeric + hyphens/underscores only)
  if (!fileId || !/^[\w-]+$/.test(fileId)) {
    return new NextResponse('Invalid file ID', { status: 400 });
  }

  // drive.google.com/thumbnail works for any publicly shared file — no API key needed
  const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      return new NextResponse('Image not found', { status: res.status });
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';

    // Stream the body directly — no buffering
    return new NextResponse(res.body, {
      headers: {
        'Content-Type': contentType,
        // Cache in browser for 24 h; CDN/edge can keep for 7 days
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('drive-image proxy error:', err);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
