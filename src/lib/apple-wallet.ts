/* eslint-disable @typescript-eslint/no-explicit-any */
import { PKPass } from "passkit-generator";
import fs from "fs/promises";
import path from "path";

interface MemberPassData {
  fullName: string;
  membershipCode: string;
  email: string;
  joinedAt: string;
  status?: string;
  expiresAt?: string;
}

function getCertPath(): string {
  return path.join(process.cwd(), "certificates");
}

function getModelPath(): string {
  return path.join(process.cwd(), "passkit-model.pass");
}

export async function generateAppleWalletPass(member: MemberPassData): Promise<Buffer> {
  try {
    const certPath = getCertPath();
    const modelPath = getModelPath();

    let wwdr: Buffer;
    let signerCert: Buffer;
    let signerKey: Buffer;

    try {
      wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
      signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
      signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));
    } catch {
      if (
        process.env.APPLE_WWDR_CERT &&
        process.env.APPLE_SIGNER_CERT &&
        process.env.APPLE_SIGNER_KEY
      ) {
        wwdr = Buffer.from(process.env.APPLE_WWDR_CERT.replace(/\\n/g, "\n"));
        signerCert = Buffer.from(process.env.APPLE_SIGNER_CERT.replace(/\\n/g, "\n"));
        signerKey = Buffer.from(process.env.APPLE_SIGNER_KEY.replace(/\\n/g, "\n"));
      } else {
        throw new Error(
          "Certificate files not found. Add them to certificates/ or set environment variables."
        );
      }
    }

    const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE;

    // Determine tier
    const joinedDate = new Date(member.joinedAt);
    const now = new Date();
    const monthsSince = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

    let tierName = "Member";
    let tierColor = "rgb(212,175,55)"; // Gold
    if (monthsSince >= 12) { tierName = "Elite Member"; tierColor = "rgb(229,228,226)"; } // Platinum
    if (monthsSince >= 24) { tierName = "VIP Member"; tierColor = "rgb(255,215,0)"; } // Bright Gold

    // Create pass
    const pass = await PKPass.from(
      {
        model: modelPath,
        certificates: { wwdr, signerCert, signerKey, signerKeyPassphrase },
      },
      {
        description: "Casa Privé Exclusive Membership Card",
        organizationName: "Casa Privé",
        serialNumber: member.membershipCode,
        logoText: "CASA PRIVÉ",
        foregroundColor: tierColor,
        backgroundColor: "rgb(4,99,72)",
        labelColor: "rgb(255,255,255)",
      }
    );

    const storeCard = (pass as any).storeCard ?? {};
    storeCard.primaryFields = [
      {
        key: "member",
        label: tierName.toUpperCase(),
        value: member.fullName,
        textAlignment: "PKTextAlignmentCenter",
      },
    ];

    storeCard.secondaryFields = [
      { key: "code", label: "MEMBERSHIP CODE", value: member.membershipCode },
    ];
    if (member.status) {
      storeCard.secondaryFields.push({ key: "status", label: "STATUS", value: member.status });
    }

    storeCard.auxiliaryFields = [
      {
        key: "joined",
        label: "MEMBER SINCE",
        value: joinedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      },
    ];
    if (member.expiresAt) {
      storeCard.auxiliaryFields.push({
        key: "expires",
        label: "VALID UNTIL",
        value: new Date(member.expiresAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      });
    }

    storeCard.backFields = [
      {
        key: "welcome",
        label: "Welcome",
        value: `Dear ${member.fullName},\n\nThank you for being a valued member of Casa Privé. Your membership grants you exclusive access to premium events and services.`,
      },
      { key: "email", label: "Email", value: member.email },
      {
        key: "membershipDetails",
        label: "Membership Benefits",
        value:
          "• Priority table reservations\n• Exclusive event access\n• Special member pricing\n• VIP concierge service\n• Complimentary amenities",
      },
      {
        key: "contact",
        label: "Contact Us",
        value: "Visit casaprive.com\nEmail: members@casaprive.com\nPhone: +233 XX XXX XXXX",
      },
      {
        key: "terms",
        label: "Terms & Conditions",
        value: "Non-transferable. Visit casaprive.com/terms for full details.",
      },
    ];

    return pass.getAsBuffer();
  } catch (error) {
    console.error("Error generating Apple Wallet pass:", error);
    throw error;
  }
}
