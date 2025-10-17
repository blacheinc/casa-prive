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
  
  // Only set passphrase if it exists and is not empty, otherwise undefined
  const envPassphrase = process.env.PASS_CERT_PASSPHRASE;
  const signerKeyPassphrase = (envPassphrase && envPassphrase.trim() !== '') ? envPassphrase : undefined;

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
    // Prepare certificate config
    const certConfig: any = {
      wwdr,
      signerCert,
      signerKey,
    };
    
    // Only add passphrase if it exists
    if (signerKeyPassphrase) {
      certConfig.signerKeyPassphrase = signerKeyPassphrase;
    }

    // Create the pass with overrides
    const pass = await PKPass.from(
      {
        model: modelPath,
        certificates: certConfig,
      },
      {
        serialNumber: member.membershipCode,
        description: "Casa Privé Exclusive Membership Card",
        logoText: "CASA PRIVÉ",
        foregroundColor: tierColor,
        backgroundColor: "rgb(4, 99, 72)",
        labelColor: "rgb(255, 255, 255)",
      }
    );

    console.log("Pass created successfully");

    // Set barcode
    pass.setBarcodes({
      message: member.membershipCode,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    });

    console.log("Barcode set successfully");

    // Update field values using the library's proper methods
    // Access internal structure to update existing field values
    const passInternal = pass as any;
    
    if (passInternal.props && passInternal.props.storeCard) {
      console.log("Updating field values...");
      
      // Update primary field value
      if (passInternal.props.storeCard.primaryFields[0]) {
        passInternal.props.storeCard.primaryFields[0].label = tierName.toUpperCase();
        passInternal.props.storeCard.primaryFields[0].value = member.fullName;
      }

      // Update secondary fields
      if (passInternal.props.storeCard.secondaryFields[0]) {
        passInternal.props.storeCard.secondaryFields[0].value = member.membershipCode;
      }
      if (passInternal.props.storeCard.secondaryFields[1] && member.status) {
        passInternal.props.storeCard.secondaryFields[1].value = member.status;
      } else if (!member.status && passInternal.props.storeCard.secondaryFields[1]) {
        // Remove status field if no status
        passInternal.props.storeCard.secondaryFields.splice(1, 1);
      }

      // Update auxiliary field
      if (passInternal.props.storeCard.auxiliaryFields[0]) {
        passInternal.props.storeCard.auxiliaryFields[0].value = joinedDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      // Add expiry field if needed
      if (member.expiresAt) {
        passInternal.props.storeCard.auxiliaryFields.push({
          key: "expires",
          label: "VALID UNTIL",
          value: new Date(member.expiresAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
        });
      }

      // Update back fields
      const backFields = passInternal.props.storeCard.backFields;
      if (backFields[0]) {
        backFields[0].value = `Dear ${member.fullName},\n\nThank you for being a valued member of Casa Privé. Enjoy exclusive access to our premium events.`;
      }
      if (backFields[1]) {
        backFields[1].value = member.email;
      }
      if (backFields[2]) {
        backFields[2].value = "• Priority table reservations\n• Exclusive event access\n• Special member pricing\n• VIP concierge service\n• Complimentary amenities";
      }
      if (backFields[3]) {
        backFields[3].value = "Visit casaprive.com\nEmail: members@casaprive.com\nPhone: +233 XX XXX XXXX";
      }
      if (backFields[4]) {
        backFields[4].value = "This membership card is non-transferable. Visit casaprive.com/terms for full terms and conditions.";
      }

      console.log("Pass fields updated successfully");
    } else {
      console.warn("Warning: storeCard structure not found");
    }

    // Generate the pass buffer
    const buffer = pass.getAsBuffer();
    console.log("Pass buffer generated, size:", buffer.length, "bytes");

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
    console.error("Error creating pass:", error);
    throw new Error(`Failed to create pass: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}