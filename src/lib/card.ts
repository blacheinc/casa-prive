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
  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.casaprive.membership',
    serialNumber: member.membershipCode,
    teamIdentifier: '64PS3B42A3',
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