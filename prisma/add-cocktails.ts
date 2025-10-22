// prisma/add-cocktails.ts - Add Cocktails to Existing Menu
import { PrismaClient, MenuCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding cocktails to menu...');

  const cocktails = [
    {
      name: 'Sunset',
      description: 'Vodka, Mango syrup, Coconut syrup, Lemon juice, Soda water',
      category: 'COCKTAIL' as MenuCategory,
      price: 180,
      isAvailable: true,
    },
    {
      name: 'Privé',
      description: 'Rum, Blue curaçao, Coconut syrup, Pineapple juice, Lemon juice',
      category: 'COCKTAIL' as MenuCategory,
      price: 200,
      isAvailable: true,
    },
    {
      name: 'Elixir',
      description: 'Vodka, Lemon, Mint, Passion fruit, Cranberry juice',
      category: 'COCKTAIL' as MenuCategory,
      price: 130,
      isAvailable: true,
    },
    {
      name: 'The Imperial',
      description: 'Vodka, Lemon juice, Triple sec, Cranberry juice',
      category: 'COCKTAIL' as MenuCategory,
      price: 150,
      isAvailable: true,
    },
    {
      name: 'Opulence',
      description: 'Gin, Strawberry syrup, Lemon juice, Ginger Ale',
      category: 'COCKTAIL' as MenuCategory,
      price: 180,
      isAvailable: true,
    },
    {
      name: 'Tropics',
      description: 'Tequila, Strawberry syrup, Mint, Pineapple, Cranberry, Lemon',
      category: 'COCKTAIL' as MenuCategory,
      price: 150,
      isAvailable: true,
    },
  ];

  for (const cocktail of cocktails) {
    // Check if cocktail already exists
    const existing = await prisma.menuItem.findFirst({
      where: { name: cocktail.name },
    });

    if (existing) {
      // Update existing cocktail
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          description: cocktail.description,
          category: cocktail.category,
          price: cocktail.price,
          isAvailable: cocktail.isAvailable,
        },
      });
      console.log(`✓ Updated: ${cocktail.name}`);
    } else {
      // Create new cocktail
      await prisma.menuItem.create({
        data: cocktail,
      });
      console.log(`✓ Added: ${cocktail.name}`);
    }
  }

  console.log('');
  console.log('✨ Successfully processed 6 cocktails!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error adding cocktails:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });