/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/members/[code]/wallet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAppleWalletPass } from "@/lib/apple-wallet";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    const member = await prisma.member.findUnique({
      where: { membershipCode: code },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (member.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: "Membership is not active" },
        { status: 403 }
      );
    }

    // Generate the pass with ALL member data
    const passBuffer = await generateAppleWalletPass({
      fullName: member.fullName,
      membershipCode: member.membershipCode,
      email: member.email,
      phone: member.phone || undefined,
      joinedAt: member.joinedAt.toISOString(),
      status: member.status,
      expiresAt: member.expiresAt?.toISOString(),
    });

    const arrayBuffer = passBuffer.buffer.slice(
      passBuffer.byteOffset,
      passBuffer.byteOffset + passBuffer.byteLength
    ) as ArrayBuffer;

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="casaprive-${member.membershipCode}.pkpass"`,
      },
    });
  } catch (error: any) {
    console.error("Wallet pass generation error:", error);
    
    const errorMessage = error.message?.includes("Certificate files not found")
      ? "Apple Wallet service is temporarily unavailable"
      : "Failed to generate wallet pass";
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}