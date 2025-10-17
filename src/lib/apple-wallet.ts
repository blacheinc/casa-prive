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
  phone?: string;
  status: string;
  expiresAt?: string;
}

function getCertPath(): string {
  return path.join(process.cwd(), "certificates");
}

function getModelPath(): string {
  return path.join(process.cwd(), "passkit-model.pass");
}

export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  try {
    const certPath = getCertPath();
    const modelPath = getModelPath();

    console.log("📂 Certificate path:", certPath);
    console.log("📂 Model path:", modelPath);

    // Check if model path exists
    try {
      await fs.access(modelPath);
      console.log("✅ Model directory exists");
    } catch {
      console.error("❌ Model directory not found at:", modelPath);
      throw new Error(`Model directory not found at ${modelPath}. Please create the passkit-model.pass folder.`);
    }

    let wwdr: Buffer;
    let signerCert: Buffer;
    let signerKey: Buffer;

    try {
      wwdr = await fs.readFile(path.join(certPath, "wwdr.pem"));
      signerCert = await fs.readFile(path.join(certPath, "signerCert.pem"));
      signerKey = await fs.readFile(path.join(certPath, "signerKey.pem"));
      console.log("✅ Certificates loaded from files");
    } catch (readError) {
      console.log("⚠️  Certificate files not found, trying environment variables...");

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
        console.error("❌ No certificates found");
        throw new Error(
          "Certificate files not found. Please either:\n" +
            "1. Add certificate files to the certificates/ folder, OR\n" +
            "2. Set APPLE_WWDR_CERT, APPLE_SIGNER_CERT, and APPLE_SIGNER_KEY environment variables"
        );
      }
    }

    const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE;

    // Format the "Member Since" date
    const memberSince = new Date(member.joinedAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    console.log("🎨 Creating pass configuration...");

    // BRAND COLORS - Emerald Green and Gold
    const passConfig: any = {
      description: "Casa Privé Membership Pass",
      organizationName: "Casa Privé",
      passTypeIdentifier: "pass.com.casaprive.membership",
      teamIdentifier: "64PS3B42A3",
      serialNumber: member.membershipCode,
      logoText: "Casa Privé",
      
      // EMERALD GREEN BACKGROUND
      backgroundColor: "rgb(16, 185, 129)",
      
      // GOLD FOREGROUND
      foregroundColor: "rgb(234, 179, 8)",
      
      // WHITE LABELS
      labelColor: "rgb(255, 255, 255)",
      
      barcode: {
        format: "PKBarcodeFormatQR",
        message: `CASA-PRIVE-${member.membershipCode}`,
        messageEncoding: "iso-8859-1",
        altText: member.membershipCode,
      },
    };

    // Add expiration date if it exists
    if (member.expiresAt) {
      passConfig.expirationDate = new Date(member.expiresAt).toISOString();
      passConfig.relevantDate = new Date(member.expiresAt).toISOString();
    }

    console.log("🔧 Initializing PKPass...");

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
      passConfig
    );

    console.log("✅ PKPass initialized");

    // Try to add logo - don't fail if logo is missing
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      const logoBuffer = await fs.readFile(logoPath);
      
      pass.addBuffer("icon.png", logoBuffer);
      pass.addBuffer("icon@2x.png", logoBuffer);
      pass.addBuffer("logo.png", logoBuffer);
      pass.addBuffer("logo@2x.png", logoBuffer);
      
      console.log("✅ Logo added to pass");
    } catch (logoError) {
      console.warn("⚠️  Could not add logo (this is optional):", logoError);
    }

    console.log("📝 Adding pass fields...");

    // Initialize storeCard structure
    const storeCard = (pass as any).storeCard ?? {};
    storeCard.primaryFields = [];
    storeCard.secondaryFields = [];
    storeCard.auxiliaryFields = [];
    storeCard.backFields = [];

    // PRIMARY FIELD
    storeCard.primaryFields.push({
      key: "memberName",
      label: "MEMBER NAME",
      value: member.fullName,
      textAlignment: "PKTextAlignmentLeft",
    });

    // SECONDARY FIELD
    storeCard.secondaryFields.push({
      key: "membershipCode",
      label: "MEMBERSHIP CODE",
      value: member.membershipCode,
      textAlignment: "PKTextAlignmentLeft",
    });

    // AUXILIARY FIELDS
    storeCard.auxiliaryFields.push({
      key: "memberSince",
      label: "MEMBER SINCE",
      value: memberSince,
      textAlignment: "PKTextAlignmentLeft",
    });

    storeCard.auxiliaryFields.push({
      key: "status",
      label: "STATUS",
      value: member.status,
      textAlignment: "PKTextAlignmentRight",
    });

    // BACK FIELDS
    storeCard.backFields.push({
      key: "about",
      label: "About Casa Privé",
      value: "Casa Privé is an exclusive members' club offering sophisticated experiences and premium networking opportunities every Saturday evening.",
    });

    storeCard.backFields.push({
      key: "email",
      label: "Email",
      value: member.email,
    });

    if (member.phone) {
      storeCard.backFields.push({
        key: "phone",
        label: "Phone",
        value: member.phone,
      });
    }

    if (member.expiresAt) {
      const expiryDate = new Date(member.expiresAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      
      storeCard.backFields.push({
        key: "expiresAt",
        label: "Membership Expires",
        value: expiryDate,
      });
    }

    storeCard.backFields.push({
      key: "benefits",
      label: "Exclusive Member Benefits",
      value: "✓ Priority event access\n✓ Premium drinks selection\n✓ VIP concierge service\n✓ Members-only Saturday events\n✓ Complimentary guest privileges\n✓ Special birthday recognition",
    });

    storeCard.backFields.push({
      key: "usage",
      label: "How to Use",
      value: "Present this pass at Casa Privé events for entry. Your QR code will be scanned for verification.",
    });

    storeCard.backFields.push({
      key: "contact",
      label: "Contact Us",
      value: "Visit casaprive.com\nEmail: hello@casaprive.com",
    });

    storeCard.backFields.push({
      key: "terms",
      label: "Terms & Conditions",
      value: "Membership is non-transferable. Visit casaprive.com/terms for complete terms.",
    });

    // Assign the storeCard back to pass
    (pass as any).storeCard = storeCard;

    console.log("✅ Pass fields added");
    console.log("🔨 Generating buffer...");

    // Generate .pkpass buffer
    const buffer = pass.getAsBuffer();
    
    console.log("✅ Wallet pass generated successfully for:", member.fullName);
    console.log("📦 Buffer size:", buffer.length, "bytes");
    
    if (buffer.length === 0) {
      throw new Error("Generated pass buffer is empty");
    }
    
    return buffer;
  } catch (error: any) {
    console.error("❌ Error in generateAppleWalletPass:", error);
    console.error("Stack:", error.stack);
    throw error;
  }
}