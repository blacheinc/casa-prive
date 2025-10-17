// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { googleSheets } from '@/lib/sheets';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, rating, category, message } = body;

    if (!name || !email || !rating || !category || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        rating: parseInt(rating),
        category,
        message,
      },
    });

    // Log to Google Sheets
    try {
      await googleSheets.logFeedback({
        id: feedback.id,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        name: feedback.name,
        email: feedback.email,
        rating: feedback.rating,
        category: feedback.category,
        message: feedback.message,
      });
    } catch (error) {
      console.error('Google Sheets logging failed:', error);
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const where = published === 'true' ? { isPublished: true } : {};

    const feedbacks = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}