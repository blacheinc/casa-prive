/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/generate-cert-env.js
// ============================================================================
// APPLE WALLET CERTIFICATE CONVERTER FOR VERCEL DEPLOYMENT
// ============================================================================
// 
// PURPOSE:
// Converts binary Apple Wallet certificate files (.pem) into base64-encoded 
// text strings that can be stored as environment variables in Vercel.
//
// WHY THIS IS NEEDED:
// - Vercel may not deploy the certificates/ folder reliably
// - Environment variables are a secure way to store sensitive data
// - Base64 encoding converts binary files into copy-pasteable text
//
// USAGE:
//   npm run generate-cert-env
//
// SETUP BEFORE RUNNING:
// 1. Make sure you have these files in certificates/ folder:
//    - wwdr.pem          (Apple root certificate)
//    - signerCert.pem    (Your Pass Type ID certificate)
//    - signerKey.pem     (Your private key)
//
// AFTER RUNNING:
// 1. Copy the entire output
// 2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
// 3. Create these variables and paste the values:
//    - APPLE_WWDR_CERT
//    - APPLE_SIGNER_CERT
//    - APPLE_SIGNER_KEY
//    - PASS_CERT_PASSPHRASE (your key passphrase - NOT base64 encoded)
//
// ============================================================================

const fs = require('fs');
const path = require('path');

/**
 * Main function that reads certificates and outputs base64-encoded versions
 */
