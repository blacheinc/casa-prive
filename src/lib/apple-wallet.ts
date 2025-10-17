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
}

/**
 * Get the correct path for certificates based on project structure
 */
function getCertPath(): string {
  // Since certificates/ is in root and src/ is also in root
  // Go up from src/lib to root, then into certificates
  return path.join(process.cwd(), "certificates");
}

function getModelPath(): string {
  return path.join(process.cwd(), "passkit-model.pass");
}

/**
 * Generates an Apple Wallet pass (.pkpass) for a member.
 */
export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  try {
    const certPath = getCertPath();
    const modelPath = getModelPath();

    console.log("Certificate path:", certPath);
    console.log("Model path:", modelPath);

    // Read certificates with better error handling
    let wwdr: Buffer;
    let signerCert: Buffer;
    let signerKey: Buffer;

    try {
      // Try reading from files first
      wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
      signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
      signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));

      console.log("✅ Certificates loaded from files");
    } catch (readError) {
      console.log(
        "⚠️  Certificate files not found, trying environment variables..."
      );

      // Fallback to environment variables (for Vercel deployment)
      if (
        process.env.APPLE_WWDR_CERT &&
        process.env.APPLE_SIGNER_CERT &&
        process.env.APPLE_SIGNER_KEY
      ) {
        wwdr = Buffer.from(process.env.APPLE_WWDR_CERT, "base64");
        signerCert = Buffer.from(process.env.APPLE_SIGNER_CERT, "base64");
        signerKey = Buffer.from(process.env.APPLE_SIGNER_KEY, "base64");

        console.log("✅ Certificates loaded from environment variables");
      } else {
        console.error("❌ Error reading certificate files:", readError);
        console.error("Attempted path:", certPath);

        // List what's actually in the directory for debugging
        try {
          const files = await fs.readdir(certPath);
          console.log("Files in certificates directory:", files);
        } catch (dirError) {
          console.error("Cannot read certificates directory:", dirError);
        }

        throw new Error(
          "Certificate files not found. Please either:\n" +
            "1. Add certificate files to the certificates/ folder, OR\n" +
            "2. Set APPLE_WWDR_CERT, APPLE_SIGNER_CERT, and APPLE_SIGNER_KEY environment variables"
        );
      }
    }

    const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE;

    const pass = await PKPass.from(
      {
        model: modelPath,
        certificates: {
          wwdr,
          signerCert,
          signerKey,
          signerKeyPassphrase,
        },
      },
      {
        description: "Casa Privé Membership",
        organizationName: "Casa Privé",
        serialNumber: member.membershipCode,
        logoText: "Casa Privé",
        foregroundColor: "rgb(212,175,55)",
        backgroundColor: "rgb(4,99,72)",
        labelColor: "rgb(255,255,255)",
      }
    );

    // Ensure storeCard exists
    const storeCard = (pass as any).storeCard ?? {};
    storeCard.primaryFields = storeCard.primaryFields ?? [];
    storeCard.secondaryFields = storeCard.secondaryFields ?? [];
    storeCard.auxiliaryFields = storeCard.auxiliaryFields ?? [];
    storeCard.backFields = storeCard.backFields ?? [];

    // Now safely push your fields
    storeCard.primaryFields.push({
      key: "member",
      label: "MEMBER NAME",
      value: member.fullName,
    });

    storeCard.secondaryFields.push({
      key: "code",
      label: "MEMBERSHIP CODE",
      value: member.membershipCode,
    });

    storeCard.auxiliaryFields.push({
      key: "joined",
      label: "MEMBER SINCE",
      value: new Date(member.joinedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    });

    storeCard.backFields.push({
      key: "email",
      label: "Email",
      value: member.email,
    });

    storeCard.backFields.push({
      key: "terms",
      label: "Terms & Conditions",
      value: "Visit casaprive.com for full terms and conditions.",
    });

    // Generate .pkpass buffer
    const buffer = pass.getAsBuffer();
    console.log("✅ Wallet pass generated successfully");
    return buffer;
  } catch (error) {
    console.error("Error generating Apple Wallet pass:", error);
    throw error;
  }
}
