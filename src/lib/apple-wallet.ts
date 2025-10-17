/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/apple-wallet.ts
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

/**
 * Get certificates path
 */
function getCertPath(): string {
  return path.join(process.cwd(), "certificates");
}

/**
 * Get path to your pass template folder
 */
function getModelPath(): string {
  return path.join(process.cwd(), "passkit-model.pass");
}

/**
 * Generate Apple Wallet pass with dynamic member data
 */
export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  try {
    const certPath = getCertPath();
    const modelPath = getModelPath();

    // Load certificates
    let wwdr: Buffer;
    let signerCert: Buffer;
    let signerKey: Buffer;

    try {
      wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
      signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
      signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));
      console.log("✅ Certificates loaded from files");
    } catch (readError) {
      if (
        process.env.APPLE_WWDR_CERT &&
        process.env.APPLE_SIGNER_CERT &&
        process.env.APPLE_SIGNER_KEY
      ) {
        wwdr = Buffer.from(process.env.APPLE_WWDR_CERT.replace(/\\n/g, "\n"));
        signerCert = Buffer.from(
          process.env.APPLE_SIGNER_CERT.replace(/\\n/g, "\n")
        );
        signerKey = Buffer.from(
          process.env.APPLE_SIGNER_KEY.replace(/\\n/g, "\n")
        );
        console.log("✅ Certificates loaded from environment variables");
      } else {
        throw new Error(
          "Certificate files not found. Add to certificates/ or set env variables."
        );
      }
    }

    const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE;

    // Calculate membership tier
    const joinedDate = new Date(member.joinedAt);
    const now = new Date();
    const monthsSince = Math.floor(
      (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    let tierName = "Member";
    let tierColor = "rgb(212,175,55)"; // Gold
    if (monthsSince >= 12) {
      tierName = "Elite Member";
      tierColor = "rgb(229,228,226)"; // Platinum
    }
    if (monthsSince >= 24) {
      tierName = "VIP Member";
      tierColor = "rgb(255,215,0)"; // Bright Gold
    }

    const authenticationToken = process.env.WALLET_AUTH_TOKEN;

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
        webServiceURL: "https://api.casaprive.com/passes",
        authenticationToken,
      }
    );

    // Configure storeCard dynamically
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
      {
        key: "code",
        label: "MEMBERSHIP CODE",
        value: member.membershipCode,
        textAlignment: "PKTextAlignmentLeft",
      },
    ];
    if (member.status) {
      storeCard.secondaryFields.push({
        key: "status",
        label: "STATUS",
        value: member.status,
        textAlignment: "PKTextAlignmentRight",
      });
    }
    storeCard.auxiliaryFields = [
      {
        key: "joined",
        label: "MEMBER SINCE",
        value: joinedDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        textAlignment: "PKTextAlignmentLeft",
      },
    ];
    if (member.expiresAt) {
      storeCard.auxiliaryFields.push({
        key: "expires",
        label: "VALID UNTIL",
        value: new Date(member.expiresAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        textAlignment: "PKTextAlignmentRight",
      });
    }

    storeCard.backFields = [
      {
        key: "welcome",
        label: "Welcome",
        value: `Dear ${member.fullName},\n\nThank you for being a valued member of Casa Privé. Enjoy exclusive access to our premium events and services.`,
      },
      {
        key: "email",
        label: "Email",
        value: member.email,
      },
      {
        key: "membershipDetails",
        label: "Membership Benefits",
        value:
          "• Priority table reservations\n• Exclusive event access\n• Special member pricing\n• VIP concierge service\n• Complimentary amenities",
      },
      {
        key: "contact",
        label: "Contact Us",
        value:
          "Visit casaprive.com\nEmail: members@casaprive.com\nPhone: +233 XX XXX XXXX",
      },
      {
        key: "terms",
        label: "Terms & Conditions",
        value:
          "This membership card is non-transferable. Valid only for the member named above. Visit casaprive.com/terms for full terms and conditions.",
      },
    ];

    // Add barcode dynamically
    (pass as any).barcode = {
      format: "PKBarcodeFormatQR",
      message: member.membershipCode,
      messageEncoding: "iso-8859-1",
      altText: member.membershipCode,
    };

    // Generate pkpass buffer
    const buffer = pass.getAsBuffer();
    console.log("✅ Luxury wallet pass generated successfully");
    return buffer;
  } catch (error) {
    console.error("Error generating Apple Wallet pass:", error);
    throw error;
  }
}
