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

    if (member.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Membership is not active" },
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
      membershipType: member.membershipType,
    });

    // Convert Buffer to Uint8Array (compatible with NextResponse)
    const uint8Array = new Uint8Array(passBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="casaprive-${member.membershipCode}.pkpass"`,
        "Content-Length": passBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("Wallet pass generation error:", error);
    console.error("Error stack:", error.stack);
    
    const errorMessage = error.message?.includes("Certificate files not found")
      ? "Apple Wallet service is temporarily unavailable"
      : error.message?.includes("Model folder not found")
      ? "Wallet pass configuration error"
      : "Failed to generate wallet pass";
    
    // In development, return detailed error
    const errorDetails = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"
      ? {
          error: errorMessage,
          details: error.message,
          stack: error.stack?.split('\n').slice(0, 5).join('\n')
        }
      : { error: errorMessage };
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}