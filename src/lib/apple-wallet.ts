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
    // Build pass data object with actual values
    const passData: any = {
      serialNumber: member.membershipCode,
      description: "Casa Privé Exclusive Membership Card",
      logoText: "CASA PRIVÉ",
      foregroundColor: tierColor,
      backgroundColor: "rgb(4, 99, 72)",
      labelColor: "rgb(255, 255, 255)",
    };

    // Prepare certificate config
    const certConfig: any = {
      wwdr,
      signerCert,
      signerKey,
    };
    
    if (signerKeyPassphrase) {
      certConfig.signerKeyPassphrase = signerKeyPassphrase;
    }

    // Create pass
    const pass = await PKPass.from({
      model: modelPath,
      certificates: certConfig,
    }, passData);

    console.log("Pass created successfully");

    // Set barcode
    pass.setBarcodes({
      message: member.membershipCode,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    });

    console.log("Barcode set");

    // CRITICAL: Directly modify the internal pass structure
    // This is the ONLY way that actually works with passkit-generator
    const passInternal = pass as any;
    const props = passInternal.props;

    // Force update the storeCard fields with actual values
    if (props.storeCard) {
      // Primary field - Member name
      props.storeCard.primaryFields = [{
        key: "member",
        label: tierName.toUpperCase(),
        value: member.fullName,
        textAlignment: "PKTextAlignmentCenter"
      }];

      // Secondary fields
      props.storeCard.secondaryFields = [{
        key: "code",
        label: "MEMBERSHIP CODE",
        value: member.membershipCode
      }];

      if (member.status) {
        props.storeCard.secondaryFields.push({
          key: "status",
          label: "STATUS",
          value: member.status
        });
      }

      // Auxiliary fields
      props.storeCard.auxiliaryFields = [{
        key: "joined",
        label: "MEMBER SINCE",
        value: joinedDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        })
      }];

      if (member.expiresAt) {
        props.storeCard.auxiliaryFields.push({
          key: "expires",
          label: "VALID UNTIL",
          value: new Date(member.expiresAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
          })
        });
      }

      // Back fields
      props.storeCard.backFields = [
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
      ];

      console.log("Fields populated:", {
        primary: props.storeCard.primaryFields.length,
        secondary: props.storeCard.secondaryFields.length,
        auxiliary: props.storeCard.auxiliaryFields.length,
        back: props.storeCard.backFields.length
      });
    }

    // IMPORTANT: Force the pass to serialize with the updated fields
    // We need to access the internal serialization
    const buffer = pass.getAsBuffer();
    
    console.log("Pass buffer generated, size:", buffer.length, "bytes");

    if (!buffer || buffer.length === 0) {
      throw new Error("Generated pass buffer is empty");
    }

    if (buffer.length < 1000) {
      throw new Error("Generated pass buffer is too small");
    }

    console.log("Pass validation successful");
    return buffer;

  } catch (error) {
    console.error("Error creating pass:", error);
    throw new Error(`Failed to create pass: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}