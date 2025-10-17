# Casa Privé - File Structure

## API Routes
- app/api/bookings/route.ts
- app/api/bookings/[id]/route.ts
- app/api/orders/route.ts
- app/api/orders/[id]/route.ts
- app/api/members/route.ts
- app/api/waitlist/route.ts
- app/api/feedback/route.ts
- app/api/packages/route.ts
- app/api/menu-items/route.ts
- app/api/settings/route.ts
- app/api/stats/route.ts
- app/api/upload/route.ts
- app/api/payment/callback/route.ts

## Pages
- app/page.tsx (Homepage)
- app/layout.tsx (Root layout)
- app/globals.css (Global styles)
- app/admin/page.tsx (Admin dashboard)
- app/booking/page.tsx (Booking page)
- app/booking/success/page.tsx (Booking success)
- app/menu/page.tsx (Menu & ordering)
- app/member-card/[code]/page.tsx (Virtual membership card)
- app/membership/page.tsx (Membership application)
- app/rules/page.tsx (Event rules & guidelines)
- app/waitlist/page.tsx (Waitlist page)
- app/feedback/page.tsx (Feedback form)
- app/order/success/page.tsx (Order success)
- app/payment/failed/page.tsx (Payment failed)

## Components
- components/Navigation.tsx
- components/Footer.tsx

## Library
- lib/prisma.ts (Database client)
- lib/paystack.ts (Payment service)
- lib/sheets.ts (Google Sheets integration)
- lib/email.ts (Email service)
- lib/card.ts (Membership card generation)
- lib/utils.ts (Utility functions)
- lib/constants.ts (Constants)

## Database
- prisma/schema.prisma (Database schema)
- prisma/seed.ts (Database seeding)

## Configuration
- .env (Environment variables - DO NOT COMMIT)
- .env.example (Environment template)
- .gitignore (Git ignore rules)
- middleware.ts (Next.js middleware)
- next.config.js (Next.js config)
- tailwind.config.ts (Tailwind config)
- tsconfig.json (TypeScript config)
- package.json (Dependencies)
- vercel.json (Vercel deployment)
- Dockerfile (Docker image)
- docker-compose.yml (Docker compose)
- .dockerignore (Docker ignore)

## Documentation
- README.md (Main documentation)
- DEPLOYMENT_GUIDE.md (Deployment guide)

## CI/CD
- .github/workflows/ci.yml (GitHub Actions)

## Public
- public/uploads/ (File uploads directory)
