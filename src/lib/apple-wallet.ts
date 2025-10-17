/* eslint-disable @typescript-eslint/no-explicit-any */
import { PKPass } from "passkit-generator";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";

export interface MemberPassData {
  fullName: string;
  membershipCode: string;
  email: string;
  joinedAt: string;
  status?: string;
  expiresAt?: string;
}

/** Get certificate folder path */
function getCertPath(): string {
  return path.join(process.cwd(), "certificates");
}

/** Get pass model folder path */
function getModelPath(): string {
  return path.join(process.cwd(), "passkit-model.pass");
}

/** Generate QR code for membership */
async function generateQRCode(data: string): Promise<string> {
  return await QRCode.toDataURL(data, { errorCorrectionLevel: "H" });
}

/** Generate Apple Wallet pass */
export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  const certPath = getCertPath();
  const modelPath = getModelPath();

  // Load certificates
  const wwdr = process.env.APPLE_WWDR_CERT
    ? Buffer.from(process.env.APPLE_WWDR_CERT.replace(/\\n/g, "\n"))
    : await fs.readFile(path.join(certPath, "wwdr.pem"));
  const signerCert = process.env.APPLE_SIGNER_CERT
    ? Buffer.from(process.env.APPLE_SIGNER_CERT.replace(/\\n/g, "\n"))
    : await fs.readFile(path.join(certPath, "signerCert.pem"));
  const signerKey = process.env.APPLE_SIGNER_KEY
    ? Buffer.from(process.env.APPLE_SIGNER_KEY.replace(/\\n/g, "\n"))
    : await fs.readFile(path.join(certPath, "signerKey.pem"));
  const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE;

  // Determine membership tier
  const joinedDate = new Date(member.joinedAt);
  const now = new Date();
  const monthsSince = Math.floor(
    (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  let tierName = "Member";
  let tierColor = "#d4af37"; // gold
  if (monthsSince >= 12) {
    tierName = "Elite Member";
    tierColor = "#e5e4e2"; // silver
  }
  if (monthsSince >= 24) {
    tierName = "VIP Member";
    tierColor = "#ffd700"; // bright gold
  }

  // Generate QR code
  const qrDataURL = await generateQRCode(member.membershipCode);

  // Create the pass
  const pass = await PKPass.from(
    {
      model: modelPath,
      certificates: { wwdr, signerCert, signerKey, signerKeyPassphrase },
    },
    {
      // Pass Type - REQUIRED
      passTypeIdentifier: process.env.PASS_TYPE_IDENTIFIER || "pass.com.casaprive.membership",
      teamIdentifier: process.env.TEAM_IDENTIFIER || "64PS3B42A3",
      
      // Basic pass info
      description: "Casa Privé Exclusive Membership Card",
      organizationName: "Casa Privé",
      serialNumber: member.membershipCode,
      logoText: "CASA PRIVÉ",
      
      // Colors
      foregroundColor: tierColor,
      backgroundColor: "#046348",
      labelColor: "#ffffff",
    }
  );

  // Add primary field
  pass.primaryFields.push({
    key: "member",
    label: tierName.toUpperCase(),
    value: member.fullName,
    textAlignment: "PKTextAlignmentCenter",
  });

  // Add secondary fields
  pass.secondaryFields.push({
    key: "code",
    label: "MEMBERSHIP CODE",
    value: member.membershipCode,
  });

  if (member.status) {
    pass.secondaryFields.push({
      key: "status",
      label: "STATUS",
      value: member.status,
    });
  }

  // Add auxiliary fields
  pass.auxiliaryFields.push({
    key: "joined",
    label: "MEMBER SINCE",
    value: joinedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
  });

  if (member.expiresAt) {
    pass.auxiliaryFields.push({
      key: "expires",
      label: "VALID UNTIL",
      value: new Date(member.expiresAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    });
  }

  // Add back fields
  pass.backFields.push(
    {
      key: "welcome",
      label: "Welcome",
      value: `Dear ${member.fullName},\n\nThank you for being a valued member of Casa Privé. Enjoy exclusive access to our premium events.`,
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
        "This membership card is non-transferable. Visit casaprive.com/terms for full terms",
    },
    {
      key: "qrCode",
      label: "QR Code",
      value: qrDataURL,
    }
  );

  // Set the pass type to storeCard
  pass.type = "storeCard";

  return pass.getAsBuffer();
}