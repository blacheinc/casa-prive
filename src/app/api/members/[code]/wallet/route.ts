// app/api/members/[code]/wallet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAppleWalletPass } from "@/lib/apple-wallet";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params; // FIXED: Await params
    
    const member = await prisma.member.findUnique({
      where: { membershipCode: code },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const passBuffer = await generateAppleWalletPass({
      fullName: member.fullName,
      membershipCode: member.membershipCode,
      email: member.email,
      joinedAt: member.joinedAt.toISOString(),
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
  } catch (error) {
    console.error("Wallet pass generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate wallet pass" },
      { status: 500 }
    );
  }
}