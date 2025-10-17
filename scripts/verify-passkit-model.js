/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/verify-passkit-model.js
const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, '..', 'passkit-model');

const requiredFiles = [
  'pass.json',
  'logo.png',
  'logo@2x.png',
  'icon.png',
  'icon@2x.png',
];

const optionalFiles = [
  'thumbnail.png',
  'thumbnail@2x.png',
];

console.log('🔍 Verifying passkit-model folder...\n');

// Check if folder exists
if (!fs.existsSync(modelPath)) {
  console.error('❌ passkit-model folder not found!');
  console.log('\nRun: mkdir passkit-model');
  process.exit(1);
}

console.log('📁 Folder exists:', modelPath);
console.log('');

// Check required files
let allGood = true;

console.log('Required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(modelPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

console.log('');
console.log('Optional files:');
optionalFiles.forEach(file => {
  const filePath = path.join(modelPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`  ⚪ ${file} - not present (ok)`);
  }
});

console.log('');

if (allGood) {
  console.log('✅ All required files present!');
  console.log('\nYou can now deploy to Vercel.');
} else {
  console.log('❌ Some required files are missing.');
  console.log('\nSee PASSKIT_MODEL_SETUP.md for instructions.');
  process.exit(1);
}