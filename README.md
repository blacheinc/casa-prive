# Casa Privé - Luxury Members Club Website

A production-ready Next.js application for Casa Privé, an exclusive luxury members' club featuring table bookings, menu orders, membership management, and more.

## Features

✨ **Core Functionality**
- 🎫 Table booking system with multiple packages
- 🍽️ Menu ordering system with cart functionality
- 💳 Dual payment options (Paystack & Bank Transfer)
- 👥 Virtual membership card generation with QR codes
- ⏰ Waitlist management for sold-out events
- 💬 Client feedback system
- 📋 Event and table rules/guidelines

🔐 **Backend Integration**
- Google Sheets logging for all transactions
- Email notifications for bookings and orders
- Prisma ORM with PostgreSQL/SQLite
- Paystack payment verification
- RESTful API endpoints

🎨 **UI/UX**
- Responsive design with Tailwind CSS
- Emerald green and gold color scheme
- Luxury-focused design elements
- Mobile-friendly navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (or SQLite for dev)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Payment**: Paystack
- **Email**: Nodemailer
- **QR Codes**: qrcode library

## Installation

### 1. Create the project

```bash
npx create-next-app@latest casa-prive --typescript --tailwind --app --eslint
cd casa-prive
```

### 2. Install dependencies

```bash
npm install @prisma/client prisma googleapis nodemailer qrcode date-fns lucide-react zod react-hook-form @hookform/resolvers sharp
npm install -D @types/nodemailer @types/qrcode
```

### 3. Initialize Prisma

```bash
npx prisma init
```

### 4. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/casa_prive"
# For development with SQLite:
# DATABASE_URL="file:./dev.db"

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_key"
PAYSTACK_SECRET_KEY="sk_test_your_key"

# Google Sheets (Service Account JSON)
GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account","project_id":"..."}'
GOOGLE_SHEET_ID="your_sheet_id"

# Email (Gmail SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Casa Privé <noreply@casaprive.com>"
ADMIN_EMAIL="admin@casaprive.com"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_TOTAL_TABLES=20
NEXT_PUBLIC_MAX_GUESTS_PER_TABLE=6
```

### 5. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to manage data
npx prisma studio
```

### 6. Seed the database (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create table packages
  await prisma.tablePackage.createMany({
    data: [
      {
        name: 'Classic Elegance',
        description: 'Perfect for intimate gatherings',
        price: 500,
        features: ['Premium table placement', 'Complimentary welcome drinks', 'Dedicated server', 'Up to 6 guests'],
        maxGuests: 6,
      },
      // Add more packages...
    ],
  });

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Truffle Foie Gras',
        description: 'Pan-seared foie gras with truffle reduction',
        category: 'APPETIZER',
        price: 150,
        isAvailable: true,
      },
      // Add more menu items...
    ],
  });

  // Create event settings
  await prisma.eventSettings.create({
    data: {
      totalTables: 20,
      bookedTables: 0,
      currentEventDate: new Date(),
      isBookingOpen: true,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:
```bash
npx tsx prisma/seed.ts
```

## Google Sheets Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API

### 2. Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Create a service account
3. Download the JSON key file
4. Copy the entire JSON content to your `.env` file as `GOOGLE_SHEETS_CREDENTIALS`

### 3. Create Google Sheet
1. Create a new Google Sheet
2. Create sheets named: `Bookings`, `Orders`, `Waitlist`, `Feedback`
3. Share the sheet with the service account email (found in the JSON)
4. Copy the Sheet ID from the URL to `.env` as `GOOGLE_SHEET_ID`

### 4. Set up Sheet Headers

**Bookings Sheet:**
```
Date | Booking ID | Full Name | Email | Phone | Package | Guests | Table | Amount | Payment Method | Status
```

**Orders Sheet:**
```
Date | Order ID | Customer | Table | Items | Total | Payment Method | Status
```

**Waitlist Sheet:**
```
Date | ID | Full Name | Email | Phone | Guests | Preferred Date | Message
```

**Feedback Sheet:**
```
Date | ID | Name | Email | Rating | Category | Message
```

## Paystack Setup

1. Sign up at [Paystack](https://paystack.com/)
2. Get your test/live API keys from Settings > API Keys & Webhooks
3. Add keys to `.env` file
4. Set up webhook URL in Paystack dashboard: `https://your domain.com/api/payment/callback`

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings > Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a password for "Mail"
3. Use this app password in `.env` as `EMAIL_PASSWORD`

## Running the Application

### Development
```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Database Deployment

**Option 1: Vercel Postgres**
```bash
npm install @vercel/postgres
# Update DATABASE_URL in Vercel environment variables
```

**Option 2: Railway**
1. Create account at [Railway](https://railway.app/)
2. Create PostgreSQL database
3. Copy connection string to `DATABASE_URL`

**Option 3: PlanetScale**
1. Create account at [PlanetScale](https://planetscale.com/)
2. Create database
3. Update schema to remove relations (PlanetScale doesn't support foreign keys)

## File Structure

```
casa-prive/
├── app/
│   ├── api/
│   │   ├── bookings/route.ts
│   │   ├── orders/route.ts
│   │   ├── members/route.ts
│   │   ├── waitlist/route.ts
│   │   ├── feedback/route.ts
│   │   ├── packages/route.ts
│   │   ├── menu-items/route.ts
│   │   ├── settings/route.ts
│   │   └── payment/callback/route.ts
│   ├── booking/page.tsx
│   ├── menu/page.tsx
│   ├── member-card/[code]/page.tsx
│   ├── membership/page.tsx
│   ├── rules/page.tsx
│   ├── waitlist/page.tsx
│   ├── feedback/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   └── Footer.tsx
├── lib/
│   ├── prisma.ts
│   ├── paystack.ts
│   ├── sheets.ts
│   ├── email.ts
│   └── card.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Key Features Implementation

### Table Booking
- Supports multiple package types
- Tracks available tables
- Handles Paystack and bank transfer payments
- Logs to Google Sheets
- Sends email confirmations

### Menu Orders
- Real-time cart management
- Table-based ordering
- Multiple payment methods
- Email and admin notifications

### Membership Cards
- QR code generation
- Virtual card display
- Membership verification
- Apple Wallet integration (placeholder)

### Waitlist
- Automatic table availability tracking
- Email notifications
- Priority queue management

## Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **API Routes**: Add authentication for admin endpoints
3. **Payment Verification**: Always verify Paystack transactions server-side
4. **Input Validation**: Use Zod schemas for form validation
5. **Rate Limiting**: Implement rate limiting on API routes
6. **HTTPS**: Always use HTTPS in production

## Troubleshooting

### Prisma Issues
```bash
# Reset database
npx prisma db push --force-reset

# Regenerate client
npx prisma generate
```

### Google Sheets Not Updating
- Verify service account has edit access to sheet
- Check credentials format in `.env`
- Ensure Sheet ID is correct

### Payment Not Working
- Verify Paystack keys
- Check callback URL is publicly accessible
- Review Paystack dashboard for errors

## Support

For issues or questions:
- Email: admin@casaprive.com
- Review code comments
- Check Prisma/Next.js documentation

## License

Proprietary - Casa Privé © 2024

---

**Built with ❤️ for Casa Privé - The Epitome of Exclusive Living**# casa-prive
