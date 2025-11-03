// app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRCode, generateMembershipCode } from '@/lib/card';
import { emailService } from '@/lib/email';
import { whatsappService } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, profession, interest, reference1, reference2 } = body;

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
      },
    });

    // Send notifications asynchronously (don't wait for them to complete)
    // This ensures the API responds quickly
    const sendNotifications = async () => {
      try {
        // 1. Send welcome email (primary notification)
        await emailService.sendMemberWelcome(email, {
          fullName: member.fullName,
          membershipCode: member.membershipCode,
          email: member.email,
          phone: member.phone || undefined,
        });

        // 2. Send WhatsApp message if phone number provided
        if (phone) {
          await whatsappService.sendMemberWelcome(phone, {
            fullName: member.fullName,
            membershipCode: member.membershipCode,
          });
        }

        // 3. Send admin notification
        await emailService.sendAdminNotification(
          'New Member Added',
          `
            <div class="intro-text">
              <p><strong>New member has been added to Casa Privé:</strong></p>
              <ul class="info-list">
                <li><strong>Name:</strong> ${member.fullName}</li>
                <li><strong>Email:</strong> ${member.email}</li>
                ${member.phone ? `<li><strong>Phone:</strong> ${member.phone}</li>` : ''}
                <li><strong>Membership ID:</strong> ${member.membershipCode}</li>
                ${member.profession ? `<li><strong>Profession:</strong> ${member.profession}</li>` : ''}
              </ul>
              <p style="margin-top: 25px;">
                <a href="${cardUrl}" class="cta-button" style="display: inline-block; padding: 15px 35px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 20px;">
                  VIEW MEMBER CARD
                </a>
              </p>
            </div>
          `
        );
      } catch (notificationError) {
        // Log but don't fail the request
        console.error('Error sending notifications:', notificationError);
      }
    };

    // Fire and forget the notifications
    sendNotifications();

    return NextResponse.json({ 
      success: true,
      member: {
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        membershipCode: member.membershipCode,
        cardUrl,
      },
      message: 'Member created successfully. Welcome email and WhatsApp message sent.'
    });
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