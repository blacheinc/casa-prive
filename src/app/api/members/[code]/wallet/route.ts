/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Generate the pass
    const passBuffer = await generateAppleWalletPass({
      fullName: member.fullName,
      membershipCode: member.membershipCode,
      email: member.email,
      joinedAt: member.joinedAt.toISOString(),
      status: member.status,
      expiresAt: member.expiresAt?.toISOString(),
    });

    // Convert Node.js Buffer to ArrayBuffer
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
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
