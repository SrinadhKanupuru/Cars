import prisma from '../src/config/prisma.js';

async function main() {
  console.log('[PRISMA TEST] Connecting to PostgreSQL via Prisma ORM...');

  try {
    // 1. Fetch Cars with Relations
    const cars = await prisma.car.findMany({
      include: {
        images: true,
        features: true,
      },
      take: 3,
    });

    console.log(`\n✅ Successfully fetched ${cars.length} sample supercars from Prisma:`);
    cars.forEach(car => {
      console.log(`- ${car.brand} ${car.model} (${car.year}): $${Number(car.price).toLocaleString()} | ${car.horsepower} HP | ${car.images.length} images | ${car.features.length} features`);
    });

    // 2. Fetch Users & Roles
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });
    console.log(`\n✅ Successfully fetched ${users.length} users with roles from Prisma:`);
    users.forEach(u => {
      console.log(`- ${u.name} (${u.email}) -> Role: ${u.role?.name || 'N/A'}`);
    });

    // 3. Fetch Test Drives
    const testDrives = await prisma.testDrive.findMany();
    console.log(`\n✅ Test Drives count in Prisma: ${testDrives.length}`);

    // 4. Fetch Leads
    const leads = await prisma.lead.findMany();
    console.log(`✅ Leads & Inquiries count in Prisma: ${leads.length}`);

    console.log('\n🚀 PRISMA ORM IS FULLY OPERATIONAL AND SYNCED WITH POSTGRESQL!');
  } catch (err) {
    console.error('❌ Prisma Query Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