function generateCertEnv() {
  // Path to your certificates folder
  const certPath = path.join(__dirname, '..', 'certificates');
  
  console.log('🔍 Looking for certificate files in:', certPath);
  console.log('');
  
  try {
    // ========================================================================
    // STEP 1: Read the three required certificate files
    // ========================================================================
    
    console.log('📂 Reading certificate files...');
    
    // WWDR Certificate - Apple's root certificate that validates your pass
    const wwdr = fs.readFileSync(path.join(certPath, 'wwdr.pem'));
    console.log('   ✅ wwdr.pem found');
    
    // Signer Certificate - Your Pass Type ID certificate
    const signerCert = fs.readFileSync(path.join(certPath, 'signerCert.pem'));
    console.log('   ✅ signerCert.pem found');
    
    // Signer Key - Your private key (keep this secret!)
    const signerKey = fs.readFileSync(path.join(certPath, 'signerKey.pem'));
    console.log('   ✅ signerKey.pem found');
    
    console.log('');
    console.log('✅ All certificate files found!');
    console.log('');
    
    // ========================================================================
    // STEP 2: Convert binary data to base64 text
    // ========================================================================
    
    // Base64 encoding converts binary data into ASCII text that can be:
    // - Copied and pasted safely
    // - Stored in environment variables
    // - Transmitted over text-based protocols
    //
    // Example:
    //   Binary: [0x4D, 0x49, 0x49, ...] ← Can't copy this
    //   Base64: "TUlJRkZEQ0NBdnl..." ← Can copy this!
    
    const wwdrBase64 = wwdr.toString('base64');
    const signerCertBase64 = signerCert.toString('base64');
    const signerKeyBase64 = signerKey.toString('base64');
    
    // ========================================================================
    // STEP 3: Display formatted output for Vercel
    // ========================================================================
    
    const separator = '─'.repeat(80);
    
    console.log('📋 COPY THE FOLLOWING TO VERCEL ENVIRONMENT VARIABLES:');
    console.log('');
    console.log('Go to: Vercel Dashboard → Settings → Environment Variables');
    console.log('');
    console.log(separator);
    console.log('');
    
    // WWDR Certificate
    console.log('VARIABLE NAME: APPLE_WWDR_CERT');
    console.log('VARIABLE VALUE (copy everything below this line):');
    console.log('');
    console.log(wwdrBase64);
    console.log('');
    console.log(separator);
    console.log('');
    
    // Signer Certificate
    console.log('VARIABLE NAME: APPLE_SIGNER_CERT');
    console.log('VARIABLE VALUE (copy everything below this line):');
    console.log('');
    console.log(signerCertBase64);
    console.log('');
    console.log(separator);
    console.log('');
    
    // Signer Key (Private Key - Very Sensitive!)
    console.log('VARIABLE NAME: APPLE_SIGNER_KEY');
    console.log('VARIABLE VALUE (copy everything below this line):');
    console.log('');
    console.log(signerKeyBase64);
    console.log('');
    console.log(separator);
    console.log('');
    
    // ========================================================================
    // STEP 4: Instructions and reminders
    // ========================================================================
    
    console.log('📝 IMPORTANT INSTRUCTIONS:');
    console.log('');
    console.log('1. In Vercel, create 4 environment variables:');
    console.log('   • APPLE_WWDR_CERT      (paste the base64 from above)');
    console.log('   • APPLE_SIGNER_CERT    (paste the base64 from above)');
    console.log('   • APPLE_SIGNER_KEY     (paste the base64 from above)');
    console.log('   • PASS_CERT_PASSPHRASE (your key passphrase - plain text, NOT base64)');
    console.log('');
    console.log('2. For each variable:');
    console.log('   • Click "Add New"');
    console.log('   • Name: [variable name]');
    console.log('   • Value: [paste the base64 string]');
    console.log('   • Environments: ✓ Production ✓ Preview ✓ Development');
    console.log('   • Click "Save"');
    console.log('');
    console.log('3. Redeploy your application');
    console.log('');
    console.log(separator);
    console.log('');
    console.log('🔒 SECURITY REMINDERS:');
    console.log('   • Keep these base64 strings private');
    console.log('   • Don\'t commit them to GitHub');
    console.log('   • Don\'t share them in Slack/Discord');
    console.log('   • Vercel environment variables are encrypted at rest');
    console.log('');
    console.log('✅ Setup complete! Apple Wallet passes will work after deployment.');
    console.log('');
    
    // Optional: Save to a file for easier copying
    const outputFile = path.join(__dirname, '..', 'cert-env-output.txt');
    const fullOutput = `
APPLE_WWDR_CERT=${wwdrBase64}

${separator}

APPLE_SIGNER_CERT=${signerCertBase64}

${separator}

APPLE_SIGNER_KEY=${signerKeyBase64}
`;
    
    fs.writeFileSync(outputFile, fullOutput);
    console.log(`💾 Output also saved to: ${outputFile}`);
    console.log('   (You can delete this file after copying to Vercel)');
    console.log('');
    
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================
    
    console.error('');
    console.error('❌ ERROR:', error.message);
    console.error('');
    console.error('🔍 TROUBLESHOOTING:');
    console.error('');
    console.error('1. Make sure you have a certificates/ folder in your project root:');
    console.error('   casa-prive/');
    console.error('   ├── certificates/        ← Should exist');
    console.error('   │   ├── wwdr.pem         ← Should exist');
    console.error('   │   ├── signerCert.pem   ← Should exist');
    console.error('   │   └── signerKey.pem    ← Should exist');
    console.error('   └── scripts/');
    console.error('       └── generate-cert-env.js');
    console.error('');
    console.error('2. File names must match exactly (case-sensitive):');
    console.error('   • wwdr.pem (lowercase)');
    console.error('   • signerCert.pem (camelCase)');
    console.error('   • signerKey.pem (camelCase)');
    console.error('');
    console.error('3. If you don\'t have these files yet, see: APPLE_WALLET_SETUP.md');
    console.error('');
    
    // Try to list what files are actually in the certificates folder
    try {
      const files = fs.readdirSync(certPath);
      console.error('📁 Files currently in certificates/ folder:');
      if (files.length === 0) {
        console.error('   (empty - no files found)');
      } else {
        files.forEach(file => console.error(`   • ${file}`));
      }
    } catch (dirError) {
      console.error('   ⚠️  certificates/ folder does not exist');
    }
    
    console.error('');
    process.exit(1); // Exit with error code
  }
}

// Run the script
generateCertEnv();