/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/test-pass-generation.js
// Run with: node scripts/test-pass-generation.js

const { PKPass } = require('passkit-generator');
const fs = require('fs');
const path = require('path');

async function testPassGeneration() {
  console.log('🧪 Testing Apple Wallet Pass Generation...\n');

  const certPath = path.join(process.cwd(), 'certificates');
  const modelPath = path.join(process.cwd(), 'passkit-model.pass');

  try {
    // Load certificates
    console.log('📜 Loading certificates...');
    const wwdr = fs.readFileSync(path.join(certPath, 'wwdr.pem'));
    const signerCert = fs.readFileSync(path.join(certPath, 'signerCert.pem'));
    const signerKey = fs.readFileSync(path.join(certPath, 'signerKey.pem'));
    
    // Only use passphrase if it's actually set and not empty
    const envPassphrase = process.env.PASS_CERT_PASSPHRASE;
    const signerKeyPassphrase = (envPassphrase && envPassphrase.trim() !== '') ? envPassphrase : undefined;
    
    console.log('✅ Certificates loaded');
    console.log('Passphrase set:', signerKeyPassphrase ? 'Yes' : 'No (key must be unencrypted)');
    console.log('');

    // Create test pass
    console.log('🎫 Creating test pass...');
    
    const certConfig = {
      wwdr,
      signerCert,
      signerKey,
    };
    
    // Only add passphrase if it exists
    if (signerKeyPassphrase) {
      certConfig.signerKeyPassphrase = signerKeyPassphrase;
    }
    
    const pass = await PKPass.from(
      {
        model: modelPath,
        certificates: certConfig,
      },
      {
        serialNumber: 'TEST-123456',
        description: 'Test Casa Privé Membership Card',
      }
    );
    console.log('✅ Pass object created\n');

    // Set barcode
    console.log('🔲 Setting barcode...');
    pass.setBarcodes({
      message: 'TEST-123456',
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
    });
    console.log('✅ Barcode set\n');

    // Check pass structure
    console.log('🔍 Inspecting pass structure...');
    console.log('Pass type:', (pass).type);
    console.log('Pass props keys:', Object.keys((pass).props || {}));
    
    const passProps = (pass).props;
    console.log('\nPass props structure:');
    console.log(JSON.stringify(passProps, null, 2).substring(0, 500));
    console.log('\n');

    // Try to add fields
    console.log('📝 Adding fields to pass...');
    if (!passProps.storeCard) {
      passProps.storeCard = {
        primaryFields: [],
        secondaryFields: [],
        auxiliaryFields: [],
        backFields: []
      };
      console.log('Created storeCard structure');
    }

    passProps.storeCard.primaryFields.push({
      key: 'member',
      label: 'MEMBER',
      value: 'Test User',
      textAlignment: 'PKTextAlignmentCenter',
    });

    passProps.storeCard.secondaryFields.push({
      key: 'code',
      label: 'MEMBERSHIP CODE',
      value: 'TEST-123456',
    });

    console.log('✅ Fields added\n');
    console.log('Primary fields:', passProps.storeCard.primaryFields.length);
    console.log('Secondary fields:', passProps.storeCard.secondaryFields.length);
    console.log('\n');

    // Generate pass
    console.log('💾 Generating pass buffer...');
    const buffer = pass.getAsBuffer();
    console.log('✅ Pass buffer generated:', buffer.length, 'bytes\n');

    // Save to file
    const testPassPath = path.join(process.cwd(), 'test-pass.pkpass');
    fs.writeFileSync(testPassPath, buffer);
    console.log('✅ Test pass saved to:', testPassPath);
    console.log('\n');
    
    console.log('🎉 Test completed successfully!');
    console.log('Try opening test-pass.pkpass to verify it works.');

  } catch (error) {
    console.error('\n❌ Error during test:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

testPassGeneration();