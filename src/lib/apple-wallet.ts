// lib/apple-wallet.ts
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
 * Get the correct path for certificates based on environment
 */
function getCertPath(): string {
  // In Vercel/Lambda, process.cwd() might not work as expected
  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), "certificates"),
    path.join("/var/task", "certificates"),
    path.join(__dirname, "..", "..", "certificates"),
  ];

  return possiblePaths[0]; // Default to process.cwd()
}

/**
 * Generates an Apple Wallet pass (.pkpass) for a member.
 */
export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  try {
    const certPath = getCertPath();
    const modelPath = path.join(process.cwd(), "passkit-model");

    console.log("Looking for certificates at:", certPath);

    // Read certificates with better error handling
    let wwdr: Buffer;
    let signerCert: Buffer;
    let signerKey: Buffer;

    try {
      wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
      signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
      signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));
    } catch (readError) {
      console.error("Error reading certificate files:", readError);
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
    return buffer;
  } catch (error) {
    console.error("Error generating Apple Wallet pass:", error);
    throw error;
  }
}