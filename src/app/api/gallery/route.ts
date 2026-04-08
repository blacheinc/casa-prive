// app/api/gallery/route.ts
// Reads gallery images from a Google Sheet.
// Sheet format: Column A = image URL, Column B = optional caption
// The sheet must be shared publicly ("Anyone with the link can view").
import { NextResponse } from 'next/server';

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEETS_GALLERY_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!sheetId || !apiKey) {
    return NextResponse.json({ error: 'Gallery not configured', images: [] }, { status: 200 });
  }

  try {
    // Fetch columns A and B (URL + optional caption)
    const range = encodeURIComponent('Sheet1!A:B');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Google Sheets API error:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch gallery', images: [] }, { status: 500 });
    }

    const data = await res.json();
    const rows: string[][] = data.values ?? [];

    // Skip header row if first cell looks like a label, not a URL
    const dataRows = rows[0]?.[0]?.toLowerCase().startsWith('http') ? rows : rows.slice(1);

    const images = dataRows
      .filter((row) => row[0]?.trim())
      .map((row, idx) => ({
        id: String(idx),
        url: row[0].trim(),
        name: row[1]?.trim() || '',
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery', images: [] }, { status: 500 });
  }
}
