// prisma/seed.ts - Updated Seed Script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Truncate all tables
  console.log('Truncating tables...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tablePackage.deleteMany();
  await prisma.eventSettings.deleteMany();

  // Create table packages (Drinks Packages)
  console.log('Creating table packages...');
  await prisma.tablePackage.createMany({
    data: [
      {
        name: 'Indoor Table Package',
        description: 'Complete indoor experience',
        price: 20000,
        features: [
          '2 Moet Nectar Rose',
          '1 Hennessy XO',
          '1 Don Julio 1942',
          '8 Mixers',
          '10 Bottles of Water',
        ],
        maxGuests: 6,
        isActive: true,
      },
      {
        name: 'Balcony Table Package',
        description: 'Premium balcony experience',
        price: 10000,
        features: [
          '2 Moet Nectar Rose',
          '1 Hennessy VSOP',
          '5 Mixers',
          '5 Bottles of Water',
        ],
        maxGuests: 6,
        isActive: true,
      },
    ],
  });

  // Create menu items
  console.log('Creating menu items...');
  await prisma.menuItem.createMany({
    data: [
      // ============ TEQUILA ============
      {
        name: 'Don Julio 1942',
        description: 'Premium añejo tequila',
        category: 'TEQUILA',
        price: 10500,
        isAvailable: true,
      },
      {
        name: 'Don Julio Reposado',
        description: 'Smooth reposado tequila',
        category: 'TEQUILA',
        price: 4500,
        isAvailable: true,
      },
      {
        name: 'Casamigos Reposado',
        description: 'Premium reposado tequila',
        category: 'TEQUILA',
        price: 4500,
        isAvailable: true,
      },
      {
        name: 'Azul',
        description: 'Ultra-premium tequila',
        category: 'TEQUILA',
        price: 9500,
        isAvailable: true,
      },

      // ============ CHAMPAGNE ============
      {
        name: 'Moet Nectar Rose',
        description: 'Rosé champagne with rich fruity notes',
        category: 'CHAMPAGNE',
        price: 3000,
        isAvailable: true,
      },
      {
        name: 'Ace of Spade',
        description: 'Luxury champagne, iconic gold bottle',
        category: 'CHAMPAGNE',
        price: 11500,
        isAvailable: true,
      },
      {
        name: 'Dom Perignon',
        description: 'Prestigious vintage champagne',
        category: 'CHAMPAGNE',
        price: 9500,
        isAvailable: true,
      },
      {
        name: 'Veuve Clicquot Rich',
        description: 'Sweet and rich champagne',
        category: 'CHAMPAGNE',
        price: 3500,
        isAvailable: true,
      },

      // ============ COGNAC ============
      {
        name: 'Hennessy VSOP',
        description: 'Very Special Old Pale cognac',
        category: 'COGNAC',
        price: 3000,
        isAvailable: true,
      },
      {
        name: 'Hennessy XO',
        description: 'Extra Old premium cognac',
        category: 'COGNAC',
        price: 8000,
        isAvailable: true,
      },
      {
        name: 'Martel Blue Swift',
        description: 'VSOP finished in bourbon casks',
        category: 'COGNAC',
        price: 3000,
        isAvailable: true,
      },
    ],
  });

  // Create event settings
  console.log('Creating event settings...');
  await prisma.eventSettings.create({
    data: {
      totalTables: 20,
      bookedTables: 0,
      currentEventDate: new Date(),
      isBookingOpen: true,
    },
  });

  console.log('');
  console.log('Database seeded successfully! ✨');
  console.log('');
  console.log('📊 Created:');
  console.log('  ✓ 2 Table Packages:');
  console.log('    - Indoor Table Package (₵20,000)');
  console.log('    - Balcony Table Package (₵10,000)');
  console.log('  ✓ 11 Menu Items:');
  console.log('    - 4 Tequilas');
  console.log('    - 4 Champagnes');
  console.log('    - 3 Cognacs');
  console.log('  ✓ Event Settings');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });