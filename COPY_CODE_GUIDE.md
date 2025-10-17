# Code Copy Guide

## How to Fill the Files

All files have been created. Now you need to copy the code from the artifacts:

### Step 1: Environment Configuration
Copy code to:
- `.env` - Environment variables
- `.env.example` - Environment template

### Step 2: Database Setup
Copy code to:
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Database seed file

### Step 3: Library Files
Copy code to:
- `lib/prisma.ts`
- `lib/paystack.ts`
- `lib/sheets.ts`
- `lib/email.ts`
- `lib/card.ts`
- `lib/utils.ts`
- `lib/constants.ts`

### Step 4: API Routes
Copy code to all files in `app/api/`:
- bookings/route.ts
- bookings/[id]/route.ts
- orders/route.ts
- orders/[id]/route.ts
- members/route.ts
- waitlist/route.ts
- feedback/route.ts
- packages/route.ts
- menu-items/route.ts
- settings/route.ts
- stats/route.ts
- upload/route.ts
- payment/callback/route.ts

### Step 5: Pages
Copy code to:
- `app/page.tsx` - Homepage
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles
- `app/admin/page.tsx` - Admin dashboard
- `app/booking/page.tsx` - Booking page
- `app/booking/success/page.tsx` - Success page
- `app/menu/page.tsx` - Menu page
- `app/member-card/[code]/page.tsx` - Member card
- `app/membership/page.tsx` - Membership page
- `app/rules/page.tsx` - Rules page
- `app/waitlist/page.tsx` - Waitlist page
- `app/feedback/page.tsx` - Feedback page
- `app/order/success/page.tsx` - Order success
- `app/payment/failed/page.tsx` - Payment failed

### Step 6: Components
Copy code to:
- `components/Navigation.tsx`
- `components/Footer.tsx`

### Step 7: Configuration Files
Copy code to:
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `next.config.js`
- `middleware.ts`
- `vercel.json`
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

### Step 8: Documentation
Copy code to:
- `README.md`
- `DEPLOYMENT_GUIDE.md`

### Step 9: CI/CD
Copy code to:
- `.github/workflows/ci.yml`

## Quick Copy Commands

You can use these commands to open files for editing:

```bash
# Open environment file
nano .env

# Open Prisma schema
nano prisma/schema.prisma

# Open homepage
nano app/page.tsx

# etc...
```

Or use your favorite code editor:
```bash
code .  # VS Code
atom .  # Atom
subl .  # Sublime Text
```
