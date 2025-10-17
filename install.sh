#!/bin/bash

echo "🚀 Installing Casa Privé dependencies..."

# Install dependencies
npm install @prisma/client prisma
npm install googleapis nodemailer qrcode date-fns
npm install lucide-react zod react-hook-form @hookform/resolvers sharp
npm install -D @types/nodemailer @types/qrcode

echo "✅ Dependencies installed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy all code from artifacts to corresponding files"
echo "2. Update .env with your configuration"
echo "3. Run: npx prisma generate"
echo "4. Run: npx prisma db push"
echo "5. Run: npm run dev"
