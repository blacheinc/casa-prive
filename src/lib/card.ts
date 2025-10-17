// lib/card.ts
import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#10b981',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export function generateMembershipCode(): string {
  const prefix = 'CP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateAppleWalletPass(member: {
  fullName: string;
  membershipCode: string;
  email: string;
}) {
  // This is a placeholder. For production, you'd need to:
  // 1. Register for Apple Developer Program
  // 2. Get a Pass Type ID Certificate
  // 3. Use a library like 'passkit-generator'
  // 4. Sign and create actual .pkpass files
  
  // For now, we'll return a JSON structure that represents what would go in a pass
  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.casaprive.membership',
    serialNumber: member.membershipCode,
    teamIdentifier: 'YOUR_TEAM_ID',
    organizationName: 'Casa Privé',
    description: 'Casa Privé Membership Card',
    logoText: 'Casa Privé',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(16, 185, 129)',
    labelColor: 'rgb(212, 175, 55)',
    generic: {
      primaryFields: [
        {
          key: 'member',
          label: 'MEMBER NAME',
          value: member.fullName,
        },
      ],
      secondaryFields: [
        {
          key: 'membership',
          label: 'MEMBERSHIP CODE',
          value: member.membershipCode,
        },
      ],
      auxiliaryFields: [
        {
          key: 'email',
          label: 'EMAIL',
          value: member.email,
          textAlignment: 'PKTextAlignmentLeft',
        },
      ],
      backFields: [
        {
          key: 'terms',
          label: 'Terms & Conditions',
          value: 'Visit casaprive.com for full terms and conditions.',
        },
      ],
    },
  };
}