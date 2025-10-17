// app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRCode, generateMembershipCode } from '@/lib/card';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { email },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'Member with this email already exists' },
        { status: 400 }
      );
    }

    // Generate membership code
    const membershipCode = generateMembershipCode();

    // Generate QR code pointing to member card URL
    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/member-card/${membershipCode}`;
    const qrCode = await generateQRCode(cardUrl);

    // Create member
    const member = await prisma.member.create({
      data: {
        fullName,
        email,
        phone,
        membershipCode,
        qrCode,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipCode = searchParams.get('code');
    const email = searchParams.get('email');

    if (membershipCode) {
      const member = await prisma.member.findUnique({
        where: { membershipCode },
      });

      if (!member) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ member });
    }

    if (email) {
      const member = await prisma.member.findUnique({
        where: { email },
      });

      if (!member) {
        return NextResponse.json(
          { error: 'Member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ member });
    }

    // Return all members (admin only in production)
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Get member error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}