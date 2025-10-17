// src/app/api/members/[code]/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateAppleWalletPass } from '@/lib/apple-wallet';
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    // Find the member
    const member = await prisma.member.findUnique({
      where: { membershipCode: code },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    if (member.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Membership is not active' },
        { status: 403 }
      );
    }

    // Generate the pass
    const passBuffer = await generateAppleWalletPass({
      fullName: member.fullName,
      membershipCode: member.membershipCode,
      email: member.email,
      joinedAt: member.joinedAt.toISOString(),
      status: member.status,
      expiresAt: member.expiresAt?.toISOString(),
    });

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(passBuffer);

    // Return with correct headers for Safari/iOS
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="casaprive-${code}.pkpass"`,
        'Content-Length': passBuffer.length.toString(),
        // Important for iOS/Safari
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating wallet pass:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate wallet pass',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}