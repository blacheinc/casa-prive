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
  const tempModelPath = path.join("/tmp", `pass-${member.membershipCode}-${Date.now()}.pass`);

  console.log("Certificate path:", certPath);
  console.log("Model path:", modelPath);
  console.log("Temp path:", tempModelPath);

  try {
    await fs.access(modelPath);
    await fs.access(path.join(modelPath, "pass.json"));
    console.log("Model folder and pass.json verified");
  } catch {
    throw new Error(`Model folder or pass.json not found at: ${modelPath}`);
  }

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

  const joinedDate = new Date(member.joinedAt);
  const now = new Date();
  const monthsSince = Math.floor(
    (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  let tierName = "Member";
  let tierColor = "rgb(212, 175, 55)";
  let backgroundColor = "rgb(17, 24, 39)";

  if (monthsSince >= 12) {
    tierName = "Elite Member";
    tierColor = "rgb(192, 192, 192)";
    backgroundColor = "rgb(30, 41, 59)";
  }
  if (monthsSince >= 24) {
    tierName = "VIP Member";
    tierColor = "rgb(255, 215, 0)";
    backgroundColor = "rgb(15, 23, 42)";
  }

  try {
    await fs.mkdir(tempModelPath, { recursive: true });
    console.log("Created temp directory");
    
    const files = await fs.readdir(modelPath);
    for (const file of files) {
      if (file === 'pass.json') continue;
      await fs.copyFile(
        path.join(modelPath, file),
        path.join(tempModelPath, file)
      );
    }
    console.log("Copied model files");

    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: process.env.PASS_TYPE_IDENTIFIER || "pass.ass.com.casaprive.membership",
      teamIdentifier: process.env.TEAM_IDENTIFIER || "64PS3B42A3",
      organizationName: "Casa Privé",
      description: "Casa Privé Exclusive Membership Card",
      logoText: "CASA PRIVÉ",
      foregroundColor: tierColor,
      backgroundColor: backgroundColor,
      labelColor: "rgb(156, 163, 175)",
      serialNumber: member.membershipCode,
      barcode: {
        message: member.membershipCode,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1",
        altText: member.membershipCode
      },
      storeCard: {
        headerFields: [],
        primaryFields: [{
          key: "member",
          label: tierName.toUpperCase(),
          value: member.fullName.toUpperCase(),
          textAlignment: "PKTextAlignmentLeft"
        }],
        secondaryFields: [{
          key: "code",
          label: "MEMBER ID",
          value: member.membershipCode,
          textAlignment: "PKTextAlignmentLeft"
        }],
        auxiliaryFields: [{
          key: "tier",
          label: "TIER",
          value: tierName,
          textAlignment: "PKTextAlignmentLeft"
        }, {
          key: "joined",
          label: "SINCE",
          value: joinedDate.toLocaleDateString("en-US", {
            year: "numeric"
          }),
          textAlignment: "PKTextAlignmentRight"
        }],
        backFields: [
          {
            key: "welcome",
            label: "Welcome to Casa Privé",
            value: `${member.fullName}\n\nAs an exclusive member, you have access to premium Saturday evening events at Ghana's most sophisticated members' club.`
          },
          {
            key: "benefits",
            label: "Your Benefits",
            value: "• Priority event reservations\n• VIP table placement\n• Complimentary welcome drinks\n• Access to exclusive networking events\n• Premium service & concierge"
          },
          {
            key: "contact",
            label: "Member Services",
            value: `Email: ${member.email}\nWeb: casaprive.com\nPhone: +233 XX XXX XXXX`
          },
          {
            key: "qr",
            label: "Event Check-In",
            value: "Present your membership QR code (shown above) at event entrance for quick check-in."
          },
          {
            key: "terms",
            label: "Terms",
            value: "This membership is non-transferable and valid for the cardholder only. Subject to Casa Privé terms of service."
          }
        ]
      }
    };

    if (member.expiresAt) {
      passJson.storeCard.backFields.splice(1, 0, {
        key: "expires",
        label: "Valid Until",
        value: new Date(member.expiresAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric"
        })
      });
    }

    await fs.writeFile(
      path.join(tempModelPath, "pass.json"),
      JSON.stringify(passJson, null, 2)
    );
    console.log("Created pass.json with luxury design");

    const certConfig: any = {
      wwdr,
      signerCert,
      signerKey,
    };
    
    if (signerKeyPassphrase) {
      certConfig.signerKeyPassphrase = signerKeyPassphrase;
    }

    const pass = await PKPass.from({
      model: tempModelPath,
      certificates: certConfig,
    });

    console.log("Pass created from temp model");

    const buffer = pass.getAsBuffer();
    console.log("Pass buffer generated, size:", buffer.length, "bytes");

    await fs.rm(tempModelPath, { recursive: true, force: true });
    console.log("Cleaned up temp files");

    if (!buffer || buffer.length === 0) {
      throw new Error("Generated pass buffer is empty");
    }

    if (buffer.length < 1000) {
      throw new Error("Generated pass buffer is too small");
    }

    console.log("Pass validation successful");
    return buffer;

  } catch (error) {
    try {
      await fs.rm(tempModelPath, { recursive: true, force: true });
    } catch {}
    
    console.error("Error creating pass:", error);
    throw new Error(`Failed to create pass: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}