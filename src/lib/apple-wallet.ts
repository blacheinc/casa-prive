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

  console.log("Certificate path:", certPath);
  console.log("Model path:", modelPath);

  // Verify model folder exists and has required files
  try {
    await fs.access(modelPath);
    await fs.access(path.join(modelPath, "pass.json"));
    console.log("Model folder and pass.json verified");
  } catch (error) {
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
  
  const signerKeyPassphrase = process.env.PASS_CERT_PASSPHRASE || "";

  // Determine membership tier
  const joinedDate = new Date(member.joinedAt);
  const now = new Date();
  const monthsSince = Math.floor(
    (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  let tierName = "Member";
  let tierColor = "rgb(212, 175, 55)"; // gold

  if (monthsSince >= 12) {
    tierName = "Elite Member";
    tierColor = "rgb(229, 228, 226)"; // silver
  }
  if (monthsSince >= 24) {
    tierName = "VIP Member";
    tierColor = "rgb(255, 215, 0)"; // bright gold
  }

  try {
    // Create the pass
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
        // Override pass.json values
        serialNumber: member.membershipCode,
        description: "Casa Privé Exclusive Membership Card",
        logoText: "CASA PRIVÉ",
        foregroundColor: tierColor,
        backgroundColor: "rgb(4, 99, 72)",
        labelColor: "rgb(255, 255, 255)",
      }
    );

    console.log("Pass created successfully");

    // Set barcode with actual membership code
    pass.setBarcodes({
      message: member.membershipCode,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    });

    console.log("Barcode set successfully");

    // Use type assertion to access internal fields
    const passData = pass as any;

    // Ensure field arrays exist
    if (!passData.primaryFields) passData.primaryFields = [];
    if (!passData.secondaryFields) passData.secondaryFields = [];
    if (!passData.auxiliaryFields) passData.auxiliaryFields = [];
    if (!passData.backFields) passData.backFields = [];

    console.log("Field arrays initialized");

    // Add primary field (member name)
    passData.primaryFields.push({
      key: "member",
      label: tierName.toUpperCase(),
      value: member.fullName,
      textAlignment: "PKTextAlignmentCenter",
    });

    // Add secondary fields
    passData.secondaryFields.push({
      key: "code",
      label: "MEMBERSHIP CODE",
      value: member.membershipCode,
    });

    if (member.status) {
      passData.secondaryFields.push({
        key: "status",
        label: "STATUS",
        value: member.status,
      });
    }

    // Add auxiliary fields
    passData.auxiliaryFields.push({
      key: "joined",
      label: "MEMBER SINCE",
      value: joinedDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    });

    if (member.expiresAt) {
      passData.auxiliaryFields.push({
        key: "expires",
        label: "VALID UNTIL",
        value: new Date(member.expiresAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      });
    }

    // Add back fields
    passData.backFields.push(
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
          "This membership card is non-transferable. Visit casaprive.com/terms for full terms and conditions.",
      }
    );

    console.log("Pass fields configured");

    // Generate the pass buffer
    const buffer = pass.getAsBuffer();
    console.log("Pass buffer generated, size:", buffer.length, "bytes");

    // Validate buffer is not empty and is reasonable size
    if (!buffer || buffer.length === 0) {
      throw new Error("Generated pass buffer is empty");
    }

    if (buffer.length < 1000) {
      throw new Error("Generated pass buffer is too small - likely invalid");
    }

    console.log("Pass validation successful");

    return buffer;
  } catch (error) {
    console.error("Error creating pass:", error);
    throw new Error(`Failed to create pass: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}