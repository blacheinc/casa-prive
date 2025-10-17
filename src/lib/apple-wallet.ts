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
  // Same for passkit-model
  return path.join(process.cwd(), "passkit-model");
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
      wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
      signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
      signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));
      
      console.log("✅ Certificates loaded successfully");
    } catch (readError) {
      console.error("❌ Error reading certificate files:", readError);
      console.error("Attempted path:", certPath);
      
      // List what's actually in the directory for debugging
      try {
        const files = await fs.readdir(certPath);
        console.log("Files in certificates directory:", files);
      } catch (dirError) {
        console.error("Cannot read certificates directory:", dirError);
      }
      
      throw new Error("Certificate files not found. Please ensure certificates are deployed.");
    }

    const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE;

    // Create the pass shell
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
        foregroundColor: "rgb(212,175,55)", // gold
        backgroundColor: "rgb(4,99,72)", // emerald green
        labelColor: "rgb(255,255,255)", // white
      }
    );

    // Add fields after creation
    pass.primaryFields.push({
      key: "member",
      label: "MEMBER NAME",
      value: member.fullName,
    });

    pass.secondaryFields.push({
      key: "code",
      label: "MEMBERSHIP CODE",
      value: member.membershipCode,
    });

    pass.auxiliaryFields.push({
      key: "joined",
      label: "MEMBER SINCE",
      value: new Date(member.joinedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    });

    pass.backFields.push({
      key: "email",
      label: "Email",
      value: member.email,
    });

    pass.backFields.push({
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