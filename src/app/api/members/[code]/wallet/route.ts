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
    
    console.log("🔍 Fetching member with code:", code);
    
    const member = await prisma.member.findUnique({
      where: { membershipCode: code },
    });

    if (!member) {
      console.error("❌ Member not found:", code);
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    console.log("✅ Member found:", member.fullName);

    if (member.status !== 'ACTIVE') {
      console.error("❌ Member not active:", member.status);
      return NextResponse.json(
        { error: "Membership is not active" },
        { status: 403 }
      );
    }

    console.log("🎫 Generating wallet pass...");

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

    console.log("✅ Pass buffer generated, size:", passBuffer.length, "bytes");

    // Convert Node.js Buffer to regular Uint8Array
    const bytes = Uint8Array.from(passBuffer);

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="casaprive-${member.membershipCode}.pkpass"`,
        "Content-Length": bytes.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("❌ Wallet pass generation error:", error);
    console.error("Stack trace:", error.stack);
    
    const errorMessage = error.message?.includes("Certificate files not found")
      ? "Apple Wallet service is temporarily unavailable"
      : "Failed to generate wallet pass";
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}