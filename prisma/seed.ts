// prisma/seed.ts - Complete Seed Script (Food + Drinks)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tablePackage.deleteMany();
  await prisma.eventSettings.deleteMany();

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
      // ============ FOOD ITEMS ============
      
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

      // ============ DRINK ITEMS ============
      
      // Cocktails
      {
        name: 'Casa Privé Signature',
        description: 'House special with premium gin, elderflower, and champagne',
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
      {
        name: 'Old Fashioned',
        description: 'Classic bourbon cocktail with bitters and orange',
        category: 'COCKTAIL',
        price: 85,
        isAvailable: true,
      },
      {
        name: 'Espresso Martini',
        description: 'Vodka, coffee liqueur, and fresh espresso',
        category: 'COCKTAIL',
        price: 90,
        isAvailable: true,
      },
      {
        name: 'Mojito Premium',
        description: 'White rum, fresh mint, lime, and sparkling water',
        category: 'COCKTAIL',
        price: 80,
        isAvailable: true,
      },

      // Whiskey
      {
        name: 'Macallan 18',
        description: 'Single malt Scotch whisky, 18 years aged',
        category: 'WHISKEY',
        price: 450,
        isAvailable: true,
      },
      {
        name: 'Glenfiddich 21',
        description: 'Grand reserve, Caribbean rum cask finish',
        category: 'WHISKEY',
        price: 380,
        isAvailable: true,
      },
      {
        name: 'Johnnie Walker Blue',
        description: 'Rare casks, exceptionally smooth blend',
        category: 'WHISKEY',
        price: 320,
        isAvailable: true,
      },
      {
        name: 'Buffalo Trace Bourbon',
        description: 'Kentucky straight bourbon whiskey',
        category: 'WHISKEY',
        price: 120,
        isAvailable: true,
      },

      // Wine
      {
        name: 'Dom Pérignon 2012',
        description: 'Vintage champagne, prestigious house',
        category: 'WINE',
        price: 1200,
        isAvailable: true,
      },
      {
        name: 'Château Margaux 2015',
        description: 'Bordeaux red wine, premier grand cru',
        category: 'WINE',
        price: 2500,
        isAvailable: true,
      },
      {
        name: 'Cloudy Bay Sauvignon',
        description: 'New Zealand white wine, crisp and elegant',
        category: 'WINE',
        price: 180,
        isAvailable: true,
      },
      {
        name: 'Tignanello 2018',
        description: 'Super Tuscan red wine, full-bodied',
        category: 'WINE',
        price: 450,
        isAvailable: true,
      },

      // Champagne
      {
        name: 'Moët & Chandon Impérial',
        description: 'Classic champagne, golden bottle',
        category: 'CHAMPAGNE',
        price: 280,
        isAvailable: true,
      },
      {
        name: 'Veuve Clicquot Yellow',
        description: 'Rich and toasty champagne',
        category: 'CHAMPAGNE',
        price: 320,
        isAvailable: true,
      },
      {
        name: 'Krug Grande Cuvée',
        description: 'Prestige champagne, complex blend',
        category: 'CHAMPAGNE',
        price: 850,
        isAvailable: true,
      },

      // Gin
      {
        name: "Hendrick's Gin & Tonic",
        description: 'Scottish gin with cucumber and rose',
        category: 'GIN',
        price: 75,
        isAvailable: true,
      },
      {
        name: 'Tanqueray No. Ten',
        description: 'Premium London dry gin with citrus',
        category: 'GIN',
        price: 85,
        isAvailable: true,
      },
      {
        name: 'Bombay Sapphire',
        description: 'Classic gin with botanicals',
        category: 'GIN',
        price: 70,
        isAvailable: true,
      },

      // Vodka
      {
        name: 'Grey Goose',
        description: 'French premium vodka, smooth finish',
        category: 'VODKA',
        price: 90,
        isAvailable: true,
      },
      {
        name: 'Belvedere',
        description: 'Polish rye vodka, pure and crisp',
        category: 'VODKA',
        price: 95,
        isAvailable: true,
      },

      // Rum
      {
        name: 'Zacapa 23',
        description: 'Guatemalan aged rum, rich and complex',
        category: 'RUM',
        price: 150,
        isAvailable: true,
      },
      {
        name: 'Diplomatico Reserva',
        description: 'Venezuelan rum, smooth and sweet',
        category: 'RUM',
        price: 120,
        isAvailable: true,
      },

      // Beer
      {
        name: 'Heineken',
        description: 'Premium lager beer, imported',
        category: 'BEER',
        price: 30,
        isAvailable: true,
      },
      {
        name: 'Corona Extra',
        description: 'Mexican lager with lime',
        category: 'BEER',
        price: 35,
        isAvailable: true,
      },

      // Non-Alcoholic Beverages
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

  console.log('');
  console.log('Database seeded successfully! ✨');
  console.log('');
  console.log('📊 Created:');
  console.log('  ✓ 3 Table Packages');
  console.log('  ✓ 36 Menu Items:');
  console.log('    - 3 Appetizers');
  console.log('    - 3 Main Courses');
  console.log('    - 2 Desserts');
  console.log('    - 5 Cocktails');
  console.log('    - 4 Whiskeys');
  console.log('    - 4 Wines');
  console.log('    - 3 Champagnes');
  console.log('    - 3 Gins');
  console.log('    - 2 Vodkas');
  console.log('    - 2 Rums');
  console.log('    - 2 Beers');
  console.log('    - 2 Beverages');
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