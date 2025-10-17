/* eslint-disable @typescript-eslint/no-require-imports */
// generate-hash.js
const bcrypt = require('bcryptjs');

const password = 'casaprive2025';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nAdd this to your .env file:');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);

// Verify it works
const isValid = bcrypt.compareSync(password, hash);
console.log('\nVerification:', isValid ? '✅ Valid' : '❌ Invalid');