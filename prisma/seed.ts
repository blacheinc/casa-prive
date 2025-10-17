// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create table packages
  console.log('Creating table packages...');
  await prisma.tablePackage.createMany({
    data: [
      {
        name: 'Classic Elegance',
        description: 'Perfect for intimate gatherings',
        price: 5000,
        features: [
          'Premium table placement',
          'Complimentary welcome drinks',
          'Dedicated server',
          'Up to 6 guests',
        ],
        maxGuests: 6,
        isActive: true,
      },
      {
        name: 'VIP Experience',
        description: 'For those who desire the best',
        price: 10000,
        features: [
          'Prime location seating',
          'Champagne on arrival',
          'Personal concierge',
          'Up to 6 guests',
          'Exclusive menu access',
        ],
        maxGuests: 6,
        isActive: true,
      },
      {
        name: 'Platinum Reserve',
        description: 'The ultimate luxury experience',
        price: 20000,
        features: [
          'VIP lounge access',
          'Premium champagne',
          'Dedicated host',
          'Up to 6 guests',
          'Complimentary appetizer platter',
          'Priority valet parking',
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
      // Appetizers
      {
        name: 'Truffle Foie Gras',
        description: 'Pan-seared foie gras with truffle reduction',
        category: 'APPETIZER',
        price: 150,
        isAvailable: true,
      },
      {
        name: 'Lobster Bisque',
        description: 'Creamy lobster soup with cognac',
        category: 'APPETIZER',
        price: 85,
        isAvailable: true,
      },
      {
        name: 'Oysters Rockefeller',
        description: 'Baked oysters with herbs and breadcrumbs',
        category: 'APPETIZER',
        price: 95,
        isAvailable: true,
      },
      // Main Courses
      {
        name: 'Wagyu Beef Tenderloin',
        description: 'Premium A5 Wagyu with red wine jus',
        category: 'MAIN_COURSE',
        price: 450,
        isAvailable: true,
      },
      {
        name: 'Chilean Sea Bass',
        description: 'Pan-roasted with lemon butter sauce',
        category: 'MAIN_COURSE',
        price: 320,
        isAvailable: true,
      },
      {
        name: 'Duck Confit',
        description: 'Slow-cooked duck leg with orange glaze',
        category: 'MAIN_COURSE',
        price: 280,
        isAvailable: true,
      },
      // Desserts
      {
        name: 'Chocolate Soufflé',
        description: 'Classic French chocolate soufflé with vanilla ice cream',
        category: 'DESSERT',
        price: 75,
        isAvailable: true,
      },
      {
        name: 'Crème Brûlée',
        description: 'Vanilla custard with caramelized sugar',
        category: 'DESSERT',
        price: 65,
        isAvailable: true,
      },
      // Cocktails
      {
        name: 'Casa Privé Signature',
        description: 'House special cocktail with premium spirits',
        category: 'COCKTAIL',
        price: 95,
        isAvailable: true,
      },
      {
        name: 'Gold Rush Martini',
        description: 'Vodka martini with edible gold flakes',
        category: 'COCKTAIL',
        price: 120,
        isAvailable: true,
      },
      // Wine
      {
        name: 'Dom Pérignon 2012',
        description: 'Vintage champagne',
        category: 'WINE',
        price: 1200,
        isAvailable: true,
      },
      {
        name: 'Château Margaux 2015',
        description: 'Premier Grand Cru Classé',
        category: 'WINE',
        price: 2500,
        isAvailable: true,
      },
      // Beverages
      {
        name: 'Fresh Pressed Juices',
        description: 'Orange, pineapple, or mixed berries',
        category: 'BEVERAGE',
        price: 35,
        isAvailable: true,
      },
      {
        name: 'Premium Coffee',
        description: 'Espresso, cappuccino, or latte',
        category: 'BEVERAGE',
        price: 25,
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

  console.log('Database seeded successfully! ✨');
  console.log('');
  console.log('Created:');
  console.log('- 3 Table Packages');
  console.log('- 14 Menu Items');
  console.log('- Event Settings');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });