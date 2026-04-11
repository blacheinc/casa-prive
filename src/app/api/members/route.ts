// app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRCode, generateMembershipCode } from '@/lib/card';
import { whatsappService } from '@/lib/whatsapp';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, profession, interest, reference1, reference2, membershipType } = body;

    // Validation
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
    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL}/member-card/${membershipCode}`;
    const qrCode = await generateQRCode(cardUrl);

    // Create member
    const member = await prisma.member.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        profession: profession || null,
        interest: interest || null,
        reference1: reference1 || null,
        reference2: reference2 || null,
        membershipCode,
        qrCode,
        status: 'ACTIVE',
        membershipType: membershipType === 'PREMIUM' ? 'PREMIUM' : 'STANDARD',
      },
    });

    console.log('✓ Member created:', member.fullName, `(${member.membershipCode})`);

    // Send welcome email — awaited so serverless functions don't terminate before it fires
    try {
      await emailService.sendMemberWelcome(email, {
        fullName: member.fullName,
        membershipCode: member.membershipCode,
        email: member.email,
        phone: member.phone || undefined,
        membershipType: member.membershipType,
      });
      console.log('✓ Welcome email sent to:', email);
    } catch (error: any) {
      console.error('❌ Email send failed (non-critical):', error.message);
      // Don't fail the request - member is already created
    }

    // Send WhatsApp message if phone provided — awaited for the same reason
    if (phone) {
      try {
        await whatsappService.sendMemberWelcome(phone, {
          fullName: member.fullName,
          membershipCode: member.membershipCode,
          membershipType: member.membershipType,
        });
        console.log('✓ WhatsApp sent to:', phone);
      } catch (error: any) {
        console.error('❌ WhatsApp send failed (non-critical):', error.message);
        // Don't fail the request - member is already created
      }
    } else {
      console.log('ℹ️  No phone number provided - skipping WhatsApp');
    }

    return NextResponse.json({ 
      success: true,
      member: {
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        membershipCode: member.membershipCode,
        membershipType: member.membershipType,
        cardUrl,
      },
      message: `Member created successfully! Welcome email sent to ${email}.${phone ? ' WhatsApp message sent.' : ''}`
    });
  } catch (error) {
    console.error('❌ Create member error:', error);
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
    console.error('❌ Get member error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}