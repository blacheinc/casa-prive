/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/apple-wallet.ts
import { PKPass } from "passkit-generator";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp"; // You'll need to install: npm install sharp

interface MemberPassData {
  fullName: string;
  membershipCode: string;
  email: string;
  joinedAt: string;
  status?: string;
  expiresAt?: string;
}

/**
 * Get the correct path for certificates based on project structure
 */
function getCertPath(): string {
  return path.join(process.cwd(), "certificates");
}

function getModelPath(): string {
  return path.join(process.cwd(), "passkit-model.pass");
}

/**
 * Convert public logo to all required pass formats
 */
async function prepareLogoImages(): Promise<void> {
  const publicLogoPath = path.join(process.cwd(), "public", "logo.png");
  const modelPath = getModelPath();

  try {
    const logoBuffer = await fs.readFile(publicLogoPath);

    // Generate all required logo sizes
    await Promise.all([
      // Logo for card (shown on front)
      sharp(logoBuffer)
        .resize(160, 50, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(path.join(modelPath, "logo.png")),
      sharp(logoBuffer)
        .resize(320, 100, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(path.join(modelPath, "logo@2x.png")),
      sharp(logoBuffer)
        .resize(480, 150, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(path.join(modelPath, "logo@3x.png")),

      // Icon (shown in notifications and list view)
      sharp(logoBuffer)
        .resize(29, 29, { fit: "cover" })
        .png()
        .toFile(path.join(modelPath, "icon.png")),
      sharp(logoBuffer)
        .resize(58, 58, { fit: "cover" })
        .png()
        .toFile(path.join(modelPath, "icon@2x.png")),
      sharp(logoBuffer)
        .resize(87, 87, { fit: "cover" })
        .png()
        .toFile(path.join(modelPath, "icon@3x.png")),
    ]);

    console.log("✅ Logo images prepared successfully");
  } catch (error) {
    console.error("⚠️  Could not prepare logo images:", error);
    console.log("Make sure logo.png exists in the public folder");
  }
}

/**
 * Create a luxurious pattern background
 */
async function createLuxuryBackground(): Promise<void> {
  const modelPath = getModelPath();

  try {
    // Create a sophisticated geometric pattern
    const svg = `
      <svg width="360" height="440" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="luxury-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#046348"/>
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="#055d42" opacity="0.3"/>
            <circle cx="30" cy="30" r="2" fill="#d4af37" opacity="0.4"/>
          </pattern>
          <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#046348;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#023d2d;stop-opacity:0.95" />
          </linearGradient>
        </defs>
        <rect width="360" height="440" fill="url(#luxury-pattern)"/>
        <rect width="360" height="440" fill="url(#overlay)"/>
      </svg>
    `;

    await Promise.all([
      sharp(Buffer.from(svg))
        .resize(180, 220)
        .png()
        .toFile(path.join(modelPath, "background.png")),
      sharp(Buffer.from(svg))
        .resize(360, 440)
        .png()
        .toFile(path.join(modelPath, "background@2x.png")),
      sharp(Buffer.from(svg))
        .resize(540, 660)
        .png()
        .toFile(path.join(modelPath, "background@3x.png")),
    ]);

    console.log("✅ Luxury background created successfully");
  } catch (error) {
    console.error("⚠️  Could not create background:", error);
  }
}

/**
 * Create a premium strip image for the header
 */
async function createStripImage(): Promise<void> {
  const modelPath = getModelPath();

  try {
    const svg = `
      <svg width="750" height="246" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="strip-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#046348;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#055d42;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#046348;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="750" height="246" fill="url(#strip-gradient)"/>
        <line x1="0" y1="230" x2="750" y2="230" stroke="#d4af37" stroke-width="3" opacity="0.8"/>
        <text x="375" y="140" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
              fill="#d4af37" text-anchor="middle">CASA PRIVÉ</text>
        <text x="375" y="180" font-family="Arial, sans-serif" font-size="24" 
              fill="#ffffff" text-anchor="middle" opacity="0.9">Exclusive Membership</text>
      </svg>
    `;

    await Promise.all([
      sharp(Buffer.from(svg))
        .resize(375, 123)
        .png()
        .toFile(path.join(modelPath, "strip.png")),
      sharp(Buffer.from(svg))
        .resize(750, 246)
        .png()
        .toFile(path.join(modelPath, "strip@2x.png")),
      sharp(Buffer.from(svg))
        .resize(1125, 369)
        .png()
        .toFile(path.join(modelPath, "strip@3x.png")),
    ]);

    console.log("✅ Strip image created successfully");
  } catch (error) {
    console.error("⚠️  Could not create strip image:", error);
  }
}

/**
 * Generates an Apple Wallet pass (.pkpass) for a member with luxury design.
 */
export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  try {
    const certPath = getCertPath();
    const modelPath = getModelPath();

    console.log("Certificate path:", certPath);
    console.log("Model path:", modelPath);

    // Prepare all visual assets
    await Promise.all([
      prepareLogoImages(),
      createLuxuryBackground(),
      createStripImage(),
    ]);

    // Read certificates with better error handling
    let wwdr: Buffer;
    let signerCert: Buffer;
    let signerKey: Buffer;

    try {
      wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
      signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
      signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));
      console.log("✅ Certificates loaded from files");
    } catch (readError) {
      console.log(
        "⚠️  Certificate files not found, trying environment variables..."
      );

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
          "Certificate files not found. Please either:\n" +
            "1. Add certificate files to the certificates/ folder, OR\n" +
            "2. Set APPLE_WWDR_CERT, APPLE_SIGNER_CERT, and APPLE_SIGNER_KEY environment variables"
        );
      }
    }

    const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE;

    // Calculate membership duration
    const joinedDate = new Date(member.joinedAt);
    const now = new Date();
    const monthsSince = Math.floor(
      (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Determine tier based on membership duration (optional)
    let tierName = "Member";
    let tierColor = "rgb(212,175,55)"; // Gold
    if (monthsSince >= 12) {
      tierName = "Elite Member";
      tierColor = "rgb(229,228,226)"; // Platinum
    }
    if (monthsSince >= 24) {
      tierName = "VIP Member";
      tierColor = "rgb(255,215,0)"; // Brighter Gold
    }

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
        description: "Casa Privé Exclusive Membership Card",
        organizationName: "Casa Privé",
        serialNumber: member.membershipCode,
        logoText: "CASA PRIVÉ",

        // Luxury color scheme.
        foregroundColor: "rgb(212,175,55)", // Gold text
        backgroundColor: "rgb(4,99,72)", // Deep green
        labelColor: "rgb(255,255,255)", // White labels
      }
    );

    (pass as any).barcodes = [
      {
        format: "PKBarcodeFormatQR",
        message: member.membershipCode,
        messageEncoding: "iso-8859-1",
        altText: member.membershipCode,
      },
    ];

    (pass as any).relevantDate = member.expiresAt || undefined;

    // Configure storeCard with luxury information
    const storeCard = (pass as any).storeCard ?? {};
    storeCard.primaryFields = [];
    storeCard.secondaryFields = [];
    storeCard.auxiliaryFields = [];
    storeCard.backFields = [];

    // Primary field - Member name with tier
    storeCard.primaryFields.push({
      key: "member",
      label: tierName.toUpperCase(),
      value: member.fullName,
      textAlignment: "PKTextAlignmentCenter",
    });

    // Secondary fields - Code and Status
    storeCard.secondaryFields.push({
      key: "code",
      label: "MEMBERSHIP CODE",
      value: member.membershipCode,
      textAlignment: "PKTextAlignmentLeft",
    });

    if (member.status) {
      storeCard.secondaryFields.push({
        key: "status",
        label: "STATUS",
        value: member.status,
        textAlignment: "PKTextAlignmentRight",
      });
    }

    // Auxiliary fields - Join date and tier
    storeCard.auxiliaryFields.push({
      key: "joined",
      label: "MEMBER SINCE",
      value: joinedDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      textAlignment: "PKTextAlignmentLeft",
    });

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

    // Back fields - Detailed information
    storeCard.backFields.push({
      key: "welcome",
      label: "Welcome",
      value: `Dear ${member.fullName},\n\nThank you for being a valued member of Casa Privé. Your membership grants you exclusive access to our premium events and services.`,
    });

    storeCard.backFields.push({
      key: "email",
      label: "Email",
      value: member.email,
    });

    storeCard.backFields.push({
      key: "membershipDetails",
      label: "Membership Benefits",
      value:
        "• Priority table reservations\n• Exclusive event access\n• Special member pricing\n• VIP concierge service\n• Complimentary amenities",
    });

    storeCard.backFields.push({
      key: "contact",
      label: "Contact Us",
      value:
        "Visit casaprive.com\nEmail: members@casaprive.com\nPhone: +233 XX XXX XXXX",
    });

    storeCard.backFields.push({
      key: "terms",
      label: "Terms & Conditions",
      value:
        "This membership card is non-transferable. Valid only for the member named above. Visit casaprive.com/terms for full terms and conditions.",
    });

    // Generate .pkpass buffer
    const buffer = pass.getAsBuffer();
    console.log("✅ Luxury wallet pass generated successfully");
    return buffer;
  } catch (error) {
    console.error("Error generating Apple Wallet pass:", error);
    throw error;
  }
}
