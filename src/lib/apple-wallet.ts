/* eslint-disable @typescript-eslint/no-explicit-any */
import { PKPass } from "passkit-generator";
import fs from "fs/promises";
import path from "path";

export interface MemberPassData {
  fullName: string;
  membershipCode: string;
  email: string;
  joinedAt: string;
  status?: string;
  expiresAt?: string;
}

/** Generate Apple Wallet pass */
export async function generateAppleWalletPass(
  member: MemberPassData
): Promise<Buffer> {
  const certPath = path.join(process.cwd(), "certificates");
  const modelPath = path.join(process.cwd(), "passkit-model.pass");
  const tempModelPath = path.join(process.cwd(), ".temp-pass-model");

  console.log("Certificate path:", certPath);
  console.log("Model path:", modelPath);

  // Verify model folder exists
  try {
    await fs.access(modelPath);
    await fs.access(path.join(modelPath, "pass.json"));
    console.log("Model folder and pass.json verified");
  } catch {
    throw new Error(`Model folder or pass.json not found at: ${modelPath}`);
  }

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
  
  const envPassphrase = process.env.PASS_CERT_PASSPHRASE;
  const signerKeyPassphrase = (envPassphrase && envPassphrase.trim() !== '') ? envPassphrase : undefined;

  // Determine membership tier
  const joinedDate = new Date(member.joinedAt);
  const now = new Date();
  const monthsSince = Math.floor(
    (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  let tierName = "Member";
  let tierColor = "rgb(212, 175, 55)";

  if (monthsSince >= 12) {
    tierName = "Elite Member";
    tierColor = "rgb(229, 228, 226)";
  }
  if (monthsSince >= 24) {
    tierName = "VIP Member";
    tierColor = "rgb(255, 215, 0)";
  }

  try {
    // Create a temporary copy of the model with updated pass.json
    await fs.mkdir(tempModelPath, { recursive: true });
    
    // Copy all files from model to temp
    const files = await fs.readdir(modelPath);
    for (const file of files) {
      if (file === 'pass.json') continue; // We'll create this separately
      await fs.copyFile(
        path.join(modelPath, file),
        path.join(tempModelPath, file)
      );
    }

    // Create modified pass.json with actual values
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: process.env.PASS_TYPE_IDENTIFIER || "pass.com.casaprive.membership",
      teamIdentifier: process.env.TEAM_IDENTIFIER || "64PS3B42A3",
      organizationName: "Casa Privé",
      description: "Casa Privé Exclusive Membership Card",
      logoText: "CASA PRIVÉ",
      foregroundColor: tierColor,
      backgroundColor: "rgb(4, 99, 72)",
      labelColor: "rgb(255, 255, 255)",
      serialNumber: member.membershipCode,
      barcodes: [{
        message: member.membershipCode,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1"
      }],
      storeCard: {
        headerFields: [],
        primaryFields: [{
          key: "member",
          label: tierName.toUpperCase(),
          value: member.fullName,
          textAlignment: "PKTextAlignmentCenter"
        }],
        secondaryFields: [{
          key: "code",
          label: "MEMBERSHIP CODE",
          value: member.membershipCode
        }],
        auxiliaryFields: [{
          key: "joined",
          label: "MEMBER SINCE",
          value: joinedDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
          })
        }],
        backFields: [
          {
            key: "welcome",
            label: "Welcome",
            value: `Dear ${member.fullName},\n\nThank you for being a valued member of Casa Privé. Enjoy exclusive access to our premium events.`
          },
          {
            key: "email",
            label: "Email",
            value: member.email
          },
          {
            key: "benefits",
            label: "Membership Benefits",
            value: "• Priority table reservations\n• Exclusive event access\n• Special member pricing\n• VIP concierge service\n• Complimentary amenities"
          },
          {
            key: "contact",
            label: "Contact Us",
            value: "Visit casaprive.com\nEmail: members@casaprive.com\nPhone: +233 XX XXX XXXX"
          },
          {
            key: "terms",
            label: "Terms & Conditions",
            value: "This membership card is non-transferable. Visit casaprive.com/terms for full terms and conditions."
          }
        ]
      }
    };

    // Add status if provided
    if (member.status) {
      passJson.storeCard.secondaryFields.push({
        key: "status",
        label: "STATUS",
        value: member.status
      });
    }

    // Add expiry if provided
    if (member.expiresAt) {
      passJson.storeCard.auxiliaryFields.push({
        key: "expires",
        label: "VALID UNTIL",
        value: new Date(member.expiresAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        })
      });
    }

    // Write the modified pass.json
    await fs.writeFile(
      path.join(tempModelPath, "pass.json"),
      JSON.stringify(passJson, null, 2)
    );

    console.log("Created temporary pass model with values");

    // Prepare certificate config
    const certConfig: any = {
      wwdr,
      signerCert,
      signerKey,
    };
    
    if (signerKeyPassphrase) {
      certConfig.signerKeyPassphrase = signerKeyPassphrase;
    }

    // Create pass from temporary model
    const pass = await PKPass.from({
      model: tempModelPath,
      certificates: certConfig,
    });

    console.log("Pass created successfully");

    // Generate the pass buffer
    const buffer = pass.getAsBuffer();
    console.log("Pass buffer generated, size:", buffer.length, "bytes");

    // Cleanup temp directory
    await fs.rm(tempModelPath, { recursive: true, force: true });
    console.log("Cleaned up temporary files");

    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error("Generated pass buffer is empty");
    }

    if (buffer.length < 1000) {
      throw new Error("Generated pass buffer is too small - likely invalid");
    }

    console.log("Pass validation successful");

    return buffer;
  } catch (error) {
    // Cleanup on error
    try {
      await fs.rm(tempModelPath, { recursive: true, force: true });
    } catch {}
    
    console.error("Error creating pass:", error);
    throw new Error(`Failed to create pass: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}