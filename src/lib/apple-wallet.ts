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
 * Generates an Apple Wallet pass (.pkpass) for a member.
 */
export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  try {
    const certPath = path.join(process.cwd(), "certificates");
    const modelPath = path.join(process.cwd(), "passkit-model");

    const wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
    const signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
    const signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));
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
