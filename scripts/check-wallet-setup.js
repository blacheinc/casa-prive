/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/check-wallet-setup.js
// Run with: node scripts/check-wallet-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Apple Wallet Pass Setup...\n');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// Check 1: Model folder exists
const modelPath = path.join(process.cwd(), 'passkit-model.pass');
if (fs.existsSync(modelPath)) {
  checks.passed.push('✅ passkit-model.pass folder exists');
} else {
  checks.failed.push('❌ passkit-model.pass folder not found');
}

// Check 2: pass.json exists and is valid
const passJsonPath = path.join(modelPath, 'pass.json');
if (fs.existsSync(passJsonPath)) {
  checks.passed.push('✅ pass.json exists');
  
  try {
    const passJson = JSON.parse(fs.readFileSync(passJsonPath, 'utf8'));
    
    // Check required fields
    const required = ['formatVersion', 'passTypeIdentifier', 'teamIdentifier', 'organizationName'];
    const missing = required.filter(field => !passJson[field]);
    
    if (missing.length === 0) {
      checks.passed.push('✅ pass.json has all required fields');
    } else {
      checks.failed.push(`❌ pass.json missing fields: ${missing.join(', ')}`);
    }
    
    // Check barcode
    if (passJson.barcode && passJson.barcode.message && passJson.barcode.message !== '') {
      checks.passed.push('✅ pass.json has valid barcode');
    } else {
      checks.failed.push('❌ pass.json barcode is missing or empty');
    }
    
    // Check storeCard structure
    if (passJson.storeCard) {
      checks.passed.push('✅ pass.json has storeCard structure');
    } else {
      checks.failed.push('❌ pass.json missing storeCard structure');
    }
    
  } catch (error) {
    checks.failed.push(`❌ pass.json is not valid JSON: ${error.message}`);
  }
} else {
  checks.failed.push('❌ pass.json not found');
}

// Check 3: Required images
const requiredImages = [
  'icon.png',
  'icon@2x.png',
  'logo.png',
  'logo@2x.png'
];

const optionalImages = [
  'strip.png',
  'strip@2x.png',
  'background.png',
  'background@2x.png'
];

requiredImages.forEach(img => {
  const imgPath = path.join(modelPath, img);
  if (fs.existsSync(imgPath)) {
    const stats = fs.statSync(imgPath);
    checks.passed.push(`✅ ${img} exists (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    checks.failed.push(`❌ ${img} not found`);
  }
});

optionalImages.forEach(img => {
  const imgPath = path.join(modelPath, img);
  if (fs.existsSync(imgPath)) {
    const stats = fs.statSync(imgPath);
    checks.passed.push(`✅ ${img} exists (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    checks.warnings.push(`⚠️  ${img} not found (optional)`);
  }
});

// Check 4: Certificates
const certPath = path.join(process.cwd(), 'certificates');
const certFiles = ['wwdr.pem', 'signerCert.pem', 'signerKey.pem'];

if (fs.existsSync(certPath)) {
  checks.passed.push('✅ certificates folder exists');
  
  certFiles.forEach(cert => {
    const certFilePath = path.join(certPath, cert);
    if (fs.existsSync(certFilePath)) {
      checks.passed.push(`✅ ${cert} exists`);
    } else {
      checks.failed.push(`❌ ${cert} not found`);
    }
  });
} else {
  checks.failed.push('❌ certificates folder not found');
}

// Check 5: Environment variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  checks.passed.push('✅ .env.local exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredEnvVars = ['PASS_TYPE_IDENTIFIER', 'TEAM_IDENTIFIER'];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      checks.passed.push(`✅ ${envVar} is set`);
    } else {
      checks.warnings.push(`⚠️  ${envVar} not found in .env.local`);
    }
  });
} else {
  checks.warnings.push('⚠️  .env.local not found');
}

// Print results
console.log('=== PASSED CHECKS ===');
checks.passed.forEach(check => console.log(check));

if (checks.warnings.length > 0) {
  console.log('\n=== WARNINGS ===');
  checks.warnings.forEach(warning => console.log(warning));
}

if (checks.failed.length > 0) {
  console.log('\n=== FAILED CHECKS ===');
  checks.failed.forEach(failure => console.log(failure));
  console.log('\n❌ Setup incomplete. Please fix the failed checks above.');
  process.exit(1);
} else {
  console.log('\n✅ All critical checks passed! Your Apple Wallet setup looks good.');
  process.exit(0);
}